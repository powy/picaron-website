// Task 5 — create-order. Validates the checkout payload server-side (never
// trust the front), prices the cart from lib/products.ts (a client-sent
// amount is ignored), and inserts the order as 'pending'.

import { MAINLAND_POSTAL_CODE_REGEX, validateAddress, type AddressFormData } from '../../checkout/address';
import {
  SHIPPING_METHODS,
  type CreateOrderRequest,
  type ParcelShopData,
  type ShippingMethod,
} from '../../checkout/order';
import { PRODUCTS, type ProductId } from '../../products';
import { computeShippingCents } from '../../shipping';
import type { Queryable } from '../db';

export class OrderValidationError extends Error {
  constructor(public details: Record<string, string>) {
    super(`Commande invalide : ${Object.entries(details).map(([k, v]) => `${k} (${v})`).join(', ')}`);
    this.name = 'OrderValidationError';
  }
}

export interface ValidOrder {
  locale: 'fr' | 'en';
  items: { productId: ProductId; quantity: number }[];
  shippingMethod: ShippingMethod;
  billingAddress: AddressFormData;
  deliveryAddress: AddressFormData | null;
  relay: ParcelShopData | null;
}

export interface OrderLine {
  produit: ProductId;
  quantite: number;
  prix_unitaire_centimes: number;
}

const MAX_QUANTITY_PER_LINE = 20;
const ADDRESS_KEYS: (keyof AddressFormData)[] = [
  'lastName',
  'firstName',
  'address',
  'addressComplement',
  'postalCode',
  'city',
  'country',
  'email',
  'phone',
];
// Column sizes in scripts/db/schema.sql.
const MAX_LENGTHS: Partial<Record<keyof AddressFormData, number>> = { phone: 30, postalCode: 10 };
const DEFAULT_MAX_LENGTH = 120;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

function parseAddress(value: unknown, prefix: string, errors: Record<string, string>): AddressFormData | null {
  if (!isRecord(value)) {
    errors[prefix] = 'required';
    return null;
  }
  const address = {} as AddressFormData;
  for (const key of ADDRESS_KEYS) {
    const field = value[key] ?? '';
    if (typeof field !== 'string') {
      errors[`${prefix}.${key}`] = 'invalid';
      continue;
    }
    if (field.length > (MAX_LENGTHS[key] ?? DEFAULT_MAX_LENGTH)) {
      errors[`${prefix}.${key}`] = 'tooLong';
    }
    address[key] = field.trim();
  }
  if (Object.keys(errors).some((key) => key.startsWith(`${prefix}.`))) return null;
  // Delivery is France-only for now (see AddressFields.tsx), whatever was sent.
  address.country = 'France';
  for (const [key, error] of Object.entries(validateAddress(address))) {
    errors[`${prefix}.${key}`] = error;
  }
  return address;
}

function parseRelay(value: unknown, errors: Record<string, string>): ParcelShopData | null {
  if (!isRecord(value)) {
    errors.relay = 'required';
    return null;
  }
  const relay = {} as ParcelShopData;
  for (const key of ['ID', 'Nom', 'Adresse1', 'CP', 'Ville'] as const) {
    const field = value[key];
    if (typeof field !== 'string' || !field.trim() || field.length > DEFAULT_MAX_LENGTH) {
      errors[`relay.${key}`] = 'invalid';
    } else {
      relay[key] = field.trim();
    }
  }
  if (typeof value.Adresse2 === 'string' && value.Adresse2.trim()) relay.Adresse2 = value.Adresse2.trim();
  if (typeof value.Pays === 'string' && value.Pays.trim()) relay.Pays = value.Pays.trim();
  // France-only: the widget is restricted to FR, but never trust the front.
  if (relay.CP && !MAINLAND_POSTAL_CODE_REGEX.test(relay.CP)) errors['relay.CP'] = 'notMainlandFrance';
  if (relay.Pays && !['FR', 'FRA', 'FRANCE'].includes(relay.Pays.toUpperCase())) errors['relay.Pays'] = 'notMainlandFrance';
  return relay;
}

export function validateOrderRequest(input: unknown): ValidOrder {
  const errors: Record<string, string> = {};
  if (!isRecord(input)) throw new OrderValidationError({ body: 'invalid' });
  const body = input as Partial<Record<keyof CreateOrderRequest, unknown>>;

  const locale = body.locale === 'en' ? 'en' : 'fr';

  const items: ValidOrder['items'] = [];
  if (!Array.isArray(body.items) || body.items.length === 0) {
    errors.items = 'required';
  } else {
    for (const [index, item] of body.items.entries()) {
      if (
        !isRecord(item) ||
        typeof item.productId !== 'string' ||
        !(item.productId in PRODUCTS) ||
        !Number.isInteger(item.quantity) ||
        (item.quantity as number) < 1 ||
        (item.quantity as number) > MAX_QUANTITY_PER_LINE
      ) {
        errors[`items.${index}`] = 'invalid';
        continue;
      }
      if (items.some((existing) => existing.productId === item.productId)) {
        errors[`items.${index}`] = 'duplicate';
        continue;
      }
      items.push({ productId: item.productId as ProductId, quantity: item.quantity as number });
    }
  }

  const shippingMethod = body.shippingMethod as ShippingMethod;
  if (!SHIPPING_METHODS.includes(shippingMethod)) errors.shippingMethod = 'invalid';

  const billingAddress = parseAddress(body.billingAddress, 'billingAddress', errors);
  let deliveryAddress: AddressFormData | null = null;
  let relay: ParcelShopData | null = null;
  if (shippingMethod === 'colissimo') {
    deliveryAddress = parseAddress(body.deliveryAddress, 'deliveryAddress', errors);
  } else if (shippingMethod === 'mondial_relay') {
    relay = parseRelay(body.relay, errors);
  }

  if (Object.keys(errors).length > 0) throw new OrderValidationError(errors);
  return { locale, items, shippingMethod, billingAddress: billingAddress!, deliveryAddress, relay };
}

/** Prices the cart from the server-side catalog (products only, no shipping). */
export function computeOrderLines(items: ValidOrder['items']): { lines: OrderLine[]; totalCents: number } {
  const lines = items.map((item) => ({
    produit: item.productId,
    quantite: item.quantity,
    prix_unitaire_centimes: PRODUCTS[item.productId].priceCents,
  }));
  const totalCents = lines.reduce((sum, line) => sum + line.quantite * line.prix_unitaire_centimes, 0);
  return { lines, totalCents };
}

const fullName = (address: AddressFormData) => `${address.firstName} ${address.lastName}`;

export async function createOrder(db: Queryable, input: unknown): Promise<{ publicId: string; id: number }> {
  const order = validateOrderRequest(input);
  const { lines, totalCents: productsCents } = computeOrderLines(order.items);
  const shippingCents = computeShippingCents(order.items, order.shippingMethod);
  const totalCents = productsCents + shippingCents;
  const billing = order.billingAddress;
  const delivery = order.deliveryAddress;
  const relay = order.relay;

  const result = await db.query<{ id: number; public_id: string }>(
    `INSERT INTO commandes (
       statut, mode_livraison, langue, lignes_produits, montant_total, email_client, telephone_client,
       adresse_nom, adresse_ligne1, adresse_ligne2, adresse_code_postal, adresse_ville, adresse_pays,
       point_relais_id, point_relais_nom, point_relais_adresse, point_relais_code_postal, point_relais_ville,
       livraison_nom, livraison_ligne1, livraison_ligne2, livraison_code_postal, livraison_ville, livraison_pays,
       livraison_email, livraison_telephone, frais_livraison
     ) VALUES (
       'pending', $1, $2, $3, $4, $5, $6,
       $7, $8, $9, $10, $11, 'FR',
       $12, $13, $14, $15, $16,
       $17, $18, $19, $20, $21, $22,
       $23, $24, $25
     )
     RETURNING id, public_id`,
    [
      order.shippingMethod,
      order.locale,
      JSON.stringify(lines),
      (totalCents / 100).toFixed(2),
      billing.email,
      billing.phone,
      fullName(billing),
      billing.address,
      billing.addressComplement || null,
      billing.postalCode,
      billing.city,
      relay?.ID ?? null,
      relay?.Nom ?? null,
      relay ? [relay.Adresse1, relay.Adresse2].filter(Boolean).join(', ') : null,
      relay?.CP ?? null,
      relay?.Ville ?? null,
      delivery ? fullName(delivery) : null,
      delivery?.address ?? null,
      delivery?.addressComplement || null,
      delivery?.postalCode ?? null,
      delivery?.city ?? null,
      delivery ? 'FR' : null,
      delivery?.email ?? null,
      delivery?.phone ?? null,
      (shippingCents / 100).toFixed(2),
    ]
  );

  return { id: result.rows[0].id, publicId: result.rows[0].public_id };
}

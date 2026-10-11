import {
  formatOrderReference,
  type OrderStatus,
  type OrderSummary,
  type ShippingMethod,
} from '../../checkout/order';
import type { Queryable } from '../db';
import type { OrderLine } from './create-order';

/** A row of the `commandes` table (the columns the backend reads). */
export interface OrderRow {
  id: number;
  public_id: string;
  statut: OrderStatus;
  mode_livraison: ShippingMethod;
  langue: string;
  lignes_produits: OrderLine[];
  montant_total: string;
  frais_livraison: string;
  email_client: string;
  telephone_client: string | null;
  adresse_nom: string;
  point_relais_id: string | null;
  point_relais_nom: string | null;
  point_relais_adresse: string | null;
  point_relais_code_postal: string | null;
  point_relais_ville: string | null;
  livraison_nom: string | null;
  livraison_ligne1: string | null;
  livraison_ligne2: string | null;
  livraison_code_postal: string | null;
  livraison_ville: string | null;
  stripe_payment_intent_id: string | null;
  email_confirmation_envoye_le: Date | null;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isPublicId(value: string): boolean {
  return UUID_REGEX.test(value);
}

/** NUMERIC(10,2) comes back from pg as a string ("69.00"). */
const numericToCents = (value: string) => Math.round(Number(value) * 100);

/** Amount charged: products + shipping. */
export function totalCents(row: Pick<OrderRow, 'montant_total'>): number {
  return numericToCents(row.montant_total);
}

export function shippingCents(row: Pick<OrderRow, 'frais_livraison'>): number {
  return numericToCents(row.frais_livraison);
}

export async function findOrderByPublicId(db: Queryable, publicId: string): Promise<OrderRow | null> {
  if (!isPublicId(publicId)) return null;
  const result = await db.query<OrderRow>('SELECT * FROM commandes WHERE public_id = $1', [publicId]);
  return result.rows[0] ?? null;
}

export function toOrderSummary(row: OrderRow): OrderSummary {
  return {
    publicId: row.public_id,
    reference: formatOrderReference(row.id),
    status: row.statut,
    items: row.lignes_produits.map((line) => ({
      productId: line.produit,
      quantity: line.quantite,
      unitPriceCents: line.prix_unitaire_centimes,
    })),
    shippingCents: shippingCents(row),
    totalCents: totalCents(row),
    shippingMethod: row.mode_livraison,
    relay:
      row.mode_livraison === 'mondial_relay' && row.point_relais_nom
        ? {
            name: row.point_relais_nom,
            address: row.point_relais_adresse ?? '',
            postalCode: row.point_relais_code_postal ?? '',
            city: row.point_relais_ville ?? '',
          }
        : null,
    delivery:
      row.mode_livraison === 'colissimo' && row.livraison_nom
        ? {
            name: row.livraison_nom,
            postalCode: row.livraison_code_postal ?? '',
            city: row.livraison_ville ?? '',
          }
        : null,
  };
}

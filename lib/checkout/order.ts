// Types shared by the checkout front end and the order API
// (lib/server/http/router.ts). Type-only on purpose: safe to import from both
// client components and server code.

import type { AddressFormData } from './address';
import type { ProductId } from '../products';

export const SHIPPING_METHODS = ['mondial_relay', 'colissimo'] as const;
export type ShippingMethod = (typeof SHIPPING_METHODS)[number];

/** Relay point as returned by the Mondial Relay ParcelShopPicker widget. */
export interface ParcelShopData {
  ID: string;
  Nom: string;
  Adresse1: string;
  Adresse2?: string;
  CP: string;
  Ville: string;
  Pays?: string;
}

/** Body of POST /api/orders. Amounts are never sent: the server prices the cart. */
export interface CreateOrderRequest {
  locale: string;
  items: { productId: ProductId; quantity: number }[];
  shippingMethod: ShippingMethod;
  billingAddress: AddressFormData;
  /** Colissimo only. */
  deliveryAddress?: AddressFormData;
  /** Mondial Relay only. */
  relay?: ParcelShopData;
}

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'shipped' | 'cancelled';

/** Response of GET /api/orders/:publicId — deliberately no email/phone. */
export interface OrderSummary {
  publicId: string;
  reference: string;
  status: OrderStatus;
  items: { productId: ProductId; quantity: number; unitPriceCents: number }[];
  shippingCents: number;
  /** Products + shipping: the amount charged. */
  totalCents: number;
  shippingMethod: ShippingMethod;
  relay: { name: string; address: string; postalCode: string; city: string } | null;
  delivery: { name: string; postalCode: string; city: string } | null;
}

export type PaymentProviderName = 'mock' | 'stripe';

/** Response of POST /api/orders/:publicId/payment-intent. */
export type PaymentIntentResponse =
  | { alreadyPaid: true }
  | {
      alreadyPaid: false;
      provider: PaymentProviderName;
      paymentIntentId: string;
      clientSecret: string;
      amountCents: number;
    };

export type MockPaymentOutcome = 'succeeded' | 'declined' | 'insufficient_funds';

export function formatOrderReference(id: number): string {
  return `PIC-${String(id).padStart(6, '0')}`;
}

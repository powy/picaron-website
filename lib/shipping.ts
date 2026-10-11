// Shipping fees — shared by the cart/checkout pages and the server
// (lib/server/orders/create-order.ts), which is the one that bills them.
//
// Default rule while the real grid (per number of boxes/books and weight)
// is still undecided — amounts are PLACEHOLDERS:
// - each copy of the board game adds a full delivery fee;
// - novels ship for free with at least one game (they go in its box);
// - novels bought without any game pay one flat "novel only" fee per order.

import type { ShippingMethod } from './checkout/order';
import { PRODUCTS, type ProductId } from './products';

export interface ShippingRate {
  /** Added for each copy of the board game. */
  perGameCents: number;
  /** Flat fee for an order containing only novels. */
  novelOnlyCents: number;
}

// Same placeholder amounts for both carriers for now.
export const SHIPPING_RATES: Record<ShippingMethod, ShippingRate> = {
  mondial_relay: { perGameCents: 1000, novelOnlyCents: 500 },
  colissimo: { perGameCents: 1000, novelOnlyCents: 500 },
};

export function computeShippingCents(
  items: { productId: ProductId; quantity: number }[],
  method: ShippingMethod
): number {
  const rate = SHIPPING_RATES[method];
  const count = (kind: 'game' | 'novel') =>
    items.filter((item) => PRODUCTS[item.productId].kind === kind).reduce((sum, item) => sum + item.quantity, 0);

  const games = count('game');
  if (games > 0) return games * rate.perGameCents;
  return count('novel') > 0 ? rate.novelOnlyCents : 0;
}

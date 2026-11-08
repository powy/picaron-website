// Shipping fees — shared by the cart/checkout pages and the server
// (lib/server/orders/create-order.ts), which is the one that bills them.
//
// Rule (amounts are PLACEHOLDERS until the real carrier rates are set):
// - each copy of the board game pays the game fee;
// - each novel pays the novel fee, except that every game brings one novel
//   with free delivery.

import type { ShippingMethod } from './checkout/order';
import { PRODUCTS, type ProductId } from './products';

export interface ShippingRate {
  /** Added for each copy of the board game. */
  perGameCents: number;
  /** Added for each novel that is not delivered free with a game. */
  perNovelCents: number;
}

export const SHIPPING_RATES: Record<ShippingMethod, ShippingRate> = {
  mondial_relay: { perGameCents: 842, perNovelCents: 242 },
  colissimo: { perGameCents: 942, perNovelCents: 342 },
};

type Items = { productId: ProductId; quantity: number }[];

function count(items: Items, kind: 'game' | 'novel'): number {
  return items.filter((item) => PRODUCTS[item.productId].kind === kind).reduce((sum, item) => sum + item.quantity, 0);
}

/** Novels delivered free: one per copy of the game. */
export function countFreeNovels(items: Items): number {
  return Math.min(count(items, 'novel'), count(items, 'game'));
}

export function computeShippingCents(items: Items, method: ShippingMethod): number {
  const rate = SHIPPING_RATES[method];
  const paidNovels = count(items, 'novel') - countFreeNovels(items);
  return count(items, 'game') * rate.perGameCents + paidNovels * rate.perNovelCents;
}

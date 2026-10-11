// sessionStorage keys of the checkout flow (see lib/use-session-state.ts),
// cleared once an order is paid so the next purchase starts fresh.
export const CHECKOUT_SESSION_KEYS = [
  'picaron_shipping_method_v1',
  'picaron_delivery_address_v1',
  'picaron_billing_address_v1',
  'picaron_billing_different_v1',
];

export function clearCheckoutSession(): void {
  try {
    for (const key of CHECKOUT_SESSION_KEYS) window.sessionStorage.removeItem(key);
  } catch {
    // storage unavailable — nothing to clear
  }
}

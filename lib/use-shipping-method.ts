'use client';

import { useSessionState } from '@/lib/use-session-state';
import type { ShippingMethod } from '@/lib/checkout/order';

export type { ShippingMethod };

export const SHIPPING_METHOD_STORAGE_KEY = 'picaron_shipping_method_v1';

export function useShippingMethod(): [ShippingMethod | null, (method: ShippingMethod) => void, boolean] {
  return useSessionState<ShippingMethod | null>(SHIPPING_METHOD_STORAGE_KEY, null);
}

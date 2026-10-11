export type ProductId = 'boucaniers' | 'armand';

/** 'game' = board game box, 'novel' = book — drives shipping (lib/shipping.ts). */
export type ProductKind = 'game' | 'novel';

export interface Product {
  id: ProductId;
  kind: ProductKind;
  priceCents: number;
  image: string;
}

export const PRODUCTS: Record<ProductId, Product> = {
  boucaniers: {
    id: 'boucaniers',
    kind: 'game',
    priceCents: 6900,
    image: '/MatérielTransparent.png',
  },
  armand: {
    id: 'armand',
    kind: 'novel',
    priceCents: 1000,
    image: '/assets/Nouvelle-illustrée.png',
  },
};

export function formatPriceCents(cents: number, locale: string): string {
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

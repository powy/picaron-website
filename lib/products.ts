export type ProductId = 'boucaniers' | 'armand';

/** 'game' = board game box, 'novel' = book — drives shipping (lib/shipping.ts). */
export type ProductKind = 'game' | 'novel';

export interface Product {
  id: ProductId;
  kind: ProductKind;
  priceCents: number;
  /** 13-digit EAN/GTIN barcode, sent to Google as product data. */
  gtin13?: string;
  /** Full-size picture (shop zoom, Google product data). */
  image: string;
  /** Small version of `image` for cart thumbnails. */
  thumbnail: string;
}

export const PRODUCTS: Record<ProductId, Product> = {
  boucaniers: {
    id: 'boucaniers',
    kind: 'game',
    priceCents: 6900,
    gtin13: '0634240347085',
    image: '/boutique/boucaniers-packshot.webp',
    thumbnail: '/boutique/boucaniers-packshot-thumb.webp',
  },
  armand: {
    id: 'armand',
    kind: 'novel',
    priceCents: 1000,
    image: '/assets/Nouvelle-illustrée.webp',
    thumbnail: '/assets/Nouvelle-illustrée.webp',
  },
};

export function formatPriceCents(cents: number, locale: string): string {
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

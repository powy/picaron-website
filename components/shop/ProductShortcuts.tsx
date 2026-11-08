'use client';

// Links to each product sheet of the shop page, so the novel is never missed
// below the game. Desktop: a card under the cart preview, in the sticky column.
// Mobile/tablet: a row of two links above the products.

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { PRODUCTS, ProductId, formatPriceCents } from '@/lib/products';

const SHORTCUTS: { productId: ProductId; kindKey: 'game' | 'novel' }[] = [
  { productId: 'boucaniers', kindKey: 'game' },
  { productId: 'armand', kindKey: 'novel' },
];

export default function ProductShortcuts({ locale, compact = false }: { locale: string; compact?: boolean }) {
  const t = useTranslations('shop.shortcuts');
  const tCart = useTranslations('cart');

  if (compact) {
    return (
      <nav aria-label={t('title')} className="grid grid-cols-2 gap-3" data-testid="product-shortcuts-compact">
        {SHORTCUTS.map(({ productId, kindKey }) => (
          <a
            key={productId}
            href={`#${productId}`}
            className="flex items-center gap-2 border-2 border-parchment rounded-lg bg-parchment/30 p-2 hover:bg-parchment/60 transition-colors"
          >
            <Image
              src={PRODUCTS[productId].thumbnail}
              alt=""
              width={48}
              height={48}
              className="w-12 h-12 object-contain shrink-0"
            />
            <span className="min-w-0 text-sm leading-tight text-ink">
              <span className="block font-oldstyle text-base text-pirate-red">{t(kindKey)}</span>
              {formatPriceCents(PRODUCTS[productId].priceCents, locale)}
            </span>
          </a>
        ))}
      </nav>
    );
  }

  return (
    <nav
      aria-labelledby="product-shortcuts-title"
      className="border-2 border-parchment rounded-lg bg-parchment/30 p-5 stack-y-3 text-base"
      data-testid="product-shortcuts"
    >
      <h2 id="product-shortcuts-title" className="font-oldstyle text-2xl text-pirate-red">
        {t('title')}
      </h2>
      <ul className="divide-y divide-parchment">
        {SHORTCUTS.map(({ productId, kindKey }) => (
          <li key={productId}>
            <a href={`#${productId}`} className="flex items-center gap-3 py-2 group">
              <Image
                src={PRODUCTS[productId].thumbnail}
                alt=""
                width={56}
                height={56}
                className="w-14 h-14 object-contain shrink-0"
              />
              <span className="min-w-0 leading-tight">
                <span className="block font-oldstyle text-lg text-ink group-hover:text-pirate-red group-hover:underline">
                  {tCart(`products.${productId}.name`)}
                </span>
                <span className="text-sm text-ink">
                  {t(kindKey)} · {formatPriceCents(PRODUCTS[productId].priceCents, locale)}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

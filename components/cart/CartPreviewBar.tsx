'use client';

// Mobile/tablet counterpart of CartPreview: a slim bar pinned to the bottom
// of the shop page, only while the cart has items. Never covers the product
// sheets or the footer: while it is shown, <body> gets the has-cart-bar class,
// which reserves its height at the bottom of the page (app/globals.css).

import { useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useCart } from '@/lib/cart-context';
import { formatPriceCents } from '@/lib/products';

export default function CartPreviewBar({ locale }: { locale: string }) {
  const t = useTranslations('cart.preview');
  const { itemCount, subtotalCents } = useCart();
  const visible = itemCount > 0;

  useEffect(() => {
    document.body.classList.toggle('has-cart-bar', visible);
    return () => document.body.classList.remove('has-cart-bar');
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="lg:hidden fixed bottom-0 inset-x-0 z-40 nav-bg shadow-nav"
          data-testid="cart-preview-bar"
        >
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 text-base">
            <p className="m-0 text-base text-sand whitespace-nowrap">
              <span className="font-semibold">{t('items', { count: itemCount })}</span>
              <span className="mx-2" aria-hidden="true">
                ·
              </span>
              <span>{formatPriceCents(subtotalCents, locale)}</span>
            </p>
            <Link
              href={`/${locale}/panier`}
              className="inline-block bg-forest hover:bg-forest-hover text-bone font-oldstyle text-base px-5 py-2 rounded-full whitespace-nowrap transition-colors shadow-lg"
            >
              {t('viewCartShort')}
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

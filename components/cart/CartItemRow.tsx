'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { CartItem, useCart } from '@/lib/cart-context';
import { PRODUCTS, formatPriceCents } from '@/lib/products';

export default function CartItemRow({ item, locale }: { item: CartItem; locale: string }) {
  const t = useTranslations('cart');
  const { addItem, updateQuantity, removeItem } = useCart();
  const product = PRODUCTS[item.productId];
  const lineTotalCents = product.priceCents * item.quantity;

  return (
    <div className="flex items-center gap-4 py-4 border-b border-parchment">
      <Image
        src={product.thumbnail}
        alt={t(`products.${item.productId}.name`)}
        width={80}
        height={80}
        className="w-20 h-20 object-contain shrink-0"
      />

      {/* Phone: name above the controls; wider screens: one line. */}
      <div className="grow min-w-0 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <div className="grow min-w-0">
          <p className="font-oldstyle text-lg text-ink leading-tight">
            {t(`products.${item.productId}.name`)}
          </p>
          <p className="text-sm text-ink">
            {t('unitPrice')} {formatPriceCents(product.priceCents, locale)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 sm:flex-nowrap sm:gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              disabled={item.quantity === 0}
              aria-label={t('aria.decreaseQuantity')}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-parchment text-ink hover:bg-sand transition-colors disabled:opacity-40 disabled:hover:bg-parchment"
            >
              -
            </button>
            <span className="w-6 text-center">{item.quantity}</span>
            <button
              type="button"
              // A product at 0 is not in the cart yet: adding puts it back in.
              onClick={() =>
                item.quantity === 0 ? addItem(item.productId) : updateQuantity(item.productId, item.quantity + 1)
              }
              aria-label={t('aria.increaseQuantity')}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-parchment text-ink hover:bg-sand transition-colors"
            >
              +
            </button>
          </div>

          <p className="w-20 sm:w-24 text-right font-semibold text-ink">
            {formatPriceCents(lineTotalCents, locale)}
          </p>

          <button
            type="button"
            onClick={() => removeItem(item.productId)}
            disabled={item.quantity === 0}
            aria-label={t('aria.removeItem')}
            className="link-pirate text-sm shrink-0 disabled:invisible max-sm:disabled:hidden"
          >
            {t('remove')}
          </button>
        </div>
      </div>
    </div>
  );
}

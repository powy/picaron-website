'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { CartItem, useCart } from '@/lib/cart-context';
import { PRODUCTS, formatPriceCents } from '@/lib/products';

export default function CartItemRow({ item, locale }: { item: CartItem; locale: string }) {
  const t = useTranslations('cart');
  const { updateQuantity, removeItem } = useCart();
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

      <div className="grow min-w-0">
        <p className="font-oldstyle text-lg text-ink truncate">
          {t(`products.${item.productId}.name`)}
        </p>
        <p className="text-sm text-ink">
          {t('unitPrice')} {formatPriceCents(product.priceCents, locale)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
          aria-label={t('aria.decreaseQuantity')}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-parchment text-ink hover:bg-sand transition-colors"
        >
          -
        </button>
        <span className="w-6 text-center">{item.quantity}</span>
        <button
          type="button"
          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
          aria-label={t('aria.increaseQuantity')}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-parchment text-ink hover:bg-sand transition-colors"
        >
          +
        </button>
      </div>

      <p className="w-24 text-right font-semibold text-ink">
        {formatPriceCents(lineTotalCents, locale)}
      </p>

      <button
        type="button"
        onClick={() => removeItem(item.productId)}
        aria-label={t('aria.removeItem')}
        className="link-pirate text-sm shrink-0"
      >
        {t('remove')}
      </button>
    </div>
  );
}

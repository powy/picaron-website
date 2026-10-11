'use client';

// Cart preview shown next to the products on the shop page (desktop). The
// full cart (/panier) stays the place where the delivery method is chosen
// and the order is placed; this card only summarizes and links to it.

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { CartItem, useCart } from '@/lib/cart-context';
import { PRODUCTS, ProductId, formatPriceCents } from '@/lib/products';

interface CartPreviewProps {
  locale: string;
  /** Product just added from the shop page: its line is briefly highlighted. */
  highlightId?: ProductId | null;
}

export default function CartPreview({ locale, highlightId = null }: CartPreviewProps) {
  const t = useTranslations('cart.preview');
  const { items, itemCount, subtotalCents } = useCart();

  return (
    <aside
      aria-labelledby="cart-preview-title"
      className="border-2 border-parchment rounded-lg bg-parchment/30 p-5 space-y-4 text-base"
      data-testid="cart-preview"
    >
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="cart-preview-title" className="font-oldstyle text-2xl text-pirate-red">
          {t('title')}
        </h2>
        {itemCount > 0 && (
          <span className="text-sm text-ink whitespace-nowrap">{t('items', { count: itemCount })}</span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="py-4 text-center text-ink space-y-1">
          <p className="m-0 font-oldstyle text-lg">{t('empty')}</p>
          <p className="m-0 text-sm">{t('emptyHint')}</p>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-parchment text-base">
            {items.map((item) => (
              <CartPreviewLine
                key={item.productId}
                item={item}
                locale={locale}
                highlighted={item.productId === highlightId}
              />
            ))}
          </ul>

          <div className="border-t-2 border-parchment pt-3 space-y-1">
            <div className="flex justify-between text-ink font-semibold">
              <span>{t('subtotal')}</span>
              <span data-testid="cart-preview-subtotal">{formatPriceCents(subtotalCents, locale)}</span>
            </div>
            <p className="m-0 text-xs text-ink">{t('shippingNextStep')}</p>
          </div>

          <Link href={`/${locale}/panier`} className="btn-primary-full block text-center text-base">
            {t('viewCart')}
          </Link>

          <p className="m-0 text-xs text-center">
            <Link href={`/${locale}/cgv`} className="link-pirate text-xs">
              {t('terms')}
            </Link>
          </p>
        </>
      )}
    </aside>
  );
}

function CartPreviewLine({ item, locale, highlighted }: { item: CartItem; locale: string; highlighted: boolean }) {
  const tCart = useTranslations('cart');
  const { updateQuantity, removeItem } = useCart();
  const product = PRODUCTS[item.productId];
  const name = tCart(`products.${item.productId}.name`);

  return (
    <li
      className={`flex gap-3 py-3 px-2 -mx-2 rounded transition-colors duration-700 ${
        highlighted ? 'bg-sand/60' : 'bg-transparent'
      }`}
      data-testid={`cart-preview-line-${item.productId}`}
    >
      {/* object-top: the Boucaniers picture shows the box at the top of the material spread. */}
      <Image
        src={product.image}
        alt=""
        width={56}
        height={56}
        className="w-14 h-14 rounded object-cover object-top bg-bone flex-shrink-0"
      />

      <div className="flex-grow min-w-0 space-y-1">
        <div className="flex justify-between gap-3">
          <p className="m-0 font-oldstyle text-ink text-base leading-snug">{name}</p>
          <p className="m-0 text-ink text-base whitespace-nowrap">
            {formatPriceCents(product.priceCents * item.quantity, locale)}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              aria-label={`${tCart('aria.decreaseQuantity')} — ${name}`}
              className="w-8 h-8 p-0 flex items-center justify-center rounded-full bg-parchment text-ink text-base leading-none hover:bg-sand transition-colors"
            >
              −
            </button>
            <span className="w-7 text-center text-ink" aria-label={tCart('quantity')}>
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              aria-label={`${tCart('aria.increaseQuantity')} — ${name}`}
              className="w-8 h-8 p-0 flex items-center justify-center rounded-full bg-parchment text-ink text-base leading-none hover:bg-sand transition-colors"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.productId)}
            aria-label={`${tCart('aria.removeItem')} — ${name}`}
            className="link-pirate text-sm p-0"
          >
            {tCart('remove')}
          </button>
        </div>
      </div>
    </li>
  );
}

'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { formatPriceCents } from '@/lib/products';
import { computeShippingCents } from '@/lib/shipping';
import { useShippingMethod, ShippingMethod } from '@/lib/use-shipping-method';
import CartItemRow from '@/components/cart/CartItemRow';
import FranceOnlyNotice from '@/components/checkout/FranceOnlyNotice';

// NEXT_PUBLIC_SHIPPING_METHODS restricts the choice (e.g. "colissimo" to open
// the shop without Mondial Relay). Keep it in sync with SHIPPING_METHODS on the
// API side, which rejects a disabled method. Default: both.
const ENABLED_METHODS = (process.env.NEXT_PUBLIC_SHIPPING_METHODS ?? 'mondial_relay,colissimo')
  .split(',')
  .map((method) => method.trim());
const SHIPPING_METHODS = (
  [
    { method: 'mondial_relay', i18nKey: 'mondialRelay' },
    { method: 'colissimo', i18nKey: 'colissimo' },
  ] as { method: ShippingMethod; i18nKey: 'mondialRelay' | 'colissimo' }[]
).filter(({ method }) => ENABLED_METHODS.includes(method));

export default function PanierPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const t = useTranslations('cart');
  const { items, subtotalCents } = useCart();
  const [shippingMethod, setShippingMethod] = useShippingMethod();
  // A single enabled method is selected for the customer (also overrides a
  // now-disabled method remembered from an earlier session).
  const onlyMethod = SHIPPING_METHODS.length === 1 ? SHIPPING_METHODS[0].method : null;
  useEffect(() => {
    if (onlyMethod && shippingMethod !== onlyMethod) setShippingMethod(onlyMethod);
  }, [onlyMethod, shippingMethod, setShippingMethod]);
  // Same rule as the server, which bills it (lib/shipping.ts).
  const shippingCents = shippingMethod ? computeShippingCents(items, shippingMethod) : null;

  if (items.length === 0) {
    return (
      <div className="mt-8">
        <h1 className="title-page">{t('title')}</h1>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
          <p className="text-2xl font-oldstyle text-pirate-red">{t('empty.title')}</p>
          <p className="text-lg text-ink">{t('empty.message')}</p>
          <Link href={`/${locale}/boutique`} className="btn-primary-rounded inline-block mt-4">
            {t('empty.cta')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h1 className="title-page">{t('title')}</h1>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          <div>
            {items.map((item) => (
              <CartItemRow key={item.productId} item={item} locale={locale} />
            ))}
          </div>

          <div>
            <h2 className="font-oldstyle text-xl text-pirate-red mb-1">{t('shippingMethod.title')}</h2>
            <p className="text-sm text-ink mb-1">{t('shippingMethod.deliveryEstimate')}</p>
            <FranceOnlyNotice className="mb-4" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SHIPPING_METHODS.map(({ method, i18nKey }) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setShippingMethod(method)}
                  className={`text-left border-2 rounded-lg p-4 transition-colors ${
                    shippingMethod === method ? 'border-pirate-red bg-parchment/30' : 'border-wood'
                  }`}
                >
                  <p className="font-oldstyle text-lg text-ink">{t(`shippingMethod.${i18nKey}.name`)}</p>
                  <p className="text-sm text-ink">{t(`shippingMethod.${i18nKey}.description`)}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="space-y-4 border-2 border-parchment rounded-lg p-6">
            <div className="flex justify-between items-center text-ink">
              <span>{t('summary.itemsSubtotal')}</span>
              <span>{formatPriceCents(subtotalCents, locale)}</span>
            </div>
            <div className="flex justify-between items-center text-ink" data-testid="cart-shipping">
              <span>{t('summary.shipping')}</span>
              {shippingCents === null ? (
                <span className="text-sm italic">{t('summary.shippingPending')}</span>
              ) : (
                <span>{formatPriceCents(shippingCents, locale)}</span>
              )}
            </div>
            <div className="flex justify-between items-center text-2xl font-semibold text-ink border-t border-parchment pt-4">
              <span>{t('summary.total')}</span>
              <span data-testid="cart-total">{formatPriceCents(subtotalCents + (shippingCents ?? 0), locale)}</span>
            </div>

            <button
              type="button"
              disabled={shippingMethod === null}
              onClick={() => router.push(`/${locale}/commande/adresse`)}
              className="btn-primary-full block text-center w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('summary.checkout')}
            </button>

            <Link href={`/${locale}/boutique`} className="link-pirate block text-center text-sm">
              {t('summary.continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

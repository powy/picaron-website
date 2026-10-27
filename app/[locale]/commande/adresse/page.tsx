'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { PRODUCTS, formatPriceCents } from '@/lib/products';
import { computeShippingCents } from '@/lib/shipping';
import { useSessionState } from '@/lib/use-session-state';
import { useShippingMethod } from '@/lib/use-shipping-method';
import MondialRelayPicker, { ParcelShopData } from '@/components/checkout/MondialRelayPicker';
import MockRelayPicker from '@/components/checkout/MockRelayPicker';
import FranceOnlyNotice from '@/components/checkout/FranceOnlyNotice';
import { createOrder } from '@/lib/checkout/api-client';
import type { CreateOrderRequest } from '@/lib/checkout/order';
import AddressFields, {
  AddressFormData,
  AddressFieldKey,
  DEFAULT_ADDRESS,
  validateAddress,
} from '@/components/checkout/AddressFields';

// Offline test mode swaps the Mondial Relay widget (CDN scripts + API) for
// fixed fake relay points — see lib/server/config.ts for the other switches.
const RelayPicker = process.env.NEXT_PUBLIC_RELAY_PICKER === 'mock' ? MockRelayPicker : MondialRelayPicker;

export default function CommandeAdressePage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const t = useTranslations('checkout');
  const tCart = useTranslations('cart');
  const { items, subtotalCents } = useCart();

  const [shippingMethod, , methodHydrated] = useShippingMethod();

  const [deliveryAddress, setDeliveryAddress] = useSessionState<AddressFormData>(
    'picaron_delivery_address_v1',
    DEFAULT_ADDRESS
  );
  const [billingAddress, setBillingAddress] = useSessionState<AddressFormData>(
    'picaron_billing_address_v1',
    DEFAULT_ADDRESS
  );
  const [billingDifferent, setBillingDifferent] = useSessionState<boolean>(
    'picaron_billing_different_v1',
    false
  );

  const [deliveryTouched, setDeliveryTouched] = useState<Partial<Record<AddressFieldKey, boolean>>>({});
  const [billingTouched, setBillingTouched] = useState<Partial<Record<AddressFieldKey, boolean>>>({});
  const [selectedRelay, setSelectedRelay] = useState<ParcelShopData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  useEffect(() => {
    if (methodHydrated && items.length > 0 && shippingMethod === null) {
      router.replace(`/${locale}/panier`);
    }
  }, [methodHydrated, items.length, shippingMethod, locale, router]);

  if (items.length === 0) {
    return (
      <div className="mt-8">
        <h1 className="title-page">{t('title')}</h1>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center stack-y-4">
          <p className="text-2xl font-oldstyle text-pirate-red">{tCart('empty.title')}</p>
          <p className="text-lg text-ink">{tCart('empty.message')}</p>
          <Link href={`/${locale}/boutique`} className="btn-primary-rounded inline-block mt-4">
            {tCart('empty.cta')}
          </Link>
        </div>
      </div>
    );
  }

  if (!methodHydrated || shippingMethod === null) {
    // Brief flash while sessionStorage hydrates, or while the redirect above
    // (no method chosen) is in flight.
    return null;
  }

  const shippingCents = computeShippingCents(items, shippingMethod);
  const deliveryErrors = validateAddress(deliveryAddress);
  const billingErrors = validateAddress(billingAddress);

  const canContinue =
    shippingMethod === 'mondial_relay'
      ? Object.keys(billingErrors).length === 0 && selectedRelay !== null
      : Object.keys(deliveryErrors).length === 0 &&
        (!billingDifferent || Object.keys(billingErrors).length === 0);

  const setDeliveryField = (key: AddressFieldKey, value: string) =>
    setDeliveryAddress((prev) => ({ ...prev, [key]: value }));
  const setBillingField = (key: AddressFieldKey, value: string) =>
    setBillingAddress((prev) => ({ ...prev, [key]: value }));
  const touchDelivery = (key: AddressFieldKey) => setDeliveryTouched((prev) => ({ ...prev, [key]: true }));
  const touchBilling = (key: AddressFieldKey) => setBillingTouched((prev) => ({ ...prev, [key]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canContinue || submitting) return;
    const payload: CreateOrderRequest =
      shippingMethod === 'mondial_relay'
        ? { locale, items, shippingMethod, billingAddress, relay: selectedRelay! }
        : {
            locale,
            items,
            shippingMethod,
            deliveryAddress,
            billingAddress: billingDifferent ? billingAddress : deliveryAddress,
          };
    setSubmitting(true);
    setSubmitError(false);
    try {
      // The order is created 'pending' before payment (task 5); the cart is
      // only cleared once the payment is confirmed (success page).
      const { publicId } = await createOrder(payload);
      router.push(`/${locale}/commande/paiement?order=${publicId}`);
    } catch (error) {
      console.error('create-order failed:', error);
      setSubmitError(true);
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      <h1 className="title-page">
        {shippingMethod === 'colissimo' ? t('deliveryAddressTitle') : t('title')}
      </h1>

      <div className="max-w-7xl mx-auto px-4 py-8 stack-y-10">
        <form className="stack-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-sm text-ink">
            <p>{t('requiredHint')}</p>
            <FranceOnlyNotice />
          </div>

          {shippingMethod === 'mondial_relay' ? (
            <>
              <div>
                <p className="font-oldstyle text-ink mb-1">{t('relay.title')}</p>
                <p className="text-sm text-ink mb-3">{t('relay.chooseCta')}</p>
                <RelayPicker onSelect={setSelectedRelay} />
                {selectedRelay && (
                  <p className="text-sm text-ink mt-3">
                    {t('relay.selectedLabel')} : {selectedRelay.Nom} — {selectedRelay.Adresse1}
                    {selectedRelay.Adresse2 ? `, ${selectedRelay.Adresse2}` : ''}, {selectedRelay.CP}{' '}
                    {selectedRelay.Ville}
                  </p>
                )}
              </div>

              <div>
                <p className="font-oldstyle text-xl text-pirate-red mb-3">{t('billingAddressTitle')}</p>
                <AddressFields
                  idPrefix="billing"
                  values={billingAddress}
                  errors={billingErrors}
                  touched={billingTouched}
                  onChange={setBillingField}
                  onBlur={touchBilling}
                  t={t}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="font-oldstyle text-xl text-pirate-red mb-3">{t('deliveryAddressTitle')}</p>
                <AddressFields
                  idPrefix="delivery"
                  values={deliveryAddress}
                  errors={deliveryErrors}
                  touched={deliveryTouched}
                  onChange={setDeliveryField}
                  onBlur={touchDelivery}
                  t={t}
                />
              </div>

              <label className="flex items-center gap-2 text-ink text-sm">
                <input
                  type="checkbox"
                  checked={billingDifferent}
                  onChange={(e) => setBillingDifferent(e.target.checked)}
                />
                {t('differentBillingCheckbox')}
              </label>

              {billingDifferent && (
                <div>
                  <p className="font-oldstyle text-xl text-pirate-red mb-3">{t('billingAddressTitle')}</p>
                  <AddressFields
                    idPrefix="billing"
                    values={billingAddress}
                    errors={billingErrors}
                    touched={billingTouched}
                    onChange={setBillingField}
                    onBlur={touchBilling}
                    t={t}
                  />
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={!canContinue || submitting}
            className="btn-primary-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? t('submitting') : t('continueToPayment')}
          </button>

          {submitError && (
            <p role="alert" className="error-text text-center">
              {t('submitError')}
            </p>
          )}
        </form>

        <div className="border-t-2 border-parchment pt-6">
          <h2 className="font-oldstyle text-xl text-pirate-red mb-4">{t('orderSummary')}</h2>

          <div className="stack-y-2">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-ink">
                <span>
                  {tCart(`products.${item.productId}.name`)} × {item.quantity}
                </span>
                <span>
                  {formatPriceCents(PRODUCTS[item.productId].priceCents * item.quantity, locale)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-ink mt-4 pt-4 border-t border-parchment">
            <span>{tCart('summary.shipping')}</span>
            <span>{formatPriceCents(shippingCents, locale)}</span>
          </div>

          <div className="flex justify-between items-center text-xl font-semibold text-ink mt-2">
            <span>{tCart('summary.total')}</span>
            <span>{formatPriceCents(subtotalCents + shippingCents, locale)}</span>
          </div>

          <Link href={`/${locale}/panier`} className="link-pirate text-sm inline-block mt-4">
            {t('modifyCart')}
          </Link>
        </div>
      </div>
    </div>
  );
}

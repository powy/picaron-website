'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import MockPaymentForm from '@/components/checkout/MockPaymentForm';
import FranceOnlyNotice from '@/components/checkout/FranceOnlyNotice';
import OrderSummaryCard from '@/components/checkout/OrderSummaryCard';
import StripePaymentForm from '@/components/checkout/StripePaymentForm';
import { ApiError, createPaymentIntent, getOrder } from '@/lib/checkout/api-client';
import type { OrderSummary, PaymentIntentResponse } from '@/lib/checkout/order';
import { formatPriceCents } from '@/lib/products';

type ReadyIntent = Extract<PaymentIntentResponse, { alreadyPaid: false }>;
type State =
  | { kind: 'loading' }
  | { kind: 'notFound' }
  | { kind: 'error' }
  | { kind: 'ready'; order: OrderSummary; intent: ReadyIntent };

const KNOWN_DECLINE_CODES = ['card_declined', 'insufficient_funds'];

export default function CommandePaiementPage() {
  return (
    <Suspense>
      <PaymentContent />
    </Suspense>
  );
}

function PaymentContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = params.locale as string;
  const publicId = searchParams.get('order') ?? '';
  const t = useTranslations('payment');

  const [state, setState] = useState<State>({ kind: 'loading' });
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const successUrl = `/${locale}/commande/succes?order=${publicId}`;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const order = await getOrder(publicId);
        const intent = await createPaymentIntent(publicId);
        if (cancelled) return;
        if (intent.alreadyPaid) {
          router.replace(successUrl);
          return;
        }
        setState({ kind: 'ready', order, intent });
      } catch (error) {
        if (cancelled) return;
        console.error('payment setup failed:', error);
        setState({ kind: error instanceof ApiError && error.status === 404 ? 'notFound' : 'error' });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [publicId, router, successUrl]);

  const handleFailed = (code: string, stripeMessage?: string) => {
    if (KNOWN_DECLINE_CODES.includes(code)) setPaymentError(t(`declined.${code}`));
    else setPaymentError(stripeMessage ?? t('declined.generic'));
  };
  const handleSucceeded = () => router.push(successUrl);

  return (
    <div className="mt-8">
      <h1 className="title-page">{t('title')}</h1>
      <div className="max-w-2xl mx-auto px-4 py-8 stack-y-6">
        {state.kind === 'loading' && <p className="text-center text-ink">{t('loading')}</p>}
        {state.kind === 'notFound' && <p className="text-center text-ink">{t('notFound')}</p>}
        {state.kind === 'error' && (
          <p role="alert" className="text-center error-text">
            {t('loadError')}
          </p>
        )}

        {state.kind === 'ready' && (
          <>
            <p className="text-center text-ink">{t('orderRef', { ref: state.order.reference })}</p>
            <OrderSummaryCard order={state.order} locale={locale} />
            <FranceOnlyNotice className="text-center" />

            {paymentError && (
              <p role="alert" className="error-text text-center" data-testid="payment-error">
                {paymentError}
              </p>
            )}

            {state.intent.provider === 'mock' ? (
              <MockPaymentForm
                paymentIntentId={state.intent.paymentIntentId}
                onSucceeded={handleSucceeded}
                onFailed={handleFailed}
              />
            ) : (
              <StripePaymentForm
                clientSecret={state.intent.clientSecret}
                locale={locale}
                returnUrl={`${window.location.origin}${successUrl}`}
                payLabel={t('pay', { amount: formatPriceCents(state.intent.amountCents, locale) })}
                onSucceeded={handleSucceeded}
                onFailed={handleFailed}
              />
            )}

            <div className="text-center">
              <Link href={`/${locale}/commande/annulation?order=${publicId}`} className="link-pirate text-sm">
                {t('abandon')}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

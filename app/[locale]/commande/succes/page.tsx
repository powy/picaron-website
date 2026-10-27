'use client';

// Task 9 — confirmation page. The order is shown as paid only once the
// server says so (the webhook is the source of truth): right after payment
// the page polls while the status is still 'pending'. Reloading it has no
// side effect beyond clearing the (already empty) cart again.

import { Suspense, useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import OrderSummaryCard from '@/components/checkout/OrderSummaryCard';
import { useCart } from '@/lib/cart-context';
import { ApiError, getOrder } from '@/lib/checkout/api-client';
import type { OrderSummary } from '@/lib/checkout/order';
import { clearCheckoutSession } from '@/lib/checkout/session-keys';

// Outline icons (24×24, stroke), one visual style for the whole "next steps" box.
const STEP_ICON_PATHS = {
  email: [
    'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
  ],
  delivery: [
    'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12',
  ],
  tracking: [
    'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z',
    'M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z',
  ],
} as const;

function StepIcon({ name }: { name: keyof typeof STEP_ICON_PATHS }) {
  return (
    <svg
      className="w-6 h-6 shrink-0 text-pirate-red"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {STEP_ICON_PATHS[name].map((d) => (
        <path key={d} strokeLinecap="round" strokeLinejoin="round" d={d} />
      ))}
    </svg>
  );
}

const POLL_INTERVAL_MS = 1500;
const MAX_POLLS = 20;

type State = { kind: 'loading' } | { kind: 'notFound' } | { kind: 'order'; order: OrderSummary; pollingDone: boolean };

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale as string;
  const publicId = searchParams.get('order') ?? '';
  const t = useTranslations('success');
  const { clearCart } = useCart();
  const clearedRef = useRef(false);

  const [state, setState] = useState<State>({ kind: 'loading' });

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const poll = async (attempt: number) => {
      try {
        const order = await getOrder(publicId);
        if (cancelled) return;
        const done = order.status !== 'pending' || attempt >= MAX_POLLS;
        setState({ kind: 'order', order, pollingDone: done });
        if (!done) timer = setTimeout(() => poll(attempt + 1), POLL_INTERVAL_MS);
      } catch (error) {
        if (cancelled) return;
        if (error instanceof ApiError && error.status === 404) setState({ kind: 'notFound' });
        else timer = setTimeout(() => poll(attempt + 1), POLL_INTERVAL_MS);
      }
    };
    poll(1);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [publicId]);

  const isPaid = state.kind === 'order' && (state.order.status === 'paid' || state.order.status === 'shipped');
  useEffect(() => {
    if (isPaid && !clearedRef.current) {
      clearedRef.current = true;
      clearCart();
      clearCheckoutSession();
    }
  }, [isPaid, clearCart]);

  const contact = <p className="text-sm text-ink pt-4">{t('contact', { email: 'contact@picaron.fr' })}</p>;

  if (state.kind === 'loading') {
    return <p className="mt-16 text-center text-ink">{t('loading')}</p>;
  }
  if (state.kind === 'notFound') {
    return (
      <div className="mt-16 text-center stack-y-4">
        <p className="text-ink">{t('notFound')}</p>
        <Link href={`/${locale}/boutique`} className="link-pirate">
          {t('backShop')}
        </Link>
      </div>
    );
  }

  const { order } = state;
  const failed = order.status === 'failed' || order.status === 'cancelled';

  return (
    <div className="mt-8">
      <div className="max-w-2xl mx-auto px-4 py-16 text-center stack-y-6" data-testid={`order-status-${order.status}`}>
        {isPaid && (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="title-page">{t('title')}</h1>
            <p className="text-xl text-ink">{t('thanks')}</p>
          </>
        )}
        {order.status === 'pending' && (
          <>
            <h1 className="title-page">{t('pendingTitle')}</h1>
            <p className="text-ink">{state.pollingDone ? t('pendingMessage') : t('loading')}</p>
          </>
        )}
        {failed && (
          <>
            <h1 className="title-page">{t('failedTitle')}</h1>
            <p className="text-ink">{t('failedMessage')}</p>
            {order.status === 'failed' && (
              <Link href={`/${locale}/commande/paiement?order=${order.publicId}`} className="btn-primary-rounded inline-block">
                {t('retryPayment')}
              </Link>
            )}
          </>
        )}

        <p className="text-sm text-ink">{t('orderRef', { ref: order.reference })}</p>
        <OrderSummaryCard order={order} locale={locale} />

        {isPaid && (
          <div className="bg-parchment/30 rounded-lg p-6 text-left">
            <h2 className="font-oldstyle font-semibold text-2xl text-pirate-red mb-4">{t('nextSteps')}</h2>
            <ul className="stack-y-3 text-ink">
              {(['email', 'delivery', 'tracking'] as const).map((step) => (
                <li key={step} className="flex items-center gap-3">
                  <StepIcon name={step} />
                  <span>{t(`steps.${step}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link href={`/${locale}/boutique`} className="link-pirate inline-block">
          {t('backShop')}
        </Link>
        {contact}
      </div>
    </div>
  );
}

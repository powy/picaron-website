'use client';

// Offline payment form (PAYMENT_PROVIDER=mock). Each button asks the API to
// simulate what Stripe would do; the API runs the resulting event through the
// real payment-event handler (order status + confirmation email).

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { mockPay } from '@/lib/checkout/api-client';
import type { MockPaymentOutcome } from '@/lib/checkout/order';

interface MockPaymentFormProps {
  paymentIntentId: string;
  onSucceeded: () => void;
  onFailed: (code: string) => void;
}

const OUTCOMES: { outcome: MockPaymentOutcome; labelKey: string; className: string }[] = [
  { outcome: 'succeeded', labelKey: 'succeeded', className: 'btn-primary-full' },
  { outcome: 'declined', labelKey: 'declined', className: 'btn-primary-rounded w-full' },
  { outcome: 'insufficient_funds', labelKey: 'insufficientFunds', className: 'btn-primary-rounded w-full' },
];

export default function MockPaymentForm({ paymentIntentId, onSucceeded, onFailed }: MockPaymentFormProps) {
  const t = useTranslations('payment');
  const [processing, setProcessing] = useState(false);

  const simulate = async (outcome: MockPaymentOutcome) => {
    setProcessing(true);
    try {
      const result = await mockPay(paymentIntentId, outcome);
      if (result.status === 'succeeded') {
        onSucceeded();
        return;
      }
      onFailed(result.declineCode);
    } catch (error) {
      console.error('mock payment failed:', error);
      onFailed('generic');
    }
    setProcessing(false);
  };

  return (
    <div className="border-2 border-dashed border-yellow-500 bg-yellow-50/60 rounded-sm p-4 stack-y-3" data-testid="mock-payment-form">
      <p className="font-oldstyle text-lg text-ink">{t('mock.title')}</p>
      <p className="text-sm text-ink">{t('mock.hint')}</p>
      {OUTCOMES.map(({ outcome, labelKey, className }) => (
        <button
          key={outcome}
          type="button"
          disabled={processing}
          onClick={() => simulate(outcome)}
          className={`${className} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {processing ? t('processing') : t(`mock.${labelKey}`)}
        </button>
      ))}
    </div>
  );
}

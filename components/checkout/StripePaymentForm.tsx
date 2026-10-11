'use client';

// Real card form (PAYMENT_PROVIDER=stripe): Stripe Elements, so card data
// goes straight from the browser to Stripe (PCI-DSS). A successful
// confirmation here only moves the customer on — the order becomes 'paid'
// when the Stripe webhook arrives (task 7), never on the front's word.

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';

// Loaded lazily on first render only: offline/mock mode never contacts Stripe.
let stripePromise: Promise<Stripe | null> | null = null;
const getStripe = () => (stripePromise ??= loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''));

interface StripePaymentFormProps {
  clientSecret: string;
  locale: string;
  returnUrl: string;
  payLabel: string;
  onSucceeded: () => void;
  onFailed: (code: string, stripeMessage?: string) => void;
}

export default function StripePaymentForm(props: StripePaymentFormProps) {
  return (
    <Elements
      stripe={getStripe()}
      options={{ clientSecret: props.clientSecret, locale: props.locale === 'en' ? 'en' : 'fr' }}
    >
      <PaymentForm {...props} />
    </Elements>
  );
}

function PaymentForm({ returnUrl, payLabel, onSucceeded, onFailed }: StripePaymentFormProps) {
  const t = useTranslations('payment');
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    // 3-D Secure and redirect-based methods come back to returnUrl (success
    // page); plain card payments resolve here without a redirect.
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
      redirect: 'if_required',
    });
    if (error) {
      onFailed(error.decline_code ?? error.code ?? 'generic', error.message);
      setProcessing(false);
      return;
    }
    if (paymentIntent && ['succeeded', 'processing', 'requires_capture'].includes(paymentIntent.status)) {
      onSucceeded();
      return;
    }
    onFailed('generic');
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn-primary-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? t('processing') : payLabel}
      </button>
      <p className="text-xs text-ink text-center">{t('secureNote')}</p>
    </form>
  );
}

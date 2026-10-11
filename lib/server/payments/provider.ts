import type { PaymentProviderName } from '../../checkout/order';

/**
 * A payment event, normalized from a Stripe webhook event or built by the
 * offline mock. handlePaymentEvent() only ever sees this shape, so the mock
 * exercises exactly the same status/idempotency/email logic as Stripe.
 */
export interface PaymentEvent {
  /** Stripe event id (evt_...) or evt_mock_... — the idempotency key. */
  id: string;
  type: 'payment_intent.succeeded' | 'payment_intent.payment_failed' | 'other';
  /** Raw provider event type, for logs. */
  rawType: string;
  paymentIntentId: string | null;
  /** e.g. card_declined / insufficient_funds on failures. */
  failureCode: string | null;
}

export interface PaymentIntentResult {
  id: string;
  clientSecret: string;
}

export interface PaymentProvider {
  name: PaymentProviderName;
  createPaymentIntent(order: {
    publicId: string;
    amountCents: number;
    email: string;
    reference: string;
  }): Promise<PaymentIntentResult>;
  retrievePaymentIntent(id: string): Promise<PaymentIntentResult>;
  /** Verifies the webhook signature and normalizes the event. Throws WebhookSignatureError. */
  parseWebhook(rawBody: string, signatureHeader: string | null): PaymentEvent;
}

export class WebhookSignatureError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WebhookSignatureError';
  }
}

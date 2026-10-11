import Stripe from 'stripe';
import type { PaymentEvent, PaymentIntentResult, PaymentProvider } from './provider';
import { WebhookSignatureError } from './provider';

export function createStripeProvider(secretKey: string, webhookSecret: string): PaymentProvider {
  const stripe = new Stripe(secretKey);

  const toResult = (intent: Stripe.PaymentIntent): PaymentIntentResult => {
    if (!intent.client_secret) throw new Error(`PaymentIntent ${intent.id} has no client_secret`);
    return { id: intent.id, clientSecret: intent.client_secret };
  };

  return {
    name: 'stripe',

    async createPaymentIntent(order) {
      const intent = await stripe.paymentIntents.create(
        {
          amount: order.amountCents,
          currency: 'eur',
          automatic_payment_methods: { enabled: true },
          receipt_email: order.email,
          description: `Commande ${order.reference}`,
          metadata: { order_public_id: order.publicId, order_reference: order.reference },
        },
        // A double click or a retried request returns the same intent
        // instead of creating a second one for the same order.
        { idempotencyKey: `order-${order.publicId}` }
      );
      return toResult(intent);
    },

    async retrievePaymentIntent(id) {
      return toResult(await stripe.paymentIntents.retrieve(id));
    },

    parseWebhook(rawBody, signatureHeader): PaymentEvent {
      if (!signatureHeader) throw new WebhookSignatureError('Missing Stripe-Signature header');
      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(rawBody, signatureHeader, webhookSecret);
      } catch (error) {
        throw new WebhookSignatureError((error as Error).message);
      }

      if (event.type === 'payment_intent.succeeded' || event.type === 'payment_intent.payment_failed') {
        const intent = event.data.object;
        return {
          id: event.id,
          type: event.type,
          rawType: event.type,
          paymentIntentId: intent.id,
          failureCode: intent.last_payment_error?.decline_code ?? intent.last_payment_error?.code ?? null,
        };
      }
      return { id: event.id, type: 'other', rawType: event.type, paymentIntentId: null, failureCode: null };
    },
  };
}

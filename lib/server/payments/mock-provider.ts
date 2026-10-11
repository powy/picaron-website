// Offline stand-in for Stripe (PAYMENT_PROVIDER=mock, never in production —
// see lib/server/config.ts). No network: intents are just ids. The customer
// "pays" by clicking a simulated outcome on the payment page, which calls
// POST /api/mock-payment → buildMockPaymentEvent() → handlePaymentEvent(),
// the same handler the real Stripe webhook uses.

import { randomUUID } from 'node:crypto';
import type { MockPaymentOutcome } from '../../checkout/order';
import type { PaymentEvent, PaymentProvider } from './provider';

const MOCK_INTENT_PREFIX = 'mock_pi_';

export function isMockPaymentIntentId(id: string): boolean {
  return id.startsWith(MOCK_INTENT_PREFIX);
}

export function createMockProvider(): PaymentProvider {
  return {
    name: 'mock',

    async createPaymentIntent() {
      const id = `${MOCK_INTENT_PREFIX}${randomUUID().replace(/-/g, '')}`;
      return { id, clientSecret: `${id}_secret_mock` };
    },

    async retrievePaymentIntent(id) {
      return { id, clientSecret: `${id}_secret_mock` };
    },

    parseWebhook() {
      throw new Error('The mock payment provider has no webhook: use POST /api/mock-payment');
    },
  };
}

/** Same decline codes Stripe uses, so the front shows the same messages. */
export function buildMockPaymentEvent(paymentIntentId: string, outcome: MockPaymentOutcome): PaymentEvent {
  const id = `evt_mock_${randomUUID().replace(/-/g, '')}`;
  if (outcome === 'succeeded') {
    return { id, type: 'payment_intent.succeeded', rawType: 'payment_intent.succeeded', paymentIntentId, failureCode: null };
  }
  return {
    id,
    type: 'payment_intent.payment_failed',
    rawType: 'payment_intent.payment_failed',
    paymentIntentId,
    failureCode: outcome === 'insufficient_funds' ? 'insufficient_funds' : 'card_declined',
  };
}

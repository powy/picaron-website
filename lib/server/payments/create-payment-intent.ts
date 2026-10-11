// Task 6 — creates (or reuses) the payment intent for a pending/failed order.
// The amount always comes from the order row, never from the client.

import { formatOrderReference, type PaymentIntentResponse } from '../../checkout/order';
import type { Queryable } from '../db';
import { findOrderByPublicId, totalCents } from '../orders/get-order';
import type { PaymentProvider } from './provider';

export class OrderNotFoundError extends Error {
  constructor() {
    super('Commande introuvable');
    this.name = 'OrderNotFoundError';
  }
}

export class OrderNotPayableError extends Error {
  constructor(status: string) {
    super(`Commande non payable (statut ${status})`);
    this.name = 'OrderNotPayableError';
  }
}

export async function createPaymentIntentForOrder(
  db: Queryable,
  provider: PaymentProvider,
  publicId: string
): Promise<PaymentIntentResponse> {
  const order = await findOrderByPublicId(db, publicId);
  if (!order) throw new OrderNotFoundError();
  if (order.statut === 'paid' || order.statut === 'shipped') return { alreadyPaid: true };
  if (order.statut === 'cancelled') throw new OrderNotPayableError(order.statut);

  const amountCents = totalCents(order);

  // Reuse the existing intent (page reload, retry after a decline): Stripe
  // lets a failed PaymentIntent be confirmed again with another card.
  // An intent created by the other provider (switching mock <-> stripe
  // locally on the same order) is replaced.
  const existing = order.stripe_payment_intent_id;
  const existingMatchesProvider =
    existing !== null && existing.startsWith('mock_pi_') === (provider.name === 'mock');
  if (existing && existingMatchesProvider) {
    const intent = await provider.retrievePaymentIntent(existing);
    return { alreadyPaid: false, provider: provider.name, paymentIntentId: intent.id, clientSecret: intent.clientSecret, amountCents };
  }

  const intent = await provider.createPaymentIntent({
    publicId: order.public_id,
    amountCents,
    email: order.email_client,
    reference: formatOrderReference(order.id),
  });
  // Compare-and-set: two concurrent calls (double click, React dev double
  // effect) must not leave the order pointing at an intent the page isn't
  // using. The loser adopts the winner's intent.
  const updated = await db.query(
    `UPDATE commandes SET stripe_payment_intent_id = $1, date_mise_a_jour = now()
     WHERE id = $2 AND stripe_payment_intent_id IS NOT DISTINCT FROM $3`,
    [intent.id, order.id, existing]
  );
  if (updated.rowCount === 0) {
    const current = await findOrderByPublicId(db, publicId);
    if (!current?.stripe_payment_intent_id) throw new OrderNotFoundError();
    const winner = await provider.retrievePaymentIntent(current.stripe_payment_intent_id);
    return { alreadyPaid: false, provider: provider.name, paymentIntentId: winner.id, clientSecret: winner.clientSecret, amountCents };
  }
  return { alreadyPaid: false, provider: provider.name, paymentIntentId: intent.id, clientSecret: intent.clientSecret, amountCents };
}

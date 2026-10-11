// Full backend flow against a real Postgres (DATABASE_URL, e.g.
// `npm run db:local:up && npm run db:setup`): create-order -> payment intent
// -> payment events (mock and signed Stripe webhooks) -> status + email.
// Run with: npm run test:integration

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import Stripe from 'stripe';
import { loadConfig } from '../config';
import type { ServerContext } from '../context';
import { getPool } from '../db';
import type { EmailMessage } from '../email/order-confirmation';
import { route } from '../http/router';
import { ADDRESS, RELAY } from '../test-fixtures';
import { createOrder } from '../orders/create-order';
import { findOrderByPublicId } from '../orders/get-order';
import { createPaymentIntentForOrder } from './create-payment-intent';
import { handlePaymentEvent } from './handle-payment-event';
import { buildMockPaymentEvent, createMockProvider } from './mock-provider';
import type { PaymentProvider } from './provider';
import { createStripeProvider } from './stripe-provider';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL is not set — see scripts/db/README.md');

const pool = getPool(databaseUrl);
const sent: EmailMessage[] = [];
let failNextEmail = false;
const sendEmail = async (message: EmailMessage) => {
  if (failNextEmail) {
    failNextEmail = false;
    throw new Error('SMTP down');
  }
  sent.push(message);
};
const quietLog = { info() {}, warn() {}, error() {} };
const deps = { pool, sendEmail, siteUrl: 'http://localhost:3000', log: quietLog };
const mock = createMockProvider();
const createdIds: number[] = [];

const mondialRelayOrder = {
  locale: 'fr',
  items: [{ productId: 'boucaniers', quantity: 1 }],
  shippingMethod: 'mondial_relay',
  billingAddress: ADDRESS,
  relay: RELAY,
};
const colissimoOrder = {
  locale: 'en',
  items: [
    { productId: 'boucaniers', quantity: 1 },
    { productId: 'armand', quantity: 2 },
  ],
  shippingMethod: 'colissimo',
  billingAddress: { ...ADDRESS, city: 'Marseille', postalCode: '13001' },
  deliveryAddress: { ...ADDRESS, city: 'Lyon', postalCode: '69001' },
};

async function newOrder(input: unknown, provider: PaymentProvider = mock) {
  const { id, publicId } = await createOrder(pool, input);
  createdIds.push(id);
  const intent = await createPaymentIntentForOrder(pool, provider, publicId);
  assert.equal(intent.alreadyPaid, false);
  return { id, publicId, paymentIntentId: (intent as { paymentIntentId: string }).paymentIntentId };
}

const statusOf = async (publicId: string) => (await findOrderByPublicId(pool, publicId))!.statut;

before(async () => {
  await pool.query(readFileSync(path.join(process.cwd(), 'scripts/db/schema.sql'), 'utf8'));
});

after(async () => {
  if (createdIds.length) await pool.query('DELETE FROM commandes WHERE id = ANY($1::int[])', [createdIds]);
  await pool.end();
});

test('Mondial Relay order: pending -> paid, one email', async () => {
  const order = await newOrder(mondialRelayOrder);
  const row = await findOrderByPublicId(pool, order.publicId);
  assert.equal(row!.statut, 'pending');
  assert.equal(row!.montant_total, '79.00'); // 69 + 10 shipping
  assert.equal(row!.frais_livraison, '10.00');
  assert.equal(row!.point_relais_id, RELAY.ID);
  assert.equal(row!.livraison_ligne1, null);

  const before = sent.length;
  const result = await handlePaymentEvent(deps, buildMockPaymentEvent(order.paymentIntentId, 'succeeded'));
  assert.equal(result.outcome, 'updated');
  assert.equal(await statusOf(order.publicId), 'paid');
  assert.equal(sent.length, before + 1);
  assert.equal(sent.at(-1)!.to, ADDRESS.email);
});

test('Colissimo order stores the delivery address and the server-side total', async () => {
  const order = await newOrder(colissimoOrder);
  const row = (await findOrderByPublicId(pool, order.publicId))!;
  assert.equal(row.mode_livraison, 'colissimo');
  // 69 + 2 × 10 (novels) + 10 shipping (one game; novels ride along for free)
  assert.equal(row.montant_total, '99.00');
  assert.equal(row.frais_livraison, '10.00');
  assert.equal(row.livraison_ville, 'Lyon');
  assert.equal(row.point_relais_id, null);
  assert.equal(row.langue, 'en');
});

test('novels bought alone pay the flat novel-only shipping fee', async () => {
  const order = await newOrder({ ...colissimoOrder, items: [{ productId: 'armand', quantity: 2 }] });
  const row = (await findOrderByPublicId(pool, order.publicId))!;
  assert.equal(row.frais_livraison, '5.00');
  assert.equal(row.montant_total, '25.00'); // 2 × 10 + 5
});

test('replaying the same event changes nothing and sends no second email', async () => {
  const order = await newOrder(mondialRelayOrder);
  const event = buildMockPaymentEvent(order.paymentIntentId, 'succeeded');
  await handlePaymentEvent(deps, event);
  const emails = sent.length;
  const replay = await handlePaymentEvent(deps, event);
  assert.equal(replay.outcome, 'duplicate');
  assert.equal(sent.length, emails);
  assert.equal(await statusOf(order.publicId), 'paid');
});

test('decline -> failed, then a retry succeeds -> paid', async () => {
  const order = await newOrder(colissimoOrder);
  const declined = await handlePaymentEvent(deps, buildMockPaymentEvent(order.paymentIntentId, 'declined'));
  assert.equal(declined.outcome, 'updated');
  assert.equal(await statusOf(order.publicId), 'failed');

  // The payment page reuses the same intent for the retry.
  const retry = await createPaymentIntentForOrder(pool, mock, order.publicId);
  assert.equal((retry as { paymentIntentId: string }).paymentIntentId, order.paymentIntentId);

  await handlePaymentEvent(deps, buildMockPaymentEvent(order.paymentIntentId, 'succeeded'));
  assert.equal(await statusOf(order.publicId), 'paid');
});

test('a late failure never downgrades a paid order', async () => {
  const order = await newOrder(mondialRelayOrder);
  await handlePaymentEvent(deps, buildMockPaymentEvent(order.paymentIntentId, 'succeeded'));
  const late = await handlePaymentEvent(deps, buildMockPaymentEvent(order.paymentIntentId, 'insufficient_funds'));
  assert.equal(late.outcome, 'no_transition');
  assert.equal(await statusOf(order.publicId), 'paid');
  const again = await createPaymentIntentForOrder(pool, mock, order.publicId);
  assert.deepEqual(again, { alreadyPaid: true });
});

test('an event for an unknown payment intent is logged, not a crash', async () => {
  const result = await handlePaymentEvent(deps, buildMockPaymentEvent('mock_pi_does_not_exist', 'succeeded'));
  assert.equal(result.outcome, 'unknown_order');
});

test('a failed email is retried by the redelivery of the same event', async () => {
  const order = await newOrder(mondialRelayOrder);
  const event = buildMockPaymentEvent(order.paymentIntentId, 'succeeded');
  failNextEmail = true;
  const first = await handlePaymentEvent(deps, event);
  assert.ok(first.emailError);
  assert.equal(await statusOf(order.publicId), 'paid', 'payment is recorded even if the email fails');

  const emails = sent.length;
  const redelivery = await handlePaymentEvent(deps, event);
  assert.equal(redelivery.outcome, 'duplicate');
  assert.equal(redelivery.emailSent, true);
  assert.equal(sent.length, emails + 1);
});

test('concurrent payment-intent requests end up on a single intent', async () => {
  const { id, publicId } = await createOrder(pool, mondialRelayOrder);
  createdIds.push(id);
  const [a, b] = await Promise.all([
    createPaymentIntentForOrder(pool, mock, publicId),
    createPaymentIntentForOrder(pool, mock, publicId),
  ]);
  const stored = (await findOrderByPublicId(pool, publicId))!.stripe_payment_intent_id;
  assert.equal((a as { paymentIntentId: string }).paymentIntentId, stored);
  assert.equal((b as { paymentIntentId: string }).paymentIntentId, stored);
});

// --- Internal notifications: every paid AND failed payment tells the team ---

const teamDeps = { ...deps, teamNotification: { to: 'equipe@exemple.fr', appEnv: 'staging' } };

test('team notification: paid sends the customer confirmation and the team notification', async () => {
  const order = await newOrder(colissimoOrder);
  const before = sent.length;
  await handlePaymentEvent(teamDeps, buildMockPaymentEvent(order.paymentIntentId, 'succeeded'));
  const messages = sent.slice(before);
  assert.equal(messages.length, 2);
  assert.equal(messages[0].to, ADDRESS.email);
  const notification = messages[1];
  assert.equal(notification.to, 'equipe@exemple.fr');
  assert.equal(notification.replyTo, ADDRESS.email);
  assert.ok(notification.subject.startsWith('[staging] Commande PIC-'));
  assert.ok(notification.subject.includes('PAYÉE'));
  assert.ok(notification.text.includes('Lyon'));
});

test('team notification: failed payments notify too, once per failure event, never on a replay', async () => {
  const order = await newOrder(colissimoOrder);
  const before = sent.length;
  const declined = buildMockPaymentEvent(order.paymentIntentId, 'declined');
  await handlePaymentEvent(teamDeps, declined);
  assert.equal(sent.length, before + 1);
  assert.equal(sent.at(-1)!.to, 'equipe@exemple.fr');
  assert.ok(sent.at(-1)!.subject.includes('ÉCHOUÉ'));
  assert.ok(sent.at(-1)!.subject.includes('card_declined'));

  await handlePaymentEvent(teamDeps, declined); // Stripe redelivery
  assert.equal(sent.length, before + 1);

  await handlePaymentEvent(teamDeps, buildMockPaymentEvent(order.paymentIntentId, 'insufficient_funds')); // 2nd decline
  assert.equal(sent.length, before + 2);
  assert.ok(sent.at(-1)!.subject.includes('insufficient_funds'));
});

test('team notification: a failed notification email never fails the webhook', async () => {
  const order = await newOrder(colissimoOrder);
  failNextEmail = true;
  const result = await handlePaymentEvent(teamDeps, buildMockPaymentEvent(order.paymentIntentId, 'declined'));
  assert.equal(result.emailError, null);
  assert.equal(await statusOf(order.publicId), 'failed');
});

test('emailjs stopgap routing: no customer email, only the team notification', async () => {
  const order = await newOrder(mondialRelayOrder);
  const before = sent.length;
  await handlePaymentEvent({ ...teamDeps, customerConfirmation: false }, buildMockPaymentEvent(order.paymentIntentId, 'succeeded'));
  const messages = sent.slice(before);
  assert.equal(messages.length, 1);
  assert.equal(messages[0].to, 'equipe@exemple.fr');
  assert.ok(messages[0].text.includes('Tabac Test'));
});

test('a disabled shipping method is refused by the API', async () => {
  const config = loadConfig({ DATABASE_URL: databaseUrl!, APP_ENV: 'local', PAYMENT_PROVIDER: 'mock', SHIPPING_METHODS: 'colissimo' });
  const ctx = () => ({ config, pool, payments: mock, sendEmail });
  const refused = await route({ method: 'POST', path: '/api/orders', headers: {}, body: JSON.stringify(mondialRelayOrder) }, ctx);
  assert.equal(refused.status, 400);
  assert.equal((refused.body as { error: { code: string } }).error.code, 'shipping_method_unavailable');
  const accepted = await route({ method: 'POST', path: '/api/orders', headers: {}, body: JSON.stringify(colissimoOrder) }, ctx);
  assert.equal(accepted.status, 201);
  createdIds.push((await findOrderByPublicId(pool, (accepted.body as { publicId: string }).publicId))!.id);
});

// --- Through the HTTP router, as the browser / Stripe would call it --------

const WEBHOOK_SECRET = 'whsec_integration';

function context(provider: PaymentProvider, env: Record<string, string>): () => ServerContext {
  const config = loadConfig({ DATABASE_URL: databaseUrl!, APP_ENV: 'local', ...env });
  return () => ({ config, pool, payments: provider, sendEmail });
}

test('offline HTTP flow: POST /api/orders -> payment-intent -> mock-payment -> GET', async () => {
  const ctx = context(mock, { PAYMENT_PROVIDER: 'mock' });
  const created = await route({ method: 'POST', path: '/api/orders', headers: {}, body: JSON.stringify(mondialRelayOrder) }, ctx);
  assert.equal(created.status, 201);
  const { publicId } = created.body as { publicId: string };
  createdIds.push((await findOrderByPublicId(pool, publicId))!.id);

  const intent = await route({ method: 'POST', path: `/api/orders/${publicId}/payment-intent`, headers: {}, body: '' }, ctx);
  const { paymentIntentId, provider, amountCents } = intent.body as { paymentIntentId: string; provider: string; amountCents: number };
  assert.equal(provider, 'mock');
  assert.equal(amountCents, 7900); // 69 + 10 shipping

  const declined = await route(
    { method: 'POST', path: '/api/mock-payment', headers: {}, body: JSON.stringify({ paymentIntentId, outcome: 'declined' }) },
    ctx
  );
  assert.equal((declined.body as { status: string }).status, 'failed');
  assert.equal((declined.body as { declineCode: string }).declineCode, 'card_declined');

  const paid = await route(
    { method: 'POST', path: '/api/mock-payment', headers: {}, body: JSON.stringify({ paymentIntentId, outcome: 'succeeded' }) },
    ctx
  );
  const { eventId } = paid.body as { eventId: string };
  const replay = await route(
    {
      method: 'POST',
      path: '/api/mock-payment',
      headers: {},
      body: JSON.stringify({ paymentIntentId, outcome: 'succeeded', replayEventId: eventId }),
    },
    ctx
  );
  assert.equal((replay.body as { outcome: string }).outcome, 'duplicate');

  const summary = await route({ method: 'GET', path: `/api/orders/${publicId}`, headers: {}, body: '' }, ctx);
  assert.equal((summary.body as { status: string }).status, 'paid');
  assert.equal((summary.body as { relay: { name: string } }).relay.name, RELAY.Nom);
  assert.equal(JSON.stringify(summary.body).includes(ADDRESS.email), false, 'no personal email in the public summary');
});

test('Stripe webhook over HTTP: signed event marks the order paid, replay is ignored', async () => {
  // Intent ids are faked in the DB: this test never calls the Stripe API,
  // only the (offline) signature verification.
  const stripeProvider = createStripeProvider('sk_test_integration', WEBHOOK_SECRET);
  const ctx = context(stripeProvider, {
    PAYMENT_PROVIDER: 'stripe',
    STRIPE_SECRET_KEY: 'sk_test_integration',
    STRIPE_WEBHOOK_SECRET: WEBHOOK_SECRET,
  });
  const { id, publicId } = await createOrder(pool, colissimoOrder);
  createdIds.push(id);
  const paymentIntentId = `pi_test_${id}`;
  await pool.query('UPDATE commandes SET stripe_payment_intent_id = $1 WHERE id = $2', [paymentIntentId, id]);

  const payload = JSON.stringify({
    id: `evt_test_${id}`,
    object: 'event',
    type: 'payment_intent.succeeded',
    data: { object: { id: paymentIntentId, object: 'payment_intent' } },
  });
  const signature = Stripe.webhooks.generateTestHeaderString({ payload, secret: WEBHOOK_SECRET });
  const request = { method: 'POST', path: '/api/stripe-webhook', headers: { 'stripe-signature': signature }, body: payload };

  const first = await route(request, ctx);
  assert.equal(first.status, 200);
  assert.equal((first.body as { outcome: string }).outcome, 'updated');
  assert.equal(await statusOf(publicId), 'paid');

  const replay = await route(request, ctx);
  assert.equal((replay.body as { outcome: string }).outcome, 'duplicate');

  const tampered = await route({ ...request, body: payload.replace('succeeded', 'payment_failed') }, ctx);
  assert.equal(tampered.status, 400);
});

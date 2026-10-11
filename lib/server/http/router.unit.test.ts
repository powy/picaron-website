import { test } from 'node:test';
import assert from 'node:assert/strict';
import Stripe from 'stripe';
import { loadConfig } from '../config';
import type { ServerContext } from '../context';
import { createMockProvider } from '../payments/mock-provider';
import { createStripeProvider } from '../payments/stripe-provider';
import { pathSegments, route } from './router';

const WEBHOOK_SECRET = 'whsec_unit_test';

// No route below reaches the database: a pool that throws proves it.
const noDb = new Proxy({}, { get: () => () => { throw new Error('DB must not be used'); } }) as ServerContext['pool'];

function ctx(env: Record<string, string>): () => ServerContext {
  const config = loadConfig({ DATABASE_URL: 'postgres://x:y@localhost:5433/db', ...env });
  const payments =
    config.paymentProvider === 'stripe'
      ? createStripeProvider(config.stripeSecretKey!, config.stripeWebhookSecret!)
      : createMockProvider();
  return () => ({ config, pool: noDb, payments, sendEmail: async () => {} });
}

const offline = ctx({ APP_ENV: 'local', PAYMENT_PROVIDER: 'mock', ALLOWED_ORIGINS: 'https://picaron.fr' });
const production = ctx({
  APP_ENV: 'production',
  PAYMENT_PROVIDER: 'stripe',
  STRIPE_SECRET_KEY: 'sk_live_unit',
  STRIPE_WEBHOOK_SECRET: WEBHOOK_SECRET,
  TEAM_NOTIFY_EMAIL: 'equipe@exemple.fr',
});

const post = (path: string, body: unknown, headers: Record<string, string> = {}) => ({
  method: 'POST',
  path,
  headers,
  body: typeof body === 'string' ? body : JSON.stringify(body),
});

test('paths work with or without the /api prefix', () => {
  assert.deepEqual(pathSegments('/api/orders/abc?x=1'), ['orders', 'abc']);
  assert.deepEqual(pathSegments('/orders/abc/'), ['orders', 'abc']);
});

test('health reports the environment', async () => {
  const response = await route({ method: 'GET', path: '/api/health', headers: {}, body: '' }, offline);
  assert.deepEqual(response.body, { appEnv: 'local', paymentProvider: 'mock' });
});

test('unknown routes return 404', async () => {
  assert.equal((await route(post('/api/nope', {}), offline)).status, 404);
});

test('malformed JSON and invalid orders are rejected with 400 before any DB access', async () => {
  assert.equal((await route(post('/api/orders', '{oops'), offline)).status, 400);
  const invalid = await route(post('/api/orders', { items: [] }), offline);
  assert.equal(invalid.status, 400);
  assert.equal((invalid.body as { error: { code: string } }).error.code, 'invalid_order');
});

test('an unknown order id is a 404 without a DB lookup', async () => {
  const response = await route({ method: 'GET', path: '/api/orders/not-a-uuid', headers: {}, body: '' }, offline);
  assert.equal(response.status, 404);
});

test('mock payment endpoint does not exist in production', async () => {
  const response = await route(post('/api/mock-payment', { paymentIntentId: 'mock_pi_x', outcome: 'succeeded' }), production);
  assert.equal(response.status, 404);
});

test('mock payment validates its input', async () => {
  assert.equal((await route(post('/api/mock-payment', { paymentIntentId: 'pi_real', outcome: 'succeeded' }), offline)).status, 400);
  assert.equal((await route(post('/api/mock-payment', { paymentIntentId: 'mock_pi_x', outcome: 'maybe' }), offline)).status, 400);
});

test('stripe webhook does not exist in mock mode', async () => {
  assert.equal((await route(post('/api/stripe-webhook', {}), offline)).status, 404);
});

test('stripe webhook rejects missing and forged signatures', async () => {
  const payload = JSON.stringify({ id: 'evt_1', type: 'payment_intent.succeeded', data: { object: { id: 'pi_1' } } });
  const missing = await route(post('/api/stripe-webhook', payload), production);
  assert.equal(missing.status, 400);

  const forgedHeader = Stripe.webhooks.generateTestHeaderString({ payload, secret: 'whsec_attacker' });
  const forged = await route(post('/api/stripe-webhook', payload, { 'Stripe-Signature': forgedHeader }), production);
  assert.equal(forged.status, 400);
  assert.equal((forged.body as { error: { code: string } }).error.code, 'invalid_signature');
});

test('a correctly signed Stripe event is normalized', () => {
  const provider = createStripeProvider('sk_test_unit', WEBHOOK_SECRET);
  const payload = JSON.stringify({
    id: 'evt_42',
    object: 'event',
    type: 'payment_intent.payment_failed',
    data: { object: { id: 'pi_42', object: 'payment_intent', last_payment_error: { code: 'card_declined', decline_code: 'insufficient_funds' } } },
  });
  const header = Stripe.webhooks.generateTestHeaderString({ payload, secret: WEBHOOK_SECRET });
  assert.deepEqual(provider.parseWebhook(payload, header), {
    id: 'evt_42',
    type: 'payment_intent.payment_failed',
    rawType: 'payment_intent.payment_failed',
    paymentIntentId: 'pi_42',
    failureCode: 'insufficient_funds',
  });
});

test('CORS headers only for allowed origins', async () => {
  const allowed = await route({ method: 'OPTIONS', path: '/api/orders', headers: { Origin: 'https://picaron.fr' }, body: '' }, offline);
  assert.equal(allowed.status, 204);
  assert.equal(allowed.headers['Access-Control-Allow-Origin'], 'https://picaron.fr');
  const other = await route({ method: 'OPTIONS', path: '/api/orders', headers: { origin: 'https://evil.example' }, body: '' }, offline);
  assert.equal(other.headers['Access-Control-Allow-Origin'], undefined);
});

test('a misconfigured server answers 500 without leaking details', async () => {
  const response = await route(post('/api/orders', {}), () => {
    loadConfig({});
    throw new Error('unreachable');
  });
  assert.equal(response.status, 500);
  assert.equal((response.body as { error: { code: string } }).error.code, 'server_misconfigured');
});

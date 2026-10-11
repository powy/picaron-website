// Smoke test of a deployed order API (staging, or a local `npm run dev:stripe`)
// with Stripe TEST cards, without a browser:
//   create a Colissimo order -> payment intent -> confirm it with a Stripe test
//   payment method -> wait for the webhook to update the order.
// It validates the whole chain: function, database, Stripe webhook delivery
// and email (check the team mailbox afterwards: one "PAYÉE" or "ÉCHOUÉ" email).
//
//   STRIPE_SECRET_KEY=sk_test_... node scripts/smoke-test.mjs <api base url> [paid|declined|insufficient_funds]
//   e.g. node scripts/smoke-test.mjs https://xxxx.functions.fnc.fr-par.scw.cloud paid
//        node scripts/smoke-test.mjs http://localhost:3000/api declined
//
// Safety: refuses a live Stripe key and a production API. It creates real
// rows in the target database (a "TEST Smoke" order): fine for staging, and it
// is meant to be deleted afterwards.
//
// This uses a Stripe TEST payment method (pm_card_visa...) server-side. It does
// not exercise the Stripe card form or 3-D Secure in the browser: those stay
// manual (LOCAL-TEST-GUIDE.md section 4.3).

import Stripe from 'stripe';

const OUTCOMES = {
  paid: { paymentMethod: 'pm_card_visa', expected: 'paid' },
  declined: { paymentMethod: 'pm_card_chargeDeclined', expected: 'failed' },
  insufficient_funds: { paymentMethod: 'pm_card_chargeDeclinedInsufficientFunds', expected: 'failed' },
};

const [apiArg, outcomeArg = 'paid'] = process.argv.slice(2);
const outcome = OUTCOMES[outcomeArg];
if (!apiArg || !outcome) {
  console.error('Usage: STRIPE_SECRET_KEY=sk_test_... node scripts/smoke-test.mjs <api base url> [paid|declined|insufficient_funds]');
  process.exit(2);
}
const secretKey = process.env.STRIPE_SECRET_KEY ?? '';
if (!secretKey.startsWith('sk_test_')) {
  console.error('STRIPE_SECRET_KEY must be a TEST key (sk_test_...). Refusing to continue.');
  process.exit(2);
}
const api = apiArg.replace(/\/$/, '');

async function call(method, path, body) {
  const response = await fetch(`${api}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = text;
  }
  if (!response.ok) throw new Error(`${method} ${path} -> HTTP ${response.status}: ${text.slice(0, 300)}`);
  return json;
}

const step = (message) => console.log(`\n> ${message}`);

step(`Health of ${api}`);
const health = await call('GET', '/health');
console.log(health);
if (health.appEnv === 'production') {
  console.error('This API runs in production. Refusing: the smoke test must never create orders there.');
  process.exit(2);
}
if (health.paymentProvider !== 'stripe') {
  console.error('This API uses the mock payment provider, not Stripe. Nothing to test here (use the offline e2e tests).');
  process.exit(2);
}

step('Create a Colissimo order (mainland France, 1 x Boucaniers)');
const address = {
  lastName: 'TEST-SMOKE',
  firstName: 'Ne pas expedier',
  address: '10 rue de la Paix',
  addressComplement: '',
  postalCode: '75002',
  city: 'Paris',
  country: 'France',
  email: process.env.SMOKE_EMAIL ?? 'smoke-test@example.com',
  phone: '0600000000',
};
const { publicId } = await call('POST', '/orders', {
  locale: 'fr',
  items: [{ productId: 'boucaniers', quantity: 1 }],
  shippingMethod: 'colissimo',
  billingAddress: address,
  deliveryAddress: address,
});
console.log({ publicId });

step('Create the payment intent');
const intent = await call('POST', `/orders/${publicId}/payment-intent`);
console.log({ paymentIntentId: intent.paymentIntentId, amountCents: intent.amountCents, provider: intent.provider });

step(`Confirm it with Stripe test payment method ${outcome.paymentMethod} (${outcomeArg})`);
const stripe = new Stripe(secretKey);
try {
  const confirmed = await stripe.paymentIntents.confirm(intent.paymentIntentId, {
    payment_method: outcome.paymentMethod,
    return_url: 'https://example.com/return',
  });
  console.log({ stripeStatus: confirmed.status });
} catch (error) {
  // A decline is thrown as a card error: expected for the declined outcomes.
  console.log({ stripeError: error.code ?? error.message, declineCode: error.decline_code });
  if (outcome.expected === 'paid') throw error;
}

step('Wait for the Stripe webhook to update the order');
let status = 'pending';
for (let attempt = 0; attempt < 30 && status === 'pending'; attempt++) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  status = (await call('GET', `/orders/${publicId}`)).status;
}
console.log({ status, expected: outcome.expected });

if (status !== outcome.expected) {
  console.error(
    `\nFAIL: the order is "${status}" instead of "${outcome.expected}". The webhook probably did not reach the API: ` +
      'check the Stripe dashboard > Webhooks > the endpoint > recent deliveries (signature secret, URL, events).'
  );
  process.exit(1);
}
console.log(
  `\nOK. Now check the team mailbox: you should have exactly one "${outcome.expected === 'paid' ? 'PAYÉE' : 'ÉCHOUÉ'}" email` +
    ` for order ${publicId} (subject tagged [${health.appEnv}]).`
);

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ConfigError, emailRouting, isMockPaymentEnabled, loadConfig } from './config';

const base = {
  DATABASE_URL: 'postgres://picaron:picaron@localhost:5433/picaron_commandes',
  TEAM_NOTIFY_EMAIL: 'equipe@exemple.fr',
};

test('outside local, smtp needs TEAM_NOTIFY_EMAIL so every order notifies the team', () => {
  const env = { DATABASE_URL: base.DATABASE_URL, APP_ENV: 'staging', PAYMENT_PROVIDER: 'mock' };
  assert.throws(() => loadConfig(env), /TEAM_NOTIFY_EMAIL/);
  assert.equal(loadConfig({ ...env, TEAM_NOTIFY_EMAIL: 'equipe@exemple.fr' }).teamNotifyEmail, 'equipe@exemple.fr');
  // Local offline (Mailpit) doesn't need it.
  assert.doesNotThrow(() => loadConfig({ ...env, APP_ENV: 'local' }));
});

test('emailRouting: emailjs = team notification only, smtp = customer + team', () => {
  const emailjs = loadConfig({
    ...base,
    APP_ENV: 'staging',
    PAYMENT_PROVIDER: 'mock',
    TEAM_NOTIFY_EMAIL: '',
    EMAIL_TRANSPORT: 'emailjs',
    EMAILJS_SERVICE_ID: 's',
    EMAILJS_TEMPLATE_ID: 't',
    EMAILJS_PUBLIC_KEY: 'p',
  });
  assert.equal(emailRouting(emailjs).customerConfirmation, false);
  assert.ok(emailRouting(emailjs).teamTo);
  const smtp = loadConfig({ ...base, APP_ENV: 'staging', PAYMENT_PROVIDER: 'mock' });
  assert.equal(emailRouting(smtp).customerConfirmation, true);
  assert.equal(emailRouting(smtp).teamTo, 'equipe@exemple.fr');
});

test('SHIPPING_METHODS restricts the accepted shipping methods (Colissimo-only launch)', () => {
  const env = { ...base, APP_ENV: 'local', PAYMENT_PROVIDER: 'mock' };
  assert.deepEqual(loadConfig(env).shippingMethods, ['mondial_relay', 'colissimo']);
  assert.deepEqual(loadConfig({ ...env, SHIPPING_METHODS: 'colissimo' }).shippingMethods, ['colissimo']);
  assert.throws(() => loadConfig({ ...env, SHIPPING_METHODS: 'pigeon' }), /SHIPPING_METHODS/);
});

// FIXME(email): temporary EmailJS transport (order emails to the team only).
test('emailjs transport needs its ids, is tolerated in production, console is not', () => {
  const prod = {
    ...base,
    APP_ENV: 'production',
    PAYMENT_PROVIDER: 'stripe',
    STRIPE_SECRET_KEY: 'sk_live_x',
    STRIPE_WEBHOOK_SECRET: 'whsec_x',
  };
  assert.throws(() => loadConfig({ ...prod, EMAIL_TRANSPORT: 'emailjs' }), /EMAILJS_SERVICE_ID/);
  const config = loadConfig({
    ...prod,
    EMAIL_TRANSPORT: 'emailjs',
    EMAILJS_SERVICE_ID: 's',
    EMAILJS_TEMPLATE_ID: 't',
    EMAILJS_PUBLIC_KEY: 'p',
  });
  assert.equal(config.emailTransport, 'emailjs');
  assert.throws(() => loadConfig({ ...prod, EMAIL_TRANSPORT: 'console' }), /console est interdit/);
});

test('local offline profile loads', () => {
  const config = loadConfig({ ...base, APP_ENV: 'local', PAYMENT_PROVIDER: 'mock' });
  assert.equal(config.paymentProvider, 'mock');
  assert.equal(isMockPaymentEnabled(config), true);
});

test('APP_ENV is mandatory (no silent default to local)', () => {
  assert.throws(() => loadConfig({ ...base, PAYMENT_PROVIDER: 'mock' }), ConfigError);
});

test('mock payments are refused in production', () => {
  assert.throws(() => loadConfig({ ...base, APP_ENV: 'production', PAYMENT_PROVIDER: 'mock' }), /mock est interdit/);
});

test('production requires live keys', () => {
  const env = {
    ...base,
    APP_ENV: 'production',
    PAYMENT_PROVIDER: 'stripe',
    STRIPE_WEBHOOK_SECRET: 'whsec_x',
  };
  assert.throws(() => loadConfig({ ...env, STRIPE_SECRET_KEY: 'sk_test_x' }), /sk_live_/);
  assert.throws(
    () => loadConfig({ ...env, STRIPE_SECRET_KEY: 'sk_live_x', NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_test_x' }),
    /pk_live_/
  );
  const config = loadConfig({ ...env, STRIPE_SECRET_KEY: 'sk_live_x' });
  assert.equal(isMockPaymentEnabled(config), false);
});

test('live keys are refused outside production', () => {
  for (const appEnv of ['local', 'staging']) {
    assert.throws(
      () =>
        loadConfig({
          ...base,
          APP_ENV: appEnv,
          PAYMENT_PROVIDER: 'stripe',
          STRIPE_SECRET_KEY: 'sk_live_x',
          STRIPE_WEBHOOK_SECRET: 'whsec_x',
        }),
      /live refusée/
    );
    assert.throws(
      () => loadConfig({ ...base, APP_ENV: appEnv, PAYMENT_PROVIDER: 'mock', NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_live_x' }),
      /live refusée/
    );
  }
});

test('stripe provider needs its secrets', () => {
  assert.throws(() => loadConfig({ ...base, APP_ENV: 'staging', PAYMENT_PROVIDER: 'stripe' }), /STRIPE_SECRET_KEY/);
});

test('console email transport is refused in production', () => {
  assert.throws(
    () =>
      loadConfig({
        ...base,
        APP_ENV: 'production',
        PAYMENT_PROVIDER: 'stripe',
        STRIPE_SECRET_KEY: 'sk_live_x',
        STRIPE_WEBHOOK_SECRET: 'whsec_x',
        EMAIL_TRANSPORT: 'console',
      }),
    /console est interdit/
  );
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../config';
import { createMailer, EMAILJS_FIXME_TAG, toEmailJsParams } from './mailer';

// FIXME(email): tests of the temporary EmailJS transport. Delete with it.

const message = { to: 'jean@exemple.fr', subject: 'Confirmation de votre commande PIC-000001 — Picaron', text: 'Merci !', html: '<p>Merci</p>' };
const env = {
  APP_ENV: 'staging',
  PAYMENT_PROVIDER: 'stripe',
  STRIPE_SECRET_KEY: 'sk_test_x',
  STRIPE_WEBHOOK_SECRET: 'whsec_x',
  DATABASE_URL: 'postgres://x',
  EMAIL_TRANSPORT: 'emailjs',
  EMAILJS_SERVICE_ID: 'service_1',
  EMAILJS_TEMPLATE_ID: 'template_1',
  EMAILJS_PUBLIC_KEY: 'pub_1',
  EMAILJS_PRIVATE_KEY: 'priv_1',
};

test('the EmailJS email is tagged FIXME in subject and body and keeps the customer address for replies', () => {
  const params = toEmailJsParams(message);
  assert.ok(params.subject.startsWith(`[${EMAILJS_FIXME_TAG}]`));
  assert.ok(params.subject.includes('PIC-000001'));
  assert.equal(params.email, 'jean@exemple.fr');
  assert.ok(params.message.startsWith('FIXME'));
  assert.ok(params.message.includes('Merci !'));
});

test('the EmailJS transport calls the REST API with the contact-template fields', async (t) => {
  const calls: { url: string; body: any }[] = [];
  t.mock.method(globalThis, 'fetch', async (url: string, init: { body: string }) => {
    calls.push({ url, body: JSON.parse(init.body) });
    return new Response('OK', { status: 200 });
  });
  t.mock.method(console, 'warn', () => {});

  await createMailer(loadConfig(env))(message);

  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://api.emailjs.com/api/v1.0/email/send');
  assert.equal(calls[0].body.service_id, 'service_1');
  assert.equal(calls[0].body.template_id, 'template_1');
  assert.equal(calls[0].body.user_id, 'pub_1');
  assert.equal(calls[0].body.accessToken, 'priv_1');
  assert.deepEqual(Object.keys(calls[0].body.template_params).sort(), ['email', 'message', 'name', 'subject']);
});

test('an EmailJS error makes sending fail, so the webhook retries', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('non-browser disabled', { status: 403 }));
  t.mock.method(console, 'warn', () => {});
  await assert.rejects(createMailer(loadConfig(env))(message), /EmailJS 403/);
});

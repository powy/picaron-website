// Wires the backend dependencies from the environment once per process
// (Next.js server or Scaleway function instance).

import type pg from 'pg';
import { loadConfig, type ServerConfig } from './config';
import { getPool } from './db';
import { createMailer, type SendEmail } from './email/mailer';
import { createMockProvider } from './payments/mock-provider';
import type { PaymentProvider } from './payments/provider';
import { createStripeProvider } from './payments/stripe-provider';

export interface ServerContext {
  config: ServerConfig;
  pool: pg.Pool;
  payments: PaymentProvider;
  sendEmail: SendEmail;
}

let cached: ServerContext | null = null;

export function getServerContext(): ServerContext {
  if (cached) return cached;
  const config = loadConfig();
  cached = {
    config,
    pool: getPool(config.databaseUrl, config.databasePoolMax),
    payments:
      config.paymentProvider === 'stripe'
        ? createStripeProvider(config.stripeSecretKey!, config.stripeWebhookSecret!)
        : createMockProvider(),
    sendEmail: createMailer(config),
  };
  return cached;
}

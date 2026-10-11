// Server configuration, read from environment variables. The same code runs
// in four environments (see shop update plan/12-environnements-et-mode-test.md):
//
//   local offline : APP_ENV=local      PAYMENT_PROVIDER=mock
//   local Stripe  : APP_ENV=local      PAYMENT_PROVIDER=stripe (sk_test_ key)
//   staging       : APP_ENV=staging    PAYMENT_PROVIDER=stripe (sk_test_ key)
//   production    : APP_ENV=production PAYMENT_PROVIDER=stripe (sk_live_ key)
//
// assertSafeConfig() refuses the combinations that could lose money: a fake
// payment provider in production, a live key outside production, a test key
// in production.

import { SHIPPING_METHODS, type PaymentProviderName, type ShippingMethod } from '../checkout/order';

export const APP_ENVS = ['local', 'staging', 'production'] as const;
export type AppEnv = (typeof APP_ENVS)[number];

// FIXME(email): 'emailjs' is a TEMPORARY stopgap. Until an SMTP provider is
// chosen, order emails go to the team through the EmailJS contact-form
// template (see mailer.ts), not to the customer. Replace with 'smtp' (see
// shop update plan/13-plan-mise-en-production.md, "Email") before public launch.
export type EmailTransport = 'smtp' | 'console' | 'emailjs';

export interface ServerConfig {
  appEnv: AppEnv;
  paymentProvider: PaymentProviderName;
  databaseUrl: string;
  databasePoolMax: number;
  stripeSecretKey: string | null;
  stripeWebhookSecret: string | null;
  emailTransport: EmailTransport;
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    user: string | null;
    pass: string | null;
  };
  /** FIXME(email): only used by the temporary 'emailjs' transport. */
  emailjs: {
    serviceId: string | null;
    templateId: string | null;
    publicKey: string | null;
    /** Account private key ("accessToken"), needed for server-side calls. */
    privateKey: string | null;
  };
  emailFrom: string;
  /**
   * Where the internal "order paid / payment failed" notifications go (a real
   * address, needed with smtp). Not needed with the temporary emailjs
   * transport, whose EmailJS template decides the recipient.
   */
  teamNotifyEmail: string | null;
  /** Shipping methods the API accepts (SHIPPING_METHODS, default: all). */
  shippingMethods: ShippingMethod[];
  /** Public site URL, used for links in emails (e.g. https://picaron.fr). */
  siteUrl: string;
  /** Origins allowed to call the API cross-origin (Scaleway functions). */
  allowedOrigins: string[];
}

export class ConfigError extends Error {
  constructor(message: string) {
    super(`Configuration invalide : ${message}`);
    this.name = 'ConfigError';
  }
}

type Env = Record<string, string | undefined>;

function required(env: Env, key: string): string {
  const value = env[key]?.trim();
  if (!value) throw new ConfigError(`la variable ${key} est obligatoire`);
  return value;
}

function optional(env: Env, key: string): string | null {
  return env[key]?.trim() || null;
}

function oneOf<T extends string>(env: Env, key: string, allowed: readonly T[], fallback?: T): T {
  const value = env[key]?.trim() || fallback;
  if (!value) throw new ConfigError(`la variable ${key} est obligatoire (${allowed.join(' | ')})`);
  if (!allowed.includes(value as T)) {
    throw new ConfigError(`${key}="${value}" n'est pas une valeur autorisée (${allowed.join(' | ')})`);
  }
  return value as T;
}

function parseShippingMethods(value: string | undefined): ShippingMethod[] {
  if (!value?.trim()) return [...SHIPPING_METHODS];
  const methods = value.split(',').map((method) => method.trim()).filter(Boolean);
  for (const method of methods) {
    if (!(SHIPPING_METHODS as readonly string[]).includes(method)) {
      throw new ConfigError(`SHIPPING_METHODS: "${method}" n'est pas un mode connu (${SHIPPING_METHODS.join(' | ')})`);
    }
  }
  if (methods.length === 0) throw new ConfigError('SHIPPING_METHODS ne peut pas être vide');
  return methods as ShippingMethod[];
}

export function loadConfig(env: Env = process.env): ServerConfig {
  // No default for APP_ENV on purpose: a deployment that forgot it must fail
  // loudly rather than silently run as "local" with mock payments.
  const appEnv = oneOf(env, 'APP_ENV', APP_ENVS);
  const paymentProvider = oneOf<PaymentProviderName>(env, 'PAYMENT_PROVIDER', ['mock', 'stripe']);
  const emailTransport = oneOf<EmailTransport>(env, 'EMAIL_TRANSPORT', ['smtp', 'console', 'emailjs'], 'smtp');

  const config: ServerConfig = {
    appEnv,
    paymentProvider,
    databaseUrl: required(env, 'DATABASE_URL'),
    databasePoolMax: Number(env.DATABASE_POOL_MAX ?? 5),
    stripeSecretKey: optional(env, 'STRIPE_SECRET_KEY'),
    stripeWebhookSecret: optional(env, 'STRIPE_WEBHOOK_SECRET'),
    emailTransport,
    smtp: {
      host: env.SMTP_HOST?.trim() || 'localhost',
      port: Number(env.SMTP_PORT ?? 1025),
      secure: env.SMTP_SECURE === 'true',
      user: optional(env, 'SMTP_USER'),
      pass: optional(env, 'SMTP_PASS'),
    },
    emailjs: {
      serviceId: optional(env, 'EMAILJS_SERVICE_ID'),
      templateId: optional(env, 'EMAILJS_TEMPLATE_ID'),
      publicKey: optional(env, 'EMAILJS_PUBLIC_KEY'),
      privateKey: optional(env, 'EMAILJS_PRIVATE_KEY'),
    },
    emailFrom: env.EMAIL_FROM?.trim() || 'Picaron <commandes@picaron.fr>',
    teamNotifyEmail: optional(env, 'TEAM_NOTIFY_EMAIL'),
    shippingMethods: parseShippingMethods(env.SHIPPING_METHODS),
    siteUrl: (env.SITE_URL?.trim() || 'http://localhost:3000').replace(/\/$/, ''),
    allowedOrigins: (env.ALLOWED_ORIGINS ?? '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  };

  if (paymentProvider === 'stripe') {
    if (!config.stripeSecretKey) throw new ConfigError('STRIPE_SECRET_KEY est obligatoire avec PAYMENT_PROVIDER=stripe');
    if (!config.stripeWebhookSecret) {
      throw new ConfigError('STRIPE_WEBHOOK_SECRET est obligatoire avec PAYMENT_PROVIDER=stripe');
    }
  }

  if (emailTransport === 'emailjs') {
    for (const [key, value] of [
      ['EMAILJS_SERVICE_ID', config.emailjs.serviceId],
      ['EMAILJS_TEMPLATE_ID', config.emailjs.templateId],
      ['EMAILJS_PUBLIC_KEY', config.emailjs.publicKey],
    ]) {
      if (!value) throw new ConfigError(`${key} est obligatoire avec EMAIL_TRANSPORT=emailjs`);
    }
  }

  assertSafeConfig(config, env);

  // Every paid or failed order must notify the team: with real SMTP outside
  // local, refuse to start rather than silently notify nobody.
  if (emailTransport === 'smtp' && appEnv !== 'local' && !config.teamNotifyEmail) {
    throw new ConfigError('TEAM_NOTIFY_EMAIL est obligatoire (notification de chaque commande payée ou échouée)');
  }
  return config;
}

export function assertSafeConfig(config: ServerConfig, env: Env = process.env): void {
  const publishableKey = env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() ?? '';
  const secretKey = config.stripeSecretKey ?? '';

  if (config.appEnv === 'production') {
    if (config.paymentProvider !== 'stripe') {
      throw new ConfigError('PAYMENT_PROVIDER=mock est interdit en production');
    }
    if (!secretKey.startsWith('sk_live_')) {
      throw new ConfigError('la production exige une clé Stripe live (sk_live_...)');
    }
    // The publishable key only exists where the front end is built (Vercel),
    // not in the Scaleway functions — check it when it is there.
    if (publishableKey && !publishableKey.startsWith('pk_live_')) {
      throw new ConfigError('la production exige une clé publique Stripe live (pk_live_...)');
    }
    // FIXME(email): 'emailjs' is tolerated in production only as a stopgap
    // (order emails reach the team, not the customer). Remove once SMTP is set.
    if (config.emailTransport === 'console') {
      throw new ConfigError('EMAIL_TRANSPORT=console est interdit en production');
    }
  } else {
    if (secretKey.startsWith('sk_live_') || secretKey.startsWith('rk_live_') || publishableKey.startsWith('pk_live_')) {
      throw new ConfigError(`clé Stripe live refusée hors production (APP_ENV=${config.appEnv})`);
    }
  }
}

/**
 * Which emails a paid or failed payment triggers.
 * - customerConfirmation: the customer's own confirmation. Off with the
 *   temporary emailjs transport (it cannot reach the customer).
 * - teamTo: recipient of the internal notification (paid AND failed), or null
 *   for none. Always on with emailjs (the EmailJS template picks the
 *   recipient, so the address is only a placeholder); with smtp it needs
 *   TEAM_NOTIFY_EMAIL.
 */
export function emailRouting(config: ServerConfig): { customerConfirmation: boolean; teamTo: string | null } {
  return {
    customerConfirmation: config.emailTransport !== 'emailjs',
    teamTo: config.teamNotifyEmail ?? (config.emailTransport === 'emailjs' ? 'equipe (destinataire du modèle EmailJS)' : null),
  };
}

/** Mock-only endpoints (fake payment) exist only outside production. */
export function isMockPaymentEnabled(config: ServerConfig): boolean {
  return config.paymentProvider === 'mock' && config.appEnv !== 'production';
}

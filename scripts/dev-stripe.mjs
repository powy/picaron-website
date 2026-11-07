// `npm run dev:stripe` — local site in Stripe TEST mode, without editing
// .env.local (which stays on the offline profile used by `npm run dev`).
//
// Starts three processes and stops them all on Ctrl+C:
// 1. `stripe listen`, forwarding Stripe test webhooks to /api/stripe-webhook
// 2. the order API with PAYMENT_PROVIDER=stripe
// 3. `next dev` with the real Mondial Relay widget
//
// Real environment variables take precedence over .env.local, so the overrides
// below win; everything else (Stripe keys, webhook secret, DATABASE_URL,
// SMTP...) still comes from .env.local.

import { readFileSync } from 'node:fs'
import { API_COMMAND, API_PORT, runTogether } from './run-together.mjs'

const PORT = process.env.PORT ?? '3000'

function readEnvLocal() {
  const values = {}
  for (const line of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (match) values[match[1]] = match[2].trim()
  }
  return values
}

const env = readEnvLocal()
const problems = []
if (!env.STRIPE_SECRET_KEY?.startsWith('sk_test_')) problems.push('STRIPE_SECRET_KEY must be a test key (sk_test_...)')
if (!env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_test_')) problems.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must be a test key (pk_test_...)')
if (!env.STRIPE_WEBHOOK_SECRET?.startsWith('whsec_') || env.STRIPE_WEBHOOK_SECRET === 'whsec_xxxxx') {
  problems.push('STRIPE_WEBHOOK_SECRET is missing — get it with: stripe listen --api-key <sk_test_...> --print-secret')
}
if (problems.length) {
  console.error('Cannot start Stripe test mode — fix .env.local:\n- ' + problems.join('\n- '))
  process.exit(1)
}

console.log(`[dev:stripe] Stripe TEST mode on http://localhost:${PORT} — .env.local is not modified`)

runTogether('dev:stripe', [
  {
    label: 'stripe listen',
    command: [
      'stripe listen',
      `--api-key ${env.STRIPE_SECRET_KEY}`,
      '--events payment_intent.succeeded,payment_intent.payment_failed',
      `--forward-to localhost:${API_PORT}/api/stripe-webhook`,
    ].join(' '),
  },
  { label: 'order API', command: API_COMMAND, env: { API_PORT, PAYMENT_PROVIDER: 'stripe' } },
  {
    label: 'next dev',
    command: `npx next dev -p ${PORT}`,
    env: { API_PORT, NEXT_PUBLIC_RELAY_PICKER: 'mondialrelay' },
  },
])

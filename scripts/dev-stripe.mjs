// `npm run dev:stripe` — local site in Stripe TEST mode, without editing
// .env.local (which stays on the offline profile used by `npm run dev`).
//
// Starts two processes and stops both on Ctrl+C:
// 1. `stripe listen`, forwarding Stripe test webhooks to /api/stripe-webhook
// 2. `next dev` with PAYMENT_PROVIDER=stripe and the real Mondial Relay widget
//
// Real environment variables take precedence over .env.local in Next.js, so
// the two overrides below win; everything else (Stripe keys, webhook secret,
// DATABASE_URL, SMTP...) still comes from .env.local.

import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'

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

const children = []
const run = (label, command, args, extraEnv = {}) => {
  // One command string (the arguments contain no spaces): shell mode is needed
  // on Windows to resolve npx/stripe, and Node deprecates shell + args array.
  const child = spawn([command, ...args].join(' '), { stdio: 'inherit', shell: true, env: { ...process.env, ...extraEnv } })
  child.on('exit', (code) => {
    console.log(`[dev:stripe] ${label} exited (${code}) — stopping everything`)
    shutdown(code ?? 0)
  })
  children.push(child)
}

let stopping = false
function shutdown(code) {
  if (stopping) return
  stopping = true
  for (const child of children) child.kill()
  process.exit(code)
}
process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))

console.log(`[dev:stripe] Stripe TEST mode on http://localhost:${PORT} — .env.local is not modified`)

run('stripe listen', 'stripe', [
  'listen',
  '--api-key', env.STRIPE_SECRET_KEY,
  '--events', 'payment_intent.succeeded,payment_intent.payment_failed',
  '--forward-to', `localhost:${PORT}/api/stripe-webhook`,
])

run('next dev', 'npx', ['next', 'dev', '-p', PORT], {
  PAYMENT_PROVIDER: 'stripe',
  NEXT_PUBLIC_RELAY_PICKER: 'mondialrelay',
})

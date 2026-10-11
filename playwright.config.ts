// End-to-end tests of the purchase flow in OFFLINE test mode: mock relay
// picker, mock payment, real Next.js API + real Postgres. Deterministic, no
// Stripe/Mondial Relay/internet needed.
//
// Prerequisites: a database at DATABASE_URL with the schema applied
// (npm run db:local:up && npm run db:setup). Then: npm run test:e2e
// With E2E_MAILPIT=1 the confirmation emails go to Mailpit and are checked
// there; otherwise they are printed by the server (EMAIL_TRANSPORT=console).

import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
const useMailpit = Boolean(process.env.E2E_MAILPIT);

export default defineConfig({
  testDir: './e2e',
  timeout: 90_000,
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // A production build rather than `next dev`: Next.js allows only one dev
    // server per project folder, so this never clashes with the developer's
    // own `npm run dev` — and it tests the real production bundle.
    command: `npx next build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}/api/health`,
    timeout: 300_000,
    reuseExistingServer: false,
    // Real environment variables win over .env.local: this forces the
    // offline profile whatever the developer's .env.local says.
    env: {
      APP_ENV: 'local',
      NEXT_PUBLIC_APP_ENV: 'local',
      PAYMENT_PROVIDER: 'mock',
      NEXT_PUBLIC_RELAY_PICKER: 'mock',
      NEXT_PUBLIC_API_BASE_URL: '',
      EMAIL_TRANSPORT: useMailpit ? 'smtp' : 'console',
      SITE_URL: `http://localhost:${PORT}`,
      DATABASE_URL: process.env.DATABASE_URL ?? 'postgres://picaron:picaron@localhost:5433/picaron_commandes',
    },
  },
});

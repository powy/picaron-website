// Applies schema.sql (idempotent) to DATABASE_URL. Run with: npm run db:setup

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import pg from 'pg'
import { shouldUseSsl } from './ssl-policy.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('DATABASE_URL is not set. Add it to .env.local (see scripts/db/README.md).')
  process.exit(1)
}

const client = new pg.Client({ connectionString, ssl: shouldUseSsl(connectionString) })
try {
  await client.connect()
  await client.query(readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'))
  console.log(`Schema applied to ${new URL(connectionString).host}.`)
} catch (error) {
  console.error('Schema setup failed:', error.message)
  process.exitCode = 1
} finally {
  await client.end()
}

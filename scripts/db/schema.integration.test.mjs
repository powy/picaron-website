// Requires a reachable Postgres at DATABASE_URL — e.g. `npm run db:local:up`
// then DATABASE_URL=postgres://picaron:picaron@localhost:5433/picaron_commandes.
// Not part of `npm test` (unit tests only) — run explicitly via
// `npm run test:integration`. See scripts/db/README.md.

import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import pg from 'pg'
import { shouldUseSsl } from './ssl-policy.mjs'

const { Pool } = pg
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error(
    'DATABASE_URL is not set — run `npm run db:local:up` and set it to the local ' +
      'container (see scripts/db/README.md) before running the integration tests.'
  )
}

const pool = new Pool({ connectionString, ssl: shouldUseSsl(connectionString) })
let insertedId

before(async () => {
  const schema = readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')
  await pool.query(schema)
})

after(async () => {
  if (insertedId) {
    await pool.query('DELETE FROM commandes WHERE id = $1', [insertedId])
  }
  await pool.end()
})

test('inserting then selecting a dummy order round-trips correctly', async () => {
  const insertResult = await pool.query(
    `INSERT INTO commandes (
       statut, lignes_produits, montant_total, email_client,
       adresse_nom, adresse_ligne1, adresse_code_postal, adresse_ville, adresse_pays,
       point_relais_id, point_relais_nom, point_relais_adresse, point_relais_code_postal, point_relais_ville
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
     RETURNING id`,
    [
      'pending',
      JSON.stringify([{ produit: 'boucaniers', quantite: 1, prix_unitaire_centimes: 6900 }]),
      69,
      'test@picaron.fr',
      'Jean Testeur',
      '1 rue de Test',
      '75001',
      'Paris',
      'FR',
      'FR-000000',
      'Point Relais Test',
      '2 rue du Relais',
      '75001',
      'Paris',
    ]
  )
  insertedId = insertResult.rows[0].id
  assert.ok(insertedId, 'insert should return a generated id')

  const selectResult = await pool.query('SELECT * FROM commandes WHERE id = $1', [insertedId])
  assert.equal(selectResult.rows.length, 1)
  assert.equal(selectResult.rows[0].statut, 'pending')
  assert.equal(selectResult.rows[0].email_client, 'test@picaron.fr')
  assert.equal(selectResult.rows[0].point_relais_ville, 'Paris')
})

test('statut is constrained to the known set of values', async () => {
  await assert.rejects(
    pool.query(
      `INSERT INTO commandes (
         statut, lignes_produits, montant_total, email_client,
         adresse_nom, adresse_ligne1, adresse_code_postal, adresse_ville, adresse_pays,
         point_relais_id, point_relais_nom, point_relais_adresse, point_relais_code_postal, point_relais_ville
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [
        'not_a_real_status',
        JSON.stringify([]),
        0,
        'test@picaron.fr',
        'Jean Testeur',
        '1 rue de Test',
        '75001',
        'Paris',
        'FR',
        'FR-000000',
        'Point Relais Test',
        '2 rue du Relais',
        '75001',
        'Paris',
      ]
    ),
    /violates check constraint/
  )
})

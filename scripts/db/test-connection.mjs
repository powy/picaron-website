// Manual connectivity check for the Scaleway Serverless SQL Database.
// Ensures the `commandes` table exists, inserts a dummy order, reads it
// back, then cleans up. Run with: npm run db:test
//
// Requires DATABASE_URL in the environment, e.g.:
//   postgres://<user-or-app-id>:<api-secret-key>@<hostname>:5432/<dbname>?sslmode=require

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import pg from 'pg'
import { shouldUseSsl } from './ssl-policy.mjs'

const { Pool } = pg
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('DATABASE_URL is not set. Add it to .env.local (see scripts/db/README.md).')
  process.exit(1)
}

const pool = new Pool({ connectionString, ssl: shouldUseSsl(connectionString) })

const dummyOrder = {
  statut: 'pending',
  lignes_produits: JSON.stringify([
    { produit: 'boucaniers', quantite: 1, prix_unitaire_centimes: 6900 },
  ]),
  montant_total: 69,
  email_client: 'test@picaron.fr',
  adresse_nom: 'Jean Testeur',
  adresse_ligne1: '1 rue de Test',
  adresse_ligne2: null,
  adresse_code_postal: '75001',
  adresse_ville: 'Paris',
  adresse_pays: 'FR',
  point_relais_id: 'FR-000000',
  point_relais_nom: 'Point Relais Test',
  point_relais_adresse: '2 rue du Relais',
  point_relais_code_postal: '75001',
  point_relais_ville: 'Paris',
}

async function main() {
  const schema = readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')
  await pool.query(schema)
  console.log('Schema OK — table "commandes" exists.')

  const insertResult = await pool.query(
    `INSERT INTO commandes (
       statut, lignes_produits, montant_total, email_client,
       adresse_nom, adresse_ligne1, adresse_ligne2, adresse_code_postal, adresse_ville, adresse_pays,
       point_relais_id, point_relais_nom, point_relais_adresse, point_relais_code_postal, point_relais_ville
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING id`,
    [
      dummyOrder.statut,
      dummyOrder.lignes_produits,
      dummyOrder.montant_total,
      dummyOrder.email_client,
      dummyOrder.adresse_nom,
      dummyOrder.adresse_ligne1,
      dummyOrder.adresse_ligne2,
      dummyOrder.adresse_code_postal,
      dummyOrder.adresse_ville,
      dummyOrder.adresse_pays,
      dummyOrder.point_relais_id,
      dummyOrder.point_relais_nom,
      dummyOrder.point_relais_adresse,
      dummyOrder.point_relais_code_postal,
      dummyOrder.point_relais_ville,
    ]
  )
  const insertedId = insertResult.rows[0].id
  console.log('INSERT OK — dummy order id:', insertedId)

  const selectResult = await pool.query('SELECT * FROM commandes WHERE id = $1', [insertedId])
  console.log('SELECT OK — row read back:')
  console.log(selectResult.rows[0])

  await pool.query('DELETE FROM commandes WHERE id = $1', [insertedId])
  console.log('Cleanup OK — dummy order deleted.')

  await pool.end()
  console.log('\nAll good: connection, schema, insert and select are working.')
}

main().catch((err) => {
  console.error('DB test failed:', err.message)
  process.exit(1)
})

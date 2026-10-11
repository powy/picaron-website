-- Schema for the `commandes` (orders) table.
-- Covers the full field set needed by tasks 5 (create-order), 6 (Stripe
-- Payment Intent), 7 (Stripe webhook) and 10 (back-office) of the shop
-- update plan. Idempotent: safe to run against an existing database.

CREATE TABLE IF NOT EXISTS commandes (
  id SERIAL PRIMARY KEY,

  statut VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (statut IN ('pending', 'paid', 'shipped', 'cancelled')),

  -- Array of { produit, quantite, prix_unitaire }. JSON is enough while
  -- there is a single product (Boucaniers) in the catalog.
  lignes_produits JSONB NOT NULL,

  montant_total NUMERIC(10, 2) NOT NULL,

  email_client VARCHAR(255) NOT NULL,

  -- Adresse de facturation, en champs séparés pour faciliter les exports
  -- et étiquettes plus tard.
  adresse_nom VARCHAR(255) NOT NULL,
  adresse_ligne1 VARCHAR(255) NOT NULL,
  adresse_ligne2 VARCHAR(255),
  adresse_code_postal VARCHAR(10) NOT NULL,
  adresse_ville VARCHAR(255) NOT NULL,
  adresse_pays VARCHAR(2) NOT NULL DEFAULT 'FR',

  -- Point relais Mondial Relay sélectionné (issu du widget).
  point_relais_id VARCHAR(50) NOT NULL,
  point_relais_nom VARCHAR(255) NOT NULL,
  point_relais_adresse VARCHAR(255) NOT NULL,
  point_relais_code_postal VARCHAR(10) NOT NULL,
  point_relais_ville VARCHAR(255) NOT NULL,

  -- Défini par la tâche 6 une fois le Payment Intent créé ; consulté par
  -- le webhook (tâche 7) pour retrouver la commande.
  stripe_payment_intent_id VARCHAR(255) UNIQUE,

  date_creation TIMESTAMPTZ NOT NULL DEFAULT now(),
  date_mise_a_jour TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- v2 — Colissimo, payment failures, idempotent webhooks, confirmation email.
-- Written as idempotent ALTERs so it upgrades a v1 table in place as well as
-- a freshly created one. Safe to re-run (npm run db:setup).
-- ---------------------------------------------------------------------------

-- Unguessable identifier used in URLs (/commande/succes?order=...), so an
-- order can't be looked up by incrementing the numeric id.
ALTER TABLE commandes ADD COLUMN IF NOT EXISTS public_id UUID NOT NULL DEFAULT gen_random_uuid();
CREATE UNIQUE INDEX IF NOT EXISTS commandes_public_id_key ON commandes (public_id);

ALTER TABLE commandes ADD COLUMN IF NOT EXISTS mode_livraison VARCHAR(20) NOT NULL DEFAULT 'mondial_relay';
ALTER TABLE commandes DROP CONSTRAINT IF EXISTS commandes_mode_livraison_check;
ALTER TABLE commandes ADD CONSTRAINT commandes_mode_livraison_check
  CHECK (mode_livraison IN ('mondial_relay', 'colissimo'));

-- 'failed' : paiement refusé (webhook payment_intent.payment_failed). Le
-- client peut réessayer ; un paiement réussi ensuite repasse en 'paid'.
ALTER TABLE commandes DROP CONSTRAINT IF EXISTS commandes_statut_check;
ALTER TABLE commandes ADD CONSTRAINT commandes_statut_check
  CHECK (statut IN ('pending', 'paid', 'failed', 'shipped', 'cancelled'));

ALTER TABLE commandes ADD COLUMN IF NOT EXISTS telephone_client VARCHAR(30);
ALTER TABLE commandes ADD COLUMN IF NOT EXISTS langue VARCHAR(2) NOT NULL DEFAULT 'fr';

-- Point relais : uniquement pour Mondial Relay.
ALTER TABLE commandes ALTER COLUMN point_relais_id DROP NOT NULL;
ALTER TABLE commandes ALTER COLUMN point_relais_nom DROP NOT NULL;
ALTER TABLE commandes ALTER COLUMN point_relais_adresse DROP NOT NULL;
ALTER TABLE commandes ALTER COLUMN point_relais_code_postal DROP NOT NULL;
ALTER TABLE commandes ALTER COLUMN point_relais_ville DROP NOT NULL;

-- Adresse de livraison : uniquement pour Colissimo.
ALTER TABLE commandes ADD COLUMN IF NOT EXISTS livraison_nom VARCHAR(255);
ALTER TABLE commandes ADD COLUMN IF NOT EXISTS livraison_ligne1 VARCHAR(255);
ALTER TABLE commandes ADD COLUMN IF NOT EXISTS livraison_ligne2 VARCHAR(255);
ALTER TABLE commandes ADD COLUMN IF NOT EXISTS livraison_code_postal VARCHAR(10);
ALTER TABLE commandes ADD COLUMN IF NOT EXISTS livraison_ville VARCHAR(255);
ALTER TABLE commandes ADD COLUMN IF NOT EXISTS livraison_pays VARCHAR(2);
ALTER TABLE commandes ADD COLUMN IF NOT EXISTS livraison_email VARCHAR(255);
ALTER TABLE commandes ADD COLUMN IF NOT EXISTS livraison_telephone VARCHAR(30);

ALTER TABLE commandes DROP CONSTRAINT IF EXISTS commandes_livraison_coherente_check;
ALTER TABLE commandes ADD CONSTRAINT commandes_livraison_coherente_check CHECK (
  (mode_livraison = 'mondial_relay' AND point_relais_id IS NOT NULL)
  OR (mode_livraison = 'colissimo' AND livraison_ligne1 IS NOT NULL)
);

-- Frais de port facturés (inclus dans montant_total), calculés par le
-- serveur (lib/shipping.ts).
ALTER TABLE commandes ADD COLUMN IF NOT EXISTS frais_livraison NUMERIC(10, 2) NOT NULL DEFAULT 0;

-- Set once the confirmation email has gone out (never sent twice, even if
-- Stripe replays the webhook).
ALTER TABLE commandes ADD COLUMN IF NOT EXISTS email_confirmation_envoye_le TIMESTAMPTZ;

-- One row per payment event processed (Stripe event id, or evt_mock_... in
-- offline mode): a replayed event hits the primary key and is ignored.
CREATE TABLE IF NOT EXISTS evenements_paiement (
  event_id VARCHAR(255) PRIMARY KEY,
  type VARCHAR(100) NOT NULL,
  commande_id INTEGER REFERENCES commandes (id) ON DELETE CASCADE,
  recu_le TIMESTAMPTZ NOT NULL DEFAULT now()
);

# Base de données commandes — Scaleway Serverless SQL

Ce dossier contient le schéma et un script de test de connexion pour la
base `commandes` (tâche 2 du plan de mise à jour boutique).

## Statut : bloqué en attente d'un compte Scaleway

Provisionner l'instance réelle nécessite un compte Scaleway (avec
facturation) — ça, seul un humain avec les identifiants du compte peut le
faire. En attendant, tout (schéma, script de test, Terraform) est
testable contre un Postgres local — voir ci-dessous.

## 0. Tester en local d'abord (recommandé, pas de compte Scaleway requis)

La base Serverless SQL de Scaleway est du Postgres compatible fil : un
conteneur local suffit pour valider le schéma et les requêtes.

Depuis `picaron_web_2` :

```bash
npm run db:local:up
```

Dans `.env.local` :

```
DATABASE_URL=postgres://picaron:picaron@localhost:5433/picaron_commandes
```

Puis `npm run db:setup` (applique `schema.sql`, idempotent — à relancer après
chaque modification du schéma) et `npm run db:test` (voir section 3 plus
bas) — fonctionne à l'identique contre le conteneur local ou contre la vraie
instance Scaleway, seul `DATABASE_URL` change. Pour arrêter le conteneur :
`npm run db:local:down` ; pour repartir d'une base vide :
`npm run db:local:reset`.

Le même `docker-compose.yml` lance aussi **Mailpit**, qui reçoit les emails
de confirmation envoyés en local (boîte de réception : http://localhost:8025).

`schema.sql` contient la v1 de la table puis une section « v2 » (Colissimo,
statut `failed`, `public_id`, table `evenements_paiement` pour
l'idempotence des webhooks) écrite en `ALTER ... IF NOT EXISTS` : elle met à
niveau une base v1 existante comme une base neuve.

Voir aussi `infra/terraform/` pour la configuration Terraform de l'instance
réelle (non appliquée tant qu'il n'y a pas de compte Scaleway) et
`shop update plan/02bis-scaleway-terraform-local-test.md` pour le détail de
cette approche.

## 1. Créer l'instance réelle (via Terraform, une fois un compte disponible)

1. Créer un compte sur https://console.scaleway.com si besoin, puis un
   Project.
2. Suivre `infra/terraform/README.md` pour appliquer `scaleway_sdb_sql_database`
   (`terraform init` + `terraform apply` avec les identifiants du compte).
3. Créer manuellement une **IAM Application** + une **API key** avec accès à
   cette base (les identifiants de connexion sont liés à l'IAM, pas à un
   couple utilisateur/mot de passe classique ; volontairement laissé hors
   de Terraform pour ne pas faire atterrir le secret de la clé API dans
   l'état Terraform — voir `infra/terraform/README.md`).
4. Récupérer la chaîne de connexion, au format :
   ```
   postgres://<user-or-app-id>:<api-secret-key>@<hostname>:5432/<dbname>?sslmode=require
   ```

## 2. Configurer le projet

Ajouter la variable dans `picaron_web_2/.env.local` (jamais commité) :

```
DATABASE_URL=postgres://<user-or-app-id>:<api-secret-key>@<hostname>:5432/<dbname>?sslmode=require
```

## 3. Tester la connexion

Depuis `picaron_web_2` :

```bash
npm install
npm run db:test
```

Le script (`test-connection.mjs`) :
- crée la table `commandes` si elle n'existe pas encore (via `schema.sql`)
- insère une commande factice
- la relit et l'affiche
- la supprime (nettoyage)

Sortie attendue en cas de succès :
```
Schema OK — table "commandes" exists.
INSERT OK — dummy order id: 1
SELECT OK — row read back:
{ ... }
Cleanup OK — dummy order deleted.

All good: connection, schema, insert and select are working.
```

## Tests automatisés

- `npm test` — tests unitaires (`ssl-policy.unit.test.mjs`), aucune base
  requise
- `npm run test:integration` — teste `schema.sql` contre une vraie
  connexion Postgres (`DATABASE_URL`) : insertion/lecture, et rejet d'un
  `statut` invalide. Nécessite une base joignable — `npm run db:local:up`
  puis `DATABASE_URL=postgres://picaron:picaron@localhost:5433/picaron_commandes`

## Fichiers

- `schema.sql` — définition de la table `commandes`
- `ssl-policy.mjs` — décide si la connexion doit exiger TLS (désactivé en
  local, activé pour un hôte distant)
- `ssl-policy.unit.test.mjs` — tests unitaires de `ssl-policy.mjs`
- `test-connection.mjs` — script de test manuel (insert/select/delete),
  avec sortie détaillée pour un humain
- `schema.integration.test.mjs` — équivalent automatisé, avec assertions

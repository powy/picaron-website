# Terraform — infrastructure Scaleway (staging + prod)

Gère, **par environnement** (`staging`, `prod`) :
- l'instance Scaleway Serverless SQL Database (`picaron-commandes-<env>`) ;
- le namespace + la fonction serverless `api` (tâches 5 à 7 : create-order,
  payment intent, webhook Stripe), dont le code est `functions/api/handler.ts`
  → `lib/server/` (le même code que les routes `/api` utilisées en local).

Contexte : `shop update plan/02bis-scaleway-terraform-local-test.md` et
`shop update plan/12-environnements-et-mode-test.md`.

## Volontairement hors de Terraform

L'IAM Application et l'API key utilisées pour se connecter à la base sont
créées **manuellement** dans la console Scaleway, pas par Terraform : ça
évite que la clé soit *générée* dans l'état Terraform. La chaîne de connexion
qui en résulte est ensuite passée à la fonction via `TF_VAR_database_url`
(elle apparaît donc dans l'état, comme les autres secrets : le `.tfstate`
doit rester privé, il est ignoré par git).

## 1. Validation locale (aucun compte Scaleway requis)

```bash
terraform init
terraform fmt -check
terraform validate
```

## 2. Déployer un environnement (compte Scaleway requis)

Pré-requis : identifiants Scaleway dans l'environnement.

```bash
export SCW_ACCESS_KEY=... SCW_SECRET_KEY=... SCW_DEFAULT_PROJECT_ID=... SCW_DEFAULT_REGION=fr-par
```

Une fois par environnement :

```bash
cp staging.tfvars.example staging.tfvars      # puis adapter (git-ignoré)
terraform workspace new staging               # un état séparé par environnement
```

Déploiement (staging ; remplacer par `prod` pour la production) :

```bash
# depuis picaron_web_2 : construire le bundle de la fonction
npm run build:functions

cd infra/terraform
terraform workspace select staging
export TF_VAR_database_url='postgres://...'          # vide au tout premier apply, voir ci-dessous
export TF_VAR_stripe_secret_key='sk_test_...'        # prod : sk_live_...
export TF_VAR_stripe_webhook_secret='whsec_...'
export TF_VAR_smtp_user='...' TF_VAR_smtp_pass='...'
terraform apply -var-file=staging.tfvars
```

Garde-fous :
- `terraform apply` refuse de continuer si le workspace ne correspond pas à
  `environment` du fichier tfvars (précondition dans `functions.tf`).
- L'application elle-même refuse de démarrer avec une clé `sk_live_` hors
  production, une clé `sk_test_` en production, ou le paiement simulé en
  production (`lib/server/config.ts`).

### Premier déploiement d'un environnement (ordre des étapes)

1. `terraform apply` → crée la base et la fonction (la fonction répondra 500
   tant que `DATABASE_URL` / les clés Stripe ne sont pas fournies).
2. Console Scaleway : créer l'IAM Application + API key pour la base ;
   construire la chaîne de connexion avec `terraform output database_endpoint`.
3. Appliquer le schéma : depuis `picaron_web_2`,
   `DATABASE_URL='postgres://...' npm run db:setup`.
4. Stripe (mode **test** pour staging, **live** pour prod) : Developers →
   Webhooks → Add endpoint → URL = `terraform output stripe_webhook_url`,
   événements `payment_intent.succeeded` et `payment_intent.payment_failed`.
   Récupérer le `whsec_...`.
5. Relancer `terraform apply` avec `TF_VAR_database_url` et
   `TF_VAR_stripe_webhook_secret` renseignés.
6. Vercel : un **projet par environnement** (`picaron-staging` sur
   `staging.picaron.fr`, `picaron-prod` sur `picaron.fr` au go-live), chacun
   avec ses propres variables (modèles : `.env.staging.example`,
   `.env.production.example`). Ne pas définir `APP_ENV` côté Vercel. Définir `NEXT_PUBLIC_API_BASE_URL` =
   `terraform output api_url`, `NEXT_PUBLIC_APP_ENV` (`staging` /
   `production`), `NEXT_PUBLIC_RELAY_PICKER=mondialrelay`,
   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (`pk_test_` / `pk_live_`), puis
   redéployer.
7. Vérifier : `curl $(terraform output -raw api_url)/health` →
   `{"appEnv":"staging","paymentProvider":"stripe"}`.

## Fichiers

- `versions.tf` — versions de Terraform et des providers (`scaleway`, `archive`)
- `main.tf` — configuration du provider (identifiants via variables d'env)
- `variables.tf` — environnement, URLs, SMTP, secrets (`TF_VAR_...`)
- `database.tf` — `scaleway_sdb_sql_database` par environnement
- `functions.tf` — namespace + fonction `api` (bundle `functions/dist/api/handler.js`)
- `outputs.tf` — endpoint de la base, URL de l'API, URL du webhook Stripe
- `staging.tfvars.example`, `prod.tfvars.example` — valeurs non secrètes

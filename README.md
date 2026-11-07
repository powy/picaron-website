<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/assets/LogoPICARONJ1Pour_Fond_Sombre3.webp">
    <img src="public/assets/PICARON_LOGO.webp" alt="Picaron" width="240">
  </picture>
</p>

<h1 align="center">picaron-website</h1>

Website and online shop of Picaron, publisher of the board game **Boucaniers**.

Next.js 16 / React 19 / TypeScript, Tailwind CSS, next-intl (fr/en). Static site on Cloudflare Pages,
Stripe payments, serverless order API on Scaleway (PostgreSQL), infrastructure described in Terraform.

## Getting started

```bash
npm install
cp .env.example .env.local     # then fill in the keys (Stripe in test mode)
npm run dev                    # http://localhost:3000, order API on port 3001
```

## Useful commands

| Command | Purpose |
|---|---|
| `npm run ci` | every CI check, locally (see below) |
| `npm test` | unit tests |
| `npm run test:integration` | integration tests (local PostgreSQL: `npm run db:local:up`) |
| `npm run test:e2e` | Playwright tests of the checkout flow |
| `npm run dev:stripe` | local dev with `stripe listen` |
| `npm run build` | build the static site into `out/` |
| `npm start` | serve `out/` and the order API locally, as once deployed |
| `npm run build:functions` | build the `api` serverless function |
| `npm run tf -- plan` | Terraform (staging/prod), see `infra/terraform/README.md` |
| `npm run smoke` | end-to-end test order against a deployed API |

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on every pull request: lint, typecheck, unit tests,
function bundle, integration and e2e tests (Postgres + Mailpit), Terraform `fmt`/`validate`,
`npm audit` and a gitleaks secret scan. Mergify (`.mergify.yml`) merges a PR once it is green
and approved; Dependabot opens weekly update PRs.

Run the same checks locally before pushing (Docker must be running):

```bash
npm run ci                     # every step, then a summary
npm run ci -- e2e terraform    # only the steps whose name contains one of the words
```

It uses the local Postgres and Mailpit containers (`npm run db:local:up`), whatever `.env.local`
says, and runs gitleaks (and Terraform, if not installed) through Docker. CI also starts from
`npm ci`; run it yourself after changing dependencies.

## Deployment

The site is a static export, with one Cloudflare Pages project per environment:

| Branch | Project | Address |
|---|---|---|
| `staging` | `picaron-staging` | `staging.picaron.fr` |
| `production` | `picaron-prod` | `picaron.fr` |

`main` is the working branch: merge it into `staging`, check, then into `production`.

Both projects use the build command `npm run build` and the output folder `out`. They run the same
code with their own variables (`.env.staging.example`, `.env.production.example`). `NEXT_PUBLIC_*`
values are written into the files at build time, so redeploy after changing one.

`public/_redirects` holds the redirects. `scripts/finish-static-build.mjs` adds the noindex header
outside production and leaves the Mondial Relay test page out of production.

## Layout

- `app/`, `components/`, `messages/`: the site (pages, components, fr/en texts)
- `lib/server/`, `functions/api/`: order API, payments, emails
- `infra/terraform/`: Scaleway (database, function), one workspace per environment
- `scripts/`: local server, database, build, Terraform and smoke test scripts

## License

Source-available, all rights reserved (see `LICENSE`). The Picaron name and logo are not covered by the license.

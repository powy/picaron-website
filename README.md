<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/assets/LogoPICARONJ1Pour_Fond_Sombre3.webp">
    <img src="public/assets/PICARON_LOGO.webp" alt="Picaron" width="240">
  </picture>
</p>

<h1 align="center">picaron-website</h1>

Website and online shop of Picaron, publisher of the board game **Boucaniers**.

Next.js 16 / React 19 / TypeScript, Tailwind CSS, next-intl (fr/en). Stripe payments, serverless
order API on Scaleway (PostgreSQL), infrastructure described in Terraform.

## Getting started

```bash
npm install
cp .env.example .env.local     # then fill in the keys (Stripe in test mode)
npm run dev                    # http://localhost:3000
```

## Useful commands

| Command | Purpose |
|---|---|
| `npm test` | unit tests |
| `npm run test:integration` | integration tests (local PostgreSQL: `npm run db:local:up`) |
| `npm run test:e2e` | Playwright tests of the checkout flow |
| `npm run dev:stripe` | local dev with `stripe listen` |
| `npm run build:functions` | build the `api` serverless function |
| `npm run tf -- plan` | Terraform (staging/prod), see `infra/terraform/README.md` |
| `npm run smoke` | end-to-end test order against a deployed API |

## Layout

- `app/`, `components/`, `messages/`: the site (pages, components, fr/en texts)
- `lib/server/`, `functions/api/`: order API, payments, emails
- `infra/terraform/`: Scaleway (database, function), one workspace per environment
- `scripts/`: database, build, Terraform and smoke test scripts

## License

Source-available, all rights reserved (see `LICENSE`). The Picaron name and logo are not covered by the license.

// Wrapper around terraform: loads secrets into TF_VAR_* for the child process
// only (nothing is written to disk), then runs terraform. Works on Windows,
// macOS and Linux.
//
//   npm run tf -- plan
//   npm run tf -- apply
//   npm run tf -- output api_url
//
// Sources, in order:
//   1. STRIPE_SECRET_KEY from .env.local -> TF_VAR_stripe_secret_key
//   2. infra/terraform/<workspace>.secrets.env (git-ignored, optional), one
//      NAME=value per line, e.g. TF_VAR_database_url, TF_VAR_stripe_webhook_secret
// For plan/apply/destroy/refresh, -var-file=<workspace>.tfvars is added.
// Scaleway credentials come from the `scw init` profile (or SCW_* variables).

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseEnv } from 'node:util';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tfDir = join(root, 'infra', 'terraform');

const readEnv = (path) => (existsSync(path) ? parseEnv(readFileSync(path, 'utf8')) : {});

const fail = (message) => {
  console.error(message);
  process.exit(1);
};

const run = (args, options = {}) => {
  const result = spawnSync('terraform', args, { cwd: tfDir, ...options });
  if (result.error) fail(`Could not run terraform: ${result.error.message}`);
  return result;
};

const args = process.argv.slice(2);
if (args.length === 0) fail('Usage: npm run tf -- <terraform command and arguments>');

const workspace = run(['workspace', 'show'], { encoding: 'utf8' }).stdout.trim();
const env = { ...process.env };

// .env.local holds the test key: only use it outside prod (prod's sk_live_ key
// goes in prod.secrets.env).
const stripeKey = workspace === 'prod' ? undefined : readEnv(join(root, '.env.local')).STRIPE_SECRET_KEY;
if (stripeKey) {
  if (!stripeKey.startsWith('sk_test_')) {
    fail(`Workspace ${workspace} requires an sk_test_ key (.env.local has a different prefix).`);
  }
  env.TF_VAR_stripe_secret_key = stripeKey;
}

Object.assign(env, readEnv(join(tfDir, `${workspace}.secrets.env`)));

const withVarFile = ['plan', 'apply', 'destroy', 'refresh'].includes(args[0]);
const finalArgs = withVarFile ? [args[0], `-var-file=${workspace}.tfvars`, ...args.slice(1)] : args;

console.log(`terraform workspace: ${workspace}`);
const result = run(finalArgs, { env, stdio: 'inherit' });
process.exit(result.status ?? 1);

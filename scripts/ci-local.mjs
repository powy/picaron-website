// Runs every check of the CI workflow (.github/workflows/ci.yml) locally, in
// the same order; keep both in sync. Needs Docker running (Postgres and
// Mailpit from infra/local, the Linux lockfile check, gitleaks, and terraform
// when it is not installed). It does not reinstall node_modules; CI does.
//
//   npm run ci                    every step
//   npm run ci -- e2e terraform   only the steps whose name contains a word
//
// Every step runs even after a failure; a summary is printed at the end and
// the exit code is 1 when a step failed.

import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tfDir = join(root, 'infra', 'terraform');
const GITLEAKS_IMAGE = 'ghcr.io/gitleaks/gitleaks:v8.30.1';
const TERRAFORM_IMAGE = 'hashicorp/terraform:1.16.2';
// CI runs Linux with the Node (and npm) version of .nvmrc.
const NODE_IMAGE = `node:${readFileSync(join(root, '.nvmrc'), 'utf8').trim()}`;

// The local Docker database, whatever .env.local says (it may point at a
// real Scaleway database): real environment variables win over --env-file.
const testEnv = {
  DATABASE_URL: 'postgres://picaron:picaron@localhost:5433/picaron_commandes',
  E2E_MAILPIT: '1',
};

const has = (command) => spawnSync(`${command} version`, { stdio: 'ignore', shell: true }).status === 0;

// Terraform: the local binary when installed, else its Docker image. A
// throwaway data dir keeps this away from any real .terraform setup.
const TERRAFORM_CHECKS = 'terraform fmt -check -recursive && terraform init -backend=false -input=false && terraform validate';
const terraformStep = has('terraform')
  ? { command: TERRAFORM_CHECKS, cwd: tfDir, env: { TF_DATA_DIR: mkdtempSync(join(tmpdir(), 'tf-')) } }
  : {
      command: `docker run --rm -v "${tfDir}:/tf" -w /tf -e TF_DATA_DIR=/tmp/tf --entrypoint sh ${TERRAFORM_IMAGE} -c "${TERRAFORM_CHECKS}"`,
      env: { MSYS_NO_PATHCONV: '1' },
    };

const steps = [
  {
    // CI starts with `npm ci` on Linux, where npm checks platform-specific
    // parts of the lockfile that Windows and macOS skip.
    job: 'checks',
    name: 'lockfile (npm ci on Linux, dry run)',
    command:
      `docker run --rm -v "${join(root, 'package.json')}:/app/package.json:ro" ` +
      `-v "${join(root, 'package-lock.json')}:/app/package-lock.json:ro" -w /app ${NODE_IMAGE} ` +
      'npm ci --dry-run --ignore-scripts --no-audit --no-fund',
    env: { MSYS_NO_PATHCONV: '1' },
  },
  { job: 'checks', name: 'lint', command: 'npm run lint' },
  { job: 'checks', name: 'typecheck', command: 'npx tsc --noEmit' },
  { job: 'checks', name: 'unit tests', command: 'npm test' },
  { job: 'checks', name: 'function bundle', command: 'npm run build:functions' },
  { job: 'e2e', name: 'start Postgres and Mailpit', command: 'npm run db:local:up' },
  { job: 'e2e', name: 'db schema', command: 'npm run db:setup', env: testEnv },
  { job: 'e2e', name: 'integration tests', command: 'npm run test:integration', env: testEnv },
  { job: 'e2e', name: 'e2e tests', command: 'npm run test:e2e', env: testEnv },
  { job: 'terraform', name: 'terraform fmt and validate', ...terraformStep },
  { job: 'security', name: 'npm audit', command: 'npm audit --omit=dev --audit-level=high' },
  {
    job: 'security',
    name: 'gitleaks',
    command: `docker run --rm -v "${root}:/repo" -e GIT_CONFIG_COUNT=1 -e GIT_CONFIG_KEY_0=safe.directory -e GIT_CONFIG_VALUE_0=/repo ${GITLEAKS_IMAGE} git /repo --redact --no-banner`,
    // Git Bash on Windows would otherwise rewrite /repo into a Windows path.
    env: { MSYS_NO_PATHCONV: '1' },
  },
];

const filters = process.argv.slice(2).map((word) => word.toLowerCase());
const selected = filters.length
  ? steps.filter((step) => filters.some((word) => `${step.job} ${step.name}`.toLowerCase().includes(word)))
  : steps;
if (selected.length === 0) {
  console.error(`No step matches: ${filters.join(', ')}. Steps: ${steps.map((step) => step.name).join(', ')}`);
  process.exit(1);
}

const results = [];
for (const step of selected) {
  console.log(`\n\x1b[1m▶ [${step.job}] ${step.name}\x1b[0m  (${step.command})`);
  const started = Date.now();
  const { status } = spawnSync(step.command, {
    cwd: step.cwd ?? root,
    env: { ...process.env, ...step.env },
    stdio: 'inherit',
    shell: true,
  });
  results.push({ ...step, ok: status === 0, seconds: Math.round((Date.now() - started) / 1000) });
}

console.log('\n\x1b[1mSummary\x1b[0m');
for (const { job, name, ok, seconds } of results) {
  console.log(`  ${ok ? '\x1b[32m✔' : '\x1b[31m✘'}\x1b[0m [${job}] ${name} (${seconds}s)`);
}
const failed = results.filter((result) => !result.ok).length;
console.log(failed ? `\n\x1b[31m${failed} step(s) failed.\x1b[0m` : '\n\x1b[32mAll green.\x1b[0m');
process.exit(failed ? 1 : 0);

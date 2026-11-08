// Runs after scripts/finish-static-build.mjs (npm postbuild). On a production
// build (NEXT_PUBLIC_APP_ENV=production) it fails the build when test settings
// or test content would reach customers, so Cloudflare does not deploy it.
// Other builds are not checked.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

if (process.env.NEXT_PUBLIC_APP_ENV !== 'production') process.exit(0);

const outDir = 'out';
const problems = [];

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';
if (publishableKey && !publishableKey.startsWith('pk_live_')) {
  problems.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not a live key (pk_live_...)');
}
if (process.env.NEXT_PUBLIC_MONDIAL_RELAY_BRAND_CODE === 'BDTEST') {
  problems.push('NEXT_PUBLIC_MONDIAL_RELAY_BRAND_CODE is the BDTEST sandbox brand');
}

const robots = readFileSync(join(outDir, 'robots.txt'), 'utf8');
if (!robots.includes('Allow: /') || robots.includes('Disallow: /')) {
  problems.push('robots.txt does not allow indexing');
}
if (existsSync(join(outDir, '_headers')) && readFileSync(join(outDir, '_headers'), 'utf8').includes('noindex')) {
  problems.push('_headers sends noindex');
}

const files = readdirSync(outDir, { recursive: true }).map(String);
if (files.some((file) => file.includes('mondial-relay-test'))) {
  problems.push('the Mondial Relay test page is in the build');
}

// The start of the test banner text, before its "({env})" placeholder. Every
// page embeds all the translations in its scripts, so only the rendered HTML
// outside <script> counts.
const bannerTexts = ['fr', 'en'].map((locale) => {
  const messages = JSON.parse(readFileSync(join('messages', `${locale}.json`), 'utf8'));
  return messages.testBanner.text.split('(')[0].trim();
});
const renderedHtml = (file) => readFileSync(join(outDir, file), 'utf8').replace(/<script[\s\S]*?<\/script>/g, '');
const withBanner = files.filter(
  (file) => file.endsWith('.html') && bannerTexts.some((text) => renderedHtml(file).includes(text))
);
if (withBanner.length) problems.push(`the test banner is on ${withBanner.length} page(s), e.g. ${withBanner[0]}`);

if (problems.length) {
  console.error(`Production build refused:\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log('Production build checked: no test settings or test content.');

// Runs after `next build` (npm postbuild): finishes the static site in out/.
//
// Production: drops the Mondial Relay proof-of-concept page.
// Elsewhere: adds a Cloudflare _headers file so the site is never indexed
// (app/robots.ts covers robots.txt).
// Everywhere: adds the prefetch files under the names the browser asks for, and
// the 404 pages. Cloudflare serves the closest 404.html, so /en/nope gets the
// English one; addresses without a language get the French one.

import { copyFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, sep } from 'node:path';

const outDir = 'out';

// Next.js writes a page's prefetch data in folders
// (__next.$d$locale/boutique/__PAGE__.txt) but the browser requests one flat
// name (__next.$d$locale.boutique.__PAGE__.txt): without a copy under that
// name, every link prefetch is a 404.
function copyPrefetchFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const path = join(dir, entry.name);
    if (!entry.name.startsWith('__next.')) {
      copyPrefetchFiles(path);
      continue;
    }
    for (const relative of readdirSync(path, { recursive: true })) {
      if (!statSync(join(path, relative)).isFile()) continue;
      copyFileSync(join(path, relative), join(dir, `${entry.name}.${relative.split(sep).join('.')}`));
    }
  }
}

copyPrefetchFiles(outDir);

for (const locale of ['fr', 'en']) {
  copyFileSync(join(outDir, locale, 'introuvable.html'), join(outDir, locale, '404.html'));
}
copyFileSync(join(outDir, 'fr', '404.html'), join(outDir, '404.html'));

if (process.env.NEXT_PUBLIC_APP_ENV === 'production') {
  for (const locale of ['fr', 'en']) {
    rmSync(join(outDir, locale, 'mondial-relay-test.html'), { force: true });
    rmSync(join(outDir, locale, 'mondial-relay-test.txt'), { force: true });
    rmSync(join(outDir, locale, 'mondial-relay-test'), { force: true, recursive: true });
  }
} else {
  writeFileSync(join(outDir, '_headers'), '/*\n  X-Robots-Tag: noindex, nofollow\n');
}

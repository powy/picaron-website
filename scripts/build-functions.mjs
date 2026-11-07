// Bundles the Scaleway function (functions/api/handler.ts + lib/server and
// its dependencies) into a single ES module, functions/dist/api/handler.js.
// Terraform zips and deploys it (archive_file in infra/terraform/functions.tf).
// Run with: npm run build:functions

import { build } from 'esbuild'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const outDir = path.resolve('functions/dist/api')
rmSync(path.resolve('functions/dist'), { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })

await build({
  entryPoints: ['functions/api/handler.ts'],
  outfile: path.join(outDir, 'handler.js'),
  bundle: true,
  platform: 'node',
  target: 'node24',
  // Scaleway's Node runtime loads handler.js as an ES module.
  format: 'esm',
  // Bundled CommonJS dependencies still call require().
  banner: {
    js: "import { createRequire as __createRequire } from 'node:module'; const require = __createRequire(import.meta.url);",
  },
  // pg's optional native binding is never used.
  external: ['pg-native'],
  logLevel: 'info',
})

// Load the bundle the way Scaleway does, so a broken one fails here rather than
// once deployed. This package.json stands in for the runtime's own: it sits
// outside functions/dist/api, so it is not deployed.
writeFileSync(path.resolve('functions/dist/package.json'), '{"type":"module"}\n')
const { handle } = await import(pathToFileURL(path.join(outDir, 'handler.js')).href)
if (typeof handle !== 'function') throw new Error('handler.js does not export handle')

console.log('Wrote functions/dist/api/handler.js')

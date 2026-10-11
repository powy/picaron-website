// Bundles the Scaleway function (functions/api/handler.ts + lib/server and
// its dependencies) into a single CommonJS file, functions/dist/api/handler.js.
// Terraform zips and deploys it (archive_file in infra/terraform/functions.tf).
// Run with: npm run build:functions

import { build } from 'esbuild'
import { mkdirSync, rmSync } from 'node:fs'
import path from 'node:path'

const outDir = path.resolve('functions/dist/api')
rmSync(path.resolve('functions/dist'), { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })

await build({
  entryPoints: ['functions/api/handler.ts'],
  outfile: path.join(outDir, 'handler.js'),
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'cjs',
  // pg's optional native binding is never used.
  external: ['pg-native'],
  logLevel: 'info',
})

console.log('Wrote functions/dist/api/handler.js')

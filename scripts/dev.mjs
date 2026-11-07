// `npm run dev` — the local site and the order API it calls.

import { API_COMMAND, API_PORT, runTogether } from './run-together.mjs'

runTogether('dev', [
  { label: 'order API', command: API_COMMAND, env: { API_PORT } },
  { label: 'next dev', command: 'npx next dev', env: { API_PORT } },
])

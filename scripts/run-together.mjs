// Starts several commands and stops them all on Ctrl+C or when one exits.

import { spawn } from 'node:child_process'

// The order API that `next dev` forwards /api to (next.config.mjs).
export const API_PORT = process.env.API_PORT ?? '3001'
export const API_COMMAND = 'node --env-file-if-exists=.env.local --import tsx scripts/local-server.ts'

export function runTogether(name, commands) {
  const children = []
  let stopping = false
  const shutdown = (code) => {
    if (stopping) return
    stopping = true
    for (const child of children) child.kill()
    process.exit(code)
  }
  process.on('SIGINT', () => shutdown(0))
  process.on('SIGTERM', () => shutdown(0))

  for (const { label, command, env = {} } of commands) {
    // One command string: shell mode is needed on Windows to resolve
    // npx/stripe, and Node deprecates shell + args array.
    const child = spawn(command, { stdio: 'inherit', shell: true, env: { ...process.env, ...env } })
    child.on('exit', (code) => {
      console.log(`[${name}] ${label} exited (${code}) — stopping everything`)
      shutdown(code ?? 0)
    })
    children.push(child)
  }
}

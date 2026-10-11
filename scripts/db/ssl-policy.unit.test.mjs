import { test } from 'node:test'
import assert from 'node:assert/strict'
import { shouldUseSsl } from './ssl-policy.mjs'

test('disables ssl for localhost', () => {
  assert.equal(shouldUseSsl('postgres://u:p@localhost:5433/db'), false)
})

test('disables ssl for 127.0.0.1', () => {
  assert.equal(shouldUseSsl('postgres://u:p@127.0.0.1:5433/db'), false)
})

test('enables ssl for a remote host (e.g. the real Scaleway instance)', () => {
  assert.equal(
    shouldUseSsl('postgres://u:p@my-instance.sdb.fr-par.scw.cloud:5432/db'),
    true
  )
})

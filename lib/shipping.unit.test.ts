import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeShippingCents } from './shipping';

const game = (quantity: number) => ({ productId: 'boucaniers' as const, quantity });
const novel = (quantity: number) => ({ productId: 'armand' as const, quantity });

for (const method of ['mondial_relay', 'colissimo'] as const) {
  test(`${method}: one full fee per copy of the game`, () => {
    assert.equal(computeShippingCents([game(1)], method), 1000);
    assert.equal(computeShippingCents([game(3)], method), 3000);
  });

  test(`${method}: novels ship free with a game`, () => {
    assert.equal(computeShippingCents([game(1), novel(2)], method), 1000);
    assert.equal(computeShippingCents([game(2), novel(1)], method), 2000);
  });

  test(`${method}: novels alone pay one flat fee`, () => {
    assert.equal(computeShippingCents([novel(1)], method), 500);
    assert.equal(computeShippingCents([novel(3)], method), 500);
  });

  test(`${method}: empty cart has no fee`, () => {
    assert.equal(computeShippingCents([], method), 0);
  });
}

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeShippingCents, countFreeNovels } from './shipping';

const game = (quantity: number) => ({ productId: 'boucaniers' as const, quantity });
const novel = (quantity: number) => ({ productId: 'armand' as const, quantity });

test('mondial_relay: one game fee per copy of the game', () => {
  assert.equal(computeShippingCents([game(1)], 'mondial_relay'), 842);
  assert.equal(computeShippingCents([game(3)], 'mondial_relay'), 3 * 842);
});

test('colissimo: one game fee per copy of the game', () => {
  assert.equal(computeShippingCents([game(1)], 'colissimo'), 942);
  assert.equal(computeShippingCents([game(3)], 'colissimo'), 3 * 942);
});

test('novels alone pay one novel fee each', () => {
  assert.equal(computeShippingCents([novel(1)], 'mondial_relay'), 242);
  assert.equal(computeShippingCents([novel(3)], 'mondial_relay'), 3 * 242);
  assert.equal(computeShippingCents([novel(2)], 'colissimo'), 2 * 342);
});

test('each game delivers one novel free', () => {
  assert.equal(computeShippingCents([game(1), novel(1)], 'mondial_relay'), 842);
  assert.equal(computeShippingCents([game(2), novel(1)], 'colissimo'), 2 * 942);
  assert.equal(computeShippingCents([game(1), novel(3)], 'mondial_relay'), 842 + 2 * 242);
  assert.equal(computeShippingCents([game(2), novel(3)], 'colissimo'), 2 * 942 + 342);
});

test('free novels are capped by the number of games and of novels', () => {
  assert.equal(countFreeNovels([game(1), novel(3)]), 1);
  assert.equal(countFreeNovels([game(3), novel(1)]), 1);
  assert.equal(countFreeNovels([novel(2)]), 0);
});

test('empty cart has no fee', () => {
  assert.equal(computeShippingCents([], 'mondial_relay'), 0);
  assert.equal(computeShippingCents([], 'colissimo'), 0);
});

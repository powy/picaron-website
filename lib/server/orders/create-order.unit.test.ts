import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ADDRESS, RELAY } from '../test-fixtures';
import { computeOrderLines, OrderValidationError, validateOrderRequest } from './create-order';

const mondialRelay = {
  locale: 'fr',
  items: [{ productId: 'boucaniers', quantity: 1 }],
  shippingMethod: 'mondial_relay',
  billingAddress: ADDRESS,
  relay: RELAY,
};

const errorsOf = (input: unknown) => {
  try {
    validateOrderRequest(input);
  } catch (error) {
    assert.ok(error instanceof OrderValidationError);
    return error.details;
  }
  assert.fail('expected a validation error');
};

test('a valid Mondial Relay order passes', () => {
  const order = validateOrderRequest(mondialRelay);
  assert.equal(order.shippingMethod, 'mondial_relay');
  assert.equal(order.relay?.ID, '012345');
  assert.equal(order.deliveryAddress, null);
});

test('a valid Colissimo order passes and needs a delivery address', () => {
  const colissimo = { ...mondialRelay, shippingMethod: 'colissimo', relay: undefined, deliveryAddress: ADDRESS };
  assert.equal(validateOrderRequest(colissimo).deliveryAddress?.city, 'Paris');
  assert.ok('deliveryAddress' in errorsOf({ ...colissimo, deliveryAddress: undefined }));
});

test('Mondial Relay without a relay point is rejected', () => {
  assert.ok('relay' in errorsOf({ ...mondialRelay, relay: undefined }));
});

test('invalid addresses reuse the front-end rules', () => {
  const details = errorsOf({ ...mondialRelay, billingAddress: { ...ADDRESS, email: 'pasunemail', postalCode: 'AB123' } });
  assert.equal(details['billingAddress.email'], 'invalidEmail');
  assert.equal(details['billingAddress.postalCode'], 'invalidPostalCode');
});

test('France only: overseas addresses and relay points outside mainland France are rejected', () => {
  const overseas = errorsOf({ ...mondialRelay, billingAddress: { ...ADDRESS, postalCode: '97400' } });
  assert.equal(overseas['billingAddress.postalCode'], 'notMainlandFrance');
  assert.equal(errorsOf({ ...mondialRelay, relay: { ...RELAY, CP: '98000' } })['relay.CP'], 'notMainlandFrance');
  assert.equal(errorsOf({ ...mondialRelay, relay: { ...RELAY, Pays: 'BE' } })['relay.Pays'], 'notMainlandFrance');
  const colissimo = { ...mondialRelay, shippingMethod: 'colissimo', relay: undefined };
  assert.equal(
    errorsOf({ ...colissimo, deliveryAddress: { ...ADDRESS, postalCode: '97100' } })['deliveryAddress.postalCode'],
    'notMainlandFrance'
  );
  assert.equal(validateOrderRequest({ ...mondialRelay, relay: { ...RELAY, CP: '20000', Pays: 'FR' } }).relay?.CP, '20000');
});

test('unknown products, bad quantities and duplicates are rejected', () => {
  assert.ok('items.0' in errorsOf({ ...mondialRelay, items: [{ productId: 'nope', quantity: 1 }] }));
  assert.ok('items.0' in errorsOf({ ...mondialRelay, items: [{ productId: 'boucaniers', quantity: 0 }] }));
  assert.ok('items.0' in errorsOf({ ...mondialRelay, items: [{ productId: 'boucaniers', quantity: 1.5 }] }));
  assert.ok('items.0' in errorsOf({ ...mondialRelay, items: [{ productId: 'boucaniers', quantity: 999 }] }));
  assert.ok(
    'items.1' in
      errorsOf({
        ...mondialRelay,
        items: [
          { productId: 'boucaniers', quantity: 1 },
          { productId: 'boucaniers', quantity: 2 },
        ],
      })
  );
  assert.ok('items' in errorsOf({ ...mondialRelay, items: [] }));
});

test('unknown shipping method and non-object body are rejected', () => {
  assert.ok('shippingMethod' in errorsOf({ ...mondialRelay, shippingMethod: 'drone' }));
  assert.ok('body' in errorsOf('hello'));
});

test('the total comes from the server catalog, not the client', () => {
  const order = validateOrderRequest({
    ...mondialRelay,
    totalCents: 1, // ignored
    items: [
      { productId: 'boucaniers', quantity: 2, priceCents: 1 }, // price ignored
      { productId: 'armand', quantity: 1 },
    ],
  });
  const { lines, totalCents } = computeOrderLines(order.items);
  assert.equal(totalCents, 2 * 6900 + 1000);
  assert.deepEqual(lines[0], { produit: 'boucaniers', quantite: 2, prix_unitaire_centimes: 6900 });
});

test('country is forced to France', () => {
  const order = validateOrderRequest({ ...mondialRelay, billingAddress: { ...ADDRESS, country: 'Narnia' } });
  assert.equal(order.billingAddress.country, 'France');
});

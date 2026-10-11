import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_ADDRESS, validateAddress } from './address';

const withPostalCode = (postalCode: string) =>
  validateAddress({
    ...DEFAULT_ADDRESS,
    lastName: 'Dupont',
    firstName: 'Jean',
    address: '10 rue de la Paix',
    city: 'Ville',
    email: 'jean@exemple.fr',
    phone: '0612345678',
    postalCode,
  }).postalCode;

test('mainland France postal codes are accepted (Paris, Corsica, last department)', () => {
  for (const code of ['75002', '01000', '20000', '20200', '95000', '13001']) {
    assert.equal(withPostalCode(code), undefined, code);
  }
});

test('overseas territories, Monaco and 00xxx are refused with a "contact us" error', () => {
  for (const code of ['97400', '97100', '98000', '98800', '00100', '96000']) {
    assert.equal(withPostalCode(code), 'notMainlandFrance', code);
  }
});

test('malformed postal codes keep the generic error', () => {
  for (const code of ['7500', 'AB123', '750021']) {
    assert.equal(withPostalCode(code), 'invalidPostalCode', code);
  }
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { OrderRow } from '../orders/get-order';
import { buildOrderConfirmationEmail } from './order-confirmation';

const order = {
  id: 42,
  public_id: '11111111-2222-3333-4444-555555555555',
  statut: 'paid',
  mode_livraison: 'mondial_relay',
  langue: 'fr',
  lignes_produits: [{ produit: 'boucaniers', quantite: 2, prix_unitaire_centimes: 6900 }],
  montant_total: '158.00',
  frais_livraison: '20.00',
  email_client: 'jean@exemple.fr',
  adresse_nom: 'Jean <Dupont>',
  point_relais_nom: 'Tabac Test',
  point_relais_adresse: '1 rue du Relais',
  point_relais_code_postal: '75001',
  point_relais_ville: 'Paris',
} as unknown as OrderRow;

test('French email with reference, total, relay and link', () => {
  const email = buildOrderConfirmationEmail(order, 'http://localhost:3000');
  assert.equal(email.to, 'jean@exemple.fr');
  assert.match(email.subject, /PIC-000042/);
  assert.match(email.text, /Boucaniers × 2/);
  assert.match(email.text, /Livraison — 20,00/);
  assert.match(email.text, /Total : 158,00/);
  assert.match(email.text, /Tabac Test — 1 rue du Relais, 75001 Paris/);
  assert.match(email.text, /http:\/\/localhost:3000\/fr\/commande\/succes\?order=11111111/);
  assert.match(email.html, /Jean &lt;Dupont&gt;/, 'HTML is escaped');
});

test('English Colissimo email', () => {
  const email = buildOrderConfirmationEmail(
    {
      ...order,
      langue: 'en',
      mode_livraison: 'colissimo',
      livraison_nom: 'Jean Dupont',
      livraison_ligne1: '3 avenue Foch',
      livraison_ligne2: null,
      livraison_code_postal: '69001',
      livraison_ville: 'Lyon',
    },
    'https://picaron.fr'
  );
  assert.match(email.subject, /is confirmed/);
  assert.match(email.text, /Home delivery by Colissimo/);
  assert.match(email.text, /3 avenue Foch, 69001 Lyon/);
});

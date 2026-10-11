import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { OrderRow } from '../orders/get-order';
import { buildTeamNotificationEmail } from './order-notification';

const order: OrderRow = {
  id: 12,
  public_id: '00000000-0000-4000-8000-000000000000',
  statut: 'paid',
  mode_livraison: 'colissimo',
  langue: 'fr',
  lignes_produits: [{ produit: 'boucaniers', quantite: 1, prix_unitaire_centimes: 6900 }],
  montant_total: '79.00',
  frais_livraison: '10.00',
  email_client: 'jean@exemple.fr',
  telephone_client: '0612345678',
  adresse_nom: 'Jean Dupont',
  point_relais_id: null,
  point_relais_nom: null,
  point_relais_adresse: null,
  point_relais_code_postal: null,
  point_relais_ville: null,
  livraison_nom: 'Jean Dupont',
  livraison_ligne1: '10 rue de la Paix',
  livraison_ligne2: null,
  livraison_code_postal: '69001',
  livraison_ville: 'Lyon',
  stripe_payment_intent_id: 'pi_1',
  email_confirmation_envoye_le: null,
};
const context = { to: 'equipe@exemple.fr', appEnv: 'production', siteUrl: 'https://picaron.fr' };
// Intl formats amounts with a non-breaking space before the euro sign.
const plain = (value: string) => value.replace(/\s/g, ' ');

test('paid notification: subject, customer details and destination', () => {
  const email = buildTeamNotificationEmail(order, 'paid', context);
  assert.equal(plain(email.subject), 'Commande PIC-000012 PAYÉE — 79,00 € (Colissimo)');
  assert.equal(email.to, 'equipe@exemple.fr');
  assert.equal(email.replyTo, 'jean@exemple.fr');
  for (const expected of ['Jean Dupont', 'jean@exemple.fr', '0612345678', '10 rue de la Paix', '69001 Lyon', 'Total : 79,00 €']) {
    assert.ok(plain(email.text).includes(expected), expected);
  }
});

test('failed notification carries the decline code', () => {
  const email = buildTeamNotificationEmail({ ...order, statut: 'failed' }, 'failed', { ...context, failureCode: 'card_declined' });
  assert.equal(plain(email.subject), 'Paiement ÉCHOUÉ PIC-000012 — 79,00 € (card_declined)');
});

test('anything but production is tagged in the subject', () => {
  assert.ok(buildTeamNotificationEmail(order, 'paid', { ...context, appEnv: 'staging' }).subject.startsWith('[staging] '));
});

test('a Mondial Relay order names the relay point', () => {
  const relay: OrderRow = {
    ...order,
    mode_livraison: 'mondial_relay',
    point_relais_id: '012345',
    point_relais_nom: 'Tabac Test',
    point_relais_adresse: '1 rue du Relais',
    point_relais_code_postal: '75001',
    point_relais_ville: 'Paris',
  };
  const email = buildTeamNotificationEmail(relay, 'paid', context);
  assert.ok(email.text.includes('Tabac Test (012345)'));
  assert.ok(email.subject.includes('Mondial Relay'));
});

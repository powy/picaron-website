// Internal notification sent to the team for every paid or failed payment, in
// addition to (or, while no SMTP provider exists, instead of) the customer
// confirmation. Always French: it is for us. Pure function; sending is done by
// handlePaymentEvent() through mailer.ts.

import { formatOrderReference } from '../../checkout/order';
import { formatPriceCents, type ProductId } from '../../products';
import type { OrderRow } from '../orders/get-order';
import { shippingCents, totalCents } from '../orders/get-order';
import type { EmailMessage } from './order-confirmation';

export type TeamNotificationKind = 'paid' | 'failed';

const PRODUCT_NAMES: Record<ProductId, string> = {
  boucaniers: 'Boucaniers',
  armand: 'Armand ou Les Rêveurs du Nouveau Monde',
};

export interface TeamNotificationContext {
  /** Recipient (ignored by the EmailJS transport, whose template decides). */
  to: string;
  appEnv: string;
  siteUrl: string;
  /** Stripe decline code on failures (card_declined, insufficient_funds...). */
  failureCode?: string | null;
}

export function buildTeamNotificationEmail(
  order: OrderRow,
  kind: TeamNotificationKind,
  context: TeamNotificationContext
): EmailMessage {
  const reference = formatOrderReference(order.id);
  const price = (cents: number) => formatPriceCents(cents, 'fr');
  const total = price(totalCents(order));
  const method = order.mode_livraison === 'mondial_relay' ? 'Mondial Relay' : 'Colissimo';
  // Anything but production is a test order: say so in the subject.
  const envTag = context.appEnv === 'production' ? '' : `[${context.appEnv}] `;

  const subject =
    kind === 'paid'
      ? `${envTag}Commande ${reference} PAYÉE — ${total} (${method})`
      : `${envTag}Paiement ÉCHOUÉ ${reference} — ${total} (${context.failureCode ?? 'raison inconnue'})`;

  const destination =
    order.mode_livraison === 'mondial_relay'
      ? [
          'Point relais Mondial Relay :',
          `${order.point_relais_nom} (${order.point_relais_id})`,
          `${order.point_relais_adresse}, ${order.point_relais_code_postal} ${order.point_relais_ville}`,
        ]
      : [
          'Livraison à domicile Colissimo :',
          order.livraison_nom ?? '',
          [order.livraison_ligne1, order.livraison_ligne2].filter(Boolean).join(', '),
          `${order.livraison_code_postal} ${order.livraison_ville}`,
        ];

  const text = [
    kind === 'paid'
      ? `Nouvelle commande payée : ${reference}`
      : `Un paiement a échoué pour la commande ${reference} (${context.failureCode ?? 'raison inconnue'}). Le client peut réessayer ; aucune action requise sauf s'il vous contacte.`,
    `Environnement : ${context.appEnv}`,
    `Statut : ${order.statut}`,
    '',
    `Client : ${order.adresse_nom}`,
    `Email : ${order.email_client}`,
    `Téléphone : ${order.telephone_client ?? '—'}`,
    '',
    ...order.lignes_produits.map(
      (line) => `- ${PRODUCT_NAMES[line.produit] ?? line.produit} × ${line.quantite} — ${price(line.quantite * line.prix_unitaire_centimes)}`
    ),
    `- Livraison — ${price(shippingCents(order))}`,
    `Total : ${total}`,
    '',
    ...destination,
    '',
    `Commande (page client) : ${context.siteUrl}/fr/commande/succes?order=${order.public_id}`,
  ].join('\n');

  return { to: context.to, replyTo: order.email_client, subject, text, html: `<pre>${escapeHtml(text)}</pre>` };
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);

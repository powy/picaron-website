// Task 9 — content of the order confirmation email (FR/EN). Pure function:
// sending is done by mailer.ts, triggered from handlePaymentEvent().

import { formatOrderReference } from '../../checkout/order';
import { formatPriceCents, type ProductId } from '../../products';
import type { OrderRow } from '../orders/get-order';
import { shippingCents, totalCents } from '../orders/get-order';

const PRODUCT_NAMES: Record<ProductId, { fr: string; en: string }> = {
  boucaniers: { fr: 'Boucaniers', en: 'Boucaniers' },
  armand: { fr: 'Armand ou Les Rêveurs du Nouveau Monde', en: 'Armand ou Les Rêveurs du Nouveau Monde' },
};

const COPY = {
  fr: {
    subject: (ref: string) => `Confirmation de votre commande ${ref} — Picaron`,
    hello: 'Bonjour',
    thanks: 'Merci pour votre commande ! Votre paiement a bien été reçu.',
    order: 'Commande',
    shipping: 'Livraison',
    total: 'Total',
    relay: 'Livraison en point relais Mondial Relay',
    colissimo: 'Livraison à domicile Colissimo',
    delivery: 'Livraison en France, prévue sous 15 jours indicatifs. Vous recevrez un email avec le suivi de livraison.',
    questions: 'Des questions ? Répondez simplement à cet email ou écrivez-nous à contact@picaron.fr.',
    viewOrder: 'Voir ma commande',
  },
  en: {
    subject: (ref: string) => `Your order ${ref} is confirmed — Picaron`,
    hello: 'Hello',
    thanks: 'Thank you for your order! Your payment has been received.',
    order: 'Order',
    shipping: 'Shipping',
    total: 'Total',
    relay: 'Delivery to a Mondial Relay pickup point',
    colissimo: 'Home delivery by Colissimo',
    delivery: 'Delivery in France, expected within 15 days (indicative). You will receive an email with delivery tracking.',
    questions: 'Questions? Just reply to this email or write to contact@picaron.fr.',
    viewOrder: 'View my order',
  },
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);

export interface EmailMessage {
  to: string;
  /** Where a reply goes (internal notifications: the customer). */
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
}

export function buildOrderConfirmationEmail(order: OrderRow, siteUrl: string): EmailMessage {
  const lang = order.langue === 'en' ? 'en' : 'fr';
  const copy = COPY[lang];
  const reference = formatOrderReference(order.id);
  const price = (cents: number) => formatPriceCents(cents, lang);

  const lines = [
    ...order.lignes_produits.map(
      (line) => `${PRODUCT_NAMES[line.produit]?.[lang] ?? line.produit} × ${line.quantite} — ${price(line.quantite * line.prix_unitaire_centimes)}`
    ),
    `${copy.shipping} — ${price(shippingCents(order))}`,
  ];
  const shipping =
    order.mode_livraison === 'mondial_relay'
      ? [copy.relay, `${order.point_relais_nom} — ${order.point_relais_adresse}, ${order.point_relais_code_postal} ${order.point_relais_ville}`]
      : [
          copy.colissimo,
          `${order.livraison_nom} — ${[order.livraison_ligne1, order.livraison_ligne2].filter(Boolean).join(', ')}, ${order.livraison_code_postal} ${order.livraison_ville}`,
        ];
  const orderUrl = `${siteUrl}/${lang}/commande/succes?order=${order.public_id}`;

  const text = [
    `${copy.hello} ${order.adresse_nom},`,
    '',
    copy.thanks,
    '',
    `${copy.order} ${reference}`,
    ...lines.map((line) => `- ${line}`),
    `${copy.total} : ${price(totalCents(order))}`,
    '',
    ...shipping,
    copy.delivery,
    '',
    `${copy.viewOrder} : ${orderUrl}`,
    '',
    copy.questions,
  ].join('\n');

  const html = `<!doctype html>
<html lang="${lang}"><body style="font-family: Georgia, serif; color: #2b1d0e; max-width: 560px; margin: 0 auto;">
  <h1 style="color: #8b1a1a;">${escapeHtml(copy.order)} ${reference}</h1>
  <p>${escapeHtml(copy.hello)} ${escapeHtml(order.adresse_nom)},</p>
  <p>${escapeHtml(copy.thanks)}</p>
  <ul>${lines.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>
  <p><strong>${escapeHtml(copy.total)} : ${escapeHtml(price(totalCents(order)))}</strong></p>
  <p><strong>${escapeHtml(shipping[0])}</strong><br>${escapeHtml(shipping[1])}</p>
  <p>${escapeHtml(copy.delivery)}</p>
  <p><a href="${escapeHtml(orderUrl)}" style="color: #8b1a1a;">${escapeHtml(copy.viewOrder)}</a></p>
  <p style="font-size: 13px;">${escapeHtml(copy.questions)}</p>
</body></html>`;

  return { to: order.email_client, subject: copy.subject(reference), text, html };
}

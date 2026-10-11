// Task 7 — the single place where an order becomes 'paid' or 'failed'.
// Called by the Stripe webhook (after signature verification) and, offline,
// by the mock payment endpoint with a Stripe-shaped event.
//
// Guarantees:
// - idempotent: each event id is recorded in evenements_paiement; a replayed
//   event changes nothing and sends no second email
// - status machine: pending -> paid | failed, failed -> paid (retry after a
//   decline); paid/shipped/cancelled are never downgraded
// - unknown payment intent: logged, no crash
// - confirmation email sent at most once (email_confirmation_envoye_le); if
//   sending fails the claim is released and emailError is returned, so the
//   webhook answers 500 and Stripe's redelivery retries the email.

import type pg from 'pg';
import { withTransaction } from '../db';
import { buildOrderConfirmationEmail } from '../email/order-confirmation';
import { buildTeamNotificationEmail, type TeamNotificationKind } from '../email/order-notification';
import type { SendEmail } from '../email/mailer';
import type { OrderRow } from '../orders/get-order';
import type { PaymentEvent } from './provider';

export interface PaymentEventDeps {
  pool: pg.Pool;
  sendEmail: SendEmail;
  siteUrl: string;
  /** Customer confirmation on payment. Default true; see emailRouting() in config.ts. */
  customerConfirmation?: boolean;
  /**
   * Internal notification for every paid AND failed payment. Absent = none.
   * The paid one is sent with the confirmation (same at-most-once claim); the
   * failed one is best-effort (a lost one never fails the webhook).
   */
  teamNotification?: { to: string; appEnv: string };
  log?: Pick<Console, 'info' | 'warn' | 'error'>;
}

export type PaymentEventOutcome =
  | 'updated'
  | 'no_transition'
  | 'duplicate'
  | 'unknown_order'
  | 'ignored';

export interface PaymentEventResult {
  outcome: PaymentEventOutcome;
  orderId: number | null;
  status: OrderRow['statut'] | null;
  emailSent: boolean;
  emailError: Error | null;
}

export async function handlePaymentEvent(deps: PaymentEventDeps, event: PaymentEvent): Promise<PaymentEventResult> {
  const log = deps.log ?? console;
  const result: PaymentEventResult = { outcome: 'ignored', orderId: null, status: null, emailSent: false, emailError: null };

  if (event.type === 'other' || !event.paymentIntentId) {
    log.info(`[payment] event ${event.id} (${event.rawType}) ignored`);
    return result;
  }

  await withTransaction(deps.pool, async (client) => {
    const inserted = await client.query(
      `INSERT INTO evenements_paiement (event_id, type) VALUES ($1, $2)
       ON CONFLICT (event_id) DO NOTHING RETURNING event_id`,
      [event.id, event.rawType]
    );

    const orderResult = await client.query<Pick<OrderRow, 'id' | 'statut'>>(
      'SELECT id, statut FROM commandes WHERE stripe_payment_intent_id = $1 FOR UPDATE',
      [event.paymentIntentId]
    );
    const order = orderResult.rows[0];
    result.orderId = order?.id ?? null;
    result.status = order?.statut ?? null;

    if (inserted.rowCount === 0) {
      result.outcome = 'duplicate';
      log.info(`[payment] event ${event.id} already processed — ignored`);
      return;
    }
    if (!order) {
      result.outcome = 'unknown_order';
      log.warn(`[payment] event ${event.id}: no order for payment intent ${event.paymentIntentId}`);
      return;
    }

    await client.query('UPDATE evenements_paiement SET commande_id = $1 WHERE event_id = $2', [order.id, event.id]);

    const [newStatus, fromStatuses] =
      event.type === 'payment_intent.succeeded' ? ['paid', ['pending', 'failed']] : ['failed', ['pending']];
    const updated = await client.query<Pick<OrderRow, 'statut'>>(
      `UPDATE commandes SET statut = $1, date_mise_a_jour = now()
       WHERE id = $2 AND statut = ANY($3::varchar[]) RETURNING statut`,
      [newStatus, order.id, fromStatuses]
    );
    if (updated.rowCount === 1) {
      result.outcome = 'updated';
      result.status = updated.rows[0].statut;
      log.info(`[payment] order ${order.id}: ${order.statut} -> ${result.status} (${event.id}${event.failureCode ? `, ${event.failureCode}` : ''})`);
    } else {
      result.outcome = 'no_transition';
      log.info(`[payment] order ${order.id} stays ${order.statut} on ${event.rawType} (${event.id})`);
    }
  });

  // Also runs on a duplicate: that is how a Stripe redelivery retries an
  // email that failed the first time. The claim makes it send at most once.
  if (result.status === 'paid' && result.orderId !== null) {
    try {
      result.emailSent = await sendConfirmationOnce(deps, result.orderId);
    } catch (error) {
      result.emailError = error as Error;
      log.error(`[payment] order ${result.orderId}: confirmation email failed — ${(error as Error).message}`);
    }
  }

  // A new failure event (also a second decline on an already failed order):
  // tell the team. Not on a replay, and not for a late failure on a paid order.
  if (
    event.type === 'payment_intent.payment_failed' &&
    result.outcome !== 'duplicate' &&
    result.orderId !== null &&
    result.status !== 'paid' &&
    deps.teamNotification
  ) {
    try {
      const failed = await deps.pool.query<OrderRow>('SELECT * FROM commandes WHERE id = $1', [result.orderId]);
      if (failed.rows[0]) await notifyTeam(deps, failed.rows[0], 'failed', event.failureCode);
    } catch (error) {
      log.error(`[payment] order ${result.orderId}: failure notification not sent — ${(error as Error).message}`);
    }
  }

  return result;
}

function notifyTeam(deps: PaymentEventDeps, order: OrderRow, kind: TeamNotificationKind, failureCode?: string | null) {
  const { to, appEnv } = deps.teamNotification!;
  return deps.sendEmail(buildTeamNotificationEmail(order, kind, { to, appEnv, siteUrl: deps.siteUrl, failureCode }));
}

async function sendConfirmationOnce(deps: PaymentEventDeps, orderId: number): Promise<boolean> {
  const claimed = await deps.pool.query<OrderRow>(
    `UPDATE commandes SET email_confirmation_envoye_le = now()
     WHERE id = $1 AND email_confirmation_envoye_le IS NULL RETURNING *`,
    [orderId]
  );
  const order = claimed.rows[0];
  if (!order) return false;

  try {
    if (deps.customerConfirmation !== false) await deps.sendEmail(buildOrderConfirmationEmail(order, deps.siteUrl));
    if (deps.teamNotification) await notifyTeam(deps, order, 'paid');
    return true;
  } catch (error) {
    await deps.pool.query('UPDATE commandes SET email_confirmation_envoye_le = NULL WHERE id = $1', [orderId]);
    throw error;
  }
}

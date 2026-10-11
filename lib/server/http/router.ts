// Framework-agnostic HTTP layer for the order API. The same routing runs
// behind the Next.js catch-all route (app/api/[...path]/route.ts, local dev)
// and behind the Scaleway function (functions/api/handler.ts, staging/prod),
// so local tests exercise exactly what gets deployed.
//
//   POST /api/orders                          create-order (task 5)
//   GET  /api/orders/:publicId                order summary (success page)
//   POST /api/orders/:publicId/payment-intent payment intent (task 6)
//   POST /api/stripe-webhook                  Stripe webhook (task 7)
//   POST /api/mock-payment                    offline fake payment (mock only)
//   GET  /api/health                          environment check

import { SHIPPING_METHODS, type MockPaymentOutcome } from '../../checkout/order';
import { ConfigError, emailRouting, isMockPaymentEnabled } from '../config';
import { getServerContext, type ServerContext } from '../context';
import { createOrder, OrderValidationError } from '../orders/create-order';
import { findOrderByPublicId, toOrderSummary } from '../orders/get-order';
import {
  createPaymentIntentForOrder,
  OrderNotFoundError,
  OrderNotPayableError,
} from '../payments/create-payment-intent';
import { handlePaymentEvent, type PaymentEventDeps } from '../payments/handle-payment-event';
import { buildMockPaymentEvent, isMockPaymentIntentId } from '../payments/mock-provider';
import { WebhookSignatureError } from '../payments/provider';

export interface ApiRequest {
  method: string;
  path: string;
  headers: Record<string, string | undefined>;
  body: string;
}

export interface ApiResponse {
  status: number;
  headers: Record<string, string>;
  body: unknown;
}

const json = (status: number, body: unknown): ApiResponse => ({ status, headers: {}, body });
const error = (status: number, code: string, message: string, details?: unknown) =>
  json(status, { error: { code, message, ...(details ? { details } : {}) } });

const MOCK_OUTCOMES: MockPaymentOutcome[] = ['succeeded', 'declined', 'insufficient_funds'];

/** Same wiring for the Stripe webhook and the offline mock payment. */
function paymentEventDeps(ctx: ServerContext): PaymentEventDeps {
  const routing = emailRouting(ctx.config);
  return {
    pool: ctx.pool,
    sendEmail: ctx.sendEmail,
    siteUrl: ctx.config.siteUrl,
    customerConfirmation: routing.customerConfirmation,
    teamNotification: routing.teamTo ? { to: routing.teamTo, appEnv: ctx.config.appEnv } : undefined,
  };
}

function parseJson(body: string): unknown {
  try {
    return body ? JSON.parse(body) : {};
  } catch {
    return undefined;
  }
}

function corsHeaders(ctx: ServerContext | null, origin: string | undefined): Record<string, string> {
  if (!ctx || !origin || !ctx.config.allowedOrigins.includes(origin)) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };
}

/** Header lookup that ignores case (Scaleway and Next.js don't agree on it). */
function header(headers: ApiRequest['headers'], name: string): string | undefined {
  const lower = name.toLowerCase();
  const key = Object.keys(headers).find((candidate) => candidate.toLowerCase() === lower);
  return key ? headers[key] : undefined;
}

export async function route(
  request: ApiRequest,
  getContext: () => ServerContext = getServerContext
): Promise<ApiResponse> {
  let ctx: ServerContext | null = null;
  let response: ApiResponse;
  try {
    ctx = getContext();
    response = await dispatch(ctx, request);
  } catch (caught) {
    response = toErrorResponse(caught);
  }
  response.headers = { ...response.headers, ...corsHeaders(ctx, header(request.headers, 'origin')) };
  return response;
}

function toErrorResponse(caught: unknown): ApiResponse {
  if (caught instanceof OrderValidationError) {
    return error(400, 'invalid_order', 'Commande invalide', caught.details);
  }
  if (caught instanceof OrderNotFoundError) return error(404, 'order_not_found', caught.message);
  if (caught instanceof OrderNotPayableError) return error(409, 'order_not_payable', caught.message);
  if (caught instanceof WebhookSignatureError) return error(400, 'invalid_signature', caught.message);
  if (caught instanceof ConfigError) {
    console.error(`[api] ${caught.message}`);
    return error(500, 'server_misconfigured', 'Server misconfigured');
  }
  console.error('[api] unexpected error', caught);
  return error(500, 'internal_error', 'Internal error');
}

/** "/api/orders/x" and "/orders/x" (Scaleway function root) both give ["orders", "x"]. */
export function pathSegments(rawPath: string): string[] {
  const segments = rawPath.split('?')[0].split('/').filter(Boolean);
  return segments[0] === 'api' ? segments.slice(1) : segments;
}

async function dispatch(ctx: ServerContext, request: ApiRequest): Promise<ApiResponse> {
  const segments = pathSegments(request.path);
  const method = request.method.toUpperCase();

  if (method === 'OPTIONS') return json(204, null);

  if (segments[0] === 'health' && segments.length === 1 && method === 'GET') {
    return json(200, { appEnv: ctx.config.appEnv, paymentProvider: ctx.config.paymentProvider });
  }

  if (segments[0] === 'orders') {
    if (segments.length === 1 && method === 'POST') {
      const body = parseJson(request.body);
      if (body === undefined) return error(400, 'invalid_json', 'Invalid JSON body');
      const method = (body as { shippingMethod?: unknown } | null)?.shippingMethod;
      if (typeof method === 'string' && !(ctx.config.shippingMethods as string[]).includes(method)) {
        const allowed = ctx.config.shippingMethods;
        if ((SHIPPING_METHODS as readonly string[]).includes(method)) {
          return error(400, 'shipping_method_unavailable', 'Ce mode de livraison n\'est pas disponible', { allowed });
        }
      }
      const { publicId } = await createOrder(ctx.pool, body);
      return json(201, { publicId });
    }
    if (segments.length === 2 && method === 'GET') {
      const order = await findOrderByPublicId(ctx.pool, segments[1]);
      return order ? json(200, toOrderSummary(order)) : error(404, 'order_not_found', 'Commande introuvable');
    }
    if (segments.length === 3 && segments[2] === 'payment-intent' && method === 'POST') {
      return json(200, await createPaymentIntentForOrder(ctx.pool, ctx.payments, segments[1]));
    }
  }

  if (segments[0] === 'stripe-webhook' && segments.length === 1 && method === 'POST') {
    if (ctx.payments.name !== 'stripe') return error(404, 'not_found', 'Not found');
    const event = ctx.payments.parseWebhook(request.body, header(request.headers, 'stripe-signature') ?? null);
    const result = await handlePaymentEvent(paymentEventDeps(ctx), event);
    // 500 makes Stripe redeliver the event, which retries the email.
    if (result.emailError) return error(500, 'email_failed', 'Confirmation email failed');
    return json(200, { received: true, outcome: result.outcome });
  }

  if (segments[0] === 'mock-payment' && segments.length === 1 && method === 'POST') {
    if (!isMockPaymentEnabled(ctx.config)) return error(404, 'not_found', 'Not found');
    return mockPayment(ctx, parseJson(request.body));
  }

  return error(404, 'not_found', 'Not found');
}

/**
 * Offline stand-in for "card form + Stripe webhook": builds the event Stripe
 * would send and runs it through the real handlePaymentEvent(). Replaying a
 * previous event id (replayEventId) tests idempotency.
 */
async function mockPayment(ctx: ServerContext, body: unknown): Promise<ApiResponse> {
  const input = (body ?? {}) as { paymentIntentId?: unknown; outcome?: unknown; replayEventId?: unknown };
  if (typeof input.paymentIntentId !== 'string' || !isMockPaymentIntentId(input.paymentIntentId)) {
    return error(400, 'invalid_payment_intent', 'paymentIntentId must be a mock_pi_... id');
  }
  if (!MOCK_OUTCOMES.includes(input.outcome as MockPaymentOutcome)) {
    return error(400, 'invalid_outcome', `outcome must be one of ${MOCK_OUTCOMES.join(', ')}`);
  }
  const event = buildMockPaymentEvent(input.paymentIntentId, input.outcome as MockPaymentOutcome);
  if (typeof input.replayEventId === 'string' && input.replayEventId.startsWith('evt_mock_')) {
    event.id = input.replayEventId;
  }

  const result = await handlePaymentEvent(paymentEventDeps(ctx), event);
  if (result.outcome === 'unknown_order') {
    return error(404, 'order_not_found', 'No order for this payment intent');
  }

  const base = { eventId: event.id, outcome: result.outcome, orderStatus: result.status, emailSent: result.emailSent };
  // Same shape the front gets from Stripe.js: success, or a decline code.
  return event.type === 'payment_intent.succeeded'
    ? json(200, { status: 'succeeded', ...base })
    : json(200, { status: 'failed', declineCode: event.failureCode, ...base });
}

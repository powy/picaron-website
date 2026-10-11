// Front-end calls to the order API. Same origin locally (Next.js /api
// routes); the Scaleway function URL in staging/prod via
// NEXT_PUBLIC_API_BASE_URL.

import type {
  CreateOrderRequest,
  MockPaymentOutcome,
  OrderSummary,
  PaymentIntentResponse,
} from './order';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(response.status, body?.error?.code ?? 'unknown', body?.error?.message ?? response.statusText);
  }
  return body as T;
}

export function createOrder(payload: CreateOrderRequest) {
  return request<{ publicId: string }>('/api/orders', { method: 'POST', body: JSON.stringify(payload) });
}

export function getOrder(publicId: string) {
  return request<OrderSummary>(`/api/orders/${encodeURIComponent(publicId)}`);
}

export function createPaymentIntent(publicId: string) {
  return request<PaymentIntentResponse>(`/api/orders/${encodeURIComponent(publicId)}/payment-intent`, {
    method: 'POST',
  });
}

export function mockPay(paymentIntentId: string, outcome: MockPaymentOutcome) {
  return request<{ status: 'succeeded' } | { status: 'failed'; declineCode: string }>('/api/mock-payment', {
    method: 'POST',
    body: JSON.stringify({ paymentIntentId, outcome }),
  });
}

// Scaleway Serverless Function entry point (staging/prod). Thin adapter from
// the Scaleway HTTP event to the shared router — all logic lives in
// lib/server. Bundled by `npm run build:functions` into
// functions/dist/api/handler.js, deployed by infra/terraform/functions.tf.

import { route } from '../../lib/server/http/router';

interface ScalewayEvent {
  httpMethod: string;
  path: string;
  headers?: Record<string, string | undefined>;
  body?: string | null;
  isBase64Encoded?: boolean;
}

export async function handle(event: ScalewayEvent) {
  const rawBody = event.body ?? '';
  const result = await route({
    method: event.httpMethod,
    path: event.path,
    headers: event.headers ?? {},
    body: event.isBase64Encoded ? Buffer.from(rawBody, 'base64').toString('utf8') : rawBody,
  });
  return {
    statusCode: result.status,
    headers: { 'Content-Type': 'application/json', ...result.headers },
    body: result.status === 204 ? '' : JSON.stringify(result.body),
  };
}

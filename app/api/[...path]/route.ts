// Local/dev entry point for the order API: forwards everything under /api to
// the shared router (lib/server/http/router.ts), the same code the Scaleway
// function runs in staging/prod.

import { route } from '@/lib/server/http/router';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function handle(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const result = await route({
    method: request.method,
    path: url.pathname,
    headers: Object.fromEntries(request.headers.entries()),
    // Raw text on purpose: the Stripe signature is computed on the exact bytes.
    body: request.method === 'GET' ? '' : await request.text(),
  });
  if (result.status === 204) return new Response(null, { status: 204, headers: result.headers });
  return Response.json(result.body, { status: result.status, headers: result.headers });
}

export { handle as GET, handle as POST, handle as OPTIONS };

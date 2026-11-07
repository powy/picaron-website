// Local stand-in for what runs once deployed: the order API (the shared router,
// as on the Scaleway function) and, when given a folder, the static site with
// its _redirects and _headers (as on Cloudflare).
//
//   npm run dev   API only, on API_PORT (3001); next dev forwards /api to it
//   npm start     API and the built site in out/ (run npm run build first)
//
// The e2e tests use it too (playwright.config.ts).

import { existsSync, readFileSync, statSync } from 'node:fs';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { extname, join, resolve } from 'node:path';
import { route } from '../lib/server/http/router';

const PORT = Number(process.env.API_PORT ?? 3001);
const staticDir = process.argv[2] ? resolve(process.argv[2]) : null;

const CONTENT_TYPES: Record<string, string> = {
  '.avif': 'image/avif',
  '.css': 'text/css',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webm': 'video/webm',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function configLines(name: string): string[] {
  const path = staticDir ? join(staticDir, name) : '';
  if (!path || !existsSync(path)) return [];
  return readFileSync(path, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));
}

const redirects = configLines('_redirects').map((line) => {
  const [from, to, status] = line.split(/\s+/);
  return { from, to, status: Number(status) };
});

// Our _headers only has a /* block, so every "Name: value" line applies.
const siteHeaders = Object.fromEntries(
  configLines('_headers')
    .filter((line) => line.includes(': '))
    .map((line) => line.split(': ', 2))
);

function findRedirect(pathname: string) {
  for (const { from, to, status } of redirects) {
    if (from === pathname) return { to, status };
    if (from.endsWith('/*') && pathname.startsWith(from.slice(0, -1))) {
      return { to: to.replace(':splat', pathname.slice(from.length - 1)), status };
    }
  }
  return null;
}

function findFile(root: string, pathname: string): string | null {
  const base = join(root, decodeURIComponent(pathname));
  if (!base.startsWith(root)) return null;
  const candidates = [base, `${base}.html`, join(base, 'index.html')];
  return candidates.find((file) => existsSync(file) && statSync(file).isFile()) ?? null;
}

function serveStatic(root: string, request: IncomingMessage, response: ServerResponse) {
  const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
  const redirect = findRedirect(pathname);
  if (redirect) {
    response.writeHead(redirect.status, { Location: redirect.to, ...siteHeaders });
    response.end();
    return;
  }
  const file = findFile(root, pathname);
  const notFoundPage = join(root, '404.html');
  const served = file ?? (existsSync(notFoundPage) ? notFoundPage : null);
  if (!served) {
    response.writeHead(404, siteHeaders);
    response.end();
    return;
  }
  response.writeHead(file ? 200 : 404, {
    'Content-Type': CONTENT_TYPES[extname(served)] ?? 'application/octet-stream',
    ...siteHeaders,
  });
  response.end(readFileSync(served));
}

async function readBody(request: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(chunk as Buffer);
  // Raw text on purpose: the Stripe signature is computed on the exact bytes.
  return Buffer.concat(chunks).toString('utf8');
}

async function serveApi(request: IncomingMessage, response: ServerResponse) {
  const result = await route({
    method: request.method ?? 'GET',
    path: request.url ?? '/',
    headers: request.headers as Record<string, string | undefined>,
    body: request.method === 'GET' ? '' : await readBody(request),
  });
  response.writeHead(result.status, { 'Content-Type': 'application/json', ...result.headers });
  response.end(result.status === 204 ? undefined : JSON.stringify(result.body));
}

createServer((request, response) => {
  if (request.url?.startsWith('/api/')) {
    serveApi(request, response).catch((caught) => {
      console.error('[local-server]', caught);
      response.writeHead(500);
      response.end();
    });
  } else if (staticDir) {
    serveStatic(staticDir, request, response);
  } else {
    response.writeHead(404);
    response.end();
  }
}).listen(PORT, () => {
  console.log(`[local-server] http://localhost:${PORT}${staticDir ? ` (site: ${staticDir})` : ' (API only)'}`);
});

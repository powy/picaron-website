import createNextIntlPlugin from 'next-intl/plugin';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: __dirname,
  },
};

// `next dev` stands in for what Cloudflare (public/_redirects) and the order
// API (scripts/local-server.ts) do once the site is deployed.
/** @type {import('next').NextConfig} */
const devConfig = {
  ...nextConfig,
  async redirects() {
    return [{ source: '/', destination: '/fr/boucaniers/presentation', permanent: false }];
  },
  async rewrites() {
    const apiPort = process.env.API_PORT ?? '3001';
    return [{ source: '/api/:path*', destination: `http://localhost:${apiPort}/api/:path*` }];
  },
};

// The site is a static export: `next build` writes it to out/.
export default function config(phase) {
  return withNextIntl(phase === PHASE_DEVELOPMENT_SERVER ? devConfig : { ...nextConfig, output: 'export' });
}

import type { MetadataRoute } from 'next'

// Only production may be indexed. Local and staging (staging.picaron.fr) are
// blocked; next.config.mjs also sends X-Robots-Tag: noindex for those.
export default function robots(): MetadataRoute.Robots {
  if (process.env.NEXT_PUBLIC_APP_ENV !== 'production') {
    return { rules: { userAgent: '*', disallow: '/' } }
  }
  return { rules: { userAgent: '*', allow: '/' } }
}

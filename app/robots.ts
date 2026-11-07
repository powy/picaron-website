import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

// Only production may be indexed. Local and staging (staging.picaron.fr) are
// blocked; scripts/finish-static-build.mjs also sends X-Robots-Tag: noindex.
export default function robots(): MetadataRoute.Robots {
  if (process.env.NEXT_PUBLIC_APP_ENV !== 'production') {
    return { rules: { userAgent: '*', disallow: '/' } }
  }
  return { rules: { userAgent: '*', allow: '/' } }
}

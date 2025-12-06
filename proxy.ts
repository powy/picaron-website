import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'

const intlMiddleware = createMiddleware({
  locales: ['fr', 'en'],
  defaultLocale: 'fr'
})

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect root to /boucaniers (preserving locale)
  if (pathname === '/' || pathname === '/fr' || pathname === '/en') {
    const locale = pathname === '/en' ? 'en' : 'fr'
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/boucaniers`
    return NextResponse.redirect(url, 301)
  }

  // Continue with i18n middleware for other routes
  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}

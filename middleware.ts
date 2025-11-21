import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'

const intlMiddleware = createMiddleware({
  locales: ['fr', 'en'],
  defaultLocale: 'fr'
})

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect /boucaniers to home page (preserving locale)
  if (pathname === '/boucaniers' || pathname === '/fr/boucaniers' || pathname === '/en/boucaniers') {
    const locale = pathname.startsWith('/en') ? 'en' : 'fr'
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}`
    return NextResponse.redirect(url, 301)
  }

  // Continue with i18n middleware for other routes
  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
import '../globals.css'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import TestModeBanner from '@/components/TestModeBanner'
import CartProvider from '@/lib/cart-context'
import { locales, type Locale } from '@/i18n'
import { garamondFont, granjonFont } from '../fonts'

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}

// This is the root layout (there is no app/layout.tsx): <html> lives here so
// that its lang attribute follows the locale.

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()
  
  const messages = (await import(`@/messages/${locale}.json`)).default

  return (
    <html lang={locale} className={`${garamondFont.variable} ${granjonFont.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="min-h-screen relative">
            {/* Background texture - Fond-infini */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'url(/backgrounds/Fond-infini.jpg)',
                backgroundRepeat: 'repeat-y',
                backgroundSize: '100% auto',
                backgroundPosition: 'top center',
                zIndex: 0,
              }}
            />

            <div className="relative z-10 flex flex-col min-h-screen">
              <CartProvider>
                <Navigation />
                <main className="w-full mx-auto pt-12 lg:pt-14 flex-grow">
                  {children}
                </main>
              </CartProvider>
              <Footer locale={locale} />
              <TestModeBanner />
            </div>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { locales } from '@/i18n'

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as any)) notFound()
  
  const messages = (await import(`@/messages/${locale}.json`)).default

  return (
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
          <Navigation />
          <main className="w-full mx-auto pt-12 lg:pt-14 flex-grow">
            {children}
          </main>
          <Footer locale={locale} />
        </div>
      </div>
    </NextIntlClientProvider>
  )
}
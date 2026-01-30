import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { locales } from '@/i18n'
import { Metadata } from 'next'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  return {
    title: {
      template: 'Picaron - %s',
      default: 'Picaron'
    },
    description: locale === 'fr'
      ? 'Boucaniers - Jeu de société de stratégie et de pirates'
      : 'Boucaniers - Pirate strategy board game',
  }
}

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
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: 'url(/background-lumineux.webp)',
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
          }}
        />
        
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navigation />
          <main className="container mx-auto px-4 pt-14 lg:pt-16 flex-grow">
            {children}
          </main>
          <Footer locale={locale} />
        </div>
      </div>
    </NextIntlClientProvider>
  )
}
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import ProductJsonLd from './ProductJsonLd'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return {
    title: t('boutique.title'),
    description: t('boutique.description')
  }
}

export default async function BoutiqueLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <>
      <ProductJsonLd locale={locale} />
      {children}
    </>
  )
}

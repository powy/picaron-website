import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

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

export default function BoutiqueLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

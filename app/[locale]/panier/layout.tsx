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
    title: t('panier.title'),
    description: t('panier.description')
  }
}

export default function PanierLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

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
    title: t('commandePaiement.title'),
    description: t('commandePaiement.description')
  }
}

export default function CommandePaiementLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

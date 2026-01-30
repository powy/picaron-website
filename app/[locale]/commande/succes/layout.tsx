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
    title: t('commandeSucces.title'),
    description: t('commandeSucces.description')
  }
}

export default function CommandeSuccesLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

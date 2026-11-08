import { use } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

// The site's 404 page: scripts/finish-static-build.mjs copies it to 404.html
// for each language. A regular page rather than not-found.tsx, which would not
// get the [locale] layout (navigation, footer, language).

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return {
    title: t('notFound.title'),
    description: t('notFound.description'),
    robots: { index: false }
  }
}

export default function NotFoundPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  setRequestLocale(locale)
  const t = useTranslations('notFound')

  return (
    <div className="mt-8">
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="title-page">{t('title')}</h1>
        <p className="text-lg text-ink mb-8">{t('text')}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href={`/${locale}/boucaniers/presentation`} className="btn-primary-rounded">
            {t('home')}
          </Link>
          <Link href={`/${locale}/boutique`} className="btn-primary-blue-rounded">
            {t('shop')}
          </Link>
        </div>
      </div>
    </div>
  )
}

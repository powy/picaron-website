'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

export default function FAQRedirect() {
  const router = useRouter()
  const locale = useLocale()

  useEffect(() => {
    // Redirect after 2 seconds
    const timer = setTimeout(() => {
      router.replace(`/${locale}/boucaniers/faq`)
    }, 2000)

    return () => clearTimeout(timer)
  }, [router, locale])

  return (
    <div className="mt-8">
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="title-page">FAQ</h1>
        <div className="mt-8 p-6 bg-sand/10 rounded-lg border border-gold">
          <p className="text-ink text-lg mb-4">
            {locale === 'fr'
              ? 'La FAQ a été déplacée vers la section Boucaniers.'
              : 'The FAQ has been moved to the Boucaniers section.'}
          </p>
          <p className="text-ink/70">
            {locale === 'fr'
              ? 'Redirection automatique en cours...'
              : 'Redirecting automatically...'}
          </p>
        </div>
      </div>
    </div>
  )
}

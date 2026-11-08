import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function Footer({ locale = 'fr' }: { locale?: string }) {
  const t = useTranslations('footer')
  // Set at build time, like the rest of the static site.
  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 py-6 text-center text-sm text-gray-600 font-normal">
      <div className="container mx-auto px-4">
        <p className="mb-2">{t('copyright', { year: String(year) })}</p>
        <p>
          <Link href={`/${locale}/mentions-legales`} className="link-pirate-transition">
            {t('legal')}
          </Link>
          {' | '}
          <Link href={`/${locale}/cgv`} className="link-pirate-transition">
            {t('terms')}
          </Link>
          {' | '}
          <Link href={`/${locale}/politique-confidentialite`} className="link-pirate-transition">
            {t('privacy')}
          </Link>
          {' | '}
          <Link href={`/${locale}/cookies`} className="link-pirate-transition">
            {t('cookies')}
          </Link>
        </p>
      </div>
    </footer>
  )
}

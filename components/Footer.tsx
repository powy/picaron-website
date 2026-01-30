import Link from 'next/link'

export default function Footer({ locale = 'fr' }: { locale?: string }) {
  return (
    <footer className="mt-16 py-6 text-center text-sm text-gray-600 font-normal">
      <div className="container mx-auto px-4">
        <p className="mb-2">© 2025 Picaron. Tous droits réservés.</p>
        <p>
          <Link href={`/${locale}/mentions-legales`} className="link-pirate-transition">
            Mentions légales
          </Link>
          {' | '}
          <Link href={`/${locale}/cgv`} className="link-pirate-transition">
            CGV
          </Link>
          {' | '}
          <Link href={`/${locale}/politique-confidentialite`} className="link-pirate-transition">
            Politique de confidentialité
          </Link>
          {' | '}
          <Link href={`/${locale}/cookies`} className="link-pirate-transition">
            Cookies
          </Link>
        </p>
      </div>
    </footer>
  )
}

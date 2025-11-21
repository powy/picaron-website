import Link from 'next/link'

export default function Footer({ locale = 'fr' }: { locale?: string }) {
  return (
    <footer className="mt-16 py-6 text-center text-sm text-gray-600">
      <div className="container mx-auto px-4">
        <p className="mb-2">© 2025 Picaron. Tous droits réservés.</p>
        <p>
          <Link href={`/${locale}/mentions-legales`} className="hover:text-[#8b2020] transition-colors">
            Mentions légales
          </Link>
          {' | '}
          <Link href={`/${locale}/cgv`} className="hover:text-[#8b2020] transition-colors">
            CGV
          </Link>
          {' | '}
          <Link href={`/${locale}/politique-confidentialite`} className="hover:text-[#8b2020] transition-colors">
            Politique de confidentialité
          </Link>
          {' | '}
          <Link href={`/${locale}/cookies`} className="hover:text-[#8b2020] transition-colors">
            Cookies
          </Link>
        </p>
      </div>
    </footer>
  )
}

'use client'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Navigation() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: '/', label: t('game') },
    { href: '/equipe', label: 'PicaRon' },
    { href: '/faq', label: t('faq') },
    { href: '/boutique', label: t('shop') },
    { href: '/contact', label: t('contact') }
  ]

  return (
    <nav className="fixed top-0 w-full z-50 bg-mahogany font-normal">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-12 lg:h-14">
          <Link href="/" className="flex items-center h-12 lg:h-14 leading-none">
            <Image
              src="/assets/LogoPICARONJ1Pour_Fond_Sombre3.png"
              alt="Picaron"
              width={90}
              height={90}
              className="h-12 w-auto lg:h-14 object-contain leading-none block align-top"
              priority
            />
          </Link>

          <div className="hidden lg:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className="text-sand font-caravagesque font-normal menu-item"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <button
            className="lg:hidden text-sand"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-sand bg-mahogany">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className="block text-sand font-caravagesque font-normal mobile-menu-item"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
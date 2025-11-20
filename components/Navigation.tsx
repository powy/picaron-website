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
    { href: '/equipe', label: 'Picaron' },
    { href: '/boutique', label: t('shop') },
    { href: '/contact', label: t('contact') }
  ]

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#842c0d]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-32 py-2">
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/LogoPICARONJ1Pour_Fond_Sombre2.png"
              alt="Picaron"
              width={180}
              height={90}
              priority
            />
          </Link>

          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className="text-[#ffdaa6] font-granjon menu-item"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t bg-[#f2e8d5]/90">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className="block text-[#ffdaa6] font-granjon mobile-menu-item"
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
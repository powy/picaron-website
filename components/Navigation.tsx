'use client'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from '@/lib/cart-context'

type NavItem = {
  href: string
  label: string
  children?: NavItem[]
}

const ChevronIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="12"
    height="8"
    viewBox="0 0 12 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 1.5L6 6.5L11 1.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const ShoppingBagIcon = ({ isActive }: { isActive: boolean }) => (
  <Image
    src={isActive ? '/assets/Shopping_panier_blanc.webp' : '/assets/Shopping_panier.webp'}
    alt=""
    width={32}
    height={32}
    className="inline-block mr-2 relative top-1"
  />
)

// Number of items in the cart, shown on the "Boutique" link (the cart itself
// is previewed on the shop page — there is no separate cart icon in the menu).
// Sits right after the label, vertically centered (the menu links are heavily
// padded, so an absolutely positioned badge would end up clipped).
const CartCountBadge = ({ count }: { count: number }) =>
  count > 0 ? (
    <span
      aria-hidden="true"
      data-testid="nav-cart-badge"
      className="cart-badge static ml-2 self-center text-sm min-w-[1.4rem] h-[1.4rem]"
    >
      {count}
    </span>
  ) : null

export default function Navigation() {
  const t = useTranslations('nav')
  const tCart = useTranslations('cart')
  const locale = useLocale()
  const pathname = usePathname()
  const { itemCount } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null) // desktop
  const [mobileAccordionOpen, setMobileAccordionOpen] = useState<string | null>(null) // mobile

  const shopAriaLabel = (item: NavItem) =>
    item.href === '/boutique' && itemCount > 0
      ? tCart('preview.navBadgeAria', { label: item.label, count: itemCount })
      : undefined

  const navItems: NavItem[] = [
    {
      href: '/boucaniers',
      label: t('boucaniers'),
      children: [
        { href: '/boucaniers/presentation', label: t('boucaniersSubmenu.presentation') },
        { href: '/boucaniers/comment-jouer', label: t('boucaniersSubmenu.howToPlay') },
        { href: '/boucaniers/medias', label: t('boucaniersSubmenu.medias') },
        { href: '/boucaniers/faq', label: t('boucaniersSubmenu.faq') }
      ]
    },
    { href: '/equipe', label: 'PicaRon' },
    { href: '/boutique', label: t('shop') },
    { href: '/contact', label: t('contact') }
  ]

  // Helper function to determine if a link is active
  const isLinkActive = (
    itemHref: string,
    currentPathname: string,
    hasChildren: boolean = false
  ): boolean => {
    // Remove locale prefix (e.g., '/fr' or '/en')
    const pathWithoutLocale = currentPathname.replace(/^\/(fr|en)/, '') || '/'

    // Root path edge case
    if (itemHref === '/' && pathWithoutLocale === '/') {
      return true
    }

    // For parent items with children, use "starts with" matching
    if (hasChildren) {
      return pathWithoutLocale.startsWith(itemHref)
    }

    // For leaf items, use exact matching
    return pathWithoutLocale === itemHref
  }

  return (
    <nav className="fixed top-0 w-full z-50 nav-bg font-normal shadow-nav">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-12 lg:h-14">
          <Link href="/" className="flex items-center h-12 lg:h-14 leading-none">
            <Image
              src="/assets/LogoPICARONJ1Pour_Fond_Sombre3.webp"
              alt="Picaron"
              width={90}
              height={90}
              className="h-12 w-auto lg:h-14 object-contain leading-none block align-top"
              priority
            />
          </Link>

          <div className="hidden lg:flex space-x-6">
            {navItems.map((item) => (
              item.children ? (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(item.label)}
                  onMouseLeave={() => setDropdownOpen(null)}
                >
                  <Link
                    href={`/${locale}${item.href}`}
                    className={`font-caravagesque font-normal menu-item inline-flex items-center ${
                      isLinkActive(item.href, pathname, true) ? 'text-white' : 'text-sand'
                    }`}
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen === item.label}
                  >
                    {item.label}
                    <ChevronIcon
                      className={`nav-chevron ${dropdownOpen === item.label ? 'nav-chevron-open' : ''}`}
                    />
                  </Link>

                  {dropdownOpen === item.label && (
                    <div className="dropdown-panel" role="menu">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={`/${locale}${child.href}`}
                          className={`dropdown-link ${
                            isLinkActive(child.href, pathname) ? 'text-white' : ''
                          }`}
                          role="menuitem"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={`/${locale}${item.href}`}
                  className={`font-caravagesque font-normal menu-item inline-flex items-baseline ${
                    isLinkActive(item.href, pathname) ? 'text-white' : 'text-sand'
                  }`}
                  aria-label={shopAriaLabel(item)}
                >
                  {item.href === '/boutique' && <ShoppingBagIcon isActive={isLinkActive(item.href, pathname)} />}
                  {item.label}
                  {item.href === '/boutique' && <CartCountBadge count={itemCount} />}
                </Link>
              )
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
          <div className="lg:hidden py-4 border-t border-sand nav-bg">
            {navItems.map((item) => (
              item.children ? (
                <div key={item.href} className="border-b border-sand/20">
                  <button
                    onClick={() => setMobileAccordionOpen(
                      mobileAccordionOpen === item.label ? null : item.label
                    )}
                    className={`mobile-accordion-header ${
                      isLinkActive(item.href, pathname, true) ? 'text-white' : ''
                    }`}
                    aria-expanded={mobileAccordionOpen === item.label}
                  >
                    <span>{item.label}</span>
                    <ChevronIcon
                      className={`nav-chevron ${
                        mobileAccordionOpen === item.label ? 'nav-chevron-open' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {mobileAccordionOpen === item.label && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={`/${locale}${child.href}`}
                            className={`mobile-accordion-link ${
                              isLinkActive(child.href, pathname) ? 'text-white' : ''
                            }`}
                            onClick={() => {
                              setMobileMenuOpen(false)
                              setMobileAccordionOpen(null)
                            }}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={`/${locale}${item.href}`}
                  className={`flex items-baseline font-caravagesque font-normal mobile-menu-item ${
                    isLinkActive(item.href, pathname) ? 'text-white' : 'text-sand'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label={shopAriaLabel(item)}
                >
                  {item.href === '/boutique' && <ShoppingBagIcon isActive={isLinkActive(item.href, pathname)} />}
                  {item.label}
                  {item.href === '/boutique' && <CartCountBadge count={itemCount} />}
                </Link>
              )
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
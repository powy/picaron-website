'use client';

import {useState} from 'react';
import {useTranslations, useLocale} from 'next-intl';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

const Navigation = () => {
  const t = useTranslations('navigation');
  const locale = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: `/${locale}`, label: t('home'), key: 'home' },
    { href: `/${locale}/boucaniers`, label: t('boucaniers'), key: 'boucaniers' },
    { href: `/${locale}/team`, label: t('team'), key: 'team' },
    { href: `/${locale}/contact`, label: t('contact'), key: 'contact' },
    { href: `/${locale}/shop`, label: t('shop'), key: 'shop' }
  ];

  const toggleLanguage = () => {
    const newLocale = locale === 'fr' ? 'en' : 'fr';
    const currentPath = pathname.replace(`/${locale}`, '');
    window.location.href = `/${newLocale}${currentPath}`;
  };

  return (
    <>
      {/* Desktop Navigation - Compass Rose */}
      <nav className="fixed top-4 right-4 z-50 hidden md:block">
        <div className="relative">
          {/* Compass Background */}
          <div 
            className={`w-32 h-32 rounded-full border-4 border-treasure-gold bg-deep-navy bg-opacity-90 backdrop-blur-md transition-transform duration-500 ${
              isOpen ? 'rotate-90 scale-110' : 'rotate-0 scale-100'
            }`}
            style={{
              background: `
                radial-gradient(circle at center, rgba(26, 35, 50, 0.9) 0%, rgba(26, 35, 50, 0.7) 100%),
                conic-gradient(from 0deg, var(--treasure-gold) 0deg, transparent 10deg, transparent 350deg, var(--treasure-gold) 360deg)
              `,
              boxShadow: '0 0 30px rgba(212, 165, 116, 0.4), inset 0 0 20px rgba(0, 0, 0, 0.5)'
            }}
          >
            {/* Center Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-pirate-red border-2 border-treasure-gold text-bone-white font-bold text-sm hover:scale-110 transition-transform duration-300"
              style={{
                background: 'radial-gradient(circle, var(--pirate-red) 0%, #661717 100%)',
                boxShadow: '0 0 15px rgba(139, 32, 32, 0.6)'
              }}
            >
              ⚓
            </button>

            {/* Navigation Links - Positioned around compass */}
            {isOpen && (
              <div className="absolute inset-0">
                {links.map((link, index) => {
                  const angle = (index * 72) - 90; // 360deg / 5 links = 72deg each, starting at top
                  const radian = (angle * Math.PI) / 180;
                  const radius = 45;
                  const x = Math.cos(radian) * radius;
                  const y = Math.sin(radian) * radius;
                  const isActive = pathname === link.href || (link.href !== `/${locale}` && pathname.startsWith(link.href));

                  return (
                    <Link
                      key={link.key}
                      href={link.href as any}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 hover:scale-125 ${
                        isActive 
                          ? 'bg-treasure-gold text-weathered-wood shadow-treasure' 
                          : 'bg-verdigris-copper text-bone-white hover:bg-treasure-gold hover:text-weathered-wood'
                      }`}
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        boxShadow: isActive ? '0 0 15px rgba(212, 165, 116, 0.6)' : '0 0 10px rgba(78, 124, 123, 0.4)'
                      }}
                      title={link.label}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.key === 'home' && '🏠'}
                      {link.key === 'boucaniers' && '⚔️'}
                      {link.key === 'team' && '👥'}
                      {link.key === 'contact' && '📧'}
                      {link.key === 'shop' && '🛒'}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full bg-sea-mist-green border-2 border-verdigris-copper text-bone-white text-sm font-bold hover:bg-verdigris-copper transition-colors duration-300"
            style={{
              background: 'linear-gradient(135deg, var(--sea-mist-green) 0%, var(--verdigris-copper) 100%)',
              boxShadow: '0 0 10px rgba(30, 58, 58, 0.4)'
            }}
          >
            {locale.toUpperCase()}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-deep-navy bg-opacity-95 backdrop-blur-md border-b-2 border-treasure-gold">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link href={`/${locale}`} className="text-treasure-gold font-display text-xl">
                PICARON
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full bg-pirate-red border-2 border-treasure-gold text-bone-white font-bold hover:scale-110 transition-transform duration-300"
              >
                {isOpen ? '✕' : '☰'}
              </button>
            </div>

            {/* Mobile Menu Links */}
            {isOpen && (
              <div className="pb-4">
                {links.map((link) => {
                  const isActive = pathname === link.href || (link.href !== `/${locale}` && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.key}
                      href={link.href as any}
                      className={`block py-2 px-4 rounded-lg mb-2 transition-colors duration-300 ${
                        isActive 
                          ? 'bg-treasure-gold text-weathered-wood' 
                          : 'text-bone-white hover:bg-verdigris-copper'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                
                {/* Mobile Language Toggle */}
                <button
                  onClick={toggleLanguage}
                  className="w-full mt-4 py-2 px-4 rounded-lg bg-sea-mist-green border-2 border-verdigris-copper text-bone-white font-bold hover:bg-verdigris-copper transition-colors duration-300"
                >
                  {locale === 'fr' ? 'English' : 'Français'}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer for mobile nav */}
      <div className="h-16 md:h-0"></div>
    </>
  );
};

export default Navigation;
'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

// Delivery is mainland France only: elsewhere, customers contact us. Shown on
// the shop, cart, address and payment pages (and stated in the CGV).
export default function FranceOnlyNotice({ className = '' }: { className?: string }) {
  const t = useTranslations('franceOnly');
  const locale = useParams().locale as string;
  return (
    <p className={`text-sm text-ink ${className}`} data-testid="france-only-notice">
      {t.rich('text', {
        link: (chunks) => (
          <Link href={`/${locale}/contact`} className="link-pirate">
            {chunks}
          </Link>
        ),
      })}
    </p>
  );
}

'use client';

import { useTranslations } from 'next-intl';

// Inlined at build time: shown on local and staging builds, never in
// production (nor on a build that doesn't set NEXT_PUBLIC_APP_ENV at all).
const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

export default function TestModeBanner() {
  const t = useTranslations('testBanner');
  if (APP_ENV !== 'local' && APP_ENV !== 'staging') return null;

  return (
    <div
      role="status"
      className="fixed top-14 right-2 z-40 rounded-sm bg-yellow-300 px-3 py-1 text-xs font-semibold text-black shadow-sm"
    >
      {t('text', { env: APP_ENV })}
    </div>
  );
}

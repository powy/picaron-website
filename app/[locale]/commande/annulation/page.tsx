'use client';

// Reached with "Abandonner le paiement" on the payment page. The order stays
// 'pending' (the payment intent could still be completed), so the customer
// can resume it; nothing has been charged.

import { Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function CancelPage() {
  return (
    <Suspense>
      <CancelContent />
    </Suspense>
  );
}

function CancelContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale as string;
  const publicId = searchParams.get('order');
  const t = useTranslations('cancel');

  return (
    <div className="mt-8">
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h1 className="title-page">{t('title')}</h1>

          <p className="text-xl text-ink mb-6">{t('message')}</p>

          <div className="bg-parchment/30 rounded-lg p-6 mb-6">
            <p className="text-ink mb-3">{t('encouragement')}</p>
            <p className="text-sm text-gray-600 italic">{t('tip')}</p>
          </div>

          <div className="space-y-4">
            {publicId && (
              <div>
                <Link
                  href={`/${locale}/commande/paiement?order=${publicId}`}
                  className="inline-block bg-pirate-red text-bone px-8 py-3 rounded-lg font-oldstyle text-lg hover:bg-pirate-red-hover transition-colors"
                >
                  {t('resumePayment')}
                </Link>
              </div>
            )}

            <Link
              href={`/${locale}/boutique`}
              className={
                publicId
                  ? 'text-pirate-red hover:underline font-oldstyle'
                  : 'inline-block bg-pirate-red text-bone px-8 py-3 rounded-lg font-oldstyle text-lg hover:bg-pirate-red-hover transition-colors'
              }
            >
              {t('backShop')}
            </Link>

            <div>
              <Link href={`/${locale}`} className="text-pirate-red hover:underline font-oldstyle">
                {t('backHome')}
              </Link>
            </div>

            <p className="text-sm text-ink pt-4">{t('needHelp', { email: 'contact@picaron.fr' })}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

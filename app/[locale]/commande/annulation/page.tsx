'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function CancelPage() {
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="mt-8">
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h1 className="title-page">Commande annulée</h1>

          <p className="text-xl text-ink mb-6">
            Votre commande a été annulée. Aucun montant n&apos;a été débité.
          </p>

          <div className="bg-parchment/30 rounded-lg p-6 mb-6">
            <p className="text-ink mb-3">
              Vous avez changé d&apos;avis ? Boucaniers vous attend toujours !
            </p>
            <p className="text-sm text-gray-600">
              💡 Astuce : L&apos;aventure pirate n&apos;attend que vous pour commencer
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href={`/${locale}/boutique`}
              className="inline-block bg-pirate-red text-bone px-8 py-3 rounded-lg font-oldstyle text-lg hover:bg-pirate-red-hover transition-colors"
            >
              Retourner à la boutique
            </Link>

            <div>
              <Link
                href={`/${locale}`}
                className="text-pirate-red hover:underline font-oldstyle"
              >
                Retour à l&apos;accueil
              </Link>
            </div>

            <p className="text-sm text-ink pt-4">
              Besoin d&apos;aide ? Contactez-nous à{' '}
              <a href="mailto:contact@picaron.fr" className="text-pirate-red hover:underline">
                contact@picaron.fr
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
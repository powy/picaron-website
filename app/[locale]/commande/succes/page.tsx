'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale as string;
  const sessionId = searchParams.get('session_id');

  return (
    <div className="mt-8">
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-4xl font-oldstyle text-[#8b2020] mb-4">Commande confirmée !</h1>

          <p className="text-xl text-[#0c0c0d] mb-6">
            Merci pour votre achat de Boucaniers !
          </p>

          <div className="bg-[#f2e8d5]/30 rounded-lg p-6 text-left mb-6">
            <h2 className="font-oldstyle font-semibold text-[#8b2020] mb-3">Prochaines étapes :</h2>
            <ul className="space-y-2 text-[#0c0c0d]">
              <li className="flex items-start gap-2">
                <span>✉️</span>
                <span>Vous allez recevoir un email de confirmation</span>
              </li>
              <li className="flex items-start gap-2">
                <span>📦</span>
                <span>Votre commande sera préparée dans les 48h</span>
              </li>
              <li className="flex items-start gap-2">
                <span>🚚</span>
                <span>Livraison prévue pour mi-décembre</span>
              </li>
              <li className="flex items-start gap-2">
                <span>📧</span>
                <span>Vous recevrez un email avec le suivi de livraison</span>
              </li>
            </ul>
          </div>

          {sessionId && (
            <p className="text-sm text-gray-500 mb-6">
              Référence de commande: {sessionId.slice(0, 8)}...
            </p>
          )}

          <div className="space-y-3">
            <Link
              href={`/${locale}`}
              className="inline-block bg-[#8b2020] text-[#faf8f3] px-8 py-3 rounded-lg font-oldstyle text-lg hover:bg-[#a02525] transition-colors"
            >
              Retour à l&apos;accueil
            </Link>

            <p className="text-sm text-[#0c0c0d] pt-4">
              Des questions ? Contactez-nous à{' '}
              <a href="mailto:contact@picaron.fr" className="text-[#8b2020] hover:underline">
                contact@picaron.fr
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
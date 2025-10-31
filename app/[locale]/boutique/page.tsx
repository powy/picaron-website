'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import NewsletterSection from '@/components/NewsletterSection';

export default function BoutiquePage() {
  const params = useParams();
  const locale = params.locale as string;

  // Calcul automatique de la date de livraison (mi-décembre)
  const getDeliveryDate = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const december15 = new Date(currentYear, 11, 15); // 15 décembre

    if (today > december15) {
      // Si on a dépassé le 15 décembre, livraison mi-décembre année suivante
      return new Date(currentYear + 1, 11, 15);
    }
    return december15;
  };

  const formatDeliveryDate = () => {
    const deliveryDate = getDeliveryDate();
    return deliveryDate.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const handleCheckout = () => {
    // Direct redirect to Stripe payment link
    window.location.href = 'https://buy.stripe.com/test_9B67sK38I5Zi5wp9xQ48000';
  };

  return (
    <div className="mt-8">
      <h1 className="text-5xl font-oldstyle text-[#0c0c0d] mb-8 text-center">
        Boutique
      </h1>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Galerie d'images */}
          <div className="space-y-4">
            <div className="aspect-square relative">
              <Image
                src="/assets/assets_old_web/Boite.png"
                alt="Jeu Boucaniers - Boîte du jeu"
                fill
                className="object-cover"
              />
            </div>
            {/* Image du matériel */}
            <div className="relative">
              <Image
                src="/MatérielTransparent.png"
                alt="Matériel Boucaniers"
                width={600}
                height={800}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Informations produit */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-oldstyle text-[#8b2020] mb-2">Boucaniers</h2>

              {/* Stock status */}
              <div className="mb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-base font-semibold bg-orange-100 text-orange-800">
                  Précommande
                </span>
              </div>

              <p className="text-2xl font-semibold text-[#0c0c0d] mb-4">69,00 € TTC</p>
              <p className="text-lg text-[#0c0c0d] mb-4">
                Jeu de stratégie en simultané. Pour 2 à 5 joueurs à partir de 10 ans et des parties de 30 à 60 minutes.
              </p>
            </div>

            <div className="prose max-w-none">
              <p className="text-[#0c0c0d] text-lg leading-relaxed">
                Embarquez dans une chasse au trésor en simultané ! Voguez dans un archipel changeant
                truffé de cannibales, de comptoirs corrompus et de mystères vaudous. Armez votre bateau,
                recrutez, pillez et commercez en prenant garde aux Compagnies des Indes.
                Le dénouement n&apos;est jamais certain et chaque tour donne le frisson !
              </p>
            </div>

            <div className="p-4">
              <h3 className="font-oldstyle font-semibold text-[#8b2020] text-xl mb-2">
                Informations de livraison
              </h3>
              <ul className="space-y-1 text-lg text-[#0c0c0d]">
                <li>Livraison uniquement en France métropolitaine</li>
                <li>Frais de port: Calculés lors de la commande</li>
                <li>Livraison prévue: {formatDeliveryDate()}</li>
                <li>International: Nous contacter directement</li>
              </ul>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleCheckout}
                className="w-full bg-[#8b2020] text-[#faf8f3] py-3 px-6 rounded-lg font-oldstyle text-lg hover:bg-[#a02525] transition-colors"
              >
                Précommander maintenant
              </button>

              <p className="text-sm text-gray-500 text-center">
                Paiement sécurisé par Stripe
              </p>
            </div>

            <div className="text-base text-[#0c0c0d] space-y-1 bg-[#f2e8d5]/20 p-4 rounded-lg">
              <p>Paiement 100% sécurisé</p>
              <p>Satisfait ou remboursé sous 14 jours</p>
              <p>Service client réactif</p>
            </div>

            {/* Liens vers les pages légales */}
            <div className="text-sm text-[#0c0c0d] space-y-1">
              <p>
                En commandant, vous acceptez nos{' '}
                <a href={`/${locale}/cgv`} className="text-[#8b2020] hover:underline">
                  Conditions Générales de Vente
                </a>
                {' '}et notre{' '}
                <a href={`/${locale}/politique-confidentialite`} className="text-[#8b2020] hover:underline">
                  Politique de Confidentialité
                </a>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
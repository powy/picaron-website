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
    // Direct redirect to Stripe payment link (France)
    window.location.href = 'https://buy.stripe.com/dRmdR8fVY9T31pw45W67S01';
  };

  const handleCheckoutEU = () => {
    // Direct redirect to Stripe payment link (European Union)
    window.location.href = 'https://buy.stripe.com/28EaEWfVY6GR6JQ31S67S00';
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
                <span className="inline-flex items-center px-3 py-1 rounded-full text-base font-semibold bg-green-100 text-green-800">
                  Stock limités
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
                <li>Livraison dans l&apos;Union Européenne</li>
                <li>Livraison prévue sous 15 jours</li>
                <li>International: Nous contacter directement</li>
              </ul>
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

            <div className="space-y-4">
              <button
                onClick={handleCheckout}
                className="w-full bg-[#8b2020] text-[#faf8f3] py-3 px-6 rounded-lg font-oldstyle text-lg hover:bg-[#a02525] transition-colors"
              >
                Commander (France)
              </button>

              <button
                onClick={handleCheckoutEU}
                className="w-full bg-[#8b2020] text-[#faf8f3] py-3 px-6 rounded-lg font-oldstyle text-lg hover:bg-[#a02525] transition-colors"
              >
                Commander (Union Européenne)
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
          </div>
        </div>

      </div>
    </div>
  );
}
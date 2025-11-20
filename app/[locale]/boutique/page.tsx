'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import NewsletterSection from '@/components/NewsletterSection';

export default function BoutiquePage() {
  const params = useParams();
  const locale = params.locale as string;

  // State pour gérer l'image agrandie dans le lightbox
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

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


  const handleCheckout_boucanier_nouvellOPTIONEL = () => {
    // Direct redirect to Stripe payment link (France)
    window.location.href = 'https://buy.stripe.com/dRmdR8fVY9T31pw45W67S01';
  };

  const handleCheckout_nouvelle = () => {
    // Direct redirect to Stripe payment link (France)
    window.location.href = 'https://buy.stripe.com/6oUfZgh028OZ0ls45W67S02';
  };

  const handleCheckout_boucanier_nouvelle = () => {
    // Direct redirect to Stripe payment link (France)
    window.location.href = 'https://buy.stripe.com/eVqdR84dg2qB0ls6e467S04';
  };

  // Gérer la fermeture du lightbox avec la touche Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && zoomedImage) {
        setZoomedImage(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [zoomedImage]);

  return (
    <div className="mt-8">
      <h1 className="text-5xl font-oldstyle text-[#0c0c0d] mb-8 text-center">
        Boutique
      </h1>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Galerie d'images */}
          <div className="space-y-4">
            {/* Image du matériel */}
            <div className="relative cursor-pointer hover:opacity-90 transition-opacity">
              <Image
                src="/MatérielTransparent.png"
                alt="Matériel Boucaniers"
                width={600}
                height={800}
                className="w-full h-auto"
                onClick={() => setZoomedImage('/MatérielTransparent.png')}
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

              {/* Boutons de commande */}
              <div className="space-y-4 mb-6">
                <button
                  onClick={handleCheckout_boucanier_nouvellOPTIONEL}
                  className="w-full bg-[#378536] text-[#faf8f3] py-3 px-6 rounded-lg font-oldstyle text-lg hover:bg-[#40933f] transition-colors"
                >
                  Commander le Jeu seul
                </button>

                <button
                  onClick={handleCheckout_boucanier_nouvelle}
                  className="w-full bg-[#378536] text-[#faf8f3] py-3 px-6 rounded-lg font-oldstyle text-lg hover:bg-[#40933f] transition-colors"
                >
                  Commander le jeu et la nouvelle
                </button>

                <p className="text-sm text-gray-500 text-center">
                  Paiement sécurisé par Stripe
                </p>
              </div>

              <p className="text-lg text-[#0c0c0d] mb-4">
                Jeu de stratégie en simultané. Pour 2 à 5 joueurs à partir de 10 ans et des parties de 30 à 60 minutes.
              </p>
            </div>

            <div className="space-y-3">
              <div className="prose max-w-none">
                <p className="text-[#0c0c0d] text-lg leading-relaxed">
                  Embarquez dans une chasse au trésor en simultané ! Voguez dans un archipel changeant
                  truffé de cannibales, de comptoirs corrompus et de mystères vaudous. Armez votre bateau,
                  recrutez, pillez et commercez en prenant garde aux Compagnies des Indes.
                  Le dénouement n&apos;est jamais certain et chaque tour donne le frisson !
                </p>
              </div>

              <div>
                <ul className="space-y-1 text-base text-[#0c0c0d]">
                  <li  className="text-[#8b2020]">Livraison en France, prévue sous 15 jours.</li>
                  <li>International: Nous contacter directement</li>
                </ul>
              </div>
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

            <div className="text-base text-[#0c0c0d] space-y-1 bg-[#f2e8d5]/20 p-4 rounded-lg">
              <p>Paiement 100% sécurisé</p>
              <p>Service client réactif</p>
            </div>
          </div>
        </div>

        {/* Deuxième produit - Armand */}
        <div className="grid md:grid-cols-2 gap-8 mt-8 pt-8 border-t-2 border-[#f2e8d5]">
          {/* Galerie d'images - Armand */}
          <div className="space-y-4">
            <div className="relative cursor-pointer hover:opacity-90 transition-opacity">
              <Image
                src="/assets/Nouvelle-illustrée.png"
                alt="Armand ou Les Rêveurs du Nouveau Monde - Couverture"
                width={600}
                height={800}
                className="w-full h-auto"
                onClick={() => setZoomedImage('/assets/Nouvelle-illustrée.png')}
              />
            </div>
            <div className="relative cursor-pointer hover:opacity-90 transition-opacity">
              <Image
                src="/assets/Nouvelle-illustrée-intérieur.png"
                alt="Armand ou Les Rêveurs du Nouveau Monde - Intérieur"
                width={600}
                height={800}
                className="w-full h-auto"
                onClick={() => setZoomedImage('/assets/Nouvelle-illustrée-intérieur.png')}
              />
              <p className="text-center text-sm text-gray-500 italic mt-2">
                Cliquer pour agrandir
              </p>
            </div>
          </div>

          {/* Informations produit - Armand */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-oldstyle text-[#8b2020] mb-2">Armand ou Les Rêveurs du Nouveau Monde</h2>

              {/* Stock status */}
              <div className="mb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-base font-semibold bg-green-100 text-green-800">
                  En stock
                </span>
              </div>

              <p className="text-2xl font-semibold text-[#0c0c0d] mb-4">10,00 € TTC</p>
            </div>

            <div className="prose max-w-none">
              <p className="text-[#0c0c0d] text-lg leading-relaxed">
                Armand ou Les Rêveurs du Nouveau Monde se plonge dans la vie et les pensées des contemporains du siècle des Lumières, sentant les préludes des chamboulements de l&apos;Ancien Monde quand le Nouveau éclot déjà. Cette nouvelle illustrée introduit le jeu de société Boucaniers. Texte et illustrations par VINCENT TELLIER.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleCheckout_boucanier_nouvelle}
                className="w-full bg-[#378536] text-[#faf8f3] py-3 px-6 rounded-lg font-oldstyle text-lg hover:bg-[#40933f] transition-colors"
              >
                  Commander le jeu et la nouvelle
              </button>

              <button
                onClick={handleCheckout_nouvelle}
                className="w-full bg-[#378536] text-[#faf8f3] py-3 px-6 rounded-lg font-oldstyle text-lg hover:bg-[#40933f] transition-colors"
              >
                  Commander la nouvelle seule
              </button>

              <p className="text-sm text-gray-500 text-center">
                Paiement sécurisé par Stripe
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Lightbox Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 transition-opacity duration-300"
          onClick={() => setZoomedImage(null)}
        >
          {/* Bouton fermer */}
          <button
            onClick={() => setZoomedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Fermer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image agrandie */}
          <div
            className="relative max-w-7xl max-h-[90vh] w-auto h-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={zoomedImage}
              alt="Image agrandie"
              width={1200}
              height={1600}
              className="object-contain max-h-[90vh] w-auto h-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}

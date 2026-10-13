'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';
import { PRODUCTS, ProductId, formatPriceCents } from '@/lib/products';
import CartPreview from '@/components/cart/CartPreview';
import CartPreviewBar from '@/components/cart/CartPreviewBar';
import FranceOnlyNotice from '@/components/checkout/FranceOnlyNotice';

const ADDED_FEEDBACK_MS = 1500;

export default function BoutiquePage() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('cart');
  const tPreview = useTranslations('cart.preview');
  const { addItem } = useCart();

  // Brief "added" feedback on the button and in the cart preview, instead of
  // a popup that would cover the product sheet.
  const [justAdded, setJustAdded] = useState<ProductId | null>(null);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleAdd = (productId: ProductId) => {
    addItem(productId, 1);
    setJustAdded(productId);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setJustAdded(null), ADDED_FEEDBACK_MS);
  };
  useEffect(() => () => {
    if (addedTimer.current) clearTimeout(addedTimer.current);
  }, []);
  const addLabel = (productId: ProductId) => (justAdded === productId ? `✓ ${tPreview('added')}` : t('addToCart'));

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
      {/* Products on the left, cart preview on the right (desktop). Below lg the
          preview becomes a bottom bar (CartPreviewBar). */}
      <div className="max-w-7xl mx-auto px-4 py-8 lg:grid lg:grid-cols-[1fr_22rem] lg:gap-10 lg:items-start">
      <div className="min-w-0">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Galerie d'images - Deuxième sur mobile, gauche sur desktop */}
          <div className="order-2 md:order-1 md:w-1/2 space-y-4">
            {/* Boîte du jeu */}
            <div className="relative cursor-pointer hover:opacity-90 transition-opacity">
              <Image
                src={PRODUCTS.boucaniers.image}
                alt="Boîte du jeu Boucaniers"
                width={1600}
                height={1323}
                className="w-full h-auto"
                onClick={() => setZoomedImage(PRODUCTS.boucaniers.image)}
              />
            </div>
            {/* Matériel du jeu */}
            <div className="relative cursor-pointer hover:opacity-90 transition-opacity">
              <Image
                src="/boutique/boucaniers-materiel.webp"
                alt="Matériel Boucaniers"
                width={1099}
                height={2256}
                className="w-full h-auto"
                onClick={() => setZoomedImage('/boutique/boucaniers-materiel.webp')}
              />
            </div>
          </div>

          {/* Wrapper info - contents sur mobile pour permettre le réordonnancement */}
          <div className="contents md:block md:w-1/2 md:space-y-4">
            {/* Header (nom + commande) - Premier sur mobile */}
            <div className="order-1">
              <h1 className="text-3xl font-oldstyle text-pirate-red mb-2">Boucaniers</h1>

              {/* Stock status */}
              <div className="mb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-base font-semibold bg-green-100 text-green-800">
                  Stocks limités
                </span>
              </div>

              <p className="text-2xl font-semibold text-ink mb-4">
                {formatPriceCents(PRODUCTS.boucaniers.priceCents, locale)}
              </p>

              {/* Bouton d'ajout au panier */}
              <div className="space-y-4 mb-6">
                <button
                  onClick={() => handleAdd('boucaniers')}
                  className="btn-primary-full"
                  aria-live="polite"
                >
                  {addLabel('boucaniers')}
                </button>
                <FranceOnlyNotice />
              </div>
            </div>

            {/* Description - Troisième sur mobile */}
            <div className="order-3 space-y-6">
              <p className="text-lg text-ink mb-4">
                Jeu de stratégie en simultané. Pour 2 à 5 joueurs à partir de 10 ans et des parties de 30 à 60 minutes.
              </p>

              <p className="text-lg text-ink mb-4">
                Embarquez dans une chasse au trésor en simultané ! Voguez dans un archipel changeant
                truffé de cannibales, de comptoirs corrompus et de mystères vaudous. Armez votre bateau,
                recrutez, pillez et commercez en prenant garde aux Compagnies des Indes.
                Le dénouement n&apos;est jamais certain et chaque tour donne le frisson !
              </p>
              <p>Livraison en France, prévue sous 15 jours indicatifs. Livraison à l'international : Nous contacter directement.</p>

              {/* Liens vers les pages légales */}
              <div className="text-sm text-ink space-y-1">
                <p>
                  En commandant, vous acceptez nos{' '}
                  <a href={`/${locale}/cgv`} className="text-pirate-red hover:underline">
                    Conditions Générales de Vente
                  </a>
                  {' '}et notre{' '}
                  <a href={`/${locale}/politique-confidentialite`} className="text-pirate-red hover:underline">
                    Politique de Confidentialité
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Deuxième produit - Armand */}
        <div className="flex flex-col md:flex-row gap-8 mt-8 pt-8 border-t-2 border-parchment">
          {/* Galerie d'images - Armand - Deuxième sur mobile, gauche sur desktop */}
          <div className="order-2 md:order-1 md:w-1/2 space-y-4">
            <div className="relative cursor-pointer hover:opacity-90 transition-opacity">
              <Image
                src="/assets/Nouvelle-illustrée.webp"
                alt="Armand ou Les Rêveurs du Nouveau Monde - Couverture"
                width={600}
                height={800}
                className="w-full h-auto"
                onClick={() => setZoomedImage('/assets/Nouvelle-illustrée.webp')}
              />
            </div>
            <div className="relative cursor-pointer hover:opacity-90 transition-opacity">
              <Image
                src="/assets/Nouvelle-illustrée-intérieur.webp"
                alt="Armand ou Les Rêveurs du Nouveau Monde - Intérieur"
                width={600}
                height={800}
                className="w-full h-auto"
                onClick={() => setZoomedImage('/assets/Nouvelle-illustrée-intérieur.webp')}
              />
              <p className="text-center text-sm text-ink italic mt-2">
                Cliquer pour agrandir
              </p>
            </div>
          </div>

          {/* Wrapper info - contents sur mobile pour permettre le réordonnancement */}
          <div className="contents md:block md:w-1/2 md:space-y-4">
            {/* Header (nom + commande) - Premier sur mobile */}
            <div className="order-1">
              <h2 className="text-3xl font-oldstyle text-pirate-red mb-2">Armand ou Les Rêveurs du Nouveau Monde</h2>

              {/* Stock status */}
              <div className="mb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-base font-semibold bg-green-100 text-green-800">
                  En stock
                </span>
              </div>

              <p className="text-2xl font-semibold text-ink mb-4">
                {formatPriceCents(PRODUCTS.armand.priceCents, locale)}
              </p>

              <div className="space-y-4 mb-6">
                <button
                  onClick={() => handleAdd('armand')}
                  className="btn-primary-full"
                  aria-live="polite"
                >
                  {addLabel('armand')}
                </button>
              </div>
            </div>

            {/* Description - Troisième sur mobile */}
            <div className="order-3 prose max-w-none">
              <p className="text-ink text-lg leading-relaxed">
                Armand ou Les Rêveurs du Nouveau Monde se plonge dans la vie et les pensées des contemporains du siècle des Lumières, sentant les préludes des chamboulements de l&apos;Ancien Monde quand le Nouveau éclot déjà. Cette nouvelle illustrée introduit le jeu de société Boucaniers. Texte et illustrations par VINCENT TELLIER.
              </p>

               <p>Livraison en France, prévue sous 15 jours indicatifs. Livraison à l'international : Nous contacter directement.</p>

              {/* Liens vers les pages légales */}
              <div className="text-sm text-ink space-y-1">
                <p>
                  En commandant, vous acceptez nos{' '}
                  <a href={`/${locale}/cgv`} className="text-pirate-red hover:underline">
                    Conditions Générales de Vente
                  </a>
                  {' '}et notre{' '}
                  <a href={`/${locale}/politique-confidentialite`} className="text-pirate-red hover:underline">
                    Politique de Confidentialité
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

        <div className="hidden lg:block lg:sticky lg:top-20">
          <CartPreview locale={locale} highlightId={justAdded} />
        </div>
      </div>

      <CartPreviewBar locale={locale} />

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

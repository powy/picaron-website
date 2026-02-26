'use client'

import Image from 'next/image'

interface Card {
  id: string
  filename: string
  alt: string
}

export default function CardCarousel() {
  // Card data with WebP filenames
  const cards: Card[] = [
    { id: 'A1', filename: 'A1volcan.webp', alt: 'Carte indice - Volcan' },
    { id: 'A2', filename: 'A2épave2.webp', alt: 'Carte indice - Épave' },
    { id: 'A3', filename: 'A3Huttes.webp', alt: 'Carte indice - Huttes' },
    { id: 'A4', filename: 'A4temple.webp', alt: 'Carte indice - Temple' },
    { id: 'A5', filename: 'A5Mangrove.webp', alt: 'Carte indice - Mangrove' },
    { id: 'A6', filename: 'A6eglise.webp', alt: 'Carte indice - Église' },
    { id: 'A7', filename: 'A7phare.webp', alt: 'Carte indice - Phare' },
  ]

  // Triple cards for seamless infinite loop
  const tripleCards = [...cards, ...cards, ...cards]

  return (
    <div
      className="relative overflow-hidden w-full py-2 bg-gradient-to-b from-transparent to-parchment-dark/5"
      role="region"
      aria-label="Carrousel de cartes indices du trésor"
    >
     
      {/* Carousel Container - Pure CSS Animation */}
      <div
        className="flex gap-5 md:gap-6 lg:gap-7 carousel-track"
        style={{ willChange: 'transform' }}
      >
        {tripleCards.map((card, index) => (
          <div
            key={`${card.id}-${index}`}
            className="flex-shrink-0 w-[280px] md:w-[330px] lg:w-[380px]"
          >
            <div className="aspect-[773/1080] w-full">
              <Image
                src={`/cards/${card.filename}`}
                alt={card.alt}
                width={773}
                height={1080}
                className="w-full h-full object-contain rounded-lg shadow-lg"
                loading="lazy"
                quality={85}
                sizes="(max-width: 768px) 280px, (max-width: 1024px) 330px, 380px"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

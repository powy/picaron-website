'use client';

import { useEffect, useState } from 'react';

interface BggRatingBadgeProps {
  gameId: number;
  gameName?: string;
}

export default function BggRatingBadge({ gameId, gameName = 'Boucaniers' }: BggRatingBadgeProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await fetch(`/api/bgg-rating?gameId=${gameId}`);
        const data = await response.json();

        if (data.rating) {
          setRating(data.rating);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la note BGG:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRating();
  }, [gameId]);

  const bggUrl = `https://boardgamegeek.com/boardgame/${gameId}`;

  if (loading) {
    return (
      <div className="inline-flex items-center gap-2 bg-[#3e2f2a] text-[#faf8f3] px-4 py-2 rounded-lg">
        <span className="text-sm">Chargement...</span>
      </div>
    );
  }

  if (!rating) {
    return null;
  }

  return (
    <a
      href={bggUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 bg-[#3e2f2a] text-[#faf8f3] px-4 py-2 rounded-lg hover:bg-[#8b2020] transition-colors"
      title={`Voir ${gameName} sur BoardGameGeek`}
    >
      {/* BGG Logo */}
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm-2 5v10h1V7h-1zm3 0v10h1V7h-1z"/>
      </svg>

      <div className="flex flex-col">
        <span className="text-xs opacity-80">BoardGameGeek</span>
        <span className="font-semibold text-lg">{rating}/10</span>
      </div>
    </a>
  );
}

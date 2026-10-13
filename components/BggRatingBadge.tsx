// Static BoardGameGeek rating badge. The rating is copied by hand from the
// BGG page: update BGG_RATING and BGG_RATING_CHECKED_AT together.
const BGG_URL = 'https://boardgamegeek.com/boardgame/434117/boucaniers'
const BGG_RATING = 8.8
const BGG_RATING_CHECKED_AT = '2026-10-13'

// BGG colours its rating hexagon by score; dark green is used for 8 and above.
const BGG_RATING_COLOR = '#1d804c'

export default function BggRatingBadge() {
  const rating = BGG_RATING.toFixed(1)

  return (
    <a
      href={BGG_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Note de ${rating.replace('.', ',')} sur 10 sur BoardGameGeek (nouvel onglet)`}
      title={`Note BoardGameGeek relevée le ${BGG_RATING_CHECKED_AT}`}
      className="inline-flex items-center gap-3 rounded-lg bg-white/80 px-4 py-2 shadow-md transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pirate-red"
    >
      <svg viewBox="0 0 100 100" className="h-14 w-14 shrink-0" aria-hidden="true">
        <polygon points="50,2 92,26 92,74 50,98 8,74 8,26" fill={BGG_RATING_COLOR} />
        <text
          x="50"
          y="52"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize="34"
          fontWeight="700"
          fontFamily="Arial, Helvetica, sans-serif"
        >
          {rating}
        </text>
      </svg>
      <span className="text-left leading-tight" aria-hidden="true">
        <span className="block text-sm text-ink">Note des joueurs sur</span>
        <span className="block text-lg font-bold" style={{ color: '#3f3a60' }}>
          BoardGameGeek
        </span>
      </span>
    </a>
  )
}

import { useFormatter, useTranslations } from 'next-intl'

// Static BoardGameGeek rating badge. The rating is copied by hand from the
// BGG page: update BGG_RATING and BGG_RATING_CHECKED_AT together.
const BGG_URL = 'https://boardgamegeek.com/boardgame/434117/boucaniers'
const BGG_RATING = 8.4
const BGG_RATING_CHECKED_AT = '2026-11-07'

const STAR_GOLD = '#E39000'
const STAR_GREY = '#d0d0d0'

// Ten stars drawn in SVG (not the ★ character, which no web font here has and
// each system draws differently). The gold row is clipped to the rating, so a
// fractional score fills part of a star: 8.4 is 8 gold stars and 40% of the 9th.
const STAR_COUNT = 10
const STAR_PITCH = 26.5 // viewBox units from one star to the next (24 wide + 2.5 gap)
const STAR_LEFT = 0.59 // the star polygon's horizontal extent inside its 24-unit cell
const STAR_WIDTH = 22.82
const STAR_POINTS =
  '12,0.8 15.29,8.27 23.41,9.09 17.33,14.53 19.05,22.51 12,18.4 4.95,22.51 6.67,14.53 0.59,9.09 8.71,8.27'
const ROW_WIDTH = STAR_COUNT * STAR_PITCH - (STAR_PITCH - 24)
const ROW_HEIGHT = 24
const STAR_SIZE_PX = 21 // matches the reference design: ~21px stars, 23.3px apart

function goldWidth(rating: number) {
  const score = Math.min(Math.max(rating, 0), STAR_COUNT)
  const full = Math.floor(score)
  const fraction = score - full
  if (fraction === 0) return full * STAR_PITCH
  return full * STAR_PITCH + STAR_LEFT + fraction * STAR_WIDTH
}

function StarRow({ rating }: { rating: number }) {
  const stars = Array.from({ length: STAR_COUNT }, (_, i) => (
    <polygon key={i} points={STAR_POINTS} transform={`translate(${i * STAR_PITCH} 0)`} />
  ))

  return (
    <svg
      viewBox={`0 0 ${ROW_WIDTH} ${ROW_HEIGHT}`}
      width={Math.round((ROW_WIDTH * STAR_SIZE_PX) / ROW_HEIGHT)}
      height={STAR_SIZE_PX}
      className="shrink-0"
      aria-hidden="true"
    >
      <defs>
        <clipPath id="bgg-rating-gold">
          <rect x="0" y="0" width={goldWidth(rating)} height={ROW_HEIGHT} />
        </clipPath>
      </defs>
      <g fill={STAR_GREY}>{stars}</g>
      <g fill={STAR_GOLD} clipPath="url(#bgg-rating-gold)">
        {stars}
      </g>
    </svg>
  )
}

export default function BggRatingBadge() {
  const t = useTranslations('bgg')
  const format = useFormatter()
  const rating = Math.round(BGG_RATING * 10) / 10
  const spokenRating = format.number(rating, { minimumFractionDigits: 1, maximumFractionDigits: 1 })

  return (
    <a
      href={BGG_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('ariaLabel', { rating: spokenRating })}
      title={t('checkedAt', { date: BGG_RATING_CHECKED_AT })}
      className="inline-flex flex-col items-center gap-x-3 sm:flex-row text-ink no-underline transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pirate-red"
    >
      <StarRow rating={rating} />
      <span className="text-sm whitespace-nowrap" aria-hidden="true">
        {t('label', { rating: rating.toFixed(1) })}
      </span>
    </a>
  )
}

'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

// YouTube video shown as a still picture with a play button. Nothing from
// YouTube loads until the visitor clicks: no YouTube title or logos over the
// picture, no YouTube cookies. The click swaps in the normal YouTube player
// (normal controls) and starts the video.
export default function YoutubeVideo({ videoId, poster, title }: { videoId: string; poster: string; title: string }) {
  const t = useTranslations('video')
  const [playing, setPlaying] = useState(false)

  return (
    <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
      {playing ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={t('play', { title })}
          className="group absolute inset-0 h-full w-full cursor-pointer focus-visible:outline focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-pirate-red"
        >
          {/* Plain img: the poster is already a sized WebP and the export does not optimise images. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <svg
              viewBox="0 0 68 68"
              className="h-16 w-16 md:h-20 md:w-20 drop-shadow-lg transition-transform group-hover:scale-110"
            >
              <circle cx="34" cy="34" r="34" className="fill-pirate-red opacity-90" />
              <path d="M27 21 L49 34 L27 47 Z" fill="#fff" />
            </svg>
          </span>
        </button>
      )}
    </div>
  )
}

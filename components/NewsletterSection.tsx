'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

export default function NewsletterSection() {
  const t = useTranslations('newsletter')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'success'>('idle')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Newsletter signup:', email)
    setStatus('success')
    setTimeout(() => setStatus('idle'), 3000)
  }

  return (
    <section className="newsletter-section">
      <h3 className="text-2xl font-oldstyle mb-4 text-center">
        {t('title')}
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-4 max-w-md mx-auto px-2">
        <input
          type="email"
          required
          placeholder={t('placeholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-3 py-2 rounded-sm bg-bone text-ink"
        />
        <button
          type="submit"
          className="w-full sm:w-auto bg-pirate-red px-6 py-2 rounded-sm hover:bg-pirate-red-hover transition font-oldstyle text-shadow whitespace-nowrap"
        >
          {t('submit')}
        </button>
      </form>
      {status === 'success' && (
        <p className="text-center mt-4 text-gold">Inscription réussie!</p>
      )}
    </section>
  )
}
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
    <section className="bg-[#1a2332] text-[#faf8f3] p-6 rounded-lg my-8">
      <h3 className="text-2xl font-oldstyle mb-4 text-center">
        {t('title')}
      </h3>
      <form onSubmit={handleSubmit} className="flex gap-4 max-w-md mx-auto">
        <input
          type="email"
          required
          placeholder={t('placeholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-2 rounded bg-[#faf8f3] text-[#0c0c0d]"
        />
        <button
          type="submit"
          className="bg-[#8b2020] px-6 py-2 rounded hover:bg-[#a02525] transition font-oldstyle text-shadow"
        >
          {t('submit')}
        </button>
      </form>
      {status === 'success' && (
        <p className="text-center mt-4 text-[#d4a574]">Inscription réussie!</p>
      )}
    </section>
  )
}
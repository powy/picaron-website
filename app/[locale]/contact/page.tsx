'use client'
import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="mt-8 max-w-2xl mx-auto">
      <h1 className="text-5xl font-oldstyle text-[#0c0c0d] mb-8 text-center">
        Contact
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[#0c0c0d] font-oldstyle mb-2">
            Nom
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-4 py-2 border-2 border-[#3e2f2a] rounded bg-[#faf8f3]"
          />
        </div>

        <div>
          <label className="block text-[#0c0c0d] font-oldstyle mb-2">
            Courriel
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-4 py-2 border-2 border-[#3e2f2a] rounded bg-[#faf8f3]"
          />
        </div>

        <div>
          <label className="block text-[#0c0c0d] font-oldstyle mb-2">
            Sujet
          </label>
          <input
            type="text"
            required
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            className="w-full px-4 py-2 border-2 border-[#3e2f2a] rounded bg-[#faf8f3]"
          />
        </div>

        <div>
          <label className="block text-[#0c0c0d] font-oldstyle mb-2">
            Message
          </label>
          <textarea
            required
            rows={6}
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            className="w-full px-4 py-2 border-2 border-[#3e2f2a] rounded bg-[#faf8f3]"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-[#8b2020] text-[#faf8f3] py-3 rounded font-oldstyle text-xl hover:bg-[#a02525] transition disabled:opacity-50"
        >
          {status === 'loading' ? 'Envoi...' : 'Envoyer par pigeon voyageur'}
        </button>

        {status === 'success' && (
          <p className="text-green-600 text-center">Message envoyé avec succès!</p>
        )}
        {status === 'error' && (
          <p className="text-red-600 text-center">Erreur lors de l'envoi. Veuillez réessayer.</p>
        )}
      </form>
    </div>
  )
}
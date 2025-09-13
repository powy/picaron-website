'use client'
import { useState, useRef } from 'react'
import emailjs from '@emailjs/browser'
import ReCAPTCHA from 'react-google-recaptcha'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    // Validate name
    const name = formData.name.trim()
    if (!name) {
      newErrors.name = 'Le nom est requis'
    } else if (name.length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères'
    } else if (name.length > 50) {
      newErrors.name = 'Le nom ne peut pas dépasser 50 caractères'
    }

    // Validate email
    const email = formData.email.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      newErrors.email = 'L\'email est requis'
    } else if (email.length < 5) {
      newErrors.email = 'L\'email doit contenir au moins 5 caractères'
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'L\'email doit être valide'
    }

    // Validate subject
    const subject = formData.subject.trim()
    if (!subject) {
      newErrors.subject = 'Le sujet est requis'
    } else if (subject.length < 3) {
      newErrors.subject = 'Le sujet doit contenir au moins 3 caractères'
    } else if (subject.length > 100) {
      newErrors.subject = 'Le sujet ne peut pas dépasser 100 caractères'
    }

    // Validate message
    const message = formData.message.trim()
    if (!message) {
      newErrors.message = 'Le message est requis'
    } else if (message.length < 10) {
      newErrors.message = 'Le message doit contenir au moins 10 caractères'
    } else if (message.length > 1000) {
      newErrors.message = 'Le message ne peut pas dépasser 1000 caractères'
    }

    // Validate reCAPTCHA
    const captchaValue = recaptchaRef.current?.getValue()
    if (!captchaValue) {
      newErrors.recaptcha = 'Veuillez compléter le reCAPTCHA'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      return
    }

    setStatus('loading')

    try {
      // Send email using EmailJS
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID',
        {
          from_name: formData.name.trim(),
          from_email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY'
      )

      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setErrors({})
      recaptchaRef.current?.reset()
    } catch (error) {
      console.error('EmailJS error:', error)
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
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className={`w-full px-4 py-2 border-2 rounded bg-[#faf8f3] ${
              errors.name ? 'border-red-500' : 'border-[#3e2f2a]'
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-[#0c0c0d] font-oldstyle mb-2">
            Courriel
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className={`w-full px-4 py-2 border-2 rounded bg-[#faf8f3] ${
              errors.email ? 'border-red-500' : 'border-[#3e2f2a]'
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-[#0c0c0d] font-oldstyle mb-2">
            Sujet
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            className={`w-full px-4 py-2 border-2 rounded bg-[#faf8f3] ${
              errors.subject ? 'border-red-500' : 'border-[#3e2f2a]'
            }`}
          />
          {errors.subject && (
            <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
          )}
        </div>

        <div>
          <label className="block text-[#0c0c0d] font-oldstyle mb-2">
            Message
          </label>
          <textarea
            rows={6}
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            className={`w-full px-4 py-2 border-2 rounded bg-[#faf8f3] ${
              errors.message ? 'border-red-500' : 'border-[#3e2f2a]'
            }`}
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message}</p>
          )}
        </div>

        <div>
          <div className="flex justify-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || 'YOUR_RECAPTCHA_SITE_KEY'}
            />
          </div>
          {errors.recaptcha && (
            <p className="text-red-500 text-sm mt-2 text-center">{errors.recaptcha}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-[#8b2020] text-[#faf8f3] py-3 rounded font-oldstyle text-xl hover:bg-[#a02525] transition disabled:opacity-50"
        >
          {status === 'loading' ? 'Envoi...' : 'Envoyer votre message'}
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
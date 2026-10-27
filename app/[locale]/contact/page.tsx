'use client'
import { useState, useEffect } from 'react'
import emailjs from '@emailjs/browser'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  // Math CAPTCHA state
  const [mathQuestion, setMathQuestion] = useState({ num1: 0, num2: 0, answer: 0 })
  const [userAnswer, setUserAnswer] = useState('')

  // Generate random math question
  const generateMathQuestion = () => {
    const num1 = Math.floor(Math.random() * 10) + 1
    const num2 = Math.floor(Math.random() * 10) + 1
    setMathQuestion({ num1, num2, answer: num1 + num2 })
    setUserAnswer('')
  }

  useEffect(() => {
    // Random numbers after mount on purpose: during SSR they would not match the client.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    generateMathQuestion()
  }, [])

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

    // Validate math CAPTCHA
    const answerNum = parseInt(userAnswer.trim(), 10)
    if (!userAnswer.trim()) {
      newErrors.captcha = 'Veuillez répondre à la question'
    } else if (isNaN(answerNum) || answerNum !== mathQuestion.answer) {
      newErrors.captcha = 'Réponse incorrecte, veuillez réessayer'
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
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY'
      )

      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setErrors({})
      generateMathQuestion() // Generate new question for next submission
    } catch (error) {
      console.error('EmailJS error:', error)
      setStatus('error')
    }
  }

  return (
    <div className="mt-8 max-w-2xl mx-auto">
      <h1 className="title-page">
        Contact
      </h1>

      <form onSubmit={handleSubmit} className="stack-y-6">
        <div>
          <label className="block text-ink font-oldstyle mb-2">
            Nom
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className={`w-full px-4 py-2 border-2 rounded-sm bg-bone ${
              errors.name ? 'border-red-500' : 'border-wood'
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-ink font-oldstyle mb-2">
            Courriel
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className={`w-full px-4 py-2 border-2 rounded-sm bg-bone ${
              errors.email ? 'border-red-500' : 'border-wood'
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-ink font-oldstyle mb-2">
            Sujet
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            className={`w-full px-4 py-2 border-2 rounded-sm bg-bone ${
              errors.subject ? 'border-red-500' : 'border-wood'
            }`}
          />
          {errors.subject && (
            <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
          )}
        </div>

        <div>
          <label className="block text-ink font-oldstyle mb-2">
            Message
          </label>
          <textarea
            rows={6}
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            className={`w-full px-4 py-2 border-2 rounded-sm bg-bone ${
              errors.message ? 'border-red-500' : 'border-wood'
            }`}
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message}</p>
          )}
        </div>

        <div>
          <label className="block text-ink font-oldstyle mb-2">
            Question de sécurité: Combien font {mathQuestion.num1} + {mathQuestion.num2} ?
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Votre réponse"
            className={`w-full px-4 py-2 border-2 rounded-sm bg-bone ${
              errors.captcha ? 'border-red-500' : 'border-wood'
            }`}
          />
          {errors.captcha && (
            <p className="text-red-500 text-sm mt-1">{errors.captcha}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-pirate-red text-bone py-3 rounded-sm font-oldstyle text-xl hover:bg-pirate-red-hover transition disabled:opacity-50"
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
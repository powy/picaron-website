# Claude Code Implementation Plan - Picaron Website

## Phase 1: Project Setup and Configuration

### Step 1.1: Initialize Next.js Project
```bash
npx create-next-app@latest picaron-website --typescript --tailwind --app --src-dir=false --import-alias="@/*"
cd picaron-website
```

### Step 1.2: Install Required Dependencies
```bash
npm install next-intl framer-motion nodemailer @types/nodemailer
```

### Step 1.3: Copy Assets
1. Copy entire `assets` folder to `public/assets/`
2. Verify all image paths are accessible

### Step 1.4: Configure Custom Font
Create `app/fonts.ts`:
```typescript
// Load the custom font from public/assets/
import localFont from 'next/font/local'

export const oldStyleFont = localFont({
  src: '../public/assets/hinted-OldStyle1HPLHS.woff2',
  variable: '--font-oldstyle',
  display: 'swap',
})
```

## Phase 2: Core Configuration Files

### Step 2.1: Create i18n Configuration
Create `i18n.ts`:
```typescript
export const locales = ['fr', 'en'] as const
export const defaultLocale = 'fr' as const
export type Locale = (typeof locales)[number]
```

### Step 2.2: Create Middleware for Localization
Create `middleware.ts`:
```typescript
import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n'

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
```

### Step 2.3: Create Translation Files
Create `messages/fr.json`:
```json
{
  "nav": {
    "home": "Picaron",
    "game": "Boucaniers",
    "team": "Équipe",
    "shop": "Boutique"
  },
  "home": {
    "title": "Le jeu de société Boucaniers arrive cette année !",
    "cta": "Découvrir Boucaniers"
  },
  "newsletter": {
    "title": "Restez informé",
    "placeholder": "Votre email",
    "submit": "S'inscrire"
  }
}
```

Create `messages/en.json`:
```json
{
  "nav": {
    "home": "Picaron",
    "game": "Boucaniers",
    "team": "Team",
    "shop": "Shop"
  },
  "home": {
    "title": "The Boucaniers board game is coming this year!",
    "cta": "Discover Boucaniers"
  },
  "newsletter": {
    "title": "Stay informed",
    "placeholder": "Your email",
    "submit": "Subscribe"
  }
}
```

## Phase 3: Layout and Navigation

### Step 3.1: Create Root Layout
Create `app/layout.tsx`:
```typescript
import './globals.css'
import { oldStyleFont } from './fonts'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className={oldStyleFont.variable}>
      <body>{children}</body>
    </html>
  )
}
```

### Step 3.2: Create Locale Layout
Create `app/[locale]/layout.tsx`:
```typescript
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import Navigation from '@/components/Navigation'
import { locales } from '@/i18n'

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!locales.includes(locale as any)) notFound()
  
  const messages = (await import(`@/messages/${locale}.json`)).default

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="min-h-screen relative">
        {/* Fixed background */}
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: 'url(/assets/background6.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        />
        
        {/* Content wrapper */}
        <div className="relative z-10">
          <Navigation />
          <main className="container mx-auto px-4 pt-20">
            {children}
          </main>
        </div>
      </div>
    </NextIntlClientProvider>
  )
}
```

### Step 3.3: Create Navigation Component
Create `components/Navigation.tsx`:
```typescript
'use client'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Navigation() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: '/', label: t('home') },
    { href: '/boucaniers', label: t('game') },
    { href: '/equipe', label: t('team') },
    { href: '/boutique', label: t('shop') }
  ]

  return (
    <nav className="fixed top-0 w-full bg-[#f2e8d5] shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/PICARON_LOGO.png"
              alt="Picaron"
              width={120}
              height={60}
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className="text-[#0c0c0d] hover:text-[#8b2020] font-oldstyle text-lg"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor">
              {/* Hamburger icon */}
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className="block py-2 text-[#0c0c0d] hover:text-[#8b2020] font-oldstyle"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
```

## Phase 4: Page Components

### Step 4.1: Homepage
Create `app/[locale]/page.tsx`:
```typescript
import { useTranslations } from 'next-intl'
import NewsletterSection from '@/components/NewsletterSection'
import SocialLinks from '@/components/SocialLinks'

export default function HomePage() {
  const t = useTranslations('home')
  
  return (
    <div className="bg-[#f2e8d5]/95 rounded-lg p-8 mt-8">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-5xl font-oldstyle text-[#0c0c0d] mb-6">
          {t('title')}
        </h1>
        
        {/* Video Player - using existing video from old website */}
        <div className="max-w-4xl mx-auto my-8">
          <video 
            controls 
            className="w-full rounded-lg shadow-xl"
            poster="/assets/assets_old_web/imageA.png"
          >
            {/* Add video source when available */}
          </video>
        </div>

        {/* CTA Button */}
        <a 
          href="/boucaniers"
          className="inline-block bg-[#8b2020] text-[#faf8f3] px-8 py-3 rounded font-oldstyle text-xl hover:bg-[#a02525] transition"
        >
          {t('cta')}
        </a>
      </section>

      {/* Newsletter and Social */}
      <NewsletterSection />
      <SocialLinks />
    </div>
  )
}
```

### Step 4.2: Boucaniers Page
Create `app/[locale]/boucaniers/page.tsx`:
```typescript
'use client'
import { useEffect, useState } from 'react'
import NewsletterSection from '@/components/NewsletterSection'

export default function BoucaniersPage() {
  const [content, setContent] = useState<string>('')

  useEffect(() => {
    // Extract content from Kickstarter PDF
    // This is a placeholder - actual content extraction needed
    setContent(`
      <h2>Story</h2>
      <p>Content from Kickstarter PDF starting at "Story"...</p>
      <!-- Continue with extracted content -->
    `)
  }, [])

  return (
    <div className="bg-[#f2e8d5]/95 rounded-lg p-8 mt-8">
      <h1 className="text-5xl font-oldstyle text-[#0c0c0d] mb-8 text-center">
        Boucaniers
      </h1>
      
      {/* Main content from Kickstarter */}
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Newsletter at bottom */}
      <NewsletterSection />
    </div>
  )
}
```

### Step 4.3: Team Page
Create `app/[locale]/equipe/page.tsx`:
```typescript
import Image from 'next/image'
import { useTranslations } from 'next-intl'

const teamMembers = [
  {
    id: 'vincent',
    image: '/assets/assets_kick/vincent-tellier.jpg',
    name: 'Vincent Tellier',
    role: 'Capitaine & Créateur',
    description: 'Concepteur du jeu et des mécaniques, auteur des illustrations, modéleur des figurines. Mordu d\'histoire.'
  },
  {
    id: 'thierry',
    image: '/assets/assets_kick/thierry-durand.jpg',
    name: 'Thierry Durand',
    role: 'Quartier-maître',
    description: 'Concepteur de l\'idée première, éternel insatisfait, qui dépouille le jeu de chaque défaut.'
  },
  {
    id: 'remi',
    image: '/assets/assets_kick/remi-durand.jpg',
    name: 'Rémi Durand',
    role: 'Maître Charpentier',
    description: 'Fabricant des figurines. Ingénieur chevronné et pointilleux. Expert en impression 3D, assure la qualité de fabrication.'
  }
]

export default function TeamPage() {
  return (
    <div className="bg-[#f2e8d5]/95 rounded-lg p-8 mt-8">
      <h1 className="text-5xl font-oldstyle text-[#0c0c0d] mb-12 text-center">
        Les Corsaires de Picaron
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        {teamMembers.map((member) => (
          <div key={member.id} className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden border-4 border-[#3e2f2a]">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-2xl font-oldstyle text-[#0c0c0d] mb-1">
              {member.name}
            </h3>
            <p className="text-[#8b2020] font-oldstyle text-lg mb-3">
              {member.role}
            </p>
            <p className="text-[#0c0c0d]">
              {member.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Step 4.4: Contact Page
Create `app/[locale]/contact/page.tsx`:
```typescript
'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

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
    <div className="bg-[#f2e8d5]/95 rounded-lg p-8 mt-8 max-w-2xl mx-auto">
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
```

### Step 4.5: Shop Page (Coming Soon)
Create `app/[locale]/boutique/page.tsx`:
```typescript
import NewsletterSection from '@/components/NewsletterSection'

export default function BoutiquePage() {
  return (
    <div className="bg-[#f2e8d5]/95 rounded-lg p-8 mt-8 text-center">
      <h1 className="text-5xl font-oldstyle text-[#0c0c0d] mb-8">
        Boutique
      </h1>
      
      <div className="py-16">
        <h2 className="text-3xl font-oldstyle text-[#8b2020] mb-4">
          Trésor en construction
        </h2>
        <p className="text-xl text-[#0c0c0d] mb-8">
          Notre boutique ouvrira bientôt ses portes !
        </p>
        
        <div className="max-w-md mx-auto">
          <p className="mb-6 text-[#0c0c0d]">
            Inscrivez-vous pour être informé de l'ouverture
          </p>
          <NewsletterSection />
        </div>
      </div>
    </div>
  )
}
```

## Phase 5: Shared Components

### Step 5.1: Newsletter Component
Create `components/NewsletterSection.tsx`:
```typescript
'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

export default function NewsletterSection() {
  const t = useTranslations('newsletter')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'success'>('idle')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement newsletter signup
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
          className="bg-[#8b2020] px-6 py-2 rounded hover:bg-[#a02525] transition font-oldstyle"
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
```

### Step 5.2: Social Links Component
Create `components/SocialLinks.tsx`:
```typescript
export default function SocialLinks() {
  const socials = [
    { name: 'Facebook', url: '#', icon: 'F' },
    { name: 'Twitter', url: '#', icon: 'T' },
    { name: 'Instagram', url: '#', icon: 'I' },
    { name: 'YouTube', url: '#', icon: 'Y' }
  ]

  return (
    <section className="flex justify-center gap-6 my-8">
      {socials.map((social) => (
        <a
          key={social.name}
          href={social.url}
          className="w-12 h-12 bg-[#3e2f2a] text-[#faf8f3] rounded-full flex items-center justify-center hover:bg-[#8b2020] transition font-oldstyle text-xl"
          aria-label={social.name}
        >
          {social.icon}
        </a>
      ))}
    </section>
  )
}
```

## Phase 6: API Routes

### Step 6.1: Contact Form API
Create `app/api/contact/route.ts`:
```typescript
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  const { name, email, subject, message } = await request.json()

  // For development - log the message
  console.log('Contact form submission:', { name, email, subject, message })

  // TODO: Configure SMTP for production
  // const transporter = nodemailer.createTransporter({
  //   host: process.env.SMTP_HOST,
  //   port: parseInt(process.env.SMTP_PORT || '587'),
  //   auth: {
  //     user: process.env.SMTP_USER,
  //     pass: process.env.SMTP_PASS
  //   }
  // })

  // await transporter.sendMail({
  //   from: email,
  //   to: 'contact@picaron.fr',
  //   subject: `[Site Web] ${subject}`,
  //   html: `
  //     <h2>Nouveau message depuis le site</h2>
  //     <p><strong>Nom:</strong> ${name}</p>
  //     <p><strong>Email:</strong> ${email}</p>
  //     <p><strong>Message:</strong></p>
  //     <p>${message}</p>
  //   `
  // })

  return NextResponse.json({ success: true })
}
```

## Phase 7: Styling

### Step 7.1: Global Styles
Update `app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-ink: #0c0c0d;
  --color-parchment: #f2e8d5;
  --color-pirate-red: #8b2020;
  --color-gold: #d4a574;
  --color-sea-mist: #1e3a3a;
  --color-navy: #1a2332;
  --color-bone: #faf8f3;
  --color-wood: #3e2f2a;
  --color-copper: #4e7c7b;
}

body {
  font-family: var(--font-oldstyle), 'EB Garamond', Georgia, serif;
  color: var(--color-ink);
}

.font-oldstyle {
  font-family: var(--font-oldstyle), serif;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: var(--color-parchment);
}

::-webkit-scrollbar-thumb {
  background: var(--color-wood);
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-pirate-red);
}
```

## Phase 8: Testing Checklist

### Functional Tests
- [ ] Navigation works on all pages
- [ ] Language switching works correctly
- [ ] Mobile menu opens/closes properly
- [ ] All images load correctly
- [ ] Background image displays properly
- [ ] Contact form submits without errors
- [ ] Newsletter signup works
- [ ] All links are functional

### Visual Tests
- [ ] Custom font loads and displays
- [ ] Colors match specification
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Logo is clearly visible
- [ ] Text is readable on all backgrounds

### Content Tests
- [ ] French translations display correctly
- [ ] English translations display correctly
- [ ] Team member information is accurate
- [ ] Boucaniers content displays properly

## Phase 9: Deployment Preparation

### Environment Variables
Create `.env.local`:
```
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password
```

### Build and Test
```bash
npm run build
npm run start
```

## Important Notes for Claude Code

1. **Start with Phase 1-3** to establish the foundation
2. **Test after each phase** before moving forward
3. **Use placeholder content** if PDF extraction is complex
4. **Focus on structure over animations** initially
5. **Ensure all asset paths** are correct before styling
6. **Test responsive design** after basic functionality works
7. **Add animations last** after everything else works

## Common Pitfalls to Avoid

1. Don't try to implement everything at once
2. Don't add complex animations before basic functionality
3. Don't forget to test mobile responsiveness
4. Don't hardcode text - use translation files
5. Don't forget to handle loading and error states
6. Don't optimize images before verifying they display correctly

This plan provides a clear, step-by-step approach that Claude Code can follow systematically.
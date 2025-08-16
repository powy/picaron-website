# Picaron - Pirate-Themed Board Game Website Design Documentation

## Project Overview

**Company:** Picaron - Board Game Publisher  
**Main Product:** Boucaniers - Strategic Simultaneous Play Board Game  
**Framework:** Next.js 14+ with App Router  
**Languages:** French (default) and English  
**Domain:** picaron.fr  
**Theme:** Pirate aesthetic with authentic period engraving style inspired by Caribbean buccaneers  

---

## Technical Architecture

### Next.js Setup

```typescript
// app/layout.tsx structure
- Multilingual support with next-intl
- Dynamic asset loading from /assets folder
- Server-side rendering for SEO
- Image optimization with next/image
- Font optimization for custom pirate fonts
```

### File Structure
```
/app
  /[locale]
    /page.tsx (Accueil)
    /boucaniers/page.tsx
    /equipe/page.tsx
    /contact/page.tsx
    /boutique/page.tsx
  /api
    /contact/route.ts (Email handler)
/assets
  /images
    PICARON_LOGO.png
    /boucaniers (game images)
  /videos
  /documents
    kickstarter.pdf
/components
  /navigation
  /newsletter
  /social
/locales
  /fr
  /en
/styles
  /pirate-theme.css
```

---

## Design System

### Color Palette

**Primary Colors:**
- **Ink Black Ocean:** #0c0c0d (main background)
- **Aged Parchment:** #f2e8d5 (content areas, maps)
- **Pirate Red:** #8b2020 (CTAs, important accents)
- **Treasure Gold:** #d4a574 (highlights, premium features)

**Secondary Colors:**
- **Sea Mist Green:** #1e3a3a (mystical glow effects)
- **Deep Navy:** #1a2332 (secondary backgrounds)
- **Bone White:** #faf8f3 (text on dark)
- **Weathered Wood:** #3e2f2a (borders, frames)
- **Verdigris Copper:** #4e7c7b (aged metal details)

**Special Effects:**
- **Magical Glow:** #00ffcc with opacity for hover states
- **Candlelight:** Warm orange (#ff8c42) for ambient lighting

### Typography

```css
/* Custom Font Stack */
--font-display: 'Pirata One', 'Cinzel', serif; /* Headers */
--font-secondary: 'Crimson Text', 'Playfair Display', serif; /* Subheaders */
--font-body: 'EB Garamond', 'Georgia', serif; /* Body text */
--font-script: 'Kalam', 'Dancing Script', cursive; /* Annotations */
```

**Font Sizes:**
- H1: clamp(3rem, 8vw, 6rem) - Main titles
- H2: clamp(2rem, 5vw, 3.5rem) - Section headers  
- H3: clamp(1.5rem, 3vw, 2rem) - Subsections
- Body: 1.125rem (18px) - Optimal readability
- Small: 0.875rem - Metadata, captions

### Components Library

#### Navigation Component
```typescript
// Compass Rose Navigation
- Fixed position top-right
- Rotates to reveal menu options
- Each direction = page link
- Current page highlighted in gold
- Language toggle integrated
```

#### Parchment Container
```css
.parchment-container {
  background: var(--parchment-texture);
  border-image: url('/assets/torn-edges.svg');
  box-shadow: inset 0 0 30px rgba(139, 69, 19, 0.3);
  position: relative;
}
.parchment-container::before {
  /* Wax seal decoration */
}
```

#### Treasure Map Background
- Animated fog overlay
- Parallax scrolling layers
- Interactive hotspots
- Dynamic weather effects

---

## Page Specifications

### 1. Homepage (Accueil)

**Hero Section:**
```typescript
<HeroSection>
  - Full-screen treasure map background with Caribbean archipelago
  - Animated title: "Le jeu de société Boucaniers arrive cette année !"
  - Subtitle: "Le Panache de la stratégie en simultané - 2 à 5 joueurs"
  - Floating compass pointing to CTA
  - Fog animation revealing content
</HeroSection>
```

**Content Blocks:**
1. **Boucaniers Preview**
   - Large box art image showing pirate ships and game components
   - "Plus d'info sur Boucaniers" button (styled as treasure chest)
   - Key features: "30 à 60 minutes" | "10 ans et +" | "2-5 joueurs"
   - Animated ship sailing across background

2. **Social Follow Section**
   - "Suivez nous" in decorative frame
   - Social icons as nautical instruments
   - Hover: glow effect

3. **Newsletter Signup**
   - Styled as "Message in a Bottle"
   - Input field with quill pen icon
   - Success animation: bottle floating away

4. **Video Section**
   - Embedded video from assets showing gameplay
   - Custom player controls (ship wheel for play)
   - Link to Tabletop Simulator demo

### 2. Boucaniers Page

**Game Overview Section:**
```typescript
<GameHeader>
  - Title: "BOUCANIERS" with golden lettering effect
  - Tagline: "Embarquez dans une chasse au trésor en simultané !"
  - Player info: "2-5 joueurs | 30-60 minutes | 10 ans et +"
  - Price: "69 €" (styled as treasure value)
</GameHeader>
```

**Core Game Description:**
- "Voguez dans un archipel changeant truffé de cannibales, de comptoirs corrompus et de mystères vaudous"
- "Armez votre bateau, recrutez, pillez et commercez en prenant garde aux Compagnies des Indes"
- "Le dénouement n'est jamais certain et chaque tour donne le frisson !"

**Key Features (with pirate-themed icons):**
1. **Jouez en simultané**
   - Navigation secrète avec rose des vents
   - Actions simultanées (no waiting for turns)
   
2. **Mécanique fluide**
   - Système de combat par dés
   - Abordages et tirs de canons
   
3. **Une épopée**
   - Deux objectifs épiques: trésor d'Armand ou 25 pièces d'or
   - Le passage du Rougeaud (15 pièces bonus!)

4. **Profondeur de jeu**
   - Îles aux actions uniques
   - Combos infinis
   - Navires asymétriques

5. **Jouabilité et rejouabilité**
   - Plateau modulable (10 navires, 24 boucaniers uniques)
   - Chaque partie est unique

6. **Univers immersif**
   - Indices formant une frise continue
   - Histoire d'Armand le Baratineur cachée

**Game Components Display:**
```typescript
<ComponentShowcase>
  - 12 figurines de bateaux (3D printed, dual-color PLA)
  - 10 fiches de bateaux
  - 1 compass (rose des vents)
  - 35 lettres de marque
  - 40 jetons de dégâts et 20 d'améliorations
  - 15 pièces d'or
  - 30 pièces de 1
  - 19 tuiles île
  - 20 rhums, 20 poudres à canon, 20 cannes à sucre
  - 24 cartes boucaniers
  - 9 cartes îles, 9 cartes indices
  - 1 livret de règles illustré (30 pages)
</ComponentShowcase>
```

**Historical Documentation:**
- Caribbean maritime history
- Ship descriptions and roles
- Pirate equipment and crew positions
- Historical accuracy notes

**Customization Features:**
- Blank flag tokens for personalization
- Draw or print your own pirate colors

### 3. L'équipe Page

**Team Introduction:**
```typescript
<TeamSection>
  <SectionTitle>Les Corsaires de Picaron</SectionTitle>
  
  <TeamMember>
    <Portrait src="vincent-tellier.jpg" />
    <NamePlate>Vincent Tellier</NamePlate>
    <Role>Capitaine & Créateur</Role>
    <Description>
      Concepteur du jeu et des mécaniques, auteur des illustrations, 
      modéleur des figurines. Mondu d'histoire.
    </Description>
  </TeamMember>
  
  <TeamMember>
    <Portrait src="thierry-durand.jpg" />
    <NamePlate>Thierry Durand</NamePlate>
    <Role>Quartier-maître</Role>
    <Description>
      Concepteur de l'idée première, éternel insatisfait, 
      qui dépouille le jeu de chaque défaut.
    </Description>
  </TeamMember>
  
  <TeamMember>
    <Portrait src="remi-durand.jpg" />
    <NamePlate>Rémi Durand</NamePlate>
    <Role>Maître Charpentier</Role>
    <Description>
      Fabricant des figurines. Ingénieur chevronné et pointilleux.
      Expert en impression 3D, assure la qualité de fabrication.
    </Description>
  </TeamMember>
  
  <TeamMember>
    <Portrait src="maxime-richard.jpg" />
    <NamePlate>Maxime Richard</NamePlate>
    <Role>Navigateur</Role>
    <Description>
      Directeur du Cercle de l'Orbite Galactique qui chapeaute le projet.
    </Description>
  </TeamMember>
</TeamSection>
```

**Company Values (styled as "Code des Pirates"):**
- Excellence fabrication française
- Jeux stratégiques immersifs
- Respect de l'histoire maritime
- Innovation dans les mécaniques de jeu

### 4. Contact Page

**Contact Form:**
```typescript
// API Route: /api/contact
export async function POST(request: Request) {
  const formData = await request.json();
  // Send email to contact@picaron.fr
  // Using nodemailer or similar
}
```

**Form Design:**
- Styled as ship's logbook entry
- Fields:
  - Name (Nom/Name)
  - Email (Courriel/Email)  
  - Subject (Sujet/Subject)
  - Message (Message/Message)
- Submit button: "Send by Carrier Pigeon"
- Success: Message in bottle animation
- Error: Shipwreck animation

### 5. Boutique Page

**Temporary State:**
```typescript
<BoutiquePage>
  <ComingSoon>
    - "Treasure Vault Under Construction"
    - Animated construction with pirates working
    - Newsletter signup for launch notification
    - Link styled as inactive (grayed out)
  </ComingSoon>
</BoutiquePage>
```

---

## Interactive Elements & Animations

### Scroll Animations
```typescript
// Using Framer Motion
const scrollVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8,
      ease: "easeOut"
    }
  }
};
```

### Hover Effects
- **Cards:** Lift with shadow, slight rotation
- **Buttons:** Glow effect, scale 1.05
- **Images:** Reveal caption on old paper
- **Links:** Underline animates like rope

### Loading States
- Ship's wheel spinning
- "Charting course..." text
- Progress shown as ship journey

### Easter Eggs
- Hidden treasure clickables
- Konami code reveals special content
- Shake device: storm effect

---

## Multilingual Implementation

### Using next-intl
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const locale = negotiateLocale(request);
  // Handle /fr and /en routes
}

// Translation structure
{
  "home": {
    "hero": {
      "title": "Le jeu de société Boucaniers arrive cette année !",
      "cta": "Découvrir Boucaniers"
    }
  }
}
```

### Language Toggle
- Styled as ship's flag
- Smooth transition between languages
- Persistent user preference

---

## Asset Management

### Image Optimization
```typescript
// Using Next.js Image component
<Image 
  src="/assets/images/PICARON_LOGO.png"
  alt={t('logo.alt')}
  width={200}
  height={100}
  priority
/>
```

### Dynamic Asset Loading
```typescript
// Asset loader utility
export const loadAsset = (path: string) => {
  return `/assets/${path}`;
};
```

### Video Integration
- Lazy loading for performance
- Custom controls matching theme
- Fallback poster images

---

## SEO & Performance

### Meta Tags
```typescript
export const metadata: Metadata = {
  title: {
    template: '%s | Picaron - Jeux de société',
    default: 'Picaron - Créateurs de Boucaniers'
  },
  description: 'Découvrez Boucaniers, le nouveau jeu de société...',
  openGraph: {
    images: ['/assets/images/og-image.jpg']
  }
};
```

### Performance Optimizations
- Static generation where possible
- Image optimization with sharp
- Font subsetting
- CSS modules for scoped styles
- Lazy loading for below-fold content

---

## Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
/* Mobile: 0-768px */
/* Tablet: 768px-1024px */
/* Desktop: 1024px+ */
/* Large: 1440px+ */
```

### Mobile Adaptations
- Compass navigation → Hamburger menu
- Simplified animations
- Touch-friendly buttons (min 44px)
- Vertical card layouts
- Reduced parallax effects

### Tablet Optimizations
- Two-column layouts
- Maintained decorative elements
- Touch gestures for gallery

---

## Email Integration

### Contact Form Handler
```typescript
// /app/api/contact/route.ts
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  const { name, email, subject, message } = await request.json();
  
  const transporter = nodemailer.createTransport({
    // SMTP configuration
  });
  
  await transporter.sendMail({
    from: email,
    to: 'contact@picaron.fr',
    subject: `[Site Web] ${subject}`,
    html: emailTemplate({ name, email, message })
  });
  
  return Response.json({ success: true });
}
```

---

## Development Roadmap

### Phase 1: Foundation (Week 1)
- Next.js setup with i18n
- Basic routing structure
- Design system implementation
- Asset organization

### Phase 2: Core Pages (Week 2)
- Homepage with animations
- Boucaniers page with content
- Responsive navigation

### Phase 3: Interactive Features (Week 3)
- Contact form with email
- Newsletter integration
- Social media links
- Advanced animations

### Phase 4: Polish (Week 4)
- Performance optimization
- SEO implementation
- Testing & debugging
- Deployment to production

---

## Deployment

### Hosting Options
- Vercel (optimal for Next.js)
- Custom VPS with Node.js
- Docker containerization

### Environment Variables
```env
NEXT_PUBLIC_SITE_URL=https://picaron.fr
EMAIL_HOST=smtp.provider.com
EMAIL_USER=contact@picaron.fr
EMAIL_PASS=secure_password
```

### CI/CD Pipeline
- GitHub Actions for testing
- Automatic deployment on merge
- Preview deployments for PRs
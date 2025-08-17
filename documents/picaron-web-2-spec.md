# Picaron - Pirate-Themed Board Game Website Design Documentation

## Project Overview

**Company:** Picaron - Board Game Publisher  
**Main Product:** Boucaniers - Strategic Simultaneous Play Board Game  
**Framework:** Next.js with App Router  
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
  /assets_game (assets used for a video game prototype)
  /assets_kick (assets used for the kickstarter)
  /assets_old_web (assets used in previous minimal webpage)

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

/* hinted-OldStyle1HPLHS is a custom font provided in asset hinted-OldStyle1HPLHS */

--font-display: "hinted-OldStyle1HPLHS", "Pirata One", "Cinzel", serif; /* Headers */
--font-secondary: "hinted-OldStyle1HPLHS", "Crimson Text", "Playfair Display",
  serif; /* Subheaders */
--font-body: "EB Garamond", "Georgia", serif; /* Body text */
--font-script: "Kalam", "Dancing Script", cursive; /* Annotations */
```

**Font Sizes:**

- H1: clamp(3rem, 8vw, 6rem) - Main titles
- H2: clamp(2rem, 5vw, 3.5rem) - Section headers
- H3: clamp(1.5rem, 3vw, 2rem) - Subsections
- Body: 1.125rem (18px) - Optimal readability
- Small: 0.875rem - Metadata, captions

### Components Library

#### Navigation Component

- Menu on top
  -- Picaron logo on the top Left, should be clearly lisible (asset/PICARON_LOGO.png)
  -- menus entries are aligned on the top right in this order: Picaron, Boucaniers, Equipe/Team, Boutique/shop

- Fixed background for all website asset/background6.jpg

## Page Specifications

### 1. Homepage (Accueil)

Complete Homepage using the most content of picaron.fr webpage. Including video
assets from this webpage are in assets/assets_old_web

**Hero Section:**

```typescript
<HeroSection>
  - Full-screen treasure map background with Caribbean archipelago - Animated
  title: "Le jeu de société Boucaniers arrive cette année !" - Subtitle: "Le
  Panache de la stratégie en simultané - 2 à 5 joueurs" - Floating compass
  pointing to CTA - Fog animation revealing content
</HeroSection>
```

**Content Blocks:**

. **Social Follow Section**

- "Suivez nous" in decorative frame
- Social icons as nautical instruments
- Hover: glow effect

. **Newsletter Signup**

- Styled as "Message in a Bottle"
- Input field with quill pen icon
- Success animation: bottle floating away

. **Video Section**

- Embedded video from assets showing gameplay (same than picaron.fr)
- Custom player controls (ship wheel for play)
- Link to Tabletop Simulator demo

### 2. Boucaniers Page

Please get the content from the pdf "BOUCANIERS by Vincent Tellier — Kickstarter.pdf"
The assets are in assets/assets_kick

Starting at "Story"
Sttopping at "Sinon, celle-ci continue"
Skip before and after.

Add the same component to follow and newsletter from the main page at the bottom

### 3. L'équipe Page

Assets for portraits are in assets/assets_kick

**Team Introduction:**

```typescript
<TeamSection>
  <SectionTitle>Les Corsaires de Picaron</SectionTitle>

  <TeamMember>
    <Portrait src="vincent-tellier.jpg" />
    <NamePlate>Vincent Tellier</NamePlate>
    <Role>Capitaine & Créateur</Role>
    <Description>
      Concepteur du jeu et des mécaniques, auteur des illustrations, modéleur
      des figurines. Mondu d'histoire.
    </Description>
  </TeamMember>

  <TeamMember>
    <Portrait src="thierry-durand.jpg" />
    <NamePlate>Thierry Durand</NamePlate>
    <Role>Quartier-maître</Role>
    <Description>
      Concepteur de l'idée première, éternel insatisfait, qui dépouille le jeu
      de chaque défaut.
    </Description>
  </TeamMember>

  <TeamMember>
    <Portrait src="remi-durand.jpg" />
    <NamePlate>Rémi Durand</NamePlate>
    <Role>Maître Charpentier</Role>
    <Description>
      Fabricant des figurines. Ingénieur chevronné et pointilleux. Expert en
      impression 3D, assure la qualité de fabrication.
    </Description>
  </TeamMember>
</TeamSection>
```

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
    - "Treasure Vault Under Construction" - Animated construction with pirates
    working - Newsletter signup for launch notification - Link styled as
    inactive (grayed out)
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
      ease: "easeOut",
    },
  },
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
  alt={t("logo.alt")}
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
    template: "%s | Picaron - Jeux de société",
    default: "Picaron - Créateurs de Boucaniers",
  },
  description: "Découvrez Boucaniers, le nouveau jeu de société...",
  openGraph: {
    images: ["/assets/images/og-image.jpg"],
  },
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

- Top menu replaced by a foldable menu.
- Simplified animations
- Touch-friendly buttons (min 44px)
- Vertical card layouts
- Reduced parallax effects

---

## Email Integration

### Contact Form Handler

```typescript
// /app/api/contact/route.ts
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  const { name, email, subject, message } = await request.json();

  const transporter = nodemailer.createTransport({
    // SMTP configuration
  });

  await transporter.sendMail({
    from: email,
    to: "contact@picaron.fr",
    subject: `[Site Web] ${subject}`,
    html: emailTemplate({ name, email, message }),
  });

  return Response.json({ success: true });
}
```

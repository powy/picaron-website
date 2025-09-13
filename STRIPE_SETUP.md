# Configuration Stripe pour Boucaniers

## 🔧 Étapes de configuration

### 1. Créer un compte Stripe
1. Aller sur [https://stripe.com](https://stripe.com)
2. Créer un compte professionnel
3. Compléter la vérification d'identité et les informations bancaires
4. Activer votre compte pour la France

### 2. Configurer le produit dans Stripe Dashboard
1. Se connecter au [Dashboard Stripe](https://dashboard.stripe.com)
2. Aller dans **Produits** → **Ajouter un produit**
3. Configurer le produit:
   ```
   Nom: Boucaniers
   Description: Jeu de société Boucaniers
   Image: Uploader votre meilleure photo du jeu
   Prix: 69,00 € (Ponctuel)
   ID du prix: Sauvegarder cet ID pour plus tard
   ```

### 3. Récupérer les clés API
1. Dans le Dashboard Stripe → **Développeurs** → **Clés API**
2. Copier:
   - Clé publiable de test: `pk_test_...`
   - Clé secrète de test: `sk_test_...`

### 4. Configurer le webhook
1. Dans **Développeurs** → **Webhooks**
2. Ajouter un endpoint:
   ```
   URL: https://votre-site.vercel.app/api/stripe-webhook
   Événements à écouter:
   - checkout.session.completed
   - payment_intent.succeeded
   ```
3. Copier le secret du webhook: `whsec_...`

### 5. Variables d'environnement
Créer `.env.local` avec:
```env
# Stripe - Mode Test
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# URL de votre site
NEXT_PUBLIC_DOMAIN=http://localhost:3000

# ID du prix Stripe pour Boucaniers
STRIPE_PRICE_ID=price_xxxxx
```

## 🧪 Test avec carte de test
- Numéro: `4242 4242 4242 4242`
- Date d'expiration: N'importe quelle date future
- CVC: N'importe quel 3 chiffres
- Code postal: N'importe quel code valide

## 📦 Structure implémentée
```
app/
├── lib/
│   └── stripe.ts              # Configuration Stripe
├── api/
│   ├── create-checkout-session/
│   │   └── route.ts           # API création session
│   └── stripe-webhook/
│       └── route.ts           # Webhook Stripe
├── [locale]/
│   ├── boutique/
│   │   └── page.tsx           # Page boutique complète
│   ├── commande/
│   │   ├── succes/
│   │   │   └── page.tsx       # Page de succès
│   │   └── annulation/
│   │       └── page.tsx       # Page d'annulation
│   ├── cgv/
│   │   └── page.tsx           # Conditions générales
│   ├── mentions-legales/
│   │   └── page.tsx           # Mentions légales
│   └── politique-confidentialite/
│       └── page.tsx           # Politique de confidentialité
```

## ✅ Fonctionnalités implémentées
- ✅ Page boutique avec galerie d'images
- ✅ Sélecteur de quantité
- ✅ Intégration Stripe Checkout
- ✅ Pages de succès et annulation
- ✅ Pages légales complètes
- ✅ Support multilingue (FR/EN)
- ✅ Design cohérent avec le thème pirate
- ✅ Livraison France uniquement
- ✅ Prix: 69,00 € TTC
- ✅ Calcul automatique de la date de livraison (mi-décembre)

## 🚀 Déploiement
1. Configurer les variables d'environnement sur Vercel
2. Déployer l'application
3. Mettre à jour l'URL du webhook dans Stripe
4. Tester le processus complet

## 📞 Support
Pour toute question, contactez: contact@picaron.fr
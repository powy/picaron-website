# Environment Variables Setup Guide

This guide covers all environment variables needed for the Picaron website to function properly.

## Table of Contents

1. [Overview](#overview)
2. [EmailJS Configuration (Contact Form)](#emailjs-configuration-contact-form)
3. [Stripe Configuration (Payments)](#stripe-configuration-payments)
4. [CAPTCHA Configuration](#captcha-configuration)
5. [Setting Variables in Vercel](#setting-variables-in-vercel)
6. [Local Development Setup](#local-development-setup)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## Overview

The Picaron website requires environment variables for:
- **Contact Form**: EmailJS for sending contact form submissions to contact@picaron.fr
- **Payments**: Stripe for processing game purchases
- **CAPTCHA**: Friendly-Challenge for spam protection (no configuration needed)

**Total variables needed: 8**

---

## EmailJS Configuration (Contact Form)

### Required Variables (3)

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

### Step-by-Step Setup

#### 1. Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

#### 2. Add Email Service

1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Select **Gmail** (since you're sending to contact@picaron.fr)
4. Follow the OAuth flow to connect your Gmail account
5. Name your service (e.g., "Picaron Contact")
6. Click **Create Service**
7. **Copy the Service ID** - this is your `NEXT_PUBLIC_EMAILJS_SERVICE_ID`

#### 3. Create Email Template

1. Go to **Email Templates** in your EmailJS dashboard
2. Click **Create New Template**
3. Configure the template:

   **Template Name**: `Picaron Contact Form`

   **To Email**: `contact@picaron.fr`

   **From Name**: `{{name}}`

   **From Email**: `{{email}}`

   **Subject**: `[Picaron Contact] {{subject}}`

   **Content**:
   ```
   Nouveau message depuis le formulaire de contact Picaron:

   Nom: {{name}}
   Email: {{email}}
   Sujet: {{subject}}

   Message:
   {{message}}
   ```

4. Click **Save**
5. **Copy the Template ID** - this is your `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`

#### 4. Get Public Key

1. Go to **Account** (top right corner)
2. Click **General** tab
3. Find **Public Key** section
4. **Copy the Public Key** - this is your `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`

### Free Tier Limits

- 200 emails per month (free tier)
- Upgrade to paid plan if you need more

---

## Stripe Configuration (Payments)

### Required Variables (5)

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRICE_ID=price_xxxxx
NEXT_PUBLIC_DOMAIN=https://your-site.vercel.app
```

### Step-by-Step Setup

For detailed Stripe setup instructions, see **[STRIPE_SETUP.md](./STRIPE_SETUP.md)**

#### Quick Reference

1. **Create Stripe Account**: [https://stripe.com](https://stripe.com)
2. **Get API Keys**: Dashboard → Developers → API Keys
   - Copy **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Copy **Secret key** → `STRIPE_SECRET_KEY`
3. **Create Product**: Dashboard → Products → Add Product
   - Name: "Boucaniers"
   - Price: 69,00 €
   - Copy **Price ID** → `STRIPE_PRICE_ID`
4. **Setup Webhook**: Dashboard → Developers → Webhooks
   - URL: `https://your-site.vercel.app/api/stripe-webhook`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`
   - Copy **Webhook Secret** → `STRIPE_WEBHOOK_SECRET`
5. **Set Domain**: Your production URL → `NEXT_PUBLIC_DOMAIN`

### Test vs Production Keys

- **Development/Staging**: Use `pk_test_` and `sk_test_` keys
- **Production**: Switch to `pk_live_` and `sk_live_` keys after going live

### Test Card

For testing payments:
- Card Number: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- Postal Code: Any valid code

---

## CAPTCHA Configuration

### Friendly-Challenge (No Setup Required!)

Good news! The contact form uses **Friendly-Challenge**, a privacy-focused CAPTCHA that:
- ✅ Requires **NO account** or registration
- ✅ Requires **NO environment variables**
- ✅ Works out of the box
- ✅ GDPR compliant
- ✅ No tracking or cookies

The default test sitekey (`FCMIBKUMT9BPQB3V`) is already configured in the code and works for all domains.

### Optional: Custom Sitekey

If you want to generate your own sitekey for production:

1. Go to [https://friendlycaptcha.com/](https://friendlycaptcha.com/)
2. Create a free account
3. Generate a sitekey for your domain
4. Update the `data-sitekey` attribute in `app/[locale]/contact/page.tsx:202`

**For most users, this is optional. The default sitekey works fine.**

---

## Setting Variables in Vercel

### Vercel Dashboard Setup

1. Go to your project on [https://vercel.com](https://vercel.com)
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - **Key**: Variable name (e.g., `NEXT_PUBLIC_EMAILJS_SERVICE_ID`)
   - **Value**: Your actual value
   - **Environments**: Select all three:
     - ✅ Production
     - ✅ Preview
     - ✅ Development

4. Click **Save** for each variable

### Complete Variable List for Vercel

Copy this checklist and fill in your values:

```
☐ NEXT_PUBLIC_EMAILJS_SERVICE_ID
☐ NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
☐ NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
☐ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
☐ STRIPE_SECRET_KEY
☐ STRIPE_WEBHOOK_SECRET
☐ STRIPE_PRICE_ID
☐ NEXT_PUBLIC_DOMAIN
```

### Important Notes

- Variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Variables without `NEXT_PUBLIC_` are server-side only (more secure)
- After adding/changing variables, **redeploy your app** for changes to take effect

### Redeploying After Changes

1. Go to **Deployments** tab
2. Click the **⋮** menu on the latest deployment
3. Select **Redeploy**
4. Or push a new commit to trigger automatic deployment

---

## Local Development Setup

For local development, create a `.env.local` file in the `picaron_web_2` directory:

```bash
# Copy the example file
cp .env.example .env.local
```

Then edit `.env.local` with your actual values:

```env
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxxxx
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxx

# Stripe Configuration (use test keys for development)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_PRICE_ID=price_xxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_DOMAIN=http://localhost:3000
```

**Important**:
- Never commit `.env.local` to git (it's already in `.gitignore`)
- Use Stripe **test keys** for local development
- Use `http://localhost:3000` for `NEXT_PUBLIC_DOMAIN` locally

---

## Testing

### Test Contact Form

1. Go to the contact page: `/contact` or `/en/contact`
2. Fill out all fields with valid data
3. Complete the Friendly-Challenge CAPTCHA (simple puzzle)
4. Click "Envoyer votre message"
5. Check for success message
6. Verify email arrives at `contact@picaron.fr`

### Test Stripe Checkout

1. Go to the shop page: `/boutique` or `/en/shop`
2. Select quantity and click "Acheter maintenant"
3. Use test card: `4242 4242 4242 4242`
4. Complete checkout
5. Verify redirect to success page
6. Check Stripe dashboard for test payment

### Common Test Issues

**Contact form shows "Error sending"**
- Check EmailJS variables are set correctly
- Verify EmailJS service is active
- Check browser console for specific error

**Stripe checkout fails**
- Verify all 5 Stripe variables are set
- Ensure using correct key type (test vs live)
- Check webhook URL matches your domain

**CAPTCHA doesn't appear**
- Check that friendly-challenge package is installed (`npm install`)
- Verify no browser extensions are blocking it
- Check browser console for errors

---

## Troubleshooting

### Contact Form Issues

#### "Veuillez compléter le CAPTCHA" error
- Make sure you complete the Friendly-Challenge puzzle
- Try refreshing the page if the CAPTCHA doesn't load
- Check browser console for JavaScript errors

#### Email not sending
1. Verify all 3 EmailJS variables are set in Vercel
2. Check EmailJS dashboard for quota limits (200/month on free tier)
3. Verify the email template is active
4. Check that Gmail service is connected in EmailJS
5. Look for errors in Vercel function logs

#### Emails going to spam
- Add your domain to SPF/DKIM records
- Use a verified email domain in EmailJS
- Consider upgrading to EmailJS paid plan

### Stripe Payment Issues

#### "Invalid API Key" error
- Verify `STRIPE_SECRET_KEY` is set correctly
- Ensure no extra spaces in the key
- Check you're using the right environment (test vs live)

#### Webhook not working
1. Verify `STRIPE_WEBHOOK_SECRET` is correct
2. Check webhook URL in Stripe dashboard matches your domain
3. Ensure webhook is listening for correct events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
4. Test webhook using Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe-webhook`

#### Wrong price shown
- Verify `STRIPE_PRICE_ID` matches the product in Stripe dashboard
- Create new price if needed and update the variable

### Vercel Deployment Issues

#### Variables not taking effect
- Redeploy after adding/changing variables
- Check variables are set for the correct environment (Production/Preview/Development)
- Clear Vercel cache if needed

#### Build fails after changes
- Run `npm install` locally to ensure dependencies are correct
- Check for TypeScript errors: `npm run build`
- Verify all required packages are in `package.json`

### Still Having Issues?

1. Check Vercel function logs: Project → Deployments → Click deployment → Functions tab
2. Check browser console for client-side errors
3. Verify `.env.example` matches what you've set in Vercel
4. Contact support: `contact@picaron.fr`

---

## Security Best Practices

### DO:
- ✅ Use environment variables for all secrets
- ✅ Use test keys for development/staging
- ✅ Switch to live keys only for production
- ✅ Rotate keys if compromised
- ✅ Monitor Stripe dashboard for unusual activity

### DON'T:
- ❌ Commit `.env.local` to git
- ❌ Share secret keys publicly
- ❌ Use live keys in development
- ❌ Hardcode secrets in source code
- ❌ Use same keys across multiple environments

---

## Summary Checklist

Before deploying to production:

```
☐ EmailJS account created
☐ EmailJS service connected to Gmail
☐ EmailJS template configured with contact@picaron.fr
☐ All 3 EmailJS variables set in Vercel
☐ Stripe account created and verified
☐ Stripe product "Boucaniers" created at 69€
☐ Stripe webhook configured
☐ All 5 Stripe variables set in Vercel
☐ Contact form tested successfully
☐ Test payment completed successfully
☐ Switched to Stripe live keys for production
☐ Webhook URL updated for production domain
☐ NEXT_PUBLIC_DOMAIN set to production URL
```

---

## Quick Reference

| Variable | Where to Get It | Used For |
|----------|----------------|----------|
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | EmailJS → Email Services | Contact form |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | EmailJS → Email Templates | Contact form |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | EmailJS → Account → General | Contact form |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe → Developers → API Keys | Payment checkout |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API Keys | Payment processing |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Developers → Webhooks | Payment verification |
| `STRIPE_PRICE_ID` | Stripe → Products → Price ID | Product pricing |
| `NEXT_PUBLIC_DOMAIN` | Your Vercel URL | Redirects & webhooks |

---

For more detailed Stripe setup, see **[STRIPE_SETUP.md](./STRIPE_SETUP.md)**

For general questions, contact: `contact@picaron.fr`

import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_default', {
  apiVersion: '2025-08-27.basil',
});
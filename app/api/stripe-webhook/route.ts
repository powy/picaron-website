import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/app/lib/stripe';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Erreur webhook:', error);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;

      // Ici, vous pouvez:
      // - Envoyer un email de confirmation
      // - Enregistrer la commande dans une base de données
      // - Déclencher le processus de fulfillment

      console.log('Commande complétée:', {
        sessionId: session.id,
        customerEmail: session.customer_details?.email,
        amount: session.amount_total,
        shipping: session.shipping_cost,
        metadata: session.metadata,
      });

      break;

    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('Paiement réussi:', paymentIntent.id);
      break;

    default:
      console.log(`Événement non géré: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
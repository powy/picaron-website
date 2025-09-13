import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/app/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { quantity, locale } = await req.json();

    // Calcul de la date de livraison (mi-décembre)
    const getDeliveryDate = () => {
      const today = new Date();
      const currentYear = today.getFullYear();
      const december15 = new Date(currentYear, 11, 15); // 15 décembre

      if (today > december15) {
        // Si on a dépassé le 15 décembre, livraison mi-décembre année suivante
        return new Date(currentYear + 1, 11, 15);
      }
      return december15;
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID || 'price_default',
          quantity: quantity || 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000'}/${locale}/commande/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000'}/${locale}/commande/annulation`,
      locale: locale === 'fr' ? 'fr' : 'en',
      shipping_address_collection: {
        allowed_countries: ['FR'], // France uniquement pour l'instant
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0, // Frais de port à définir
              currency: 'eur',
            },
            display_name: locale === 'fr' ? 'Livraison standard' : 'Standard delivery',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 10,
              },
            },
          },
        },
      ],
      metadata: {
        product: 'boucaniers',
        delivery_date: getDeliveryDate().toISOString(),
        locale: locale,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Erreur création session:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session' },
      { status: 500 }
    );
  }
}
import { PRODUCTS } from '@/lib/products'
import { computeShippingCents } from '@/lib/shipping'
import type { ShippingMethod } from '@/lib/checkout/order'

const SITE_URL = 'https://picaron.fr'

// Schema.org Product data for search engines. Price, barcode and image come
// from lib/products.ts and the delivery fees from lib/shipping.ts; the
// description and availability mirror the visible shop page; the seller and
// return policy mirror the CGV (sections 1 and 10).
export default function ProductJsonLd({ locale, description }: { locale: string; description: string }) {
  const product = PRODUCTS.boucaniers
  const url = `${SITE_URL}/${locale}/boutique`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Boucaniers',
    sku: product.id,
    gtin13: product.gtin13,
    url,
    category: locale === 'fr' ? 'Jeux de société' : 'Board games',
    description,
    image: `${SITE_URL}${encodeURI(product.image)}`,
    brand: { '@type': 'Brand', name: 'Picaron' },
    audience: { '@type': 'PeopleAudience', suggestedMinAge: 10 },
    offers: {
      '@type': 'Offer',
      url,
      price: (product.priceCents / 100).toFixed(2),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/LimitedAvailability',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: 'Picaron SARL', url: SITE_URL },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'FR',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 14,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/ReturnFeesCustomerResponsibility',
      },
      // The fee for one copy of the game, per carrier.
      shippingDetails: (['mondial_relay', 'colissimo'] as ShippingMethod[]).map((method) => ({
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: (computeShippingCents([{ productId: product.id, quantity: 1 }], method) / 100).toFixed(2),
          currency: 'EUR',
        },
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'FR' },
        // Upper bounds kept generous on purpose.
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 15, unitCode: 'DAY' },
          transitTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 7, unitCode: 'DAY' },
        },
      })),
    },
  }

  return (
    <script
      type="application/ld+json"
      // Escape "<" so the JSON can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
    />
  )
}

import { PRODUCTS } from '@/lib/products'

const SITE_URL = 'https://picaron.fr'

// Schema.org Product data for search engines. Price and image come from
// lib/products.ts; the description and availability mirror the visible shop page;
// the seller and return policy mirror the CGV (sections 1 and 10).
export default function ProductJsonLd({ locale }: { locale: string }) {
  const product = PRODUCTS.boucaniers
  const url = `${SITE_URL}/${locale}/boutique`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Boucaniers',
    sku: product.id,
    url,
    category: 'Jeux de société',
    description:
      'Jeu de stratégie en simultané. Pour 2 à 5 joueurs à partir de 10 ans et des parties de 30 à 60 minutes.',
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
      // shippingDetails: add once the real rates in lib/shipping.ts are set.
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

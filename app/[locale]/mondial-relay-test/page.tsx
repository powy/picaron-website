'use client'

import Link from 'next/link'
import MondialRelayPicker, { ParcelShopData } from '@/components/checkout/MondialRelayPicker'

const BRAND_CODE = process.env.NEXT_PUBLIC_MONDIAL_RELAY_BRAND_CODE || 'BDTEST'

export default function MondialRelayTestPage() {
  const handleSelect = (data: ParcelShopData) => {
    console.log('Parcel shop selected:', data)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 mt-8 pb-16">
      <h1 className="title-page">PoC — Widget Mondial Relay</h1>

      <p className="text-ink font-oldstyle mb-2">
        Page de test isolée (non liée au checkout, non liée à la navigation du site).
        Code Brand actuel : <strong>{BRAND_CODE}</strong>
        {BRAND_CODE === 'BDTEST' && ' (code de test public, en attente du vrai code Mondial Relay du contrat Picaron)'}
      </p>

      <ul className="text-sm text-ink font-oldstyle mb-6 list-disc pl-5 stack-y-1">
        <li>Le widget doit s'afficher correctement au chargement</li>
        <li>Une recherche par code postal doit retourner des résultats</li>
        <li>La sélection d'un point relais doit logger les données en console</li>
        <li>Naviguer vers l'accueil puis revenir ne doit pas casser le widget</li>
        <li>Aucune erreur console liée à un conflit React/jQuery</li>
      </ul>

      <Link href="/" className="inline-block mb-6 underline text-pirate-red">
        ← Retour à l'accueil (pour tester la navigation)
      </Link>

      <MondialRelayPicker onSelect={handleSelect} />
    </div>
  )
}

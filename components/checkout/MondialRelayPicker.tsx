'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import type { ParcelShopData } from '@/lib/checkout/order'

export type { ParcelShopData }

// Untyped third-party globals loaded by the Mondial Relay widget scripts.
/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    $?: any
    jQuery?: any
    L?: any
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const BRAND_CODE = process.env.NEXT_PUBLIC_MONDIAL_RELAY_BRAND_CODE || 'BDTEST'

// next/script dedupes by src and won't re-fire onLoad for a script already
// present in the DOM from a previous mount (client-side nav away and back).
// Check the globals directly on mount so a remount picks up scripts that are
// already loaded instead of waiting forever for an onLoad that will never
// come again.
const isJqueryLoaded = () => typeof window !== 'undefined' && !!window.$
const isLeafletLoaded = () => typeof window !== 'undefined' && !!window.L
const isWidgetScriptLoaded = () =>
  typeof window !== 'undefined' && !!window.$?.fn?.MR_ParcelShopPicker

interface MondialRelayPickerProps {
  onSelect: (shop: ParcelShopData) => void
}

export default function MondialRelayPicker({ onSelect }: MondialRelayPickerProps) {
  const widgetZoneRef = useRef<HTMLDivElement>(null)
  const initializedRef = useRef(false)
  const onSelectRef = useRef(onSelect)
  useEffect(() => {
    onSelectRef.current = onSelect
  })

  const [jqueryReady, setJqueryReady] = useState(isJqueryLoaded)
  const [leafletReady, setLeafletReady] = useState(isLeafletLoaded)
  const [widgetScriptReady, setWidgetScriptReady] = useState(isWidgetScriptLoaded)

  useEffect(() => {
    if (!widgetScriptReady || !widgetZoneRef.current || initializedRef.current) return
    if (!window.$) return

    initializedRef.current = true

    window.$(widgetZoneRef.current).MR_ParcelShopPicker({
      Target: 'mr-widget-target',
      Brand: BRAND_CODE,
      Country: 'FR',
      Responsive: true,
      ShowResultsOnMap: true,
      OnParcelShopSelected: (data: ParcelShopData) => {
        onSelectRef.current(data)
      },
    })
  }, [widgetScriptReady])

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />

      <Script
        src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"
        strategy="afterInteractive"
        onLoad={() => setJqueryReady(true)}
      />

      {jqueryReady && (
        <Script
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          strategy="afterInteractive"
          onLoad={() => setLeafletReady(true)}
        />
      )}

      {jqueryReady && leafletReady && (
        <Script
          src="https://widget.mondialrelay.com/parcelshop-picker/jquery.plugin.mondialrelay.parcelshoppicker.min.js"
          strategy="afterInteractive"
          onLoad={() => setWidgetScriptReady(true)}
        />
      )}

      <input type="hidden" id="mr-widget-target" />
      <div ref={widgetZoneRef} id="mr-widget-zone" className="border-2 border-wood rounded-sm min-h-[400px]" />
    </>
  )
}

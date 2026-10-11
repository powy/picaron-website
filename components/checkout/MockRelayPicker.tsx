'use client';

// Offline stand-in for MondialRelayPicker (NEXT_PUBLIC_RELAY_PICKER=mock):
// no CDN scripts, no Mondial Relay API. Same onSelect contract, so the
// address page and the order payload behave exactly as with the real widget.

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ParcelShopData } from '@/lib/checkout/order';

const FAKE_RELAYS: Omit<ParcelShopData, 'CP' | 'Ville'>[] = [
  { ID: 'TEST01', Nom: 'Tabac de la Place (TEST)', Adresse1: '1 place de la Mairie', Pays: 'FR' },
  { ID: 'TEST02', Nom: 'Librairie du Port (TEST)', Adresse1: '12 quai des Corsaires', Pays: 'FR' },
  { ID: 'TEST03', Nom: 'Épicerie Centrale (TEST)', Adresse1: '5 rue du Commerce', Adresse2: 'Bâtiment B', Pays: 'FR' },
];

const CITY_BY_POSTAL_CODE: Record<string, string> = {
  '75001': 'Paris',
  '69001': 'Lyon',
  '13001': 'Marseille',
  '33000': 'Bordeaux',
};

interface MockRelayPickerProps {
  onSelect: (shop: ParcelShopData) => void;
}

export default function MockRelayPicker({ onSelect }: MockRelayPickerProps) {
  const t = useTranslations('checkout.relay.mock');
  const [postalCode, setPostalCode] = useState('75001');
  const [results, setResults] = useState<ParcelShopData[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const search = () => {
    const cp = /^\d{5}$/.test(postalCode.trim()) ? postalCode.trim() : '75001';
    const city = CITY_BY_POSTAL_CODE[cp] ?? 'Ville Test';
    setResults(FAKE_RELAYS.map((relay) => ({ ...relay, ID: `${relay.ID}-${cp}`, CP: cp, Ville: city })));
    setSelectedId(null);
  };

  return (
    <div className="border-2 border-dashed border-wood rounded p-4 space-y-4" data-testid="mock-relay-picker">
      <p className="text-sm text-ink italic">{t('notice')}</p>

      <div className="flex gap-2">
        <label htmlFor="mock-relay-cp" className="sr-only">
          {t('postalCodeLabel')}
        </label>
        <input
          id="mock-relay-cp"
          className="input-field max-w-[10rem]"
          value={postalCode}
          placeholder={t('postalCodeLabel')}
          onChange={(e) => setPostalCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              search();
            }
          }}
        />
        <button type="button" className="btn-primary-rounded" onClick={search}>
          {t('search')}
        </button>
      </div>

      {results.length > 0 && (
        <ul className="space-y-2">
          {results.map((relay) => (
            <li
              key={relay.ID}
              className={`flex flex-wrap items-center justify-between gap-2 border-2 rounded p-3 ${
                selectedId === relay.ID ? 'border-pirate-red bg-parchment/30' : 'border-wood'
              }`}
            >
              <span className="text-sm text-ink">
                <strong>{relay.Nom}</strong> — {relay.Adresse1}
                {relay.Adresse2 ? `, ${relay.Adresse2}` : ''}, {relay.CP} {relay.Ville}
              </span>
              <button
                type="button"
                className="link-pirate text-sm"
                onClick={() => {
                  setSelectedId(relay.ID);
                  onSelect(relay);
                }}
              >
                {selectedId === relay.ID ? t('selected') : t('choose')}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

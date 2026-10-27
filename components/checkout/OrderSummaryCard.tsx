'use client';

import { useTranslations } from 'next-intl';
import { formatPriceCents } from '@/lib/products';
import type { OrderSummary } from '@/lib/checkout/order';

/** Items, total and delivery of a created order (payment + success pages). */
export default function OrderSummaryCard({ order, locale }: { order: OrderSummary; locale: string }) {
  const t = useTranslations('success');
  const tCart = useTranslations('cart');

  return (
    <div className="bg-parchment/30 rounded-lg p-6 text-left stack-y-3">
      <h2 className="font-oldstyle font-semibold text-2xl text-pirate-red">{t('summaryTitle')}</h2>
      <div className="stack-y-1">
        {order.items.map((item) => (
          <div key={item.productId} className="flex justify-between text-ink">
            <span>
              {tCart(`products.${item.productId}.name`)} × {item.quantity}
            </span>
            <span>{formatPriceCents(item.unitPriceCents * item.quantity, locale)}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-ink">
        <span>{t('shipping')}</span>
        <span>{formatPriceCents(order.shippingCents, locale)}</span>
      </div>
      <div className="flex justify-between font-semibold text-ink border-t border-parchment pt-2">
        <span>{t('total')}</span>
        <span>{formatPriceCents(order.totalCents, locale)}</span>
      </div>
      {order.relay && (
        <p className="text-sm text-ink">
          <strong>{t('relayLabel')}</strong> : {order.relay.name} — {order.relay.address}, {order.relay.postalCode}{' '}
          {order.relay.city}
        </p>
      )}
      {order.delivery && (
        <p className="text-sm text-ink">
          <strong>{t('colissimoLabel')}</strong> : {order.delivery.name} — {order.delivery.postalCode}{' '}
          {order.delivery.city}
        </p>
      )}
    </div>
  );
}

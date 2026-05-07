'use client';

import React, { useEffect, useState } from 'react';
import { Check, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import ServicesPanel from '@/components/checkout/OrderOverview/ServicesPanel';
import FormDataPanel from '@/components/checkout/OrderOverview/FormDataPanel';
import { checkIsFormComplete, type LocalCartItem } from '@/components/checkout/OrderOverview/overview-utils';
import { slotKey } from '@/components/checkout/PickupDeliveryTime/time-utils';
import type { OrderOverviewProps } from '@/components/checkout/types';

type ExistingOrder = {
  pickupDate?: string;
  pickupTime?: string;
  deliveryDate?: string;
  deliveryTime?: string;
}[];

export type SlotConflict = { pickup: boolean; delivery: boolean };

interface OrderOverviewExtendedProps extends OrderOverviewProps {
  /** Called whenever the proceed-ability changes so the parent can gate its submit button. */
  onCanProceedChange?: (canProceed: boolean) => void;
}

const OrderOverview: React.FC<OrderOverviewExtendedProps> = ({
  cart,
  formData,
  totalPrice,
  onFormDataChange,
  onCanProceedChange,
}) => {
  const typedCart = (cart as unknown as LocalCartItem[]) ?? [];
  const isFormComplete = checkIsFormComplete(formData, cart);

  const [slotConflict, setSlotConflict] = useState<SlotConflict>({ pickup: false, delivery: false });
  const [slotCheckLoading, setSlotCheckLoading] = useState(false);
  const [slotCheckError, setSlotCheckError] = useState(false);

  const { pickupDate, pickupTime, deliveryDate, deliveryTime } = formData ?? {};

  useEffect(() => {
    if (!pickupDate || !pickupTime || !deliveryDate || !deliveryTime) return;

    let mounted = true;
    setSlotCheckLoading(true);
    setSlotCheckError(false);

    fetch('/api/orders')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<ExistingOrder>;
      })
      .then((orders) => {
        if (!mounted || !Array.isArray(orders)) return;

        const chosenPickup   = slotKey(pickupDate, pickupTime);
        const chosenDelivery = slotKey(deliveryDate, deliveryTime);

        setSlotConflict({
          pickup:   orders.some((o) => slotKey(o.pickupDate,   o.pickupTime)   === chosenPickup),
          delivery: orders.some((o) => slotKey(o.deliveryDate, o.deliveryTime) === chosenDelivery),
        });
      })
      .catch(() => { if (mounted) setSlotCheckError(true); })
      .finally(() => { if (mounted) setSlotCheckLoading(false); });

    return () => { mounted = false; };
  }, [pickupDate, pickupTime, deliveryDate, deliveryTime]);

  const hasConflict = slotConflict.pickup || slotConflict.delivery;
  // Locked while loading so the button never briefly enables before results arrive
  const canProceed  = isFormComplete && !hasConflict && !slotCheckLoading;

  // Notify parent whenever canProceed changes
  useEffect(() => {
    onCanProceedChange?.(canProceed);
  }, [canProceed, onCanProceedChange]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {slotCheckLoading ? (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          ) : canProceed ? (
            <Check className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          <h2 className="text-2xl font-semibold text-gray-900">
            Peržiūrėkite užsakymą
          </h2>
        </div>
      </div>

      {hasConflict && !slotCheckLoading && (
        <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <div className="space-y-1">
            <p className="font-semibold">Pasirinktas laikas jau užimtas</p>
            <ul className="list-disc pl-4 space-y-0.5">
              {slotConflict.pickup && (
                <li>
                  Paėmimo laikas <strong>{pickupDate} {pickupTime}</strong> jau rezervuotas — grįžkite ir pasirinkite kitą.
                </li>
              )}
              {slotConflict.delivery && (
                <li>
                  Pristatymo laikas <strong>{deliveryDate} {deliveryTime}</strong> jau rezervuotas — grįžkite ir pasirinkite kitą.
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {slotCheckError && (
        <p className="mb-4 text-sm text-yellow-700">
          Nepavyko patikrinti laiko prieinamumo. Patikrinkite interneto ryšį ir bandykite dar kartą.
        </p>
      )}

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <ServicesPanel cart={typedCart} totalPrice={totalPrice} />
        <FormDataPanel
          formData={formData}
          onFormDataChange={onFormDataChange}
          slotConflict={slotConflict}
        />
      </div>
    </div>
  );
};

export default OrderOverview;
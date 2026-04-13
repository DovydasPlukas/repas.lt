'use client';

import React, { useEffect, useState } from 'react';
import TimeSlotSelect from '@/components/checkout/PickupDeliveryTime/TimeSlotSelect';
import {
  TIME_RANGES,
  toISODate,
  getTomorrowString,
  slotKey,
  parseDateTime,
} from '@/components/checkout/PickupDeliveryTime/time-utils';
import type { PickupDeliveryTimeProps } from '@/components/checkout/types';

type ExistingOrder = {
  pickupDate?: string;
  pickupTime?: string;
  deliveryDate?: string;
  deliveryTime?: string;
}[];

const PickupDeliveryTime: React.FC<PickupDeliveryTimeProps> = ({
  formData,
  onFormDataChange,
}) => {
  const [unavailablePickupSlots, setUnavailablePickupSlots] = useState<Set<string>>(new Set());
  const [unavailableDeliverySlots, setUnavailableDeliverySlots] = useState<Set<string>>(new Set());
  const [fetchError, setFetchError] = useState<string | null>(null);

  const getMinDeliveryDate = (): string => {
    if (formData?.pickupDate) {
      const pickup = new Date(formData.pickupDate);
      pickup.setDate(pickup.getDate() + 1);
      return toISODate(pickup);
    }
    return getTomorrowString();
  };

  // Fetch existing orders on mount to build unavailable slot sets
  useEffect(() => {
    let mounted = true;
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const orders = (await res.json()) as ExistingOrder;
        if (!mounted || !Array.isArray(orders)) return;

        const pickupSet = new Set<string>();
        const deliverySet = new Set<string>();
        for (const o of orders) {
          if (o.pickupDate && o.pickupTime)
            pickupSet.add(slotKey(o.pickupDate, o.pickupTime));
          if (o.deliveryDate && o.deliveryTime)
            deliverySet.add(slotKey(o.deliveryDate, o.deliveryTime));
        }
        setUnavailablePickupSlots(pickupSet);
        setUnavailableDeliverySlots(deliverySet);
      } catch (err: unknown) {
        console.error('Failed to fetch existing orders for slot checks:', err);
        setFetchError('Nepavyko patikrinti galimų laikų. Bandykite vėliau.');
      }
    };
    fetchOrders();
    return () => { mounted = false; };
  }, []);

  // Set sensible defaults on first mount
  useEffect(() => {
    if (!formData?.pickupDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      onFormDataChange('pickupDate', toISODate(tomorrow));
    }
    if (!formData?.pickupTime) onFormDataChange('pickupTime', TIME_RANGES[0]);
    if (!formData?.deliveryDate) {
      const d = new Date();
      d.setDate(d.getDate() + 2);
      onFormDataChange('deliveryDate', toISODate(d));
    }
    if (!formData?.deliveryTime) onFormDataChange('deliveryTime', TIME_RANGES[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When pickup changes, ensure delivery is strictly after it
  useEffect(() => {
    const pickupDT = parseDateTime(formData?.pickupDate, formData?.pickupTime);
    const deliveryDT = parseDateTime(formData?.deliveryDate, formData?.deliveryTime);
    if (!pickupDT) return;
    if (!deliveryDT || deliveryDT.getTime() <= pickupDT.getTime()) {
      const newDelivery = new Date(formData.pickupDate + 'T00:00:00');
      newDelivery.setDate(newDelivery.getDate() + 1);
      const newDeliveryDate = toISODate(newDelivery);
      onFormDataChange('deliveryDate', newDeliveryDate);
      const deliveryTime = formData?.deliveryTime ?? TIME_RANGES[0];
      if (unavailableDeliverySlots.has(slotKey(newDeliveryDate, deliveryTime))) {
        onFormDataChange('deliveryTime', '');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData?.pickupDate, formData?.pickupTime, unavailableDeliverySlots]);

  // When delivery changes, ensure pickup is strictly before it
  useEffect(() => {
    const pickupDT = parseDateTime(formData?.pickupDate, formData?.pickupTime);
    const deliveryDT = parseDateTime(formData?.deliveryDate, formData?.deliveryTime);
    if (!deliveryDT) return;
    if (!pickupDT || pickupDT.getTime() >= deliveryDT.getTime()) {
      const newPickup = new Date((formData.deliveryDate ?? '') + 'T00:00:00');
      newPickup.setDate(newPickup.getDate() - 1);
      const newPickupDate = toISODate(newPickup);
      onFormDataChange('pickupDate', newPickupDate);
      const pickupTime = formData?.pickupTime ?? TIME_RANGES[0];
      if (unavailablePickupSlots.has(slotKey(newPickupDate, pickupTime))) {
        onFormDataChange('pickupTime', '');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData?.deliveryDate, formData?.deliveryTime, unavailablePickupSlots]);

  // Clear any selected slot that becomes unavailable after fetch
  useEffect(() => {
    if (formData?.pickupDate && formData?.pickupTime) {
      if (unavailablePickupSlots.has(slotKey(formData.pickupDate, formData.pickupTime))) {
        onFormDataChange('pickupTime', '');
      }
    }
    if (formData?.deliveryDate && formData?.deliveryTime) {
      if (unavailableDeliverySlots.has(slotKey(formData.deliveryDate, formData.deliveryTime))) {
        onFormDataChange('deliveryTime', '');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unavailablePickupSlots, unavailableDeliverySlots]);

  const isPickupDisabled = (time: string) =>
    unavailablePickupSlots.has(slotKey(formData?.pickupDate, time));

  const isDeliveryDisabled = (time: string) =>
    unavailableDeliverySlots.has(slotKey(formData?.deliveryDate, time));

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        Pasirinkite paėmimo ir pristatymo laiką
      </h2>

      <div className="space-y-4">
        <TimeSlotSelect
          label="Paėmimas"
          date={formData?.pickupDate ?? ''}
          time={formData?.pickupTime ?? ''}
          minDate={getTomorrowString()}
          dateHint="Gali būti nuo rytojaus"
          timeRanges={TIME_RANGES}
          isTimeDisabled={isPickupDisabled}
          isTimeEmpty={formData?.pickupTime === ''}
          timeEmptyMessage="Pasirinktas paėmimo laikas užimtas arba netinkamas — pasirinkite kitą."
          onDateChange={(v) => onFormDataChange('pickupDate', v)}
          onTimeChange={(v) => onFormDataChange('pickupTime', v)}
        />

        <TimeSlotSelect
          label="Pristatymas"
          date={formData?.deliveryDate ?? ''}
          time={formData?.deliveryTime ?? ''}
          minDate={getMinDeliveryDate()}
          dateHint="Turi būti po paėmimo datos"
          timeRanges={TIME_RANGES}
          isTimeDisabled={isDeliveryDisabled}
          isTimeEmpty={formData?.deliveryTime === ''}
          timeEmptyMessage="Pasirinktas pristatymo laikas užimtas arba netinkamas — pasirinkite kitą."
          onDateChange={(v) => onFormDataChange('deliveryDate', v)}
          onTimeChange={(v) => onFormDataChange('deliveryTime', v)}
        />
      </div>

      {fetchError && (
        <p className="mt-2 text-sm text-yellow-700">{fetchError}</p>
      )}

      <p className="text-sm text-gray-600 mt-3">
        Pristatymo data ir laikas privalo būti vėlesni už paėmimo. Užimtos
        laiko srities pasirinkimas yra išjungtas.
      </p>
    </div>
  );
};

export default PickupDeliveryTime;
'use client';

import React, { useEffect, useState } from 'react';
import type { PickupDeliveryTimeProps } from '@/components/checkout/types';

/** Time ranges generator (08:00-18:00) */
const generateTimeRanges = () => {
  const ranges: string[] = [];
  for (let hour = 8; hour < 18; hour++) {
    const startHour = hour.toString().padStart(2, '0');
    const endHour = (hour + 1).toString().padStart(2, '0');
    ranges.push(`${startHour}:00-${endHour}:00`);
  }
  return ranges;
};

const TIME_RANGES = generateTimeRanges();

/** shape for orders returned from /api/orders (relaxed) */
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

  // Small helper: produce date string YYYY-MM-DD for "today/tomorrow" calculations
  const toISODate = (d: Date) => d.toISOString().split('T')[0];

  const getTomorrowString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return toISODate(tomorrow);
  };

  // Delivery must be at least after pickup date (we enforce deliveryDate >= pickupDate + 1 day by default)
  const getMinDeliveryDate = () => {
    if (formData?.pickupDate) {
      const pickup = new Date(formData.pickupDate);
      pickup.setDate(pickup.getDate() + 1);
      return toISODate(pickup);
    }
    return getTomorrowString();
  };

  // get start time (hh:mm) from range "10:00-11:00"
  const getRangeStart = (range: string) => range.split('-')[0];

  // build a unique key for a date/time slot
  const slotKey = (date?: string, time?: string) => `${date ?? ''}||${time ?? ''}`;

  // Parse a date + time-range to a Date object for comparison (uses start time)
  const parseDateTime = (date?: string, range?: string) => {
    if (!date || !range) return null;
    const start = getRangeStart(range);
    // Construct local datetime: "YYYY-MM-DDTHH:MM:00"
    const iso = `${date}T${start}:00`;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return d;
  };

  // Fetch existing orders (on mount) and populate unavailable slot sets
  useEffect(() => {
    let mounted = true;
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const orders = (await res.json()) as ExistingOrder;

        if (!mounted || !Array.isArray(orders)) return;

        const pickupSet = new Set<string>();
        const deliverySet = new Set<string>();

        for (const o of orders) {
          if (o.pickupDate && o.pickupTime) {
            pickupSet.add(slotKey(o.pickupDate, o.pickupTime));
          }
          if (o.deliveryDate && o.deliveryTime) {
            deliverySet.add(slotKey(o.deliveryDate, o.deliveryTime));
          }
        }

        setUnavailablePickupSlots(pickupSet);
        setUnavailableDeliverySlots(deliverySet);
      } catch (err: unknown) {
        console.error('Failed to fetch existing orders for slot checks:', err);
        setFetchError('Nepavyko patikrinti galimų laikų. Bandykite vėliau.');
        // leave sets empty so UI still works
      }
    };

    fetchOrders();
    return () => {
      mounted = false;
    };
  }, []);

  // On first mount, set sensible defaults if missing (same behaviour as before)
  useEffect(() => {
    if (!formData?.pickupDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      onFormDataChange('pickupDate', toISODate(tomorrow));
    }
    if (!formData?.pickupTime) {
      onFormDataChange('pickupTime', TIME_RANGES[0]);
    }

    if (!formData?.deliveryDate) {
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
      onFormDataChange('deliveryDate', toISODate(dayAfterTomorrow));
    }
    if (!formData?.deliveryTime) {
      onFormDataChange('deliveryTime', TIME_RANGES[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run only on mount

  // When pickup date/time changes, ensure delivery datetime > pickup datetime.
  // If not, bump deliveryDate to pickupDate +1 day (preserving deliveryTime).
  useEffect(() => {
    const pickupDT = parseDateTime(formData?.pickupDate, formData?.pickupTime);
    const deliveryDT = parseDateTime(formData?.deliveryDate, formData?.deliveryTime);

    if (!pickupDT) return;

    if (!deliveryDT || deliveryDT.getTime() <= pickupDT.getTime()) {
      const newDelivery = new Date(formData.pickupDate + 'T00:00:00');
      newDelivery.setDate(newDelivery.getDate() + 1);
      const newDeliveryDate = toISODate(newDelivery);
      // set delivery date to pickup +1 day; keep deliveryTime (or default)
      onFormDataChange('deliveryDate', newDeliveryDate);
      // If the chosen deliveryTime is unavailable for that new date, clear it to force user to pick
      const deliveryTime = formData?.deliveryTime ?? TIME_RANGES[0];
      if (unavailableDeliverySlots.has(slotKey(newDeliveryDate, deliveryTime))) {
        onFormDataChange('deliveryTime', '');
      }
    }
    // run whenever pickup date/time changes or unavailableDeliverySlots changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData?.pickupDate, formData?.pickupTime, unavailableDeliverySlots]);

  // When delivery date/time changes, ensure delivery > pickup; if not, set pickup = delivery -1 day
  useEffect(() => {
    const pickupDT = parseDateTime(formData?.pickupDate, formData?.pickupTime);
    const deliveryDT = parseDateTime(formData?.deliveryDate, formData?.deliveryTime);

    if (!deliveryDT) return;

    if (!pickupDT || pickupDT.getTime() >= deliveryDT.getTime()) {
      const newPickup = new Date((formData.deliveryDate ?? '') + 'T00:00:00');
      newPickup.setDate(newPickup.getDate() - 1);
      const newPickupDate = toISODate(newPickup);
      onFormDataChange('pickupDate', newPickupDate);
      // If chosen pickupTime unavailable, clear it
      const pickupTime = formData?.pickupTime ?? TIME_RANGES[0];
      if (unavailablePickupSlots.has(slotKey(newPickupDate, pickupTime))) {
        onFormDataChange('pickupTime', '');
      }
    }
    // run on delivery changes + unavailablePickupSlots changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData?.deliveryDate, formData?.deliveryTime, unavailablePickupSlots]);

  // If the currently selected pickup/delivery slot becomes unavailable (because we fetched orders after selection),
  // clear it and show short message under the control by leveraging fetchError or by inline text.
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

  // helpers to check if a specific option should be disabled
  const isPickupOptionDisabled = (date?: string, time?: string) => {
    if (!date || !time) return false;
    return unavailablePickupSlots.has(slotKey(date, time));
  };
  const isDeliveryOptionDisabled = (date?: string, time?: string) => {
    if (!date || !time) return false;
    return unavailableDeliverySlots.has(slotKey(date, time));
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Pasirinkite paėmimo ir pristatymo laiką</h2>

      {/* Pickup Date and Time */}
      <div className="rounded-lg border border-gray-200 p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Paėmimas</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Data *</label>
            <input
              type="date"
              value={formData?.pickupDate ?? ''}
              onChange={(e) => onFormDataChange('pickupDate', e.target.value)}
              min={getTomorrowString()}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[--RepasBlue] focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">Gali būti nuo rytojaus</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Laikas *</label>
            <select
              value={formData?.pickupTime ?? ''}
              onChange={(e) => onFormDataChange('pickupTime', e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[--RepasBlue] focus:outline-none"
            >
              <option value="">Pasirinkite laiko sritį</option>
              {TIME_RANGES.map((range) => (
                <option
                  key={range}
                  value={range}
                  disabled={isPickupOptionDisabled(formData?.pickupDate, range)}
                >
                  {range} {isPickupOptionDisabled(formData?.pickupDate, range) ? '— užimta' : ''}
                </option>
              ))}
            </select>

            {/* show inline message if current selection is empty or was cleared due to unavailability */}
            {formData?.pickupTime === '' && (
              <p className="mt-2 text-sm text-red-600">Pasirinktas paėmimo laikas užimtas arba netinkamas — pasirinkite kitą.</p>
            )}

            {fetchError && <p className="mt-2 text-sm text-yellow-700">{fetchError}</p>}
          </div>
        </div>
      </div>

      {/* Delivery Date and Time */}
      <div className="rounded-lg border border-gray-200 p-6 mt-4">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Pristatymas</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Data *</label>
            <input
              type="date"
              value={formData?.deliveryDate ?? ''}
              onChange={(e) => onFormDataChange('deliveryDate', e.target.value)}
              min={getMinDeliveryDate()}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[--RepasBlue] focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">Turi būti po paėmimo datos</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Laikas *</label>
            <select
              value={formData?.deliveryTime ?? ''}
              onChange={(e) => onFormDataChange('deliveryTime', e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[--RepasBlue] focus:outline-none"
            >
              <option value="">Pasirinkite laiko sritį</option>
              {TIME_RANGES.map((range) => (
                <option
                  key={range}
                  value={range}
                  disabled={isDeliveryOptionDisabled(formData?.deliveryDate, range)}
                >
                  {range} {isDeliveryOptionDisabled(formData?.deliveryDate, range) ? '— užimta' : ''}
                </option>
              ))}
            </select>

            {formData?.deliveryTime === '' && (
              <p className="mt-2 text-sm text-red-600">Pasirinktas pristatymo laikas užimtas arba netinkamas — pasirinkite kitą.</p>
            )}
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 mt-3">
        Pristatymo data ir laikas privalo būti vėlesni už paėmimo. Užimtos laiko srities pasirinkimas yra išjungtas.
      </p>
    </div>
  );
};

export default PickupDeliveryTime;
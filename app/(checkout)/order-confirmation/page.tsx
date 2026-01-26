'use client';
/* eslint-disable */

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const statusOptions = [
  { value: 'NEW', label: 'Naujas' },
  { value: 'PENDING', label: 'Laukiantis' },
  { value: 'COMPLETED', label: 'Užbaigtas' },
  { value: 'CANCELLED', label: 'Atšauktas' },
];

const getStatusLabel = (status: string) => {
  const option = statusOptions.find((opt) => opt.value === status);
  return option?.label || status;
};

type OrderAddon = {
  id: string;
  addonId: string;
  snapPrice?: string | null;
  snapName?: string | null;
};

type OrderService = {
  id: string;
  serviceId: string;
  service?: { id: string; name?: string } | null;
  specialRequirements?: string | null;
  orderAddons?: OrderAddon[] | null;
};

type OrderDetails = {
  id: string;
  orderNumber: string;
  snapFirstName: string;
  snapLastName: string;
  snapPhone: string;
  snapEmail?: string | null;
  snapStreet?: string | null;
  snapApartment?: string | null;
  snapFloor?: string | null;
  snapNotes?: string | null;

  // legacy single datetimes (may still exist)
  pickupDateTime?: string | null;
  deliveryDateTime?: string | null;

  // preferred: explicit start/end for ranges
  pickupStart?: string | null;
  pickupEnd?: string | null;
  deliveryStart?: string | null;
  deliveryEnd?: string | null;

  createdAt: string;
  status: string;
  orderServices?: OrderService[] | null;
};

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = searchParams.get('order');

  useEffect(() => {
    if (!orderId) {
      setError('Nerastas užsakymas');
      setLoading(false);
      return;
    }

    let mounted = true;

    const fetchSingle = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const json = await res.json();
          const candidate = (json && json.order) ? json.order : json;
          if (mounted) {
            setOrder(candidate as OrderDetails);
            setLoading(false);
            return true;
          }
        }
      } catch (e) {
        // ignore and fallback
      }
      return false;
    };

    const fetchListAndFind = async () => {
      try {
        const res = await fetch('/api/orders');
        if (!res.ok) {
          throw new Error('Failed to fetch orders list');
        }
        const json = await res.json();
        const found = Array.isArray(json) ? json.find((o: any) => o.id === orderId) : null;
        if (!found) {
          setError('Užsakymas nerastas');
        } else {
          setOrder(found as OrderDetails);
        }
      } catch (err) {
        console.error('Error fetching orders list:', err);
        setError('Nepavyko užkrauti užsakymo');
      } finally {
        setLoading(false);
      }
    };

    (async () => {
      setLoading(true);
      const ok = await fetchSingle();
      if (!ok) {
        await fetchListAndFind();
      }
    })();

    return () => {
      mounted = false;
    };
  }, [orderId]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return new Intl.DateTimeFormat('lt-LT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return new Intl.DateTimeFormat('lt-LT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return new Intl.DateTimeFormat('lt-LT', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  // infer 1-hour end from start ISO
  const inferEndIsoFromStart = (startIso?: string | null) => {
    if (!startIso) return null;
    const d = new Date(startIso);
    if (isNaN(d.getTime())) return null;
    d.setHours(d.getHours() + 1);
    return d.toISOString();
  };

  // If only end is provided, infer start = end - 1h
  const inferStartIsoFromEnd = (endIso?: string | null) => {
    if (!endIso) return null;
    const d = new Date(endIso);
    if (isNaN(d.getTime())) return null;
    d.setHours(d.getHours() - 1);
    return d.toISOString();
  };

  /**
   * Format a start/end range into:
   * - same-day: "2025 m. gruodžio 15 d. 09:00 - 10:00"  (no comma)
   * - different days: "YYYY m. MMMM D d., HH:MM - YYYY m. MMMM D d., HH:MM" (uses formatDateTime for both)
   *
   * Accepts either:
   * - both start & end (ISO strings), or
   * - a single start (ISO) — end inferred as start + 1 hour,
   * - a single end (ISO) — start inferred as end - 1 hour.
   */
  const formatRange = (start?: string | null, end?: string | null) => {
    if (!start && !end) return '-';

    // If only end provided, infer start
    if (!start && end) {
      start = inferStartIsoFromEnd(end);
    }

    // If only start provided, infer end
    if (start && !end) {
      end = inferEndIsoFromStart(start);
    }

    if (!start || !end) {
      // fallback
      return start ?? end ?? '-';
    }

    try {
      const s = new Date(start);
      const e = new Date(end);
      if (isNaN(s.getTime()) || isNaN(e.getTime())) {
        return `${start} - ${end}`;
      }

      const sameDay =
        s.getFullYear() === e.getFullYear() &&
        s.getMonth() === e.getMonth() &&
        s.getDate() === e.getDate();

      if (sameDay) {
        // desired format: "2025 m. gruodžio 15 d. 09:00 - 10:00"
        const datePart = new Intl.DateTimeFormat('lt-LT', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }).format(s);
        const timeRange = `${formatTime(start)} - ${formatTime(end)}`; // space-hyphen-space
        return `${datePart} ${timeRange}`;
      } else {
        // different days — show full datetimes separated by hyphen
        return `${formatDateTime(start)} - ${formatDateTime(end)}`;
      }
    } catch {
      return `${start} - ${end}`;
    }
  };

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[--RepasBlue] text-white rounded-lg hover:opacity-90 font-medium"
          >
            Grįžti į pradžią
          </Link>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
            <div className="w-6 h-6 border-2 border-[--RepasBlue] border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-600">Kraunami užsakymo duomenys...</p>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <p className="text-yellow-700 font-medium">Užsakymas nerastas</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[--RepasBlue] text-white rounded-lg hover:opacity-90 font-medium"
          >
            Grįžti į pradžią
          </Link>
        </div>
      </main>
    );
  }

  // Calculate total price (from snapshotted fields) — keep for confirmation display
  const calculateTotalPrice = () => {
    if (!order.orderServices) return 0;
    return order.orderServices.reduce((total, os) => {
      const addonsTotal = (os.orderAddons ?? []).reduce((sum, addon) => sum + Number(addon.snapPrice ?? 0), 0);
      return total + addonsTotal;
    }, 0);
  };

  const totalPrice = calculateTotalPrice();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Success Banner */}
      <section className="bg-white border-b border-gray-200 px-6 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ačiū už jūsų užsakymą!
          </h1>
          <p className="text-lg text-gray-600">
            Jūsų užsakymas buvo sėkmingai priimtas. Žemiau rasite užsakymo duomenis.
          </p>
        </div>
      </section>

      {/* Order Details */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-2xl">
          {/* Order Number */}
          <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">Užsakymo numeris</p>
            <p className="text-2xl font-bold text-gray-900">{order.orderNumber}</p>
          </div>

          {/* Order Info Grid */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mb-6">
            {/* Contact Information */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Kontaktinė informacija</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600">Vardas</p>
                  <p className="font-medium text-gray-900 break-words">{order.snapFirstName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Pavardė</p>
                  <p className="font-medium text-gray-900 break-words">{order.snapLastName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Telefonas</p>
                  <p className="font-medium text-gray-900 break-words">{order.snapPhone}</p>
                </div>
                {order.snapEmail && (
                  <div>
                    <p className="text-xs text-gray-600">El. paštas</p>
                    <p className="font-medium text-gray-900 break-words">{order.snapEmail}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Pristatymo adresas</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600">Gatvė</p>
                  <p className="font-medium text-gray-900 break-words">{order.snapStreet ?? '-'}</p>
                </div>
                {order.snapApartment && (
                <div>
                  <p className="text-xs text-gray-600">Butas</p>
                  <p className="font-medium text-gray-900 break-words">{order.snapApartment ?? '-'}</p>
                </div>
                )}
                {order.snapFloor && (
                <div>
                  <p className="text-xs text-gray-600">Aukštas</p>
                  <p className="font-medium text-gray-900 break-words">{order.snapFloor ?? '-'}</p>
                </div>
                )}
              </div>
            </div>
          </div>

          {/* Services list (if available) */}
          {order.orderServices && order.orderServices.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Užsakytos paslaugos</h3>
              <div className="space-y-4">
                {order.orderServices.map((os) => (
                  <div key={os.id} className="p-3 border rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900">{os.service?.name ?? os.serviceId}</div>
                        {os.specialRequirements && <div className="text-sm text-gray-600">Reikalavimai: {os.specialRequirements}</div>}
                      </div>
                      <div className="text-sm text-gray-800">
                        {os.orderAddons && os.orderAddons.length > 0
                        ? `€${os.orderAddons
                            .reduce((sum, addon) => sum + Number(addon.snapPrice ?? 0), 0)
                            .toFixed(2)}`
                        : '-'}
                      </div>
                    </div>

                    {/* Addons */}
                    {os.orderAddons && os.orderAddons.length > 0 && (
                      <div className="mt-2 text-sm text-gray-700">
                        <div className="font-medium">Priedai:</div>
                        <ul className="list-disc ml-5">
                          {os.orderAddons.map((a) => (
                            <li key={a.id}>
                              {a.snapName ?? a.addonId} {a.snapPrice ? `- €${Number(a.snapPrice).toFixed(2)}` : ''}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Notes */}
          {order.snapNotes && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Pastabos</h3>
              <p className="text-gray-700 whitespace-pre-wrap break-words">{order.snapNotes}</p>
            </div>
          )}

          {/* Order Metadata */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 mb-6">
            <div className="grid gap-4 grid-cols-2">
              <div>
                <p className="text-xs text-gray-600">Užsakymo statusas</p>
                <div className="mt-2 inline-flex px-3 py-1 rounded-full bg-blue-100">
                  <span className="text-sm font-medium text-blue-700">
                    {getStatusLabel(order.status)}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600">Užsakymo data</p>
                <p className="mt-2 font-medium text-gray-900">{formatDate(order.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Order times (ranges) */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 mb-6">
            <div className="grid gap-4 grid-cols-2">
              <div>
                <p className="text-xs text-gray-600">Paėmimas</p>
                <p className="mt-2 font-medium text-gray-900">
                  {/* Prefer explicit start/end; fallback to legacy single start (will be shown as a 1h slot) */}
                  {order.pickupStart || order.pickupEnd
                    ? formatRange(order.pickupStart ?? null, order.pickupEnd ?? null)
                    : order.pickupDateTime
                      ? formatRange(order.pickupDateTime, null)
                      : '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Pristatymas</p>
                <p className="mt-2 font-medium text-gray-900">
                  {order.deliveryStart || order.deliveryEnd
                    ? formatRange(order.deliveryStart ?? null, order.deliveryEnd ?? null)
                    : order.deliveryDateTime
                      ? formatRange(order.deliveryDateTime, null)
                      : '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Total Price */}
          <div className="rounded-lg border-2 border-[--RepasBlue] bg-blue-50 p-6 mb-6">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-gray-900">Bendra suma</p>
              <p className="text-2xl font-bold text-gray-900">€{totalPrice.toFixed(2)}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Link
              href="/order"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[--RepasBlue] text-white rounded-lg hover:opacity-90 font-medium transition-all"
            >
              Peržiūrėti mano užsakymus
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/paslaugos"
              className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all"
            >
              Grįžti į paslaugas
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
            <div className="w-6 h-6 border-2 border-[--RepasBlue] border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-600">Kraunami užsakymo duomenys...</p>
        </div>
      </main>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}
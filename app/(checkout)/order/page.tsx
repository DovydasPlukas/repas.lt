'use client';

/* eslint-disable */

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';

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
  pickupStart?: string | null;
  pickupEnd?: string | null;
  deliveryStart?: string | null;
  deliveryEnd?: string | null;
  pickupDateTime?: string | null;
  deliveryDateTime?: string | null;
  createdAt: string;
  status: string;
  orderServices?: OrderService[] | null;
};

const Order: React.FC = () => {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      setError('Jūs turite būti prisijungę');
      setLoading(false);
      return;
    }

    if (status !== 'authenticated') {
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/orders');
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Nepavyko įkelti užsakymų');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [status]);

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

  const inferEndIsoFromStart = (startIso?: string | null) => {
    if (!startIso) return null;
    const d = new Date(startIso);
    if (isNaN(d.getTime())) return null;
    d.setHours(d.getHours() + 1);
    return d.toISOString();
  };

  const inferStartIsoFromEnd = (endIso?: string | null) => {
    if (!endIso) return null;
    const d = new Date(endIso);
    if (isNaN(d.getTime())) return null;
    d.setHours(d.getHours() - 1);
    return d.toISOString();
  };

  const formatRange = (start?: string | null, end?: string | null) => {
    if (!start && !end) return '-';

    if (!start && end) {
      start = inferStartIsoFromEnd(end);
    }

    if (start && !end) {
      end = inferEndIsoFromStart(start);
    }

    if (!start || !end) {
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
        const datePart = new Intl.DateTimeFormat('lt-LT', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }).format(s);
        const timeRange = `${formatTime(start)} - ${formatTime(end)}`;
        return `${datePart} ${timeRange}`;
      } else {
        return `${formatDateTime(start)} - ${formatDateTime(end)}`;
      }
    } catch {
      return `${start} - ${end}`;
    }
  };

  const calculateTotalPrice = (order: OrderDetails) => {
    if (!order.orderServices) return 0;
    return order.orderServices.reduce((total, os) => {
      const addonsTotal = (os.orderAddons ?? []).reduce((sum, addon) => sum + Number(addon.snapPrice ?? 0), 0);
      return total + addonsTotal;
    }, 0);
  };

  const openModal = (order: OrderDetails) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    
    // Fetch full order details to ensure we have all fields including times
    const fetchFullOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${order.id}`);
        if (response.ok) {
          const data = await response.json();
          const fullOrder = data.order || data;
          setSelectedOrder(fullOrder as OrderDetails);
        }
      } catch (error) {
        console.error('Error fetching full order details:', error);
      }
    };
    
    fetchFullOrder();
  };

  if (status === 'loading' || loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
            <div className="w-6 h-6 border-2 border-[--RepasBlue] border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-600">Kraunami užsakymai...</p>
        </div>
      </main>
    );
  }

  if (error && status === 'unauthenticated') {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <p className="text-yellow-700 font-medium">{error}</p>
          </div>
          <Link
            href="/prisijungimas"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[--RepasBlue] text-white rounded-lg hover:opacity-90 font-medium"
          >
            Prisijungti
          </Link>
        </div>
      </main>
    );
  }

  // Show order details if selected
  if (selectedOrder && isModalOpen) {
    const totalPrice = calculateTotalPrice(selectedOrder);

    return (
      <>
        {/* Orders List in Background */}
        <main className="min-h-screen bg-gray-50">
          {/* Hero Section */}
          <section className="bg-[--RepasBlue] px-6 py-16 text-white md:py-24">
            <div className="mx-auto max-w-6xl">
              <h1 className="mb-4 text-balance font-sans text-4xl font-bold md:text-5xl lg:text-6xl">Mano užsakymai</h1>
              <p className="max-w-2xl text-pretty text-lg leading-relaxed text-white/90 md:text-xl">
                Peržiūrėkite ir valdykite savo užsakymus
              </p>
            </div>
          </section>

          {/* Orders List */}
          <section className="px-6 py-12">
            <div className="mx-auto max-w-4xl">
              {orders.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
                  <p className="text-gray-600 text-lg mb-4">Jūs dar neturite jokių užsakymų</p>
                  <Link
                    href="/paslaugos"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[--RepasBlue] text-white rounded-lg hover:opacity-90 font-medium"
                  >
                    Pradėti užsakymą
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <button
                      key={order.id}
                      onClick={() => openModal(order)}
                      className="w-full text-left rounded-lg border border-gray-200 bg-white p-6 hover:shadow-lg hover:border-blue-300 transition-all"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                        {/* Order Number */}
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Užsakymo numeris</p>
                          <p className="text-lg font-bold text-gray-900">{order.orderNumber}</p>
                        </div>

                        {/* Status */}
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Statusas</p>
                          <span className="inline-flex px-3 py-1 rounded-full bg-blue-100 text-sm font-medium text-blue-700">
                            {getStatusLabel(order.status)}
                          </span>
                        </div>

                        {/* Pickup Time */}
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Paėmimas</p>
                          <p className="text-sm font-medium text-gray-900">
                            {order.pickupStart || order.pickupEnd
                              ? formatRange(order.pickupStart ?? null, order.pickupEnd ?? null)
                              : order.pickupDateTime
                                ? formatRange(order.pickupDateTime, null)
                                : '-'}
                          </p>
                        </div>

                        {/* Delivery Time */}
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Pristatymas</p>
                          <p className="text-sm font-medium text-gray-900">
                            {order.deliveryStart || order.deliveryEnd
                              ? formatRange(order.deliveryStart ?? null, order.deliveryEnd ?? null)
                              : order.deliveryDateTime
                                ? formatRange(order.deliveryDateTime, null)
                                : '-'}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>

        {/* Modal Dialog */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle></DialogTitle>
              <DialogClose />
            </DialogHeader>

            {/* Order Details */}
            <div className="space-y-6">
              {/* Order Number */}
              <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6">
                <p className="text-sm text-gray-600 mb-2">Užsakymo numeris</p>
                <p className="text-2xl font-bold text-gray-900">{selectedOrder.orderNumber}</p>
              </div>

              {/* Order Info Grid */}
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {/* Contact Information */}
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Kontaktinė informacija</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600">Vardas</p>
                      <p className="font-medium text-gray-900 break-words">{selectedOrder.snapFirstName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Pavardė</p>
                      <p className="font-medium text-gray-900 break-words">{selectedOrder.snapLastName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Telefonas</p>
                      <p className="font-medium text-gray-900 break-words">{selectedOrder.snapPhone}</p>
                    </div>
                    {selectedOrder.snapEmail && (
                      <div>
                        <p className="text-xs text-gray-600">El. paštas</p>
                        <p className="font-medium text-gray-900 break-words">{selectedOrder.snapEmail}</p>
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
                      <p className="font-medium text-gray-900 break-words">{selectedOrder.snapStreet ?? '-'}</p>
                    </div>
                    {selectedOrder.snapApartment && (
                      <div>
                        <p className="text-xs text-gray-600">Butas</p>
                        <p className="font-medium text-gray-900 break-words">{selectedOrder.snapApartment ?? '-'}</p>
                      </div>
                    )}
                    {selectedOrder.snapFloor && (
                      <div>
                        <p className="text-xs text-gray-600">Aukštas</p>
                        <p className="font-medium text-gray-900 break-words">{selectedOrder.snapFloor ?? '-'}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Services list */}
              {selectedOrder.orderServices && selectedOrder.orderServices.length > 0 && (
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Užsakytos paslaugos</h3>
                  <div className="space-y-4">
                    {selectedOrder.orderServices.map((os) => (
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
              {selectedOrder.snapNotes && (
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Pastabos</h3>
                  <p className="text-gray-700 whitespace-pre-wrap break-words">{selectedOrder.snapNotes}</p>
                </div>
              )}

              {/* Order Metadata */}
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="grid gap-4 grid-cols-2">
                  <div>
                    <p className="text-xs text-gray-600">Užsakymo statusas</p>
                    <div className="mt-2 inline-flex px-3 py-1 rounded-full bg-blue-100">
                      <span className="text-sm font-medium text-blue-700">
                        {getStatusLabel(selectedOrder.status)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Užsakymo data</p>
                    <p className="mt-2 font-medium text-gray-900">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Order times */}
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="grid gap-4 grid-cols-2">
                  <div>
                    <p className="text-xs text-gray-600">Paėmimas</p>
                    <p className="mt-2 font-medium text-gray-900">
                      {selectedOrder.pickupStart || selectedOrder.pickupEnd
                        ? formatRange(selectedOrder.pickupStart ?? null, selectedOrder.pickupEnd ?? null)
                        : selectedOrder.pickupDateTime
                          ? formatRange(selectedOrder.pickupDateTime, null)
                          : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Pristatymas</p>
                    <p className="mt-2 font-medium text-gray-900">
                      {selectedOrder.deliveryStart || selectedOrder.deliveryEnd
                        ? formatRange(selectedOrder.deliveryStart ?? null, selectedOrder.deliveryEnd ?? null)
                        : selectedOrder.deliveryDateTime
                          ? formatRange(selectedOrder.deliveryDateTime, null)
                          : '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Price */}
              <div className="rounded-lg border-2 border-[--RepasBlue] bg-blue-50 p-6">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-gray-900">Bendra suma</p>
                  <p className="text-2xl font-bold text-gray-900">€{totalPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Show orders list
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[--RepasBlue] px-6 py-16 text-white md:py-24">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-4 text-balance font-sans text-4xl font-bold md:text-5xl lg:text-6xl">Mano užsakymai</h1>
          <p className="max-w-2xl text-pretty text-lg leading-relaxed text-white/90 md:text-xl">
            Peržiūrėkite ir valdykite savo užsakymus
          </p>
        </div>
      </section>

      {/* Orders List */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-4xl">
          {orders.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
              <p className="text-gray-600 text-lg mb-4">Jūs dar neturite jokių užsakymų</p>
              <Link
                href="/paslaugos"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[--RepasBlue] text-white rounded-lg hover:opacity-90 font-medium"
              >
                Pradėti užsakymą
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => openModal(order)}
                  className="w-full text-left rounded-lg border border-gray-200 bg-white p-6 hover:shadow-lg hover:border-blue-300 transition-all"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                    {/* Order Number */}
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Užsakymo numeris</p>
                      <p className="text-lg font-bold text-gray-900">{order.orderNumber}</p>
                    </div>

                    {/* Status */}
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Statusas</p>
                      <span className="inline-flex px-3 py-1 rounded-full bg-blue-100 text-sm font-medium text-blue-700">
                        {getStatusLabel(order.status)}
                      </span>
                    </div>

                    {/* Pickup Time */}
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Paėmimas</p>
                      <p className="text-sm font-medium text-gray-900">
                        {order.pickupStart || order.pickupEnd
                          ? formatRange(order.pickupStart ?? null, order.pickupEnd ?? null)
                          : order.pickupDateTime
                            ? formatRange(order.pickupDateTime, null)
                            : '-'}
                      </p>
                    </div>

                    {/* Delivery Time */}
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Pristatymas</p>
                      <p className="text-sm font-medium text-gray-900">
                        {order.deliveryStart || order.deliveryEnd
                          ? formatRange(order.deliveryStart ?? null, order.deliveryEnd ?? null)
                          : order.deliveryDateTime
                            ? formatRange(order.deliveryDateTime, null)
                            : '-'}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Order;
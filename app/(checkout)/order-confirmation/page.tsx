'use client';
/* eslint-disable */

import { Suspense } from 'react';
import { useOrderConfirmation } from './hooks/useOrderConfirmation';
import { calculateTotalPrice } from '.././utils/order';
import { LoadingState } from './components/LoadingState';
import { ErrorState, NotFoundState } from './components/ErrorStates';
import { SuccessBanner } from './components/SuccessBanner';
import { OrderInfoGrid } from './components/OrderInfoGrid';
import { ServicesList } from './components/ServicesList';
import { OrderMeta } from './components/OrderMeta';
import { ActionButtons } from './components/ActionButtons';

function OrderConfirmationContent() {
  const { order, loading, error } = useOrderConfirmation();

  if (error) return <ErrorState message={error} />;
  if (loading) return <LoadingState />;
  if (!order) return <NotFoundState />;

  const totalPrice = calculateTotalPrice(order);

  return (
    <main className="min-h-screen bg-gray-50">
      <SuccessBanner />

      <section className="px-6 py-12">
        <div className="mx-auto max-w-2xl">
          {/* Order Number */}
          <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">Užsakymo numeris</p>
            <p className="text-2xl font-bold text-gray-900">{order.orderNumber}</p>
          </div>

          <OrderInfoGrid order={order} />

          {order.orderServices && order.orderServices.length > 0 && (
            <ServicesList services={order.orderServices} />
          )}

          {order.snapNotes && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Pastabos</h3>
              <p className="text-gray-700 whitespace-pre-wrap break-words">{order.snapNotes}</p>
            </div>
          )}

          <OrderMeta order={order} totalPrice={totalPrice} />

          <ActionButtons />
        </div>
      </section>
    </main>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
'use client';

import { useOrders } from './hooks/useOrders';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { OrdersHero } from './components/OrdersHero';
import { OrdersList } from './components/OrdersList';
import { OrderDetailModal } from './components/OrderDetailModal';

export default function OrderPage() {
  const {
    status,
    orders,
    loading,
    error,
    selectedOrder,
    isModalOpen,
    openModal,
    setIsModalOpen,
  } = useOrders();

  if (status === 'loading' || loading) return <LoadingState />;
  if (error && status === 'unauthenticated') return <ErrorState message={error} />;

  return (
    <>
      <main className="min-h-screen bg-gray-50">
        <OrdersHero />

        <section className="px-6 py-12">
          <div className="mx-auto max-w-4xl">
            <OrdersList orders={orders} onOrderClick={openModal} />
          </div>
        </section>
      </main>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      )}
    </>
  );
}
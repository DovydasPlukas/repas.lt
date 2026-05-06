'use client';

import { useOrders } from './hooks/useOrders';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { OrdersHero } from './components/OrdersHero';
import { OrdersList } from './components/OrdersList';
import { OrderDetailModal } from './components/OrderDetailModal';

const FILTER_OPTIONS = [
  { label: "Visi", value: null },
  { label: "Vakar", value: "yesterday" },
  { label: "Šiandien", value: "today" },
  { label: "Rytoj", value: "tomorrow" },
  { label: "Ši savaitė", value: "thisWeek" },
  { label: "Šis mėnuo", value: "thisMonth" },
] as const;

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
    selectedFilter,
    setSelectedFilter,
  } = useOrders();

  if (status === 'loading' || loading) return <LoadingState />;
  if (error && status === 'unauthenticated') return <ErrorState message={error} />;

  return (
    <>
      <main className="min-h-screen bg-gray-50">
        <OrdersHero />

        <section className="px-6 py-12">
          <div className="mx-auto max-w-4xl">
            {/* Filter Buttons */}
            <div className="mb-8 flex gap-2 flex-wrap">
              {FILTER_OPTIONS.map((option) => (
                <button
                  key={option.label}
                  onClick={() => setSelectedFilter(option.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedFilter === option.value
                      ? "bg-[--RepasBlue] text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

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
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { OrderDetails } from '../../lib/types';
import { OrderCard } from './OrderCard';

type Props = {
  orders: OrderDetails[];
  onOrderClick: (order: OrderDetails) => void;
};

export function OrdersList({ orders, onOrderClick }: Props) {
  if (orders.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
        <p className="text-gray-600 text-lg mb-4">Nėra užsakymų</p>
        <Link
          href="/paslaugos"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[--RepasBlue] text-white rounded-lg hover:opacity-90 font-medium"
        >
          Pradėti užsakymą
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} onClick={onOrderClick} />
      ))}
    </div>
  );
}
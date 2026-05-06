'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { OrderDetails } from '../../lib/types';

function isSameDate(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getTargetDates(order: OrderDetails): Date[] {
  return [order.pickupDateTime, order.deliveryDateTime]
    .filter((d): d is string => d != null)
    .map((d) => new Date(d));
}

type FilterType = null | 'today' | 'tomorrow' | 'yesterday' | 'thisWeek' | 'thisMonth';

function filterOrdersByDate(
  orders: OrderDetails[],
  selectedDate: FilterType
): OrderDetails[] {
  if (!selectedDate) return orders;

  const today = new Date();

  return orders.filter((order) => {
    const dates = getTargetDates(order);

    return dates.some((targetDate) => {
      if (selectedDate === 'today') {
        return isSameDate(targetDate, today);
      }

      if (selectedDate === 'tomorrow') {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return isSameDate(targetDate, tomorrow);
      }

      if (selectedDate === 'yesterday') {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return isSameDate(targetDate, yesterday);
      }

      if (selectedDate === 'thisWeek') {
        const day = today.getDay();
        const diffToMonday = (day + 6) % 7;

        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - diffToMonday);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);

        return targetDate >= startOfWeek && targetDate < endOfWeek;
      }

      if (selectedDate === 'thisMonth') {
        return (
          targetDate.getFullYear() === today.getFullYear() &&
          targetDate.getMonth() === today.getMonth()
        );
      }

      return true;
    });
  });
}

export function useOrders() {
  const { status } = useSession();
  const router = useRouter();

  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState<FilterType>('today');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/prisijungimas');
      return;
    }

    if (status !== 'authenticated') return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/orders');
        if (!response.ok) throw new Error('Failed to fetch orders');
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
  }, [status, router]);

  const filteredOrders = useMemo(
    () => filterOrdersByDate(orders, selectedFilter),
    [orders, selectedFilter]
  );

  const openModal = (order: OrderDetails) => {
    setSelectedOrder(order);
    setIsModalOpen(true);

    const fetchFullOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${order.id}`);
        if (response.ok) {
          const data = await response.json();
          setSelectedOrder((data.order ?? data) as OrderDetails);
        }
      } catch (err) {
        console.error('Error fetching full order details:', err);
      }
    };

    fetchFullOrder();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };
  return {
    status,
    orders: filteredOrders,
    loading,
    error,
    selectedOrder,
    isModalOpen,
    openModal,
    closeModal,
    setIsModalOpen,
    selectedFilter,
    setSelectedFilter,
  };
}
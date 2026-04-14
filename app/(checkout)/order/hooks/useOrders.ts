'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { OrderDetails } from '../../lib/types';

export function useOrders() {
  const { status } = useSession();
  const router = useRouter();

  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Redirect unauthenticated users and fetch orders
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

  // Open modal and immediately fetch full order details in the background
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
    orders,
    loading,
    error,
    selectedOrder,
    isModalOpen,
    openModal,
    closeModal,
    setIsModalOpen,
  };
}
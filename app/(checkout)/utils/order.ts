import { statusOptions } from '../lib/constants';
import { OrderDetails } from '../lib/types';

export const getStatusLabel = (status: string): string => {
  const option = statusOptions.find((opt) => opt.value === status);
  return option?.label ?? status;
};

export const calculateTotalPrice = (order: OrderDetails): number => {
  if (!order.orderServices) return 0;
  return order.orderServices.reduce((total, os) => {
    const addonsTotal = (os.orderAddons ?? []).reduce(
      (sum, addon) => sum + Number(addon.snapPrice ?? 0),
      0,
    );
    return total + addonsTotal;
  }, 0);
};
export const getStatusColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    case "NEW":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "CANCELLED":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }
}
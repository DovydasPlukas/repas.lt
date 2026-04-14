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
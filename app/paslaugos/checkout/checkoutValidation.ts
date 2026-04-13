/**
 * just the canProceedToNextStep switch.
 * One pure function, easy to unit test in isolation.
 */

import type { CartItem, FormData } from '@/components/checkout/types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const canProceedToNextStep = (step: number, cart: CartItem[], form: FormData): boolean => {
  switch (step) {
    case 1:
      return cart.length > 0;
    case 2:
      return !!(form.pickupDate && form.pickupTime && form.deliveryDate && form.deliveryTime);
    case 3:
      return !!(form.street && form.latitude && form.longitude);
    case 4:
      return !!(
        form.email && EMAIL_RE.test(form.email) &&
        form.firstName && form.lastName &&
        form.phone && form.phone.length === 8
      );
    case 5:
      return !!form.paymentMethod;
    default:
      return false;
  }
};

'use client';

/* eslint-disable */

import { useRouter } from 'next/navigation';

interface OrderData {
  services: Array<{serviceId?: string; serviceName?: string; servicePrice?: number | string; addons: Array<{addonId?: string; addonName?: string; addonPrice?: number | string}>}>;
  street: string;
  apartment?: string | null;
  floor?: string | null;
  latitude: number | string;
  longitude: number | string;
  notes?: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  paymentMethod?: string | null;
  pickupDate?: string | null;
  pickupTime?: string | null;
  deliveryDate?: string | null;
  deliveryTime?: string | null;
  email?: string | null;
}

interface OrderService {
  serviceId: string;
  serviceName: string;
  servicePrice: number | string;
  addons: OrderAddon[];
}

interface OrderAddon {
  addonId: string;
  addonName: string;
  addonPrice: number | string;
}

interface HandleSubmitOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onProcessing?: (processing: boolean) => void;
}

/**
 * Handles the checkout submission for both Stripe and Cash payment methods
 * For Stripe: Creates a Stripe checkout session and redirects
 * For Cash: Posts order directly to API
 */
export function useCheckoutSubmit() {
  const router = useRouter();

  const handleSubmit = async (
    orderData: OrderData,
    options?: HandleSubmitOptions
  ): Promise<void> => {
    options?.onProcessing?.(true);

    try {
      const { paymentMethod } = orderData;

      if (paymentMethod === 'stripe') {
        // Handle Stripe payment
        await handleStripePayment(orderData, router, options);
      } else if (paymentMethod === 'cash') {
        // Handle cash payment - post order directly
        await handleCashPayment(orderData, router, options);
      } else {
        throw new Error('Prašome pasirinkti mokėjimo būdą');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Įvyko klaida. Prašome bandyti dar kartą.';
      options?.onError?.(errorMessage);
      options?.onProcessing?.(false);
    }
  };

  return { handleSubmit };
}

/**
 * Handle Stripe payment flow
 * Flow: Email pre-check -> Create Stripe session -> Stripe checkout -> Payment verification -> Create order
 */
async function handleStripePayment(
  orderData: OrderData,
  router: ReturnType<typeof useRouter>,
  options?: HandleSubmitOptions
): Promise<void> {
  // Pre-flight: check for existing email before redirecting to Stripe.
  // Skip if user is logged in (no email conflict possible).
  const preCheck = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: orderData.email, validateOnly: true }),
  });

  if (!preCheck.ok) {
    const preCheckData = await preCheck.json();
    throw new Error(preCheckData.error || 'Nepavyko patikrinti el. pašto');
  }

  // Build the payment details for Stripe
  const stripeOrderDetails = {
    email: orderData.email || '',
    services: orderData.services,
    successUrl: `${window.location.origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${window.location.origin}/paslaugos?paymentError=canceled`,
  };

  // Create Stripe checkout session
  const sessionResponse = await fetch('/api/payments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(stripeOrderDetails),
  });

  const sessionData = await sessionResponse.json();

  if (!sessionResponse.ok || !sessionData.url) {
    throw new Error(sessionData.error || 'Nepavyko sukurti mokėjimo sesijos. Prašome bandyti dar kartą.');
  }

  // Store order data in sessionStorage for use after payment verification
  try {
    sessionStorage.setItem('pendingOrderData', JSON.stringify(orderData));
  } catch (e) {
    console.warn('Could not store order data in sessionStorage:', e);
  }

  // Redirect to Stripe checkout
  window.location.href = sessionData.url;
}

/**
 * Handle cash payment flow - post order directly
 */
async function handleCashPayment(
  orderData: OrderData,
  router: ReturnType<typeof useRouter>,
  options?: HandleSubmitOptions
): Promise<void> {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Nepavyko sukurti užsakymo');
  }

  // Cache the full order so the confirmation page can display it without
  // needing an authenticated GET — guests can't fetch from /api/orders.
  try {
    sessionStorage.setItem('guestOrderData', JSON.stringify(data.order));
  } catch (e) {
    console.warn('Could not cache order data in sessionStorage:', e);
  }

  options?.onSuccess?.();
  options?.onProcessing?.(false);

  // Redirect to confirmation page
  router.push(`/order-confirmation?order=${data.orderId}`);
}
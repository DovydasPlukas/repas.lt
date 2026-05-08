'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { OrderDetails } from '../../lib/types';

async function verifyStripePayment(
  sessionId: string,
  setError: (msg: string) => void,
): Promise<string | null> {
  try {
    console.log('Verifying Stripe payment for session:', sessionId);
    const res = await fetch(`/api/webhooks/stripe?sessionId=${sessionId}`);
    console.log('Stripe verification response status:', res.status);

    if (!res.ok) {
      const data = await res.json();
      console.error('Stripe verification failed:', data);
      setError(data.error || 'Nepavyko patvirtinti mokėjimo. Prašome susisiekti su mūsų komanda.');
      return null;
    }

    const data = await res.json();
    console.log('Stripe verification successful:', data);

    if (data.paymentStatus !== 'paid') {
      console.warn('Payment not successful, status:', data.paymentStatus);
      setError('Mokėjimas nepavyko. Prašome bandyti dar kartą.');
      return null;
    }

    try {
      const orderDataStr = sessionStorage.getItem('pendingOrderData');
      if (!orderDataStr) {
        console.warn('No pendingOrderData found in sessionStorage');
        setError('Užsakymo duomenys nerasti. Prašome bandyti iš naujo.');
        return null;
      }

      const orderData = JSON.parse(orderDataStr);
      console.log('Creating order with data:', {
        services: orderData.services?.length,
        email: orderData.email,
      });

      const createRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      console.log('Order creation response status:', createRes.status);
      const createData = await createRes.json();
      console.log('Order creation response:', createData);

      if (!createRes.ok) {
        console.error('Order creation failed:', createData);
        setError(createData.error || 'Nepavyko sukurti užsakymo. Prašome bandyti iš naujo.');
        return null;
      }

      if (!createData.orderId) {
        console.error('No orderId in response:', createData);
        setError('Serverio klaida: orderId negrąžintas.');
        return null;
      }

      console.log('Order created successfully with ID:', createData.orderId);
      sessionStorage.removeItem('pendingOrderData');

      // Cache the full order so guests can display it without an authenticated API call.
      try {
        if (createData.order) {
          sessionStorage.setItem('guestOrderData', JSON.stringify(createData.order));
        }
      } catch (e) {
        console.warn('Could not cache Stripe order data:', e);
      }

      // Give the database a moment to sync before fetching
      await new Promise((resolve) => setTimeout(resolve, 500));

      return createData.orderId;
    } catch (e) {
      console.error('Error creating order after payment:', e);
      setError('Įvyko klaida kuriant užsakymą. Prašome bandyti iš naujo.');
      return null;
    }
  } catch (e) {
    console.error('Error verifying Stripe session:', e);
    setError('Nepavyko patvirtinti mokėjimo. Prašome bandyti iš naujo.');
    return null;
  }
}

async function fetchSingleOrder(
  id: string,
  mounted: { current: boolean },
  setOrder: (o: OrderDetails) => void,
  setError: (msg: string) => void,
  setLoading: (v: boolean) => void,
): Promise<boolean> {
  try {
    const res = await fetch(`/api/orders/${id}`);
    // Catch backend protection mechanisms directly
    if (res.status === 401 || res.status === 403) {
      if (mounted.current) {
        setError('Prisijunkite, norėdami peržiūrėti užsakymą.');
        setLoading(false);
      }
      return true; // Handled the flow by prompting for auth
    }

    if (res.ok) {
      const json = await res.json();
      const candidate = json?.order ?? json;
      if (mounted.current) {
        setOrder(candidate as OrderDetails);
        setLoading(false);
        return true;
      }
    }
  } catch (e) {
    console.error('Error fetching single order:', e);
  }
  return false;
}

async function fetchOrderFromList(
  id: string | null,
  mounted: { current: boolean },
  setOrder: (o: OrderDetails) => void,
  setError: (msg: string) => void,
  setLoading: (v: boolean) => void,
): Promise<void> {
  try {
    console.log('Fetching orders list to find order:', id);
    const res = await fetch('/api/orders');
    if (res.status === 401 || res.status === 403) {
      setError('Prisijunkite, norėdami peržiūrėti užsakymą.');
      return;
    }
    if (!res.ok) throw new Error('Failed to fetch orders list');

    const json = await res.json();
    console.log('Orders list fetched, count:', Array.isArray(json) ? json.length : 'N/A');

    // Protect against the guest GET /api/orders behavior which returns compact slots
    // If the first item lacks an 'id', this is a guest trying to map slots to an order
    if (Array.isArray(json) && json.length > 0 && !('id' in json[0])) {
      setError('Prisijunkite, norėdami peržiūrėti užsakymą.');
      return;
    }

    let found = null;
    if (id && Array.isArray(json)) {
      found = json.find((o: OrderDetails) => o.id === id);
    } else if (Array.isArray(json) && json.length > 0) {
      console.log('No specific ID provided, using most recent order');
      found = json[0];
    }

    if (!found) {
      setError('Užsakymas nerastas');
    } else {
      console.log('Order found:', found.orderNumber);
      if (mounted.current) setOrder(found as OrderDetails);
    }
  } catch (err) {
    console.error('Error fetching orders list:', err);
    setError('Nepavyko užkrauti užsakymo');
  } finally {
    if (mounted.current) setLoading(false);
  }
}

export function useOrderConfirmation() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = searchParams.get('order');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!orderId && !sessionId) {
      setError('Nerastas užsakymas');
      setLoading(false);
      return;
    }

    const mounted = { current: true };

    (async () => {
      setLoading(true);
      let resolvedOrderId = orderId;

      if (sessionId && !orderId) {
        const orderDataStr = sessionStorage.getItem('pendingOrderData');

        if (orderDataStr) {
          // Fresh load after Stripe redirect — verify payment and create order
          const stripeOrderId = await verifyStripePayment(sessionId, setError);
          if (!stripeOrderId) {
            setLoading(false);
            return;
          }
          resolvedOrderId = stripeOrderId;
          console.log('Stripe payment verified, resolved orderId:', resolvedOrderId);
          window.history.replaceState(
            {},
            '',
            `/order-confirmation?order=${resolvedOrderId}`,
          );
        } else {
          // Refresh after payment — order already created, fall through to cache / API fetch
          console.log('Refresh detected (no sessionStorage), will fetch order from cache or API');
        }
      }

      let resolvedFromCache = false;
      if (resolvedOrderId) {
        try {
          const cached = sessionStorage.getItem('guestOrderData');
          if (cached) {
            const cachedOrder = JSON.parse(cached);
            if (cachedOrder?.id === resolvedOrderId) {
              if (mounted.current) {
                setOrder(cachedOrder);
                setLoading(false);
              }
              resolvedFromCache = true;
            }
          }
        } catch (e) {
          console.warn('Could not read cached order data:', e);
        }
      }

      if (!resolvedFromCache) {
        const ok = resolvedOrderId
          ? await fetchSingleOrder(resolvedOrderId, mounted, setOrder, setError, setLoading)
          : false;

        if (!ok) {
          await fetchOrderFromList(resolvedOrderId, mounted, setOrder, setError, setLoading);
        }
      }
    })();

    return () => {
      mounted.current = false;
    };
  }, [orderId, sessionId]);

  return { order, loading, error };
}
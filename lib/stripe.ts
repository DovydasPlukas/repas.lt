import Stripe from 'stripe';

/* eslint-disable */

// Types for services
export interface OrderService {
  serviceId: string;
  serviceName: string;
  servicePrice: number | string;
  serviceDescription?: string;
  addons: OrderAddon[];
}

export interface OrderAddon {
  addonId: string;
  addonName: string;
  addonPrice: number | string;
}

if (!process.env.STRIPE_API_SECRET) {
  throw new Error('Missing STRIPE_API_SECRET environment variable');
}

// Initialize Stripe with the secret key and API version
export const stripe = new Stripe(process.env.STRIPE_API_SECRET, {
  apiVersion: '2026-03-25.dahlia',
});

/**
 * Safely converts a price string/number to cents (integer)
 * This prevents the "Invalid integer: NaN" error.
 */
function safePriceToCents(price: number | string | undefined | null): number {
  if (price === undefined || price === null || price === '') return 0;
  const parsed = parseFloat(String(price));
  return isNaN(parsed) ? 0 : Math.round(parsed * 100);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Calculate total amount in cents from cart items
 */
export function calculateTotalAmount(services: OrderService[]): number {
  let totalCents = 0;

  for (const service of services) {
    totalCents += safePriceToCents(service.servicePrice);

    if (Array.isArray(service.addons)) {
      for (const addon of service.addons) {
        totalCents += safePriceToCents(addon.addonPrice);
      }
    }
  }
  return totalCents;
}

/**
 * Create a Stripe Checkout Session for order payment
 */
export async function createCheckoutSession(options: {
  email: string;
  services: OrderService[];
  successUrl: string;
  cancelUrl: string;
}): Promise<Stripe.Checkout.Session> {
  const totalAmount = calculateTotalAmount(options.services);

  if (totalAmount <= 0) {
    throw new Error('Užsakymo suma turi būti didesnė nei 0');
  }

  if (!options.email || !isValidEmail(options.email)) {
    throw new Error('El. pašto adresas nenurodytas arba neteisingas.');
  }

  // Determine if we should show addon prices in the description
  // If there is only one service, we hide the (+Price) part as requested
  const isSingleItem = options.services.length === 1;

  // Build line items: Bundling service and its specific addons together
  const lineItems = options.services.map((service) => {
    let bundledAmountCents = safePriceToCents(service.servicePrice);
    const addonDetails: string[] = [];

    if (Array.isArray(service.addons)) {
      for (const addon of service.addons) {
        const addonCents = safePriceToCents(addon.addonPrice);
        bundledAmountCents += addonCents;
        
        if (addon.addonName) {
          // If it's a single item payment, just show the name. Otherwise, show price breakdown.
          const priceDisplay = (!isSingleItem && addonCents > 0) 
            ? ` (+${(addonCents / 100).toFixed(2)}€)` 
            : '';
          
          addonDetails.push(`${addon.addonName}${priceDisplay}`);
        }
      }
    }

    let finalDescription = service.serviceDescription || '';
    if (addonDetails.length > 0) {
      const addonsText = `${addonDetails.join(', ')}`;
      finalDescription = finalDescription ? `${finalDescription} | ${addonsText}` : addonsText;
    }

    return {
      price_data: {
        currency: 'eur',
        product_data: {
          name: service.serviceName || 'Paslauga',
          description: finalDescription.substring(0, 500) || undefined,
        },
        unit_amount: bundledAmountCents,
      },
      quantity: 1,
    };
  }).filter(item => item.price_data.unit_amount > 0);

  if (lineItems.length === 0) {
    throw new Error('Nepavyko paruošti mokėjimo elementų.');
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    locale: 'lt',
    customer_email: options.email,
    line_items: lineItems as any,
    success_url: options.successUrl,
    cancel_url: options.cancelUrl,
  });

  if (!session.url) {
    throw new Error('Nepavyko sukurti Stripe sesijos.');
  }

  return session;
}

/**
 * Retrieve a Stripe Checkout Session
 */
export async function retrieveCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.retrieve(sessionId);
}

/**
 * Verify webhook signature from Stripe
 */
export function verifyWebhookSignature(body: string, signature: string): Stripe.Event {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('Missing STRIPE_WEBHOOK_SECRET environment variable');
  }

  return stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
}
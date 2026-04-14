import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

/**
 * GET /api/webhooks/stripe/verify-session
 * Verify a Stripe checkout session and create order if payment was successful
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Trūksta sessionId parametro' },
        { status: 400 }
      );
    }

    // Retrieve the Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'Sesija nerasta' },
        { status: 404 }
      );
    }

    // Check payment status
    if (session.payment_status === 'paid') {
      // Payment successful - create order from sessionStorage data
      // Note: Order data should be passed from frontend after payment verification
      return NextResponse.json({
        ok: true,
        paymentStatus: 'paid',
        sessionId: session.id,
      });
    } else if (session.payment_status === 'unpaid') {
      return NextResponse.json(
        {
          ok: false,
          error: 'Mokėjimas nepavyko',
          paymentStatus: 'unpaid',
        },
        { status: 402 }
      );
    }

    return NextResponse.json({
      ok: true,
      paymentStatus: session.payment_status,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Error verifying Stripe session:', error);
    return NextResponse.json(
      {
        error: 'Nepavyko patvirtinti mokėjimo sesijos',
      },
      { status: 500 }
    );
  }
}
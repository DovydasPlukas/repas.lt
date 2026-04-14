import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      email,
      services,
      successUrl,
      cancelUrl,
    } = body;

    // Validate required fields
    if (!email || !Array.isArray(services) || services.length === 0) {
      return NextResponse.json(
        { error: 'Prašomi laukai: email, services' },
        { status: 400 }
      );
    }

    if (!successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Prašomi laukai: successUrl, cancelUrl' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await createCheckoutSession({
      email,
      services,
      successUrl,
      cancelUrl,
    });

    return NextResponse.json({
      ok: true,
      sessionId: session.id,
      clientSecret: session.client_secret,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Nepavyko sukurti mokėjimo sesijos',
      },
      { status: 500 }
    );
  }
}
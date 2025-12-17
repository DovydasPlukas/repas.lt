// Note: The authentication and ownership checks have been removed to allow public access to order details via unique ID.
// Find a way to keep order IDs unguessable for security.

import { db } from '@/lib/db';
// import { currentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // const user = await currentUser();

    // if user is not authenticated
    /* Removed to allow public access to order details via unique ID

    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    */
    const orderId = params.id;

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        orderServices: {
          include: {
            service: true,
            orderAddons: {
              include: {
                serviceAddon: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Ownership check
    /* Removed to allow public access to order details via unique ID

    if (order.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    */

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

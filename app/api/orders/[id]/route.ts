import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser();

    // 1. Authentication check: Block anyone not logged in
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const orderId = id;

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

    // 2. Ownership check: Block users trying to view orders that don't belong to them
    // This also naturally blocks authenticated users from viewing guest orders (where userId might be null)
    if (order.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
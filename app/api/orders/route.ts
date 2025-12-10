import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      services,
      address,
      city,
      zipCode,
      notes,
      firstName,
      lastName,
      phone,
      paymentMethod,
    } = body;

    if (!services || services.length === 0) {
      return NextResponse.json(
        { error: 'No services selected' },
        { status: 400 }
      );
    }

    // Create orders for each service
    const orderIds: string[] = [];

    for (const service of services) {
      const orderNumber = `ORD-${Date.now()}-${uuidv4().substring(0, 8)}`;

      // Get service to verify it exists
      const serviceRecord = await db.service.findUnique({
        where: { id: service.serviceId },
      });

      if (!serviceRecord) {
        return NextResponse.json(
          { error: `Service ${service.serviceId} not found` },
          { status: 404 }
        );
      }

      // Create the order
      const order = await db.order.create({
        data: {
          orderNumber,
          userId: user.id,
          serviceId: service.serviceId,
          snapFirstName: firstName,
          snapLastName: lastName,
          snapPhone: phone,
          snapCity: city,
          snapStreet: address,
          snapHouseNumber: '',
          snapZipCode: zipCode,
          snapNotes: notes,
          specialRequirements: service.specialRequirements,
          servicePriceAtPurchase: service.servicePrice,
          status: 'NEW',
          addons: {
            create: service.addons.map((addon: { addonId: string; addonPrice: number; addonName: string }) => ({
              addonId: addon.addonId,
              snapPrice: addon.addonPrice,
              snapName: addon.addonName,
            })),
          },
        },
      });

      orderIds.push(order.id);
    }

    return NextResponse.json({
      success: true,
      orderId: orderIds[0], // Return first order ID for payment redirect
      orderIds,
      paymentMethod,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const orders = await db.order.findMany({
      where: { userId: user.id },
      include: {
        service: true,
        addons: {
          include: {
            serviceAddon: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const services = await db.service.findMany({
      where: {
        enabled: true,
      },
      include: {
        addons: {
          where: {
            enabled: true,
          },
          include: {
            ranges: true,
          },
        },
      },
      orderBy: {
        position: 'asc',
      },
    });

    // Transform data for frontend
    const transformedServices = services.map((service) => ({
      id: service.id,
      name: service.name,
      description: service.description,
      position: service.position,
      addons: service.addons.map((addon) => ({
        id: addon.id,
        name: addon.name,
        price: Number(addon.price),
        type: addon.type,
        optionPricingType: addon.optionPricingType,
        ranges: (addon.ranges || []).map((r) => ({
          id: r.id,
          minQty: r.minQty,
          maxQty: r.maxQty,
          price: Number(r.price),
        })),
      })),
    }));

    return NextResponse.json(transformedServices);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}
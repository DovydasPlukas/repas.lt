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
        },
      },
    });

    // Transform data for frontend
    const transformedServices = services.map((service) => ({
      id: service.id,
      name: service.name,
      description: service.description,
      addons: service.addons.map((addon) => ({
        id: addon.id,
        name: addon.name,
        price: Number(addon.price),
        type: addon.type,
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
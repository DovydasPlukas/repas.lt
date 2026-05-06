import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const services = await db.service.findMany({
      include: {
        addons: {
          include: { ranges: true },
        },
      },
      orderBy: [{ position: "asc" }, { name: "asc" }],
    });

    const normalized = services.map((service) => ({
      ...service,
      addons: service.addons.map((addon) => ({
        ...addon,
        price: Number(addon.price),
        ranges: (addon.ranges || []).map((r) => ({
          ...r,
          price: Number(r.price),
        })),
      })),
    }));

    return NextResponse.json(normalized);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ error: "Error loading services" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, enabled, image } = body;

    if (!name || typeof enabled !== "boolean") {
      return NextResponse.json({ error: "Name and enabled are required" }, { status: 400 });
    }

    const newService = await db.service.create({
      data: { name, description, enabled, image },
    });

    return NextResponse.json(newService);
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json({ error: "Error creating service" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { services } = body;

    if (!Array.isArray(services)) {
      return NextResponse.json(
        { error: "Services array is required" },
        { status: 400 }
      );
    }

    // Update each service's position
    const updatePromises = services.map((service: { id: string; position: number }) =>
      db.service.update({
        where: { id: service.id },
        data: { position: service.position },
      })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating service positions:", error);
    return NextResponse.json(
      { error: "Error updating service positions" },
      { status: 500 }
    );
  }
}
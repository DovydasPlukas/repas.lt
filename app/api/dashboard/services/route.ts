import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const services = await db.service.findMany({
      include: { addons: true },
      orderBy: { name: "asc" },
    });

    const normalized = services.map((service) => ({
      ...service,
      addons: service.addons.map((addon) => ({
        ...addon,
        price: Number(addon.price),
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
    const { name, description, enabled } = body;

    if (!name || typeof enabled !== "boolean") {
      return NextResponse.json({ error: "Name and enabled are required" }, { status: 400 });
    }

    const newService = await db.service.create({
      data: { name, description, enabled },
    });

    return NextResponse.json(newService);
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json({ error: "Error creating service" }, { status: 500 });
  }
}
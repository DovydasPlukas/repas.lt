import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { name, type, price } = await req.json();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "service id missing" }, { status: 400 });
    }

    const addon = await db.serviceAddon.create({
      data: {
        serviceId: id,
        name,
        type,
        price: Number(price),
      },
    });

    return NextResponse.json(addon);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error creating addon" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { addonId, name, price, enabled } = await req.json();

    if (!addonId) {
      return NextResponse.json({ error: "addonId is required" }, { status: 400 });
    }

    const data: Partial<{ name: string; price: number; enabled: boolean }> = {};
    if (name !== undefined) data.name = name;
    if (price !== undefined) data.price = Number(price);
    if (enabled !== undefined) data.enabled = enabled;

    const updated = await db.serviceAddon.update({
      where: { id: addonId },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error updating addon" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const addonId = url.searchParams.get("addonId");
    if (!addonId) return NextResponse.json({ error: "addonId is required" }, { status: 400 });

    await db.serviceAddon.delete({
      where: { id: addonId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error deleting addon" }, { status: 500 });
  }
}
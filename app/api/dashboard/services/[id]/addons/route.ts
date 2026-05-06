import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { name, type, price, optionPricingType, ranges } = await req.json();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "service id missing" }, { status: 400 });
    }
    const isRange = type === "OPTION" && optionPricingType === "RANGE";

    const addon = await db.serviceAddon.create({
      data: {
        serviceId: id,
        name,
        type,
        price: isRange ? 0 : Number(price),
        ...(type === "OPTION" && optionPricingType ? { optionPricingType } : {}),
        ...(isRange && Array.isArray(ranges) && ranges.length > 0
          ? {
              ranges: {
                create: ranges.map((r: { minQty: number; maxQty: number; price: number }) => ({
                  minQty: Number(r.minQty),
                  maxQty: Number(r.maxQty),
                  price: Number(r.price),
                })),
              },
            }
          : {}),
      },
      include: { ranges: true },
    });

    return NextResponse.json(addon);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error creating addon" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { addonId, name, price, enabled, optionPricingType, ranges } = await req.json();

    if (!addonId) {
      return NextResponse.json({ error: "addonId is required" }, { status: 400 });
    }

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name;
    if (price !== undefined) data.price = Number(price);
    if (enabled !== undefined) data.enabled = enabled;
    if (optionPricingType !== undefined) data.optionPricingType = optionPricingType;

    // Replace ranges wholesale when provided
    if (Array.isArray(ranges)) {
      data.ranges = {
        deleteMany: {},
        create: ranges.map((r: { minQty: number; maxQty: number; price: number }) => ({
          minQty: Number(r.minQty),
          maxQty: Number(r.maxQty),
          price: Number(r.price),
        })),
      };
    }

    const updated = await db.serviceAddon.update({
      where: { id: addonId },
      data,
      include: { ranges: true },
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

    await db.serviceAddon.delete({ where: { id: addonId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error deleting addon" }, { status: 500 });
  }
}
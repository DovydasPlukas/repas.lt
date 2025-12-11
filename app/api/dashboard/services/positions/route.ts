import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { services } = body;

    if (!Array.isArray(services) || services.length === 0) {
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

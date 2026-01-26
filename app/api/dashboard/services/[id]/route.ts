import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, description, enabled, image } = body;

    const updatedService = await db.service.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(enabled !== undefined ? { enabled } : {}),
        ...(image !== undefined ? { image } : {}),
      },
      include: { addons: true },
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json({ error: "Error updating service" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Delete all addons of the service first
    await db.serviceAddon.deleteMany({ where: { serviceId: id } });

    // Then delete the service itself
    await db.service.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json({ error: "Error deleting service" }, { status: 500 });
  }
}

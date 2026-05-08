/* eslint-disable */

import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/adminAuth"

function mapOrderDetailed(o: any) {
  const customer = `${o.snapFirstName ?? ""} ${o.snapLastName ?? ""}`.trim()
  const email = o.snapEmail ?? ""
  const phone = o.snapPhone ?? ""
  const addressParts: string[] = []
  if (o.snapStreet) addressParts.push(o.snapStreet)
  if (o.snapApartment) addressParts.push(o.snapApartment)
  if (o.snapFloor) addressParts.push(o.snapFloor)
  const address = addressParts.join(", ")

  const items = (o.orderServices ?? []).map((os: any) => {
    const serviceName = os.service?.name ?? os.serviceId
    const addonsTotal =
      (os.orderAddons ?? []).reduce((s: number, a: any) => s + Number(a?.snapPrice ?? 0), 0) || 0
    const price = Number(os.servicePriceAtPurchase ?? 0) + addonsTotal
    return {
      id: os.id,
      name: serviceName,
      quantity: 1,
      price,
      addons: (os.orderAddons ?? []).map((a: any) => ({
        id: a.id,
        name: a.snapName ?? a.addonId,
        price: Number(a.snapPrice ?? 0),
      })),
    }
  })

  const totalAmount = items.reduce((s: number, it: any) => s + Number(it.price ?? 0), 0)

  return {
    id: o.id,
    orderNumber: o.orderNumber,
    customer,
    email,
    phone,
    address,
    serviceType:
      (o.Service && o.Service.id) ||
      (o.orderServices && o.orderServices[0]?.service?.id) ||
      o.serviceId ||
      "unknown",
    items,
    totalAmount,
    status: o.status,
    createdAt: o.createdAt,
    snap: {
      firstName: o.snapFirstName,
      lastName: o.snapLastName,
      street: o.snapStreet,
      apartment: o.snapApartment,
      floor: o.snapFloor,
      phone: o.snapPhone,
      email: o.snapEmail,
      notes: o.snapNotes,
      pickupDateTime: o.pickupDateTime,
      deliveryDateTime: o.deliveryDateTime,
    },
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if (guard) return guard

  try {
    const { id } = await params
    const order = await db.order.findUnique({
      where: { id },
      include: {
        orderServices: {
          include: {
            service: true,
            orderAddons: { include: { serviceAddon: true } },
          },
        },
        Service: true,
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(mapOrderDetailed(order))
  } catch (error) {
    console.error("Error fetching dashboard order:", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if (guard) return guard

  try {
    const { id } = await params
    const body = await request.json()
    const status = body?.status
    if (!status) {
      return NextResponse.json({ error: "Missing status" }, { status: 400 })
    }

    const order = await db.order.update({
      where: { id },
      data: { status },
      include: {
        orderServices: {
          include: {
            service: true,
            orderAddons: { include: { serviceAddon: true } },
          },
        },
        Service: true,
      },
    })

    return NextResponse.json(mapOrderDetailed(order))
  } catch (error) {
    console.error("Error updating dashboard order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if (guard) return guard

  try {
    const { id } = await params
    await db.order.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting order:", error)
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 })
  }
}
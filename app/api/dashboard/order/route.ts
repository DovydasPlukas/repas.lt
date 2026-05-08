/* eslint-disable */

import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/adminAuth"

function mapOrderForList(o: any) {
  const customer = `${o.snapFirstName ?? ""} ${o.snapLastName ?? ""}`.trim()
  const email = o.snapEmail ?? ""
  const phone = o.snapPhone ?? ""
  const addressParts: string[] = []
  if (o.snapStreet) addressParts.push(o.snapStreet)
  if (o.snapApartment) addressParts.push(o.snapApartment)
  if (o.snapFloor) addressParts.push(o.snapFloor)
  const address = addressParts.join(", ")

  const serviceType =
    (o.Service && o.Service.id) ||
    (Array.isArray(o.orderServices) && o.orderServices[0]?.service?.id) ||
    o.serviceId ||
    "unknown"

  const items = (o.orderServices ?? []).map((os: any) => {
    const serviceName = os.service?.name ?? os.serviceId
    const addonsTotal = (os.orderAddons ?? []).reduce((s: number, a: any) => s + Number(a?.snapPrice ?? 0), 0) || 0
    const price = Number(os.servicePriceAtPurchase ?? 0) + addonsTotal
    return {
      id: os.id,
      name: serviceName,
      serviceId: os.serviceId,
      quantity: 1,
      price,
      specialRequirements: os.specialRequirements,
      addons: (os.orderAddons ?? []).map((a: any) => ({
        id: a.id,
        name: a.snapName ?? a.serviceAddon?.name ?? a.addonId,
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
    serviceType,
    items,
    totalAmount,
    status: o.status,
    paymentMethod: o.paymentMethod,
    createdAt: o.createdAt,
    pickupDateTime: o.pickupDateTime,
    deliveryDateTime: o.deliveryDateTime,
    isPickedUp: o.isPickedUp ?? false,
    isDelivered: o.isDelivered ?? false,
    snapNotes: o.snapNotes,
    snap: {
      firstName: o.snapFirstName,
      lastName: o.snapLastName,
      street: o.snapStreet,
      apartment: o.snapApartment,
      floor: o.snapFloor,
      phone: o.snapPhone,
      email: o.snapEmail,
      notes: o.snapNotes,
      latitude: o.snapLatitude,
      longitude: o.snapLongitude,
    },
  }
}

export async function GET(request: NextRequest) {
  const guard = await requireAdmin()
  if (guard) return guard

  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const dateFilter = searchParams.get("dateFilter")
    const timeFilter = searchParams.get("timeFilter")

    const where: any = {}

    if (status && status !== "ALL") {
      where.status = status
    }

    if (search) {
      const normalized = search.toLowerCase()

      let mappedPayment: "PAID" | "UNPAID" | undefined
      // Lithuanian
      if (normalized.includes("ne")) mappedPayment = "UNPAID"
      else if (normalized.includes("su") || normalized.includes("moket")) mappedPayment = "PAID"
      // English
      else if (normalized.includes("unpaid")) mappedPayment = "UNPAID"
      else if (normalized.includes("paid")) mappedPayment = "PAID"

      where.OR = [
        { snapFirstName: { contains: search, mode: "insensitive" } },
        { snapLastName: { contains: search, mode: "insensitive" } },
        { snapEmail: { contains: search, mode: "insensitive" } },
        { orderNumber: { contains: search, mode: "insensitive" } },
        { snapPhone: { contains: search, mode: "insensitive" } },
        {
          orderServices: {
            some: {
              service: {
                name: { contains: search, mode: "insensitive" },
              },
            },
          },
        },
      ]

      if (mappedPayment) {
        where.OR.push({ paymentMethod: { equals: mappedPayment } })
      }
    }

    // Date filters
    if (dateFilter) {
      const now = new Date()
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)

      switch (dateFilter) {
        case "today":
          where.createdAt = { gte: startOfDay, lt: endOfDay }
          break
        case "yesterday":
          const yesterday = new Date(startOfDay.getTime() - 24 * 60 * 60 * 1000)
          where.createdAt = { gte: yesterday, lt: startOfDay }
          break
        case "thisWeek":
          const startOfWeek = new Date(startOfDay)
          startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay())
          where.createdAt = { gte: startOfWeek }
          break
        case "thisMonth":
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
          where.createdAt = { gte: startOfMonth }
          break
      }
    }

    // Time-based filters for pickup/delivery
    if (timeFilter) {
      const now = new Date()
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)

      switch (timeFilter) {
        case "pickupToday":
          where.pickupDateTime = { gte: startOfDay, lt: endOfDay }
          break
        case "deliveryToday":
          where.deliveryDateTime = { gte: startOfDay, lt: endOfDay }
          break
        case "overduePickup":
          where.pickupDateTime = { lt: now }
          where.isPickedUp = false
          break
        case "overdueDelivery":
          where.deliveryDateTime = { lt: now }
          where.isDelivered = false
          break
      }
    }

    const queryOptions: any = {
      where,
      include: {
        orderServices: {
          include: {
            service: true,
            orderAddons: { include: { serviceAddon: true } },
          },
        },
        Service: true,
      },
      orderBy: { createdAt: "desc" },
    }

    if (!search) {
      queryOptions.take = limit
      queryOptions.skip = offset
    }

    const [orders, total] = await Promise.all([db.order.findMany(queryOptions), db.order.count({ where })])

    const mapped = orders.map(mapOrderForList)

    return NextResponse.json({
      orders: mapped,
      total,
      hasMore: offset + orders.length < total,
    })
  } catch (error) {
    console.error("Error fetching dashboard orders:", error)
    return NextResponse.json({ orders: [], total: 0, hasMore: false }, { status: 500 })
  }
}

// Mass update orders
export async function PATCH(request: NextRequest) {
  const guard = await requireAdmin()
  if (guard) return guard

  try {
    const body = await request.json()
    const { orderIds, status, isPickedUp, isDelivered } = body

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json({ error: "Missing orderIds" }, { status: 400 })
    }

    const updateData: any = {}
    if (status) updateData.status = status
    if (typeof isPickedUp === "boolean") updateData.isPickedUp = isPickedUp
    if (typeof isDelivered === "boolean") updateData.isDelivered = isDelivered

    await db.order.updateMany({
      where: { id: { in: orderIds } },
      data: updateData,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error mass updating orders:", error)
    return NextResponse.json({ error: "Failed to update orders" }, { status: 500 })
  }
}

// Mass delete orders
export async function DELETE(request: NextRequest) {
  const guard = await requireAdmin()
  if (guard) return guard

  try {
    const body = await request.json()
    const { orderIds } = body

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json({ error: "Missing orderIds" }, { status: 400 })
    }

    await db.order.deleteMany({
      where: { id: { in: orderIds } },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error mass deleting orders:", error)
    return NextResponse.json({ error: "Failed to delete orders" }, { status: 500 })
  }
}
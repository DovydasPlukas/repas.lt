/* eslint-disable */

import { NextResponse } from "next/server"
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

  const items = (o.orderServices ?? []).map((os: any) => {
    const serviceName = os.service?.name ?? os.serviceId
    const addonsTotal =
      (os.orderAddons ?? []).reduce((s: number, a: any) => s + Number(a?.snapPrice ?? 0), 0) || 0
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
    items,
    totalAmount,
    status: o.status,
    createdAt: o.createdAt,
    pickupDateTime: o.pickupDateTime,
    deliveryDateTime: o.deliveryDateTime,
    isPickedUp: o.isPickedUp ?? false,
    isDelivered: o.isDelivered ?? false,
    snap: {
      firstName: o.snapFirstName,
      lastName: o.snapLastName,
      street: o.snapStreet,
      apartment: o.snapApartment,
      floor: o.snapFloor,
      phone: o.snapPhone,
      email: o.snapEmail,
      notes: o.snapNotes,
      latitude: o.snapLatitude ? Number(o.snapLatitude) : undefined,
      longitude: o.snapLongitude ? Number(o.snapLongitude) : undefined,
    },
  }
}

export async function GET() {
  const guard = await requireAdmin()
  if (guard) return guard

  try {
    const now = new Date()

    const [
      totalOrders,
      pendingOrders,
      newOrders,
      cancelledOrders,
      completedOrders,
      completedOrdersData,
      rawUpcomingPickups,
      rawUpcomingDeliveries,
      rawOverdueOrders,
    ] = await Promise.all([
      db.order.count(),
      db.order.count({ where: { status: "PENDING" } }),
      db.order.count({ where: { status: "NEW" } }),
      db.order.count({ where: { status: "CANCELLED" } }),
      db.order.count({ where: { status: "COMPLETED" } }),

      db.order.findMany({
        where: { status: "COMPLETED" },
        select: {
          orderServices: {
            select: {
              servicePriceAtPurchase: true,
              orderAddons: { select: { snapPrice: true } },
            },
          },
        },
      }),

      db.order.findMany({
        where: {
          pickupDateTime: { gt: now },
          isPickedUp: false,
          status: { not: "CANCELLED" },
        },
        include: {
          orderServices: { include: { service: true, orderAddons: { include: { serviceAddon: true } } } },
        },
        orderBy: { pickupDateTime: "asc" },
        take: 10,
      }),

      db.order.findMany({
        where: {
          deliveryDateTime: { gt: now },
          isDelivered: false,
          status: { not: "CANCELLED" },
        },
        include: {
          orderServices: { include: { service: true, orderAddons: { include: { serviceAddon: true } } } },
        },
        orderBy: { deliveryDateTime: "asc" },
        take: 10,
      }),

      db.order.findMany({
        where: {
          OR: [
            { pickupDateTime: { lt: now }, isPickedUp: false },
            { deliveryDateTime: { lt: now }, isDelivered: false },
          ],
          status: { not: "CANCELLED" },
        },
        include: {
          orderServices: { include: { service: true, orderAddons: { include: { serviceAddon: true } } } },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    ])

    const totalRevenue = completedOrdersData.reduce((sum: number, o: any) => {
      const orderTotal = (o.orderServices ?? []).reduce((osSum: number, os: any) => {
        const addonsTotal = (os.orderAddons ?? []).reduce(
          (aSum: number, a: any) => aSum + Number(a?.snapPrice ?? 0),
          0,
        )
        return osSum + Number(os.servicePriceAtPurchase ?? 0) + addonsTotal
      }, 0)
      return sum + orderTotal
    }, 0)

    const upcomingPickups = rawUpcomingPickups.map(mapOrderForList)
    const upcomingDeliveries = rawUpcomingDeliveries.map(mapOrderForList)
    const overdueOrders = rawOverdueOrders.map(mapOrderForList)

    return NextResponse.json({
      totalOrders,
      pendingOrders,
      newOrders,
      cancelledOrders,
      completedOrders,
      totalRevenue,
      upcomingPickups,
      upcomingDeliveries,
      overdueOrders,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json(
      {
        totalOrders: 0,
        pendingOrders: 0,
        newOrders: 0,
        cancelledOrders: 0,
        completedOrders: 0,
        totalRevenue: 0,
        upcomingPickups: [],
        upcomingDeliveries: [],
        overdueOrders: [],
        error: "Failed to fetch order statistics",
      },
      { status: 500 },
    )
  }
}
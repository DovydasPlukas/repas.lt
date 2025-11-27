import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const [
      totalOrders,
      pendingOrders,
      newOrders,
      cancelledOrders,
      completedOrders,
      completedOrdersData,
      recentCompletedOrders,
    ] = await Promise.all([
      db.order.count(),
      db.order.count({ where: { status: "PENDING" } }),
      db.order.count({ where: { status: "NEW" } }),
      db.order.count({ where: { status: "CANCELLED" } }),
      db.order.count({ where: { status: "COMPLETED" } }),
      db.order.findMany({
        where: { status: "COMPLETED" },
        select: { totalAmount: true },
      }),
      db.order.findMany({
        where: { status: "COMPLETED" },
        select: {
          id: true,
          customer: true,
          email: true,
          totalAmount: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ])

    const totalRevenue = completedOrdersData.reduce((sum, order) => sum + order.totalAmount, 0)

    return NextResponse.json({
      totalOrders,
      pendingOrders,
      newOrders,
      cancelledOrders,
      completedOrders,
      totalRevenue,
      recentCompletedOrders, // Added to response
    })
  } catch (error) {
    console.error(" Error fetching order stats:", error)
    return NextResponse.json(
      {
        totalOrders: 0,
        pendingOrders: 0,
        newOrders: 0,
        cancelledOrders: 0,
        completedOrders: 0,
        totalRevenue: 0,
        recentCompletedOrders: [],
        error: "Failed to fetch order statistics",
      },
      { status: 500 },
    )
  }
}
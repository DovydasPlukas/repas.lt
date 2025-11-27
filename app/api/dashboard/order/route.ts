import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    const where: any = {}

    if (status && status !== "ALL") {
      where.status = status
    }

    if (search) {
      where.OR = [
        { customer: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { orderNumber: { contains: search, mode: "insensitive" } },
      ]
    }

    const orders = await db.order.findMany({
      where,
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error(" Error fetching orders:", error)
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer, email, phone, address, serviceType, items, totalAmount } = body

    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    const order = await db.order.create({
      data: {
        orderNumber,
        customer,
        email,
        phone,
        address,
        serviceType,
        totalAmount,
        items: {
          create: items,
        },
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error(" Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
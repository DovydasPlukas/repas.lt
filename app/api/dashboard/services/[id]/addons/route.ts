import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(req, { params }) {
  try {
    const { name, type, price } = await req.json()

    const addon = await db.serviceAddon.create({
      data: {
        serviceId: params.id,
        name,
        type,
        price: Number(price),
      },
    })

    return NextResponse.json(addon)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error creating addon" }, { status: 500 })
  }
}

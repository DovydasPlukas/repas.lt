import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(req, { params }) {
  try {
    const { enabled } = await req.json()

    const service = await db.service.update({
      where: { id: params.id },
      data: { enabled },
      include: { addons: true },
    })

    return NextResponse.json(service)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error updating service" }, { status: 500 })
  }
}

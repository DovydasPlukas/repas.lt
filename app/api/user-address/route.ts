import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Neatpažinta sesija" },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Vartotojas nerastas" },
        { status: 404 }
      );
    }

    const address = await db.address.findUnique({
      where: { userId: user.id },
    });

    if (!address) {
      return NextResponse.json(
        { data: null, message: "Adresas nerastas" },
        { status: 200 }
      );
    }

    return NextResponse.json({
      data: {
        street: address.street,
        apartment: address.apartment || "",
        floor: address.floor || "",
        comments: address.comments || "",
        latitude: address.latitude.toString(),
        longitude: address.longitude.toString(),
      },
    });
  } catch (error) {
    console.error("GET /api/user-address error:", error);
    return NextResponse.json(
      { error: "Nepavyko gauti adreso duomenų" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Neatpažinta sesija" },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Vartotojas nerastas" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { street, apartment, floor, comments, latitude, longitude } = body;

    if (!street || !latitude || !longitude) {
      return NextResponse.json(
        { error: "Adresas ir vieta yra privalomi" },
        { status: 400 }
      );
    }

    const address = await db.address.upsert({
      where: { userId: user.id },
      update: {
        street,
        apartment: apartment || null,
        floor: floor || null,
        comments: comments || null,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
      create: {
        userId: user.id,
        street,
        apartment: apartment || null,
        floor: floor || null,
        comments: comments || null,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
    });

    return NextResponse.json(
      { data: address, message: "Adresas sėkmingai išsaugotas" },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/user-address error:", error);
    return NextResponse.json(
      { error: "Nepavyko išsaugoti adreso" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Neatpažinta sesija" },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Vartotojas nerastas" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { street, apartment, floor, comments, latitude, longitude } = body;

    if (!street || !latitude || !longitude) {
      return NextResponse.json(
        { error: "Adresas ir vieta yra privalomi" },
        { status: 400 }
      );
    }

    const address = await db.address.update({
      where: { userId: user.id },
      data: {
        street,
        apartment: apartment || null,
        floor: floor || null,
        comments: comments || null,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
    });

    return NextResponse.json(
      { data: address, message: "Adresas sėkmingai atnaujintas" },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/user-address error:", error);
    return NextResponse.json(
      { error: "Nepavyko atnaujinti adreso" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Neatpažinta sesija" },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Vartotojas nerastas" },
        { status: 404 }
      );
    }

    await db.address.delete({
      where: { userId: user.id },
    });

    return NextResponse.json(
      { message: "Adresas sėkmingai ištrinti" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/user-address error:", error);
    return NextResponse.json(
      { error: "Nepavyko ištrinti adreso" },
      { status: 500 }
    );
  }
}

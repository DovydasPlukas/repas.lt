/* eslint-disable */
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { hash } from 'bcryptjs';

// ------------------ helpers ------------------
function toFixed2String(value: number | string | undefined | null) {
  if (value === undefined || value === null || Number.isNaN(Number(value))) return null;
  return Number(value).toFixed(2);
}

async function generateEncryptedPassword(): Promise<string> {
  const randomPassword = uuidv4().substring(0, 20);
  const hashedPassword = await hash(randomPassword, 10);
  return hashedPassword;
}

/** Normalize a local Lithuanian phone input into +370XXXXXXXX form (best-effort). */
function formatLithuanianPhone(raw?: string | null | undefined) {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 8) {
    return `+370${digits}`;
  }
  if (digits.length === 9 && digits.startsWith('8')) {
    return `+370${digits.slice(1)}`;
  }
  if (digits.length === 11 && digits.startsWith('370')) {
    return `+${digits}`;
  }
  // best-effort: take last 8 digits
  if (digits.length > 8) {
    const last8 = digits.slice(-8);
    return `+370${last8}`;
  }
  // fallback: prefix + if missing
  return digits.startsWith('+') ? digits : `+${digits}`;
}

function parseLatLong(value: any) {
  if (value === undefined || value === null || value === '') return 0.0;
  const n = Number(String(value));
  return Number.isFinite(n) ? n : 0.0;
}

function synthesizeDateAndRangeFromIso(iso?: string | Date | null) {
  if (!iso) return { date: null, range: null };
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  if (isNaN(d.getTime())) return { date: null, range: null };

  // Force Vilnius timezone instead of relying on the server's local timezone
  // This guarantees Vercel and Localhost produce the exact same display strings
  const formatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Vilnius',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  // e.g., "2026-05-10 17:00"
  const formatted = formatter.format(d); 
  const [datePart, timePart] = formatted.split(' ');

  const startHour = parseInt(timePart.split(':')[0], 10);
  const start = String(startHour).padStart(2, '0') + ':00';
  const end = String(startHour + 1).padStart(2, '0') + ':00';

  return { date: datePart, range: `${start}-${end}` };
}

// ------------------ GET handler ------------------
// Always returns compact occupied slot data (pickup + delivery separately)
// for all users — used by TimeSlotSelect to block unavailable times.
// For authenticated user orders, use GET /api/orders/user.
export async function GET(request: NextRequest) {
  try {
    // Return only occupied slot times (compact), next 14 days
    const since = new Date();
    const until = new Date();
    until.setDate(until.getDate() + 14);

    const orders = await db.order.findMany({
      where: {
        OR: [
          { pickupDateTime: { gte: since, lte: until } },
          { deliveryDateTime: { gte: since, lte: until } },
        ],
      },
      select: {
        pickupDateTime: true,
        deliveryDateTime: true,
      },
    });

    const mapped = orders.map((o) => {
      const { date: pickupDate, range: pickupTime } = synthesizeDateAndRangeFromIso(o.pickupDateTime ?? null);
      const { date: deliveryDate, range: deliveryTime } = synthesizeDateAndRangeFromIso(o.deliveryDateTime ?? null);
      return { pickupDate, pickupTime, deliveryDate, deliveryTime };
    });

    // dedupe into compact list of single-slot entries
    const slotSet = new Set<string>();
    const compact: Array<{ pickupDate?: string | null; pickupTime?: string | null; deliveryDate?: string | null; deliveryTime?: string | null }> = [];

    for (const m of mapped) {
      if (m.pickupDate && m.pickupTime) {
        const key = `p||${m.pickupDate}||${m.pickupTime}`;
        if (!slotSet.has(key)) {
          slotSet.add(key);
          compact.push({ pickupDate: m.pickupDate, pickupTime: m.pickupTime, deliveryDate: null, deliveryTime: null });
        }
      }
      if (m.deliveryDate && m.deliveryTime) {
        const key = `d||${m.deliveryDate}||${m.deliveryTime}`;
        if (!slotSet.has(key)) {
          slotSet.add(key);
          compact.push({ pickupDate: null, pickupTime: null, deliveryDate: m.deliveryDate, deliveryTime: m.deliveryTime });
        }
      }
    }

    return NextResponse.json(compact, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch (err) {
    console.error('Error in GET /api/orders:', err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// ------------------ POST handler ------------------
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as any;

    const {
      services,
      street,
      apartment,
      floor,
      latitude,
      longitude,
      notes,
      firstName,
      lastName,
      phone,
      paymentMethod,
      pickupDateTime,
      deliveryDateTime,
      email,
    } = body;

    // validateOnly: email-exists pre-flight for the Stripe redirect flow.
    if (body.validateOnly === true) {
      let preflight_userId: string | undefined;
      try { preflight_userId = (await currentUser())?.id; } catch { /* guest */ }

      if (!preflight_userId) {
        const preflightEmail = body.email as string | undefined;
        if (!preflightEmail) {
          return NextResponse.json({ error: 'Email required' }, { status: 400 });
        }
        const existing = await db.user.findUnique({ where: { email: preflightEmail } });
        if (existing) {
          return NextResponse.json(
            { error: 'el. pastas egzistuoja, prisijunkite' },
            { status: 409 }
          );
        }
      }
      return NextResponse.json({ ok: true });
    }

    if (!Array.isArray(services) || services.length === 0) {
      return NextResponse.json({ error: 'No services selected' }, { status: 400 });
    }

    if (!pickupDateTime || !deliveryDateTime) {
      return NextResponse.json({ error: 'Missing pickup or delivery datetime' }, { status: 400 });
    }

    const pickupDateObj = new Date(pickupDateTime);
    const deliveryDateObj = new Date(deliveryDateTime);

    if (isNaN(pickupDateObj.getTime()) || isNaN(deliveryDateObj.getTime())) {
      return NextResponse.json({ error: 'Invalid dates provided' }, { status: 400 });
    }

    if (pickupDateObj >= deliveryDateObj) {
      return NextResponse.json({ error: 'Pickup must be before delivery' }, { status: 400 });
    }

    let userId: string | undefined;
    try {
      const user = await currentUser();
      userId = user?.id;
    } catch {
      userId = undefined;
    }

    const normalizedPhone = formatLithuanianPhone(phone ?? null);
    const latVal = parseLatLong(latitude);
    const lonVal = parseLatLong(longitude);

    if (!userId) {
      if (!email) {
        return NextResponse.json({ error: 'Email required for guest checkout' }, { status: 400 });
      }

      const existing = await db.user.findUnique({ where: { email } });

      if (existing) {
        return NextResponse.json(
          { error: 'el. pastas egzistuoja, prisijunkite' },
          { status: 409 }
        );
      }

      const encryptedPassword = await generateEncryptedPassword();
      const created = await db.user.create({
        data: {
          email,
          password: encryptedPassword,
          role: 'USER',
        },
        select: { id: true },
      });
      userId = created.id;

      try {
        const phoneForContact = normalizedPhone || `+guest-${userId}`;
        await db.contact.create({
          data: {
            userId,
            firstName: firstName || '',
            lastName: lastName || '',
            phoneNumber: phoneForContact,
          },
        });
      } catch (e: any) {
        if (e?.code === 'P2002') {
          try {
            await db.contact.create({
              data: {
                userId,
                firstName: firstName || '',
                lastName: lastName || '',
                phoneNumber: '', 
              },
            });
          } catch (e2) {
            console.warn('Contact create failed (fallback):', e2);
          }
        } else {
          console.warn('Contact create failed:', e);
        }
      }

      try {
        await db.address.create({
          data: {
            userId,
            street: street ?? '',
            apartment: apartment ?? null,
            floor: floor ?? null,
            comments: null,
            latitude: latVal,
            longitude: lonVal,
          },
        });
      } catch (e) {
        console.warn('Address create failed:', e);
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Could not resolve user for order' }, { status: 500 });
    }

    const orderServicesCreate: any[] = [];
    for (const s of services) {
      if (!s?.serviceId) {
        return NextResponse.json({ error: 'Missing serviceId in services array' }, { status: 400 });
      }
      const svcPriceStr = toFixed2String(s.servicePrice) ?? '0.00';
      let orderAddonsCreate: any[] | undefined = undefined;
      if (Array.isArray(s.addons) && s.addons.length > 0) {
        orderAddonsCreate = [];
        for (const addon of s.addons) {
          let snapPriceStr = toFixed2String(addon.addonPrice);
          if (!snapPriceStr) {
            try {
              const sa = await db.serviceAddon.findUnique({ where: { id: addon.addonId } });
              if (sa && sa.price !== undefined && sa.price !== null) {
                snapPriceStr = Number(String(sa.price)).toFixed(2);
              } else {
                snapPriceStr = '0.00';
              }
            } catch {
              snapPriceStr = '0.00';
            }
          }
          orderAddonsCreate.push({
            addonId: addon.addonId,
            snapPrice: snapPriceStr,
            snapName: addon.addonName ?? null,
          });
        }
      }
      orderServicesCreate.push({
        serviceId: s.serviceId,
        servicePriceAtPurchase: svcPriceStr,
        specialRequirements: s.specialRequirements ?? null,
        orderAddons: orderAddonsCreate && orderAddonsCreate.length > 0 ? { create: orderAddonsCreate } : undefined,
      });
    }

    const orderNumber = `ORD-${Date.now()}-${uuidv4().slice(0, 8)}`;
    const mappedPaymentMethod = paymentMethod === 'stripe' ? 'PAID' : 'UNPAID';

    const createdOrder = await db.order.create({
      data: {
        orderNumber,
        userId,
        snapFirstName: firstName,
        snapLastName: lastName,
        snapPhone: normalizedPhone ?? phone,
        snapEmail: email ?? '',
        snapStreet: street,
        snapApartment: apartment ?? null,
        snapFloor: floor ?? null,
        snapLatitude: String(latVal ?? '0'),
        snapLongitude: String(lonVal ?? '0'),
        snapNotes: notes ?? null,
        pickupDateTime: pickupDateObj,
        deliveryDateTime: deliveryDateObj,
        paymentMethod: mappedPaymentMethod,
        orderServices: {
          create: orderServicesCreate,
        },
      },
      include: {
        orderServices: {
          include: {
            orderAddons: { include: { serviceAddon: true } },
            service: true,
          },
        },
      },
    });

    const createdJson = JSON.parse(JSON.stringify(createdOrder));
    const { date: pickupDateOut, range: pickupTimeOut } = synthesizeDateAndRangeFromIso(createdOrder.pickupDateTime ?? null);
    const { date: deliveryDateOut, range: deliveryTimeOut } = synthesizeDateAndRangeFromIso(createdOrder.deliveryDateTime ?? null);
    createdJson.pickupDate = pickupDateOut;
    createdJson.pickupTime = pickupTimeOut;
    createdJson.deliveryDate = deliveryDateOut;
    createdJson.deliveryTime = deliveryTimeOut;

    return NextResponse.json({
      success: true,
      orderId: createdOrder.id,
      orderNumber: createdOrder.orderNumber,
      paymentMethod,
      order: createdJson,
      createdUserId: userId,
    });
  } catch (err) {
    console.error('Error creating order:', err);
    return NextResponse.json(
      { error: 'Failed to create order', details: (err as Error)?.message ?? null },
      { status: 500 }
    );
  }
}
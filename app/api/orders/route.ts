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

function parseRange(range?: string | null): [string, string] | null {
  if (!range || typeof range !== 'string') return null;
  const parts = range.split('-').map((p) => p.trim());
  if (parts.length !== 2) return null;
  const [a, b] = parts;
  const timeRe = /^\d{2}:\d{2}$/;
  if (!timeRe.test(a) || !timeRe.test(b)) return null;
  return [a, b];
}

function buildIso(date?: string | null, time?: string | null): string | null {
  if (!date || !time) return null;
  const iso = `${date}T${time}:00`;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
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
  // Common cases:
  // - "60000000" (8 digits) -> +37060000000
  // - "860000000" (9 digits, leading 8) -> +37060000000
  // - "37060000000" (11 digits) -> +37060000000
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
  // Use LOCAL date parts so date and hour stay consistent across timezones
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const datePart = `${year}-${month}-${day}`;
  const hour = d.getHours();
  const start = String(hour).padStart(2, '0') + ':00';
  const end = String(hour + 1).padStart(2, '0') + ':00';
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

// ------------------ POST handler (guest checkout + create user + address) ------------------
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
      pickupDate,
      pickupTime,
      deliveryDate,
      deliveryTime,
      email,
    } = body as {
      services: any[];
      street: string;
      apartment?: string | null;
      floor?: string | null;
      latitude: number | string;
      longitude: number | string;
      notes?: string | null;
      firstName: string;
      lastName: string;
      phone: string;
      paymentMethod?: string | null;
      pickupDate?: string | null;
      pickupTime?: string | null;
      deliveryDate?: string | null;
      deliveryTime?: string | null;
      email?: string | null;
    };

    // validateOnly: email-exists pre-flight for the Stripe redirect flow.
    // Handled as a fully separate early exit BEFORE any field validation — the
    // pre-flight body only contains { email, validateOnly: true } and has no
    // services, dates, or address fields, so all the normal validators would fire.
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

    const pickupRange = parseRange(pickupTime ?? null);
    const deliveryRange = parseRange(deliveryTime ?? null);

    if (!pickupDate || !pickupRange) {
      return NextResponse.json({ error: 'Invalid or missing pickup date/time range' }, { status: 400 });
    }
    if (!deliveryDate || !deliveryRange) {
      return NextResponse.json({ error: 'Invalid or missing delivery date/time range' }, { status: 400 });
    }

    const [pickupStartTime, pickupEndTime] = pickupRange;
    const [deliveryStartTime, deliveryEndTime] = deliveryRange;

    const pickupStartIso = buildIso(pickupDate, pickupStartTime);
    const pickupEndIso = buildIso(pickupDate, pickupEndTime);
    const deliveryStartIso = buildIso(deliveryDate, deliveryStartTime);
    const deliveryEndIso = buildIso(deliveryDate, deliveryEndTime);

    if (!pickupStartIso || !pickupEndIso || !deliveryStartIso || !deliveryEndIso) {
      return NextResponse.json({ error: 'Invalid times' }, { status: 400 });
    }

    if (new Date(pickupStartIso) >= new Date(pickupEndIso)) {
      return NextResponse.json({ error: 'Pickup start must be before pickup end' }, { status: 400 });
    }
    if (new Date(deliveryStartIso) >= new Date(deliveryEndIso)) {
      return NextResponse.json({ error: 'Delivery start must be before delivery end' }, { status: 400 });
    }
    if (new Date(pickupStartIso) >= new Date(deliveryStartIso)) {
      return NextResponse.json({ error: 'Pickup must be before delivery' }, { status: 400 });
    }

    // Determine user: either currentUser() or create/find by email
    // Wrapped in try/catch — some auth setups throw instead of returning null
    // for unauthenticated requests.
    let userId: string | undefined;
    try {
      const user = await currentUser();
      userId = user?.id;
    } catch {
      userId = undefined;
    }

    // Normalize phone and lat/lon
    const normalizedPhone = formatLithuanianPhone(phone ?? null);
    const latVal = parseLatLong(latitude);
    const lonVal = parseLatLong(longitude);

    if (!userId) {
      if (!email) {
        return NextResponse.json({ error: 'Email required for guest checkout' }, { status: 400 });
      }

      const existing = await db.user.findUnique({ where: { email } });

      if (existing) {
        // Email already belongs to a registered account — guest must sign in
        return NextResponse.json(
          { error: 'el. pastas egzistuoja, prisijunkite' },
          { status: 409 }
        );
      }

      // --- Create the bare user row first (no nested relations) ---
      // Keeping contact/address creation separate means a phoneNumber uniqueness
      // conflict (Contact.phoneNumber is @unique) won't roll back the whole order.
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

      // --- Create contact separately; swallow uniqueness conflicts ---
      // Contact.phoneNumber is @unique so the same phone used by a previous
      // account would otherwise blow up the entire request.
      try {
        // Build a phone value that is guaranteed unique for this new user
        // even when the supplied number is already taken or empty.
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
          // Unique constraint on phoneNumber — try again with a guaranteed-unique value
          try {
            await db.contact.create({
              data: {
                userId,
                firstName: firstName || '',
                lastName: lastName || '',
                phoneNumber: '', // blank phone for uniqueness; contact can update it later
              },
            });
          } catch (e2) {
            console.warn('Contact create failed (fallback):', e2);
          }
        } else {
          console.warn('Contact create failed:', e);
        }
      }

      // --- Create address separately; errors are non-fatal ---
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

    // Guard: userId must be set before creating the order
    if (!userId) {
      return NextResponse.json({ error: 'Could not resolve user for order' }, { status: 500 });
    }

    // Build nested orderServices payload
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

    // Map paymentMethod string to PaymentMethod enum
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
        pickupDateTime: new Date(pickupStartIso),
        deliveryDateTime: new Date(deliveryStartIso),
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

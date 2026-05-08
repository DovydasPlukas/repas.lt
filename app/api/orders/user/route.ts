import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

function synthesizeDateAndRangeFromIso(iso?: string | Date | null) {
  if (!iso) return { date: null, range: null };
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  if (isNaN(d.getTime())) return { date: null, range: null };
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const datePart = `${year}-${month}-${day}`;
  const hour = d.getHours();
  const start = String(hour).padStart(2, '0') + ':00';
  const end = String(hour + 1).padStart(2, '0') + ':00';
  return { date: datePart, range: `${start}-${end}` };
}

// GET /api/orders/user
// Returns the full order list for the currently authenticated user.
// Requires authentication — unauthenticated requests get a 401.
export async function GET() {
  try {
    const user = await currentUser();

    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await db.order.findMany({
      where: { userId: user.id },
      include: {
        orderServices: {
          include: {
            service: true,
            orderAddons: { include: { serviceAddon: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const mapped = orders.map((o) => {
      const plain = JSON.parse(JSON.stringify(o));
      const { date: pickupDate, range: pickupTime } = synthesizeDateAndRangeFromIso(o.pickupDateTime ?? null);
      const { date: deliveryDate, range: deliveryTime } = synthesizeDateAndRangeFromIso(o.deliveryDateTime ?? null);
      plain.pickupDate = pickupDate;
      plain.pickupTime = pickupTime;
      plain.deliveryDate = deliveryDate;
      plain.deliveryTime = deliveryTime;
      return plain;
    });

    return NextResponse.json(mapped);
  } catch (err) {
    console.error('Error in GET /api/orders/user:', err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
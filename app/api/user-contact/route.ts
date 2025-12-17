/* eslint-disable */

import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const contact = await db.contact.findUnique({
      where: { userId: user.id },
    });

    if (!contact) {
      return NextResponse.json({
        data: null,
      });
    }

    return NextResponse.json({
      data: {
        firstName: contact.firstName,
        lastName: contact.lastName,
        phoneNumber: contact.phoneNumber,
      },
    });
  } catch (error) {
    console.error('Error fetching user contact:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact information' },
      { status: 500 }
    );
  }
}

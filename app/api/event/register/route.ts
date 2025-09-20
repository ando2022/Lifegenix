import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { eventParticipants } from '@/lib/db/schema/events';
import { users } from '@/lib/db/schema/users';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventSlug, email, fullName, phoneNumber, userId } = body;

    // If userId is provided, ensure user exists in users table first
    if (userId) {
      // Check if user exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      // If user doesn't exist, create them
      if (existingUser.length === 0) {
        try {
          await db.insert(users).values({
            id: userId,
            email,
            fullName: fullName || email,
          });
        } catch (insertError: any) {
          // If it's a duplicate key error, user was created concurrently, that's ok
          if (insertError?.cause?.code !== '23505') {
            throw insertError;
          }
        }
      }
    }

    // Insert participant into database
    const [participant] = await db
      .insert(eventParticipants)
      .values({
        eventSlug,
        email,
        fullName,
        phoneNumber,
        userId: userId || null, // Allow null for non-authenticated signups
      })
      .returning();

    return NextResponse.json({ id: participant.id });
  } catch (error) {
    console.error('Event registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register for event' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { eventParticipants } from '@/lib/db/schema/events';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const eventSlug = searchParams.get('eventSlug');

    if (!email || !eventSlug) {
      return NextResponse.json(
        { error: 'Email and eventSlug are required' },
        { status: 400 }
      );
    }

    // Check if participant exists
    const participant = await db
      .select()
      .from(eventParticipants)
      .where(
        and(
          eq(eventParticipants.email, email),
          eq(eventParticipants.eventSlug, eventSlug)
        )
      )
      .limit(1);

    if (participant.length > 0) {
      return NextResponse.json({
        exists: true,
        completed: !!participant[0].completedAt,
        id: participant[0].id,
      });
    }

    return NextResponse.json({
      exists: false,
      completed: false,
      id: null,
    });
  } catch (error) {
    console.error('Error checking participant:', error);
    return NextResponse.json(
      { error: 'Failed to check participant' },
      { status: 500 }
    );
  }
}
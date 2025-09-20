import { NextResponse } from 'next/server';
import { db, eventParticipants } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { participantId, questionnaire } = body;

    if (!participantId) {
      return NextResponse.json(
        { error: 'Participant ID is required' },
        { status: 400 }
      );
    }

    // Update participant with questionnaire responses and mark as completed
    const [updated] = await db
      .update(eventParticipants)
      .set({
        questionnaire,
        completedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(eventParticipants.id, participantId))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, participant: updated });
  } catch (error) {
    console.error('Questionnaire submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit questionnaire' },
      { status: 500 }
    );
  }
}
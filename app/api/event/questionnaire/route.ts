import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Questionnaire API received:', { body });
    const { participantId, questionnaire } = body;

    if (!participantId) {
      console.error('Missing participantId:', { participantId, questionnaire });
      return NextResponse.json(
        { error: 'Participant ID is required' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();

    // Update participant with questionnaire responses and mark as completed
    const { data: updated, error } = await supabase
      .from('event_participants')
      .update({
        questionnaire,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', participantId)
      .select()
      .single();

    if (error) {
      console.error('Questionnaire submission error:', error);

      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Participant not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to submit questionnaire' },
        { status: 500 }
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
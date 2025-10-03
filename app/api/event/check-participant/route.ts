import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

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

    const supabase = createSupabaseServerClient();

    // Check if participant exists for this specific event
    const { data: participant, error } = await supabase
      .from('event_participants')
      .select('id, completed_at, questionnaire')
      .eq('email', email)
      .eq('event_slug', eventSlug)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking participant:', error);
      return NextResponse.json(
        { error: 'Failed to check participant' },
        { status: 500 }
      );
    }

    if (participant) {
      return NextResponse.json({
        exists: true,
        completed: !!participant.completed_at,
        hasQuestionnaire: !!participant.questionnaire,
        id: participant.id,
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
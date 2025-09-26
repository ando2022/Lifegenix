import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventSlug, email, fullName, phoneNumber, userId } = body;

    const supabase = createSupabaseServerClient();

    // If userId is provided, ensure user exists in users table first
    if (userId) {
      // Check if user exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();

      // If user doesn't exist, create them
      if (!existingUser) {
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: userId,
            email,
            full_name: fullName || email,
          });

        if (userError && userError.code !== '23505') { // 23505 = duplicate key
          console.error('Error creating user:', userError);
        }
      }
    }

    // Check if participant already exists
    const { data: existing } = await supabase
      .from('event_participants')
      .select('id')
      .eq('email', email)
      .eq('event_slug', eventSlug)
      .single();

    if (existing) {
      return NextResponse.json({ id: existing.id });
    }

    // Insert participant into database
    const { data: participant, error } = await supabase
      .from('event_participants')
      .insert({
        event_slug: eventSlug,
        email,
        full_name: fullName,
        phone_number: phoneNumber,
        user_id: userId || null, // Allow null for non-authenticated signups
      })
      .select('id')
      .single();

    if (error) {
      console.error('Event registration error:', error);
      return NextResponse.json(
        { error: 'Failed to register for event' },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: participant.id });
  } catch (error) {
    console.error('Event registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register for event' },
      { status: 500 }
    );
  }
}
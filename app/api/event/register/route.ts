import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Registration API received:', { body });
    const { eventSlug, email, fullName, phoneNumber, userId } = body;

    const supabase = createSupabaseServerClient();

    // If userId is provided, ensure user exists in users table first
    let validUserId = null;
    if (userId) {
      // Check if user exists
      const { data: existingUser, error: userCheckError } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();

      console.log('User check result:', { existingUser, userCheckError });

      if (existingUser) {
        validUserId = userId;
        console.log('User exists:', existingUser);
      } else {
        // Try to create the user
        console.log('Creating user:', { id: userId, email, full_name: fullName || email });
        const { data: newUser, error: userError } = await supabase
          .from('users')
          .insert({
            id: userId,
            email,
            full_name: fullName || email,
          })
          .select('id')
          .single();

        if (userError) {
          console.error('Error creating user:', userError);
          console.error('User error details:', { 
            code: userError.code, 
            message: userError.message, 
            details: userError.details,
            hint: userError.hint 
          });
          
          if (userError.code !== '23505') { // 23505 = duplicate key
            // Try one more time to check if user exists (race condition)
            console.log('User creation failed, checking if user exists now...');
            const { data: retryUserCheck } = await supabase
              .from('users')
              .select('id')
              .eq('id', userId)
              .single();
            
            if (retryUserCheck) {
              console.log('User exists after retry, using existing user');
              validUserId = userId;
            } else {
              console.log('User creation failed, proceeding without user_id');
              validUserId = null;
            }
          } else {
            // Duplicate key error means user was created by another process
            console.log('User already exists (duplicate key), using existing user');
            validUserId = userId;
          }
        } else {
          validUserId = userId;
          console.log('User created successfully:', newUser);
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

    // Final verification: if we have a user_id, make sure it exists
    if (validUserId) {
      const { data: finalUserCheck } = await supabase
        .from('users')
        .select('id')
        .eq('id', validUserId)
        .single();
      
      if (!finalUserCheck) {
        console.log('Final user check failed, setting user_id to null');
        validUserId = null;
      }
    }

    // Insert participant into database
    const participantData = {
      event_slug: eventSlug,
      email,
      full_name: fullName,
      phone_number: phoneNumber,
      user_id: validUserId, // Use validated user ID or null
    };

    console.log('Inserting participant:', participantData);

    const { data: participant, error } = await supabase
      .from('event_participants')
      .insert(participantData)
      .select('id')
      .single();

    if (error) {
      console.error('Event registration error:', error);
      console.error('Error details:', { 
        code: error.code, 
        message: error.message, 
        details: error.details,
        hint: error.hint 
      });
      return NextResponse.json(
        { error: 'Failed to register for event', details: error.message },
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
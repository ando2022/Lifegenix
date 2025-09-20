import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next');
  const redirect = searchParams.get('redirect');
  const event = searchParams.get('event');
  
  // Determine the redirect URL
  let redirectUrl = next || redirect || '/dashboard';
  
  // If this is an event signup, append the event parameter
  if (event === 'true' && redirectUrl.includes('/event/')) {
    redirectUrl = `${redirectUrl}?event=true`;
  }

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${redirectUrl}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}


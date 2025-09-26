import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next');
  const redirect = searchParams.get('redirect');
  const event = searchParams.get('event');

  console.log('Auth callback params:', { code: !!code, next, redirect, event, origin });

  // Determine the redirect URL
  let redirectUrl = next || redirect || '/dashboard';

  // If this is an event signup, append the event parameter
  if (event === 'true' && redirectUrl.includes('/event/')) {
    redirectUrl = `${redirectUrl}?event=true`;
  }

  console.log('Redirect URL will be:', `${origin}${redirectUrl}`);

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      console.log('Auth successful, redirecting to:', `${origin}${redirectUrl}`);
      return NextResponse.redirect(`${origin}${redirectUrl}`);
    } else {
      console.error('Auth exchange error:', error);
    }
  }

  // Return the user to an error page with instructions
  console.log('No code or error, redirecting to auth error page');
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}


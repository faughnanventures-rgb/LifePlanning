import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// ===========================================
// Auth Callback Route
// ===========================================
// Handles OAuth redirects and email confirmation links

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Handle OAuth errors
  if (error) {
    console.error('Auth callback error:', error, errorDescription);
    const errorUrl = new URL('/login', origin);
    errorUrl.searchParams.set('error', errorDescription ?? error);
    return NextResponse.redirect(errorUrl);
  }

  // Exchange code for session
  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Code exchange error:', exchangeError);
      const errorUrl = new URL('/login', origin);
      errorUrl.searchParams.set('error', 'Authentication failed. Please try again.');
      return NextResponse.redirect(errorUrl);
    }

    // Successful authentication - redirect to intended destination
    const redirectUrl = new URL(next, origin);
    return NextResponse.redirect(redirectUrl);
  }

  // No code provided - redirect to login
  return NextResponse.redirect(new URL('/login', origin));
}

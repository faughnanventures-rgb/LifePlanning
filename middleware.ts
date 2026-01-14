import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// ===========================================
// Middleware
// ===========================================
// Runs before every request to protected routes
// Handles session refresh and authentication

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/plan', '/settings'];

// Routes that should redirect to dashboard if already logged in
const AUTH_ROUTES = ['/login', '/signup'];

// Public routes (no auth required)
const PUBLIC_ROUTES = ['/', '/callback'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Update session and get user
  const { response, user } = await updateSession(request);
  
  // Check if trying to access protected route
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  
  // Check if trying to access auth route
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  
  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Redirect to dashboard if accessing auth route while logged in
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return response;
}

// Configure which routes middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

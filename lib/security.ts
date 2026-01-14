import { NextResponse } from 'next/server';

// ===========================================
// Security Utilities
// ===========================================

/**
 * Create a standardized unauthorized response
 */
export function unauthorizedResponse(message: string = 'Unauthorized'): NextResponse {
  return NextResponse.json(
    { error: message },
    { status: 401 }
  );
}

/**
 * Create a standardized forbidden response
 */
export function forbiddenResponse(message: string = 'Forbidden'): NextResponse {
  return NextResponse.json(
    { error: message },
    { status: 403 }
  );
}

/**
 * Create a standardized rate limit response
 */
export function rateLimitResponse(resetTime: number): NextResponse {
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    {
      status: 429,
      headers: {
        'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
        'X-RateLimit-Reset': new Date(resetTime).toISOString(),
      },
    }
  );
}

/**
 * Create a standardized bad request response
 */
export function badRequestResponse(message: string = 'Bad request'): NextResponse {
  return NextResponse.json(
    { error: message },
    { status: 400 }
  );
}

/**
 * Create a standardized internal error response
 * Note: Never expose internal error details to client
 */
export function internalErrorResponse(): NextResponse {
  return NextResponse.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  );
}

/**
 * Sanitize user input to prevent XSS
 * Basic implementation - for HTML content, use a proper sanitizer like DOMPurify
 */
export function sanitizeInput(input: string): string {
  if (!input) {
    return '';
  }
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate that a string is a valid UUID
 */
export function isValidUuid(value: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * Check if request is from an authenticated user
 * Returns user ID if authenticated, null otherwise
 */
export async function getAuthenticatedUserId(
  request: Request
): Promise<string | null> {
  // This would integrate with your auth system
  // For Supabase, you'd verify the JWT token from cookies
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  
  // Token verification would happen here
  // For now, return null as this needs Supabase integration
  return null;
}

/**
 * Log security events
 * In production, this would send to a security monitoring service
 */
export function logSecurityEvent(
  event: string,
  details: Record<string, unknown>
): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    ...details,
  };
  
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.warn('[SECURITY]', JSON.stringify(logEntry));
  }
  
  // In production, you'd send this to a logging service
  // Example: await sendToSecurityLogger(logEntry);
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware for security and observability
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Generate request ID for tracing
  const requestId = crypto.randomUUID().slice(0, 8)
  response.headers.set('x-request-id', requestId)
  
  // Only apply CSRF checks to API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    // Skip health check
    if (request.nextUrl.pathname === '/api/health') {
      return response
    }
    
    // CSRF Protection: Check Origin/Referer for state-changing requests
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
      const origin = request.headers.get('origin')
      const referer = request.headers.get('referer')
      const host = request.headers.get('host')
      
      // In production, verify origin matches our domain
      if (origin) {
        const originHost = new URL(origin).host
        if (host && originHost !== host) {
          console.warn(`CSRF blocked: origin ${originHost} != host ${host}`, { requestId })
          return NextResponse.json(
            { error: 'Invalid request origin' },
            { status: 403 }
          )
        }
      } else if (referer) {
        // Fallback to referer check
        const refererHost = new URL(referer).host
        if (host && refererHost !== host) {
          console.warn(`CSRF blocked: referer ${refererHost} != host ${host}`, { requestId })
          return NextResponse.json(
            { error: 'Invalid request origin' },
            { status: 403 }
          )
        }
      }
      // Note: Requests without origin/referer (e.g., from Postman) are allowed
      // For stricter security, you could block these too
    }
    
    // Log API requests (basic audit trail)
    console.log(JSON.stringify({
      type: 'api_request',
      requestId,
      method: request.method,
      path: request.nextUrl.pathname,
      timestamp: new Date().toISOString(),
      // Don't log IP in production without proper consent
    }))
  }
  
  return response
}

export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
  ],
}

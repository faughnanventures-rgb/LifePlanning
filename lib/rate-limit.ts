import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { env } from './env'
import { createHash } from 'crypto'

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetIn: number
}

interface RateLimiter {
  check: (identifier: string) => Promise<RateLimitResult>
}

// In-memory rate limiter with LRU-style cleanup
class InMemoryRateLimiter implements RateLimiter {
  private requests: Map<string, { count: number; resetAt: number }> = new Map()
  private maxRequests: number
  private windowMs: number
  private maxEntries = 10000 // Prevent memory bloat

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  async check(identifier: string): Promise<RateLimitResult> {
    const now = Date.now()
    
    // Cleanup old entries periodically
    if (this.requests.size > this.maxEntries) {
      for (const [key, value] of this.requests) {
        if (now > value.resetAt) this.requests.delete(key)
        if (this.requests.size <= this.maxEntries * 0.8) break
      }
    }

    const record = this.requests.get(identifier)

    if (!record || now > record.resetAt) {
      this.requests.set(identifier, { count: 1, resetAt: now + this.windowMs })
      return { allowed: true, remaining: this.maxRequests - 1, resetIn: this.windowMs / 1000 }
    }

    if (record.count >= this.maxRequests) {
      return { allowed: false, remaining: 0, resetIn: Math.ceil((record.resetAt - now) / 1000) }
    }

    record.count++
    return { allowed: true, remaining: this.maxRequests - record.count, resetIn: Math.ceil((record.resetAt - now) / 1000) }
  }
}

class UpstashRateLimiter implements RateLimiter {
  private ratelimit: Ratelimit

  constructor(maxRequests: number, windowSeconds: number) {
    const redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    })
    this.ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(maxRequests, `${windowSeconds} s`),
    })
  }

  async check(identifier: string): Promise<RateLimitResult> {
    try {
      const result = await this.ratelimit.limit(identifier)
      return {
        allowed: result.success,
        remaining: result.remaining,
        resetIn: Math.ceil((result.reset - Date.now()) / 1000),
      }
    } catch (error) {
      // FAIL CLOSED: If Redis is down, deny requests (security over availability)
      console.error('Rate limit check failed, denying request:', error)
      return { allowed: false, remaining: 0, resetIn: 60 }
    }
  }
}

function createRateLimiter(maxRequests: number, windowSeconds: number): RateLimiter {
  if (env.isUpstashConfigured) {
    return new UpstashRateLimiter(maxRequests, windowSeconds)
  }
  // Warning: In-memory rate limiting doesn't work well on serverless
  console.warn('Using in-memory rate limiting. Configure Upstash for production.')
  return new InMemoryRateLimiter(maxRequests, windowSeconds * 1000)
}

export const chatRateLimiter = createRateLimiter(15, 60)
export const reportRateLimiter = createRateLimiter(5, 60)

/**
 * Get a secure client identifier for rate limiting.
 * Uses multiple signals to create a fingerprint that's harder to spoof.
 */
export function getClientIdentifier(request: NextRequest): string {
  // Priority 1: Vercel's verified IP (can't be spoofed)
  // @ts-expect-error - ip exists on Vercel's extended NextRequest
  const vercelIp = request.ip
  
  // Priority 2: x-real-ip (set by reverse proxy, more trustworthy than x-forwarded-for)
  const realIp = request.headers.get('x-real-ip')
  
  // Priority 3: First IP in x-forwarded-for (can be spoofed, but better than nothing)
  const forwardedFor = request.headers.get('x-forwarded-for')
  const forwardedIp = forwardedFor ? forwardedFor.split(',')[0].trim() : null
  
  const ip = vercelIp || realIp || forwardedIp || 'unknown'
  
  // Add User-Agent to fingerprint (makes spoofing slightly harder)
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  // Hash the combination for privacy and consistent length
  const fingerprint = createHash('sha256')
    .update(`${ip}:${userAgent}`)
    .digest('hex')
    .substring(0, 16)
  
  return fingerprint
}

export function rateLimitResponse(resetIn: number): NextResponse {
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.', retryAfter: resetIn },
    { status: 429, headers: { 'Retry-After': String(resetIn) } }
  )
}

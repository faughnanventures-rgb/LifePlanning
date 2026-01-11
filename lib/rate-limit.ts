import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { env } from './env'

// ============================================
// Types
// ============================================

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetIn: number
}

interface RateLimiter {
  check: (identifier: string) => Promise<RateLimitResult>
}

// ============================================
// In-Memory Fallback (for development)
// ============================================

class InMemoryRateLimiter implements RateLimiter {
  private requests: Map<string, { count: number; resetAt: number }> = new Map()
  private maxRequests: number
  private windowMs: number

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  async check(identifier: string): Promise<RateLimitResult> {
    const now = Date.now()
    const record = this.requests.get(identifier)

    if (!record || now > record.resetAt) {
      this.requests.set(identifier, { count: 1, resetAt: now + this.windowMs })
      return { allowed: true, remaining: this.maxRequests - 1, resetIn: this.windowMs / 1000 }
    }

    if (record.count >= this.maxRequests) {
      const resetIn = Math.ceil((record.resetAt - now) / 1000)
      return { allowed: false, remaining: 0, resetIn }
    }

    record.count++
    return { 
      allowed: true, 
      remaining: this.maxRequests - record.count, 
      resetIn: Math.ceil((record.resetAt - now) / 1000) 
    }
  }
}

// ============================================
// Upstash Rate Limiter (for production)
// ============================================

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
      analytics: true,
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
      console.error('Upstash rate limit error:', error)
      // On error, allow the request (fail open)
      return { allowed: true, remaining: 1, resetIn: 60 }
    }
  }
}

// ============================================
// Rate Limiter Factory
// ============================================

function createRateLimiter(maxRequests: number, windowSeconds: number): RateLimiter {
  if (env.isUpstashConfigured) {
    return new UpstashRateLimiter(maxRequests, windowSeconds)
  }
  return new InMemoryRateLimiter(maxRequests, windowSeconds * 1000)
}

// ============================================
// Configured Rate Limiters
// ============================================

// Chat: 10 requests per minute
export const chatRateLimiter = createRateLimiter(10, 60)

// Email: 3 requests per minute
export const emailRateLimiter = createRateLimiter(3, 60)

// Report: 5 requests per minute
export const reportRateLimiter = createRateLimiter(5, 60)

// ============================================
// Helper Functions
// ============================================

export function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'anonymous'
  return ip
}

export function rateLimitResponse(resetIn: number): NextResponse {
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.', retryAfter: resetIn },
    { 
      status: 429,
      headers: { 'Retry-After': String(resetIn) }
    }
  )
}

export function isDistributedRateLimitEnabled(): boolean {
  return env.isUpstashConfigured
}

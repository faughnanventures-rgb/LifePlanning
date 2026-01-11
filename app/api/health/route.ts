import { NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { isDistributedRateLimitEnabled } from '@/lib/rate-limit'

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    version: '0.4.0',
    timestamp: new Date().toISOString(),
    services: {
      anthropic: env.isAnthropicConfigured ? 'configured' : 'missing',
      email: env.isEmailConfigured ? 'configured' : 'disabled',
      rateLimit: isDistributedRateLimitEnabled() ? 'upstash' : 'in-memory',
    }
  })
}

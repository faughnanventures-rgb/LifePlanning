import { NextResponse } from 'next/server'
import { env } from '@/lib/env'

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    version: '0.8.1',
    timestamp: new Date().toISOString(),
    services: {
      anthropic: env.isAnthropicConfigured ? 'configured' : 'missing',
      email: env.isEmailConfigured ? 'configured' : 'disabled',
      rateLimit: env.isUpstashConfigured ? 'upstash' : 'in-memory',
    },
    security: {
      csrf: 'enabled',
      inputValidation: 'enabled',
      tokenBudget: 'enabled',
      rateLimitMode: env.isUpstashConfigured ? 'distributed' : 'local',
    },
    features: {
      authentication: 'enabled',
      usageLimits: 'enabled',
      celebrations: 'enabled',
      goalsTracking: 'enabled',
    }
  })
}

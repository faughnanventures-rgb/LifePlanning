// Environment configuration with validation
// This module centralizes all environment variable access

export const env = {
  // Anthropic API
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
  
  // Resend Email
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  
  // Upstash Redis (for distributed rate limiting)
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL || '',
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN || '',
  
  // App URL for email links
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || '',
  
  // Helper flags
  get isAnthropicConfigured() {
    return !!this.ANTHROPIC_API_KEY
  },
  
  get isEmailConfigured() {
    return !!this.RESEND_API_KEY
  },
  
  get isUpstashConfigured() {
    return !!this.UPSTASH_REDIS_REST_URL && !!this.UPSTASH_REDIS_REST_TOKEN
  },
}

// Validate required env vars at startup (only in production)
export function validateEnv() {
  const missing: string[] = []
  
  if (!env.ANTHROPIC_API_KEY) {
    missing.push('ANTHROPIC_API_KEY')
  }
  
  if (missing.length > 0 && process.env.NODE_ENV === 'production') {
    console.warn(`Missing environment variables: ${missing.join(', ')}`)
  }
  
  return missing.length === 0
}

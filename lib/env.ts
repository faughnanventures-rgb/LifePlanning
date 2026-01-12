export const env = {
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL || '',
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN || '',
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || '',
  
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

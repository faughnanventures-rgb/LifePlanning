import { Redis } from '@upstash/redis'
import { hash } from 'bcryptjs'
import { env } from './env'

export interface User {
  id: string
  email: string
  name: string | null
  password: string | null
  createdAt: string
  updatedAt: string
}

export interface UserUsage {
  chatRequests: number
  reportRequests: number
  totalTokens: number
  lastRequestAt: string
  dailyRequests: number
  dailyResetAt: string
}

// In-memory fallback for development
const inMemoryUsers = new Map<string, User>()
const inMemoryUsage = new Map<string, UserUsage>()

function getRedis(): Redis | null {
  if (!env.isUpstashConfigured) {
    return null
  }
  return new Redis({
    url: env.UPSTASH_REDIS_REST_URL!,
    token: env.UPSTASH_REDIS_REST_TOKEN!,
  })
}

// User CRUD operations

export async function getUserByEmail(email: string): Promise<User | null> {
  const redis = getRedis()
  const normalizedEmail = email.toLowerCase().trim()
  
  if (redis) {
    try {
      const userId = await redis.get<string>(`email:${normalizedEmail}`)
      if (!userId) return null
      return await redis.get<User>(`user:${userId}`)
    } catch (error) {
      console.error('Redis error getting user:', error)
      return null
    }
  }
  
  // In-memory fallback
  for (const user of inMemoryUsers.values()) {
    if (user.email.toLowerCase() === normalizedEmail) {
      return user
    }
  }
  return null
}

export async function getUserById(id: string): Promise<User | null> {
  const redis = getRedis()
  
  if (redis) {
    try {
      return await redis.get<User>(`user:${id}`)
    } catch (error) {
      console.error('Redis error getting user:', error)
      return null
    }
  }
  
  return inMemoryUsers.get(id) || null
}

export async function createUser(
  email: string,
  password: string,
  name?: string
): Promise<User | null> {
  const redis = getRedis()
  const normalizedEmail = email.toLowerCase().trim()
  
  // Check if user exists
  const existing = await getUserByEmail(normalizedEmail)
  if (existing) {
    return null
  }
  
  const hashedPassword = await hash(password, 12)
  const id = generateUserId()
  const now = new Date().toISOString()
  
  const user: User = {
    id,
    email: normalizedEmail,
    name: name || null,
    password: hashedPassword,
    createdAt: now,
    updatedAt: now,
  }
  
  if (redis) {
    try {
      await redis.set(`user:${id}`, user)
      await redis.set(`email:${normalizedEmail}`, id)
      
      // Initialize usage
      await redis.set(`usage:${id}`, {
        chatRequests: 0,
        reportRequests: 0,
        totalTokens: 0,
        lastRequestAt: now,
        dailyRequests: 0,
        dailyResetAt: now,
      })
      
      return user
    } catch (error) {
      console.error('Redis error creating user:', error)
      return null
    }
  }
  
  // In-memory fallback
  inMemoryUsers.set(id, user)
  inMemoryUsage.set(id, {
    chatRequests: 0,
    reportRequests: 0,
    totalTokens: 0,
    lastRequestAt: now,
    dailyRequests: 0,
    dailyResetAt: now,
  })
  
  return user
}

export async function updateUser(
  id: string,
  updates: Partial<Pick<User, 'name' | 'password'>>
): Promise<User | null> {
  const user = await getUserById(id)
  if (!user) return null
  
  const redis = getRedis()
  const updatedUser: User = {
    ...user,
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  
  if (redis) {
    try {
      await redis.set(`user:${id}`, updatedUser)
      return updatedUser
    } catch (error) {
      console.error('Redis error updating user:', error)
      return null
    }
  }
  
  inMemoryUsers.set(id, updatedUser)
  return updatedUser
}

// Usage tracking

export async function getUserUsage(userId: string): Promise<UserUsage | null> {
  const redis = getRedis()
  
  if (redis) {
    try {
      return await redis.get<UserUsage>(`usage:${userId}`)
    } catch (error) {
      console.error('Redis error getting usage:', error)
      return null
    }
  }
  
  return inMemoryUsage.get(userId) || null
}

export async function incrementUsage(
  userId: string,
  type: 'chat' | 'report',
  tokens: number = 0
): Promise<UserUsage | null> {
  const redis = getRedis()
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  
  let usage = await getUserUsage(userId)
  
  if (!usage) {
    usage = {
      chatRequests: 0,
      reportRequests: 0,
      totalTokens: 0,
      lastRequestAt: now.toISOString(),
      dailyRequests: 0,
      dailyResetAt: today,
    }
  }
  
  // Reset daily counter if new day
  if (usage.dailyResetAt !== today) {
    usage.dailyRequests = 0
    usage.dailyResetAt = today
  }
  
  // Increment counters
  if (type === 'chat') {
    usage.chatRequests++
  } else {
    usage.reportRequests++
  }
  usage.totalTokens += tokens
  usage.dailyRequests++
  usage.lastRequestAt = now.toISOString()
  
  if (redis) {
    try {
      await redis.set(`usage:${userId}`, usage)
      return usage
    } catch (error) {
      console.error('Redis error updating usage:', error)
      return null
    }
  }
  
  inMemoryUsage.set(userId, usage)
  return usage
}

// Usage limits

export const USAGE_LIMITS = {
  FREE: {
    dailyRequests: 50,
    monthlyReports: 5,
    maxTokensPerRequest: 15000,
  },
  // Future: PREMIUM tier
} as const

export async function checkUsageLimits(userId: string): Promise<{
  allowed: boolean
  reason?: string
  usage?: UserUsage
}> {
  const usage = await getUserUsage(userId)
  
  if (!usage) {
    return { allowed: true }
  }
  
  if (usage.dailyRequests >= USAGE_LIMITS.FREE.dailyRequests) {
    return {
      allowed: false,
      reason: `Daily limit reached (${USAGE_LIMITS.FREE.dailyRequests} requests). Resets at midnight UTC.`,
      usage,
    }
  }
  
  return { allowed: true, usage }
}

// Data export (GDPR)

export async function exportUserData(userId: string): Promise<{
  user: Omit<User, 'password'> | null
  usage: UserUsage | null
}> {
  const user = await getUserById(userId)
  const usage = await getUserUsage(userId)
  
  if (!user) {
    return { user: null, usage: null }
  }
  
  // Remove password from export
  const { password: _, ...safeUser } = user
  
  return {
    user: safeUser,
    usage,
  }
}

export async function deleteUser(userId: string): Promise<boolean> {
  const user = await getUserById(userId)
  if (!user) return false
  
  const redis = getRedis()
  
  if (redis) {
    try {
      await redis.del(`user:${userId}`)
      await redis.del(`email:${user.email}`)
      await redis.del(`usage:${userId}`)
      return true
    } catch (error) {
      console.error('Redis error deleting user:', error)
      return false
    }
  }
  
  inMemoryUsers.delete(userId)
  inMemoryUsage.delete(userId)
  return true
}

// Helpers

function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

function generateResetToken(): string {
  return `reset_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

// Password Reset

interface ResetToken {
  token: string
  userId: string
  email: string
  expiresAt: string
  used: boolean
}

const inMemoryResetTokens = new Map<string, ResetToken>()

export async function createPasswordResetToken(email: string): Promise<ResetToken | null> {
  const user = await getUserByEmail(email)
  if (!user) return null
  
  const token = generateResetToken()
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour
  
  const resetToken: ResetToken = {
    token,
    userId: user.id,
    email: user.email,
    expiresAt,
    used: false,
  }
  
  const redis = getRedis()
  
  if (redis) {
    try {
      // Store token with 1 hour TTL
      await redis.set(`reset:${token}`, resetToken, { ex: 3600 })
      return resetToken
    } catch (error) {
      console.error('Redis error creating reset token:', error)
      return null
    }
  }
  
  inMemoryResetTokens.set(token, resetToken)
  return resetToken
}

export async function validateResetToken(token: string): Promise<ResetToken | null> {
  const redis = getRedis()
  
  let resetToken: ResetToken | null = null
  
  if (redis) {
    try {
      resetToken = await redis.get<ResetToken>(`reset:${token}`)
    } catch (error) {
      console.error('Redis error validating reset token:', error)
      return null
    }
  } else {
    resetToken = inMemoryResetTokens.get(token) || null
  }
  
  if (!resetToken) return null
  if (resetToken.used) return null
  if (new Date(resetToken.expiresAt) < new Date()) return null
  
  return resetToken
}

export async function useResetToken(token: string, newPassword: string): Promise<boolean> {
  const resetToken = await validateResetToken(token)
  if (!resetToken) return false
  
  const hashedPassword = await hash(newPassword, 12)
  const updated = await updateUser(resetToken.userId, { password: hashedPassword })
  
  if (!updated) return false
  
  // Mark token as used
  const redis = getRedis()
  resetToken.used = true
  
  if (redis) {
    try {
      await redis.set(`reset:${token}`, resetToken, { ex: 60 }) // Keep briefly for debugging
    } catch (error) {
      console.error('Redis error marking token used:', error)
    }
  } else {
    inMemoryResetTokens.set(token, resetToken)
  }
  
  return true
}

// Get all users for admin (be careful with this)
export async function getAllUsersCount(): Promise<number> {
  const redis = getRedis()
  
  if (redis) {
    try {
      const keys = await redis.keys('user:*')
      return keys.length
    } catch {
      return 0
    }
  }
  
  return inMemoryUsers.size
}

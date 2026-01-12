/**
 * Schema Validation Tests
 * 
 * Run with: npx tsx __tests__/schemas.test.ts
 * Or: npm test (after adding vitest)
 */

import { describe, it, expect } from 'vitest'
import { ChatRequestSchema, MessageSchema, ReportRequestSchema, LIMITS } from '../lib/schemas'

describe('MessageSchema', () => {
  it('accepts valid message', () => {
    const result = MessageSchema.safeParse({
      id: 'msg-123',
      role: 'user',
      content: 'Hello world'
    })
    expect(result.success).toBe(true)
  })

  it('rejects message with content over limit', () => {
    const result = MessageSchema.safeParse({
      id: 'msg-123',
      role: 'user',
      content: 'x'.repeat(LIMITS.MAX_MESSAGE_CONTENT + 1)
    })
    expect(result.success).toBe(false)
  })

  it('rejects message with empty content', () => {
    const result = MessageSchema.safeParse({
      id: 'msg-123',
      role: 'user',
      content: ''
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid role', () => {
    const result = MessageSchema.safeParse({
      id: 'msg-123',
      role: 'system',
      content: 'Hello'
    })
    expect(result.success).toBe(false)
  })

  it('rejects id over 50 characters', () => {
    const result = MessageSchema.safeParse({
      id: 'x'.repeat(51),
      role: 'user',
      content: 'Hello'
    })
    expect(result.success).toBe(false)
  })
})

describe('ChatRequestSchema', () => {
  it('accepts valid request', () => {
    const result = ChatRequestSchema.safeParse({
      messages: [{ id: 'msg-1', role: 'user', content: 'Hello' }],
      phase: 'snapshot',
      mode: 'quick'
    })
    expect(result.success).toBe(true)
  })

  it('accepts request with resume text', () => {
    const result = ChatRequestSchema.safeParse({
      messages: [{ id: 'msg-1', role: 'user', content: 'Hello' }],
      phase: 'career',
      mode: 'full',
      resumeText: 'My resume content'
    })
    expect(result.success).toBe(true)
  })

  it('rejects resume text over limit', () => {
    const result = ChatRequestSchema.safeParse({
      messages: [{ id: 'msg-1', role: 'user', content: 'Hello' }],
      phase: 'career',
      mode: 'full',
      resumeText: 'x'.repeat(LIMITS.MAX_RESUME_LENGTH + 1)
    })
    expect(result.success).toBe(false)
  })

  it('rejects too many messages', () => {
    const messages = Array(LIMITS.MAX_MESSAGES + 1).fill(null).map((_, i) => ({
      id: `msg-${i}`,
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: 'Message'
    }))
    
    const result = ChatRequestSchema.safeParse({
      messages,
      phase: 'snapshot',
      mode: 'quick'
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty messages array', () => {
    const result = ChatRequestSchema.safeParse({
      messages: [],
      phase: 'snapshot',
      mode: 'quick'
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid mode', () => {
    const result = ChatRequestSchema.safeParse({
      messages: [{ id: 'msg-1', role: 'user', content: 'Hello' }],
      phase: 'snapshot',
      mode: 'invalid'
    })
    expect(result.success).toBe(false)
  })
})

describe('ReportRequestSchema', () => {
  it('accepts valid report request', () => {
    const result = ReportRequestSchema.safeParse({
      phases: {
        snapshot: {
          messages: [{ id: 'msg-1', role: 'user', content: 'Hello' }],
          completed: true
        }
      },
      mode: 'quick'
    })
    expect(result.success).toBe(true)
  })

  it('rejects too many phases', () => {
    const phases: Record<string, { messages: Array<{ id: string; role: string; content: string }>; completed: boolean }> = {}
    for (let i = 0; i < 11; i++) {
      phases[`phase-${i}`] = {
        messages: [{ id: 'msg-1', role: 'user', content: 'Hello' }],
        completed: true
      }
    }
    
    const result = ReportRequestSchema.safeParse({
      phases,
      mode: 'full'
    })
    expect(result.success).toBe(false)
  })
})

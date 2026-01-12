/**
 * Token Utilities Tests
 */

import { describe, it, expect } from 'vitest'
import { 
  estimateTokens, 
  estimateMessagesTokens, 
  checkTokenBudget,
  trimConversationHistory,
  SESSION_LIMITS
} from '../lib/tokens'

describe('estimateTokens', () => {
  it('estimates tokens for short text', () => {
    // ~4 chars per token
    expect(estimateTokens('Hello')).toBe(2) // 5 chars = ceil(5/4) = 2
  })

  it('estimates tokens for longer text', () => {
    const text = 'The quick brown fox jumps over the lazy dog' // 43 chars
    expect(estimateTokens(text)).toBe(11) // ceil(43/4) = 11
  })

  it('returns 0 for empty string', () => {
    expect(estimateTokens('')).toBe(0)
  })
})

describe('estimateMessagesTokens', () => {
  it('sums tokens across messages', () => {
    const messages = [
      { content: 'Hello' },      // 2 tokens
      { content: 'World' },      // 2 tokens
    ]
    expect(estimateMessagesTokens(messages)).toBe(4)
  })

  it('handles empty array', () => {
    expect(estimateMessagesTokens([])).toBe(0)
  })
})

describe('checkTokenBudget', () => {
  it('allows small requests', () => {
    const messages = [{ content: 'Hello' }]
    const systemPrompt = 'You are helpful.'
    
    const result = checkTokenBudget(messages, systemPrompt)
    expect(result.allowed).toBe(true)
    expect(result.tokens).toBeGreaterThan(0)
  })

  it('rejects requests over limit', () => {
    const largeContent = 'x'.repeat(SESSION_LIMITS.MAX_CONTEXT_TOKENS * 4 + 100)
    const messages = [{ content: largeContent }]
    const systemPrompt = 'You are helpful.'
    
    const result = checkTokenBudget(messages, systemPrompt)
    expect(result.allowed).toBe(false)
    expect(result.reason).toBeDefined()
  })
})

describe('trimConversationHistory', () => {
  it('returns all messages if under limit', () => {
    const messages = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there!' },
    ]
    
    const result = trimConversationHistory(messages, 1000)
    expect(result.length).toBe(2)
  })

  it('keeps at least 2 messages', () => {
    const messages = [
      { role: 'user', content: 'First message' },
      { role: 'assistant', content: 'First reply' },
      { role: 'user', content: 'Second message' },
      { role: 'assistant', content: 'Second reply' },
    ]
    
    // Very small limit
    const result = trimConversationHistory(messages, 10)
    expect(result.length).toBeGreaterThanOrEqual(2)
  })

  it('preserves most recent messages', () => {
    const messages = [
      { role: 'user', content: 'Old message' },
      { role: 'assistant', content: 'Old reply' },
      { role: 'user', content: 'Recent message' },
      { role: 'assistant', content: 'Recent reply' },
    ]
    
    const result = trimConversationHistory(messages, 20)
    
    // Should include the recent messages
    const contents = result.map(m => m.content)
    expect(contents).toContain('Recent reply')
  })
})

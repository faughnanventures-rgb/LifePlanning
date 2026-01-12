/**
 * Simple token estimation and budget tracking
 * 
 * Note: This is an approximation. For production, use tiktoken or Anthropic's token counter.
 * Rule of thumb: ~4 characters per token for English text
 */

const CHARS_PER_TOKEN = 4

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN)
}

export function estimateMessagesTokens(messages: Array<{ content: string }>): number {
  return messages.reduce((total, msg) => total + estimateTokens(msg.content), 0)
}

/**
 * Session budget limits
 * These prevent runaway costs from a single user session
 */
export const SESSION_LIMITS = {
  // Max tokens per single request (input)
  MAX_INPUT_TOKENS: 8000,
  
  // Max tokens for conversation history sent to API
  MAX_CONTEXT_TOKENS: 15000,
  
  // Max estimated cost per session (rough: $0.003 per 1K input tokens for Claude Sonnet)
  MAX_SESSION_REQUESTS: 100,
} as const

/**
 * Check if a request is within budget
 */
export function checkTokenBudget(
  messages: Array<{ content: string }>,
  systemPrompt: string
): { allowed: boolean; reason?: string; tokens: number } {
  const messageTokens = estimateMessagesTokens(messages)
  const systemTokens = estimateTokens(systemPrompt)
  const totalTokens = messageTokens + systemTokens
  
  if (totalTokens > SESSION_LIMITS.MAX_CONTEXT_TOKENS) {
    return {
      allowed: false,
      reason: `Request too large (${totalTokens} tokens). Try starting a new conversation.`,
      tokens: totalTokens,
    }
  }
  
  return { allowed: true, tokens: totalTokens }
}

/**
 * Trim conversation history to fit within token budget
 * Keeps system message and most recent messages
 */
export function trimConversationHistory(
  messages: Array<{ role: string; content: string }>,
  maxTokens: number = SESSION_LIMITS.MAX_CONTEXT_TOKENS
): Array<{ role: string; content: string }> {
  // Always keep at least the last 2 messages (user question + context)
  if (messages.length <= 2) return messages
  
  let totalTokens = 0
  const result: Array<{ role: string; content: string }> = []
  
  // Work backwards from most recent
  for (let i = messages.length - 1; i >= 0; i--) {
    const msgTokens = estimateTokens(messages[i].content)
    
    if (totalTokens + msgTokens > maxTokens && result.length >= 2) {
      break
    }
    
    totalTokens += msgTokens
    result.unshift(messages[i])
  }
  
  return result
}

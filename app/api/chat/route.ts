import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { ChatRequestSchema } from '@/lib/schemas'
import { PHASE_PROMPTS } from '@/lib/prompts'
import { sanitizeForPrompt } from '@/lib/sanitize'
import { chatRateLimiter, getClientIdentifier, rateLimitResponse } from '@/lib/rate-limit'
import { env } from '@/lib/env'

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientId = getClientIdentifier(request)
  const rateLimit = await chatRateLimiter.check(clientId)
  
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.resetIn)
  }

  // Check API key
  if (!env.isAnthropicConfigured) {
    return NextResponse.json(
      { error: 'Anthropic API is not configured.' },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()
    
    // Validate request
    const validation = ChatRequestSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.message },
        { status: 400 }
      )
    }

    const { messages, phase, backgroundDocs } = validation.data
    const phaseConfig = PHASE_PROMPTS[phase]
    
    if (!phaseConfig) {
      return NextResponse.json(
        { error: 'Invalid phase' },
        { status: 400 }
      )
    }

    // Build system prompt with background docs if available
    let systemPrompt = phaseConfig.systemPrompt
    
    if (backgroundDocs) {
      const docsContext: string[] = []
      if (backgroundDocs.resume) {
        docsContext.push(`RESUME/BACKGROUND:\n${sanitizeForPrompt(backgroundDocs.resume)}`)
      }
      if (backgroundDocs.disc) {
        docsContext.push(`DISC PROFILE:\n${sanitizeForPrompt(backgroundDocs.disc)}`)
      }
      if (backgroundDocs.gallup) {
        docsContext.push(`STRENGTHS (GALLUP):\n${sanitizeForPrompt(backgroundDocs.gallup)}`)
      }
      if (backgroundDocs.other) {
        docsContext.push(`ADDITIONAL CONTEXT:\n${sanitizeForPrompt(backgroundDocs.other)}`)
      }
      
      if (docsContext.length > 0) {
        systemPrompt += `\n\n---\nBACKGROUND INFORMATION PROVIDED BY USER:\n${docsContext.join('\n\n')}\n---\nUse this background information to provide more personalized guidance. Reference specific details when relevant.`
      }
    }

    // Format messages for Anthropic
    const anthropicMessages = messages.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: sanitizeForPrompt(msg.content)
    }))

    // Call Anthropic API
    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })
    
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: anthropicMessages
    })

    // Extract text response
    const textContent = response.content.find(block => block.type === 'text')
    const reply = textContent && 'text' in textContent ? textContent.text : 'I apologize, but I was unable to generate a response. Please try again.'

    return NextResponse.json({ reply })

  } catch (error) {
    console.error('Chat API error:', error)
    
    if (error instanceof Anthropic.APIError) {
      if (error.status === 429) {
        return NextResponse.json(
          { error: 'AI service is busy. Please try again in a moment.' },
          { status: 429 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to get response. Please try again.' },
      { status: 500 }
    )
  }
}

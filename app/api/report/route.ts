import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { ReportRequestSchema } from '@/lib/schemas'
import { REPORT_SYSTEM_PROMPT, PHASE_ORDER, PHASE_PROMPTS } from '@/lib/prompts'
import { sanitizeForPrompt } from '@/lib/sanitize'
import { reportRateLimiter, getClientIdentifier, rateLimitResponse } from '@/lib/rate-limit'
import { env } from '@/lib/env'

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientId = getClientIdentifier(request)
  const rateLimit = await reportRateLimiter.check(clientId)
  
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
    const validation = ReportRequestSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.message },
        { status: 400 }
      )
    }

    const { phases, backgroundDocs } = validation.data

    // Build conversation summaries for each phase
    const phaseSummaries: string[] = []
    
    for (const phaseKey of PHASE_ORDER) {
      const phaseData = phases[phaseKey]
      if (phaseData && phaseData.messages.length > 0) {
        const phaseConfig = PHASE_PROMPTS[phaseKey]
        const conversation = phaseData.messages
          .map(m => `${m.role.toUpperCase()}: ${sanitizeForPrompt(m.content)}`)
          .join('\n\n')
        
        phaseSummaries.push(`## ${phaseConfig?.title || phaseKey}\n\n${conversation}`)
      }
    }

    if (phaseSummaries.length === 0) {
      return NextResponse.json(
        { error: 'No conversation data to generate report from' },
        { status: 400 }
      )
    }

    // Build the prompt
    let userPrompt = `Based on the following assessment conversations, create a comprehensive personal strategic plan:\n\n${phaseSummaries.join('\n\n---\n\n')}`
    
    // Add background docs context if available
    if (backgroundDocs) {
      const docsContext: string[] = []
      if (backgroundDocs.resume) {
        docsContext.push(`Resume/Background: ${sanitizeForPrompt(backgroundDocs.resume).slice(0, 2000)}`)
      }
      if (backgroundDocs.disc) {
        docsContext.push(`DISC Profile: ${sanitizeForPrompt(backgroundDocs.disc)}`)
      }
      if (backgroundDocs.gallup) {
        docsContext.push(`Strengths: ${sanitizeForPrompt(backgroundDocs.gallup)}`)
      }
      
      if (docsContext.length > 0) {
        userPrompt += `\n\n---\nADDITIONAL BACKGROUND:\n${docsContext.join('\n')}`
      }
    }

    // Call Anthropic API
    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })
    
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: REPORT_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }]
    })

    // Extract text response
    const textContent = response.content.find(block => block.type === 'text')
    const report = textContent && 'text' in textContent ? textContent.text : 'Failed to generate report.'

    return NextResponse.json({ report })

  } catch (error) {
    console.error('Report API error:', error)
    
    return NextResponse.json(
      { error: 'Failed to generate report. Please try again.' },
      { status: 500 }
    )
  }
}

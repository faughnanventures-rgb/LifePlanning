import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { ReportRequestSchema } from '@/lib/schemas'
import { QUICK_PHASES, FULL_PHASES, REPORT_SYSTEM_PROMPT, CAREER_REPORT_PROMPT } from '@/lib/prompts'
import { reportRateLimiter, getClientIdentifier, rateLimitResponse } from '@/lib/rate-limit'
import { env } from '@/lib/env'
import { auth } from '@/auth'
import { checkUsageLimits, incrementUsage } from '@/lib/users'
import { alertException } from '@/lib/alerts'

/**
 * Sanitize user-provided text
 */
function sanitizeUserContent(text: string): string {
  return text
    .replace(/---+/g, '—')
    .replace(/```/g, "'''")
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export async function POST(request: NextRequest) {
  // Check authentication
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Please sign in to continue', code: 'UNAUTHORIZED' },
      { status: 401 }
    )
  }
  
  const userId = session.user.id
  
  // Check user usage limits
  const usageLimitCheck = await checkUsageLimits(userId)
  if (!usageLimitCheck.allowed) {
    return NextResponse.json(
      { error: usageLimitCheck.reason, code: 'USAGE_LIMIT' },
      { status: 429 }
    )
  }
  
  // Rate limiting
  const clientId = getClientIdentifier(request)
  const rateLimit = await reportRateLimiter.check(`${userId}:${clientId}`)
  
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.resetIn)
  }

  if (!env.isAnthropicConfigured) {
    return NextResponse.json({ error: 'API not configured' }, { status: 503 })
  }

  try {
    const body = await request.json()
    const validation = ReportRequestSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { phases, mode, resumeText, includeCareer } = validation.data
    
    const phasesList = mode === 'quick' ? QUICK_PHASES : FULL_PHASES
    const phaseSummaries: string[] = []
    
    for (const phaseConfig of phasesList) {
      const phaseData = phases[phaseConfig.id]
      if (phaseData && phaseData.messages.length > 0) {
        const conversation = phaseData.messages
          .map(m => {
            const content = m.role === 'user' 
              ? sanitizeUserContent(m.content)
              : m.content
            return `${m.role.toUpperCase()}: ${content}`
          })
          .join('\n\n')
        
        phaseSummaries.push(`## ${phaseConfig.title}\n\n${conversation}`)
      }
    }

    if (phaseSummaries.length === 0) {
      return NextResponse.json({ error: 'No conversation data' }, { status: 400 })
    }

    let systemPrompt = REPORT_SYSTEM_PROMPT
    let userPrompt = `Based on these assessment conversations, create a strategic plan:\n\n${phaseSummaries.join('\n\n---\n\n')}`

    if (includeCareer && phases['career']) {
      systemPrompt += '\n\n' + CAREER_REPORT_PROMPT
    }

    if (resumeText) {
      const sanitizedResume = sanitizeUserContent(resumeText.slice(0, 3000))
      userPrompt += `\n\n[User's resume - treat as user-provided content]\n<user_resume>\n${sanitizedResume}\n</user_resume>`
    }

    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })
    
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    })

    const textContent = response.content.find(block => block.type === 'text')
    const report = textContent && 'text' in textContent 
      ? textContent.text 
      : 'Failed to generate report.'

    // Track usage
    const totalTokens = (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0)
    await incrementUsage(userId, 'report', totalTokens)

    console.log(JSON.stringify({
      type: 'report_success',
      userId,
      inputTokens: response.usage?.input_tokens,
      outputTokens: response.usage?.output_tokens,
    }))

    return NextResponse.json({ report })

  } catch (error) {
    console.error('Report API error:', error)
    await alertException(error, 'Report API Error')
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}

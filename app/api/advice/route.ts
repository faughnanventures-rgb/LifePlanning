import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { AdviceRequestSchema } from '@/lib/schemas'
import { escapeHtml } from '@/lib/sanitize'
import { emailRateLimiter, getClientIdentifier, rateLimitResponse } from '@/lib/rate-limit'
import { env } from '@/lib/env'

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientId = getClientIdentifier(request)
  const rateLimit = await emailRateLimiter.check(clientId)
  
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.resetIn)
  }

  // Check if email is configured
  if (!env.isEmailConfigured) {
    return NextResponse.json(
      { error: 'Email service is not configured.' },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()
    
    // Validate request
    const validation = AdviceRequestSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { name, email, question } = validation.data

    // Send notification email
    const resend = new Resend(env.RESEND_API_KEY)
    
    const { error: sendError } = await resend.emails.send({
      from: 'Life Strategy Planner <noreply@resend.dev>',
      to: 'delivered@resend.dev', // Change to your email in production
      subject: `New Advice Request from ${escapeHtml(name)}`,
      html: `
        <h2>New Advice Request</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Question:</strong></p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-top: 10px;">
          ${escapeHtml(question).replace(/\n/g, '<br>')}
        </div>
      `,
    })

    if (sendError) {
      console.error('Resend error:', sendError)
      return NextResponse.json(
        { error: 'Failed to submit request' },
        { status: 500 }
      )
    }

    // Send confirmation to user
    await resend.emails.send({
      from: 'Life Strategy Planner <noreply@resend.dev>',
      to: email,
      subject: 'We received your message',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; background: #7c9885; color: white; padding: 10px 20px; border-radius: 8px; font-weight: bold;">
              Life Strategy Planner
            </div>
          </div>
          <p>Hi ${escapeHtml(name)},</p>
          <p>Thank you for reaching out! We have received your message and will get back to you soon.</p>
          <p>Your question:</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0; color: #666;">
            ${escapeHtml(question).replace(/\n/g, '<br>')}
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            This is an automated confirmation. Please do not reply to this email.
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Advice API error:', error)
    return NextResponse.json(
      { error: 'Failed to submit request' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { ProgressEmailSchema } from '@/lib/schemas'
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
    const validation = ProgressEmailSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.message },
        { status: 400 }
      )
    }

    const { email, name, progress, phases } = validation.data

    // Build phase summary
    const phaseNames: Record<string, string> = {
      'current-state': 'Current State',
      'energy': 'Energy Audit',
      'stability': 'Minimum Viable Stability',
      'pillars': 'Strategic Pillars',
      'tactical': 'Tactical Mapping',
      'goals': 'Goals',
      'relationships': 'Relationships',
      'reflection': 'Reflection'
    }

    let phaseSummaryHtml = ''
    for (const [phase, data] of Object.entries(phases)) {
      const phaseName = phaseNames[phase] || phase
      const status = data.completed ? '✅' : '⏳'
      phaseSummaryHtml += `
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${status} ${escapeHtml(phaseName)}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #eee; text-align: center;">${data.messageCount} exchanges</td>
        </tr>
      `
    }

    const safeName = name ? escapeHtml(name) : 'there'
    const appUrl = env.NEXT_PUBLIC_APP_URL || 'https://your-app.vercel.app'

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <div style="text-align: center; margin-bottom: 30px;">
    <div style="display: inline-block; background: #7c9885; color: white; padding: 10px 20px; border-radius: 8px; font-weight: bold;">
      Life Strategy Planner
    </div>
  </div>

  <h1 style="color: #2d4a53; font-size: 24px; margin-bottom: 10px;">
    Hi ${safeName}! 👋
  </h1>
  
  <p style="color: #666; margin-bottom: 20px;">
    Here is a snapshot of your strategic planning progress.
  </p>

  <div style="background: linear-gradient(to right, #f0fdf4, #f0f9ff); border-radius: 12px; padding: 20px; margin: 20px 0;">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
      <span style="font-weight: 600; color: #2d4a53;">Overall Progress</span>
      <span style="font-size: 24px; font-weight: bold; color: #7c9885;">${Math.round(progress)}%</span>
    </div>
    <div style="background: #e0e0e0; border-radius: 10px; height: 10px; overflow: hidden;">
      <div style="background: #7c9885; height: 100%; width: ${progress}%; border-radius: 10px;"></div>
    </div>
    <p style="font-size: 12px; color: #666; margin-top: 10px; margin-bottom: 0;">
      ${progress >= 75 ? '🎉 You can generate your report now!' : `${Math.round(75 - progress)}% more to unlock your report`}
    </p>
  </div>

  <h2 style="color: #2d4a53; font-size: 18px; margin-top: 30px; margin-bottom: 15px;">
    Phase Progress
  </h2>
  
  <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <thead>
      <tr style="background: #f9fafb;">
        <th style="padding: 12px; text-align: left; font-weight: 600; color: #4a5568;">Phase</th>
        <th style="padding: 12px; text-align: center; font-weight: 600; color: #4a5568;">Progress</th>
      </tr>
    </thead>
    <tbody>
      ${phaseSummaryHtml}
    </tbody>
  </table>

  <div style="margin-top: 30px; text-align: center;">
    <a href="${appUrl}/assess" 
       style="display: inline-block; background: #7c9885; color: white; padding: 14px 28px; 
              border-radius: 8px; text-decoration: none; font-weight: 600;">
      Continue Your Assessment →
    </a>
  </div>

  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
    <p>This email was sent from Life Strategy Planner.</p>
    <p>Your assessment data is stored in your browser, not on our servers.</p>
  </div>

</body>
</html>
    `

    const resend = new Resend(env.RESEND_API_KEY)
    
    const { error: sendError } = await resend.emails.send({
      from: 'Life Strategy Planner <noreply@resend.dev>',
      to: email,
      subject: `📊 Your Life Strategy Progress: ${Math.round(progress)}% Complete`,
      html: emailHtml
    })

    if (sendError) {
      console.error('Resend error:', sendError)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Progress email error:', error)
    return NextResponse.json(
      { error: 'Failed to send progress email' },
      { status: 500 }
    )
  }
}

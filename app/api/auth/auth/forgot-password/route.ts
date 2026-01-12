import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createPasswordResetToken } from '@/lib/users'
import { env } from '@/lib/env'

const ForgotPasswordSchema = z.object({
  email: z.string().email().max(255),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = ForgotPasswordSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }
    
    const { email } = validation.data
    
    // Create reset token (returns null if user doesn't exist, but we don't reveal that)
    const resetToken = await createPasswordResetToken(email)
    
    // Always return success to prevent email enumeration
    const response: { success: boolean; message: string; debugResetLink?: string } = {
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link.',
    }
    
    // If token was created and email is configured, send email
    if (resetToken && env.isEmailConfigured) {
      const resetUrl = `${env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken.token}`
      
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.FROM_EMAIL || 'noreply@example.com',
            to: email,
            subject: 'Reset Your Password - Life Strategy Planner',
            html: `
              <h2>Reset Your Password</h2>
              <p>You requested a password reset for your Life Strategy Planner account.</p>
              <p><a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4a7c59; color: white; text-decoration: none; border-radius: 8px;">Reset Password</a></p>
              <p>Or copy this link: ${resetUrl}</p>
              <p>This link expires in 1 hour.</p>
              <p>If you didn't request this, you can safely ignore this email.</p>
            `,
          }),
        })
      } catch (emailError) {
        console.error('Failed to send reset email:', emailError)
      }
    }
    
    // For development/testing: include reset link in response if email not configured
    if (resetToken && !env.isEmailConfigured) {
      const resetUrl = `${env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken.token}`
      response.debugResetLink = resetUrl
      response.message = 'Email not configured. Use the link below to reset your password (development only).'
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { validateResetToken, useResetToken } from '@/lib/users'

const ResetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(100),
})

// GET: Validate token
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  
  if (!token) {
    return NextResponse.json(
      { valid: false, error: 'Missing token' },
      { status: 400 }
    )
  }
  
  const resetToken = await validateResetToken(token)
  
  if (!resetToken) {
    return NextResponse.json(
      { valid: false, error: 'Invalid or expired reset link' },
      { status: 400 }
    )
  }
  
  return NextResponse.json({
    valid: true,
    email: resetToken.email,
  })
}

// POST: Reset password
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = ResetPasswordSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      )
    }
    
    const { token, password } = validation.data
    
    const success = await useResetToken(token, password)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Invalid or expired reset link. Please request a new one.' },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Password reset successfully. You can now sign in.',
    })
    
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

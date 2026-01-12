import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createUser, getUserByEmail } from '@/lib/users'
import { sendAlert } from '@/lib/alerts'

const RegisterSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(100),
  name: z.string().min(1).max(100).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = RegisterSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      )
    }
    
    const { email, password, name } = validation.data
    
    // Check if user already exists
    const existing = await getUserByEmail(email)
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }
    
    // Create user
    const user = await createUser(email, password, name)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create account. Please try again.' },
        { status: 500 }
      )
    }
    
    // Send alert for new user signup
    await sendAlert({
      type: 'info',
      title: 'New User Signup',
      message: `New user registered: ${email}`,
      metadata: { userId: user.id },
    })
    
    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Please sign in.',
    })
    
  } catch (error) {
    console.error('Registration error:', error)
    
    await sendAlert({
      type: 'error',
      title: 'Registration Error',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
    
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getUserUsage, USAGE_LIMITS } from '@/lib/users'

// GET /api/user/usage - Get current user's usage stats
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const usage = await getUserUsage(session.user.id)
    
    if (!usage) {
      // Return default usage for new users
      return NextResponse.json({
        usage: {
          chatRequests: 0,
          reportRequests: 0,
          totalTokens: 0,
          dailyRequests: 0,
        },
        limits: USAGE_LIMITS.FREE,
        remaining: {
          dailyRequests: USAGE_LIMITS.FREE.dailyRequests,
        },
      })
    }
    
    return NextResponse.json({
      usage: {
        chatRequests: usage.chatRequests,
        reportRequests: usage.reportRequests,
        totalTokens: usage.totalTokens,
        dailyRequests: usage.dailyRequests,
        lastRequestAt: usage.lastRequestAt,
      },
      limits: USAGE_LIMITS.FREE,
      remaining: {
        dailyRequests: Math.max(0, USAGE_LIMITS.FREE.dailyRequests - usage.dailyRequests),
      },
    })
    
  } catch (error) {
    console.error('Usage API error:', error)
    return NextResponse.json(
      { error: 'Failed to get usage' },
      { status: 500 }
    )
  }
}

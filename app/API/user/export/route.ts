import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { exportUserData, deleteUser } from '@/lib/users'
import { alertInfo, alertWarning } from '@/lib/alerts'

// GET /api/user/export - Export user data (GDPR)
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const data = await exportUserData(session.user.id)
    
    if (!data.user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Log data export for audit
    await alertInfo('Data Export Requested', `User ${session.user.email} exported their data`, {
      userId: session.user.id,
    })
    
    // Return as downloadable JSON
    const exportData = {
      exportedAt: new Date().toISOString(),
      user: data.user,
      usage: data.usage,
      // Note: Conversation data is stored locally in the browser
      note: 'Your conversation data is stored locally in your browser and is not included in this export.',
    }
    
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="life-strategy-data-export-${new Date().toISOString().split('T')[0]}.json"`,
      },
    })
    
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}

// DELETE /api/user/export - Delete user account (GDPR Right to Erasure)
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Confirm deletion
    const body = await request.json().catch(() => ({}))
    if (body.confirm !== 'DELETE_MY_ACCOUNT') {
      return NextResponse.json(
        { error: 'Please confirm deletion by sending { "confirm": "DELETE_MY_ACCOUNT" }' },
        { status: 400 }
      )
    }
    
    const success = await deleteUser(session.user.id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete account' },
        { status: 500 }
      )
    }
    
    // Log account deletion for audit
    await alertWarning('Account Deleted', `User ${session.user.email} deleted their account`, {
      userId: session.user.id,
    })
    
    return NextResponse.json({
      success: true,
      message: 'Your account has been deleted. You will be signed out.',
    })
    
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    )
  }
}

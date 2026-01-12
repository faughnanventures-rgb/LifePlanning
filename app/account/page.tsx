'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Target, User, Download, Trash2, LogOut, Loader2, 
  AlertTriangle, BarChart3, Clock, MessageSquare, FileText 
} from 'lucide-react'

interface UsageData {
  usage: {
    chatRequests: number
    reportRequests: number
    totalTokens: number
    dailyRequests: number
    lastRequestAt?: string
  }
  limits: {
    dailyRequests: number
    monthlyReports: number
    maxTokensPerRequest: number
  }
  remaining: {
    dailyRequests: number
  }
}

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [usageData, setUsageData] = useState<UsageData | null>(null)
  const [isLoadingUsage, setIsLoadingUsage] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [error, setError] = useState('')
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/account')
    }
  }, [status, router])
  
  useEffect(() => {
    async function fetchUsage() {
      try {
        const response = await fetch('/api/user/usage')
        if (response.ok) {
          const data = await response.json()
          setUsageData(data)
        }
      } catch {
        console.error('Failed to fetch usage')
      } finally {
        setIsLoadingUsage(false)
      }
    }
    
    if (session) {
      fetchUsage()
    }
  }, [session])
  
  const handleExport = async () => {
    setIsExporting(true)
    setError('')
    
    try {
      const response = await fetch('/api/user/export')
      
      if (!response.ok) {
        throw new Error('Export failed')
      }
      
      // Download the file
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `life-strategy-data-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
    } catch {
      setError('Failed to export data. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }
  
  const handleDelete = async () => {
    if (deleteConfirmText !== 'DELETE') {
      setError('Please type DELETE to confirm')
      return
    }
    
    setIsDeleting(true)
    setError('')
    
    try {
      const response = await fetch('/api/user/export', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: 'DELETE_MY_ACCOUNT' }),
      })
      
      if (!response.ok) {
        throw new Error('Delete failed')
      }
      
      // Sign out and redirect
      await signOut({ redirect: false })
      router.push('/?deleted=true')
      
    } catch {
      setError('Failed to delete account. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }
  
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sage-400 animate-spin" />
      </div>
    )
  }
  
  if (!session) {
    return null
  }
  
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sage-400 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-stone-700">Life Strategy</span>
          </Link>
          <Link href="/assess" className="text-sm text-sage-600 hover:underline">
            Back to Assessment
          </Link>
        </div>
      </header>
      
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-stone-800 mb-8">Account Settings</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        {/* Profile Section */}
        <section className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-sage-600" />
            </div>
            <div>
              <p className="font-semibold text-stone-800">
                {session.user?.name || 'Anonymous User'}
              </p>
              <p className="text-sm text-stone-500">{session.user?.email}</p>
            </div>
          </div>
          
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 px-4 py-2 text-stone-600 hover:text-stone-800 
                       hover:bg-stone-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </section>
        
        {/* Usage Section */}
        <section className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-sage-500" />
            <h2 className="font-semibold text-stone-800">Usage</h2>
          </div>
          
          {isLoadingUsage ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-sage-400 animate-spin" />
            </div>
          ) : usageData ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-stone-50 rounded-xl">
                <div className="flex items-center gap-2 text-stone-500 mb-1">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-xs">Chat Messages</span>
                </div>
                <p className="text-xl font-bold text-stone-800">
                  {usageData.usage.chatRequests.toLocaleString()}
                </p>
              </div>
              
              <div className="p-4 bg-stone-50 rounded-xl">
                <div className="flex items-center gap-2 text-stone-500 mb-1">
                  <FileText className="w-4 h-4" />
                  <span className="text-xs">Reports Generated</span>
                </div>
                <p className="text-xl font-bold text-stone-800">
                  {usageData.usage.reportRequests.toLocaleString()}
                </p>
              </div>
              
              <div className="p-4 bg-stone-50 rounded-xl">
                <div className="flex items-center gap-2 text-stone-500 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs">Today&apos;s Requests</span>
                </div>
                <p className="text-xl font-bold text-stone-800">
                  {usageData.usage.dailyRequests} / {usageData.limits.dailyRequests}
                </p>
              </div>
              
              <div className="p-4 bg-stone-50 rounded-xl">
                <div className="flex items-center gap-2 text-stone-500 mb-1">
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-xs">Remaining Today</span>
                </div>
                <p className="text-xl font-bold text-stone-800">
                  {usageData.remaining.dailyRequests}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-stone-500">Unable to load usage data</p>
          )}
          
          <p className="text-xs text-stone-400 mt-4">
            Daily limits reset at midnight UTC. Free tier includes {usageData?.limits.dailyRequests || 50} requests per day.
          </p>
        </section>
        
        {/* Data Management Section */}
        <section className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
          <h2 className="font-semibold text-stone-800 mb-4">Data Management</h2>
          <p className="text-sm text-stone-500 mb-6">
            Your conversation data is stored locally in your browser. Account data (email, usage stats) 
            is stored on our servers.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 w-full px-4 py-3 border border-stone-200 
                         rounded-xl hover:bg-stone-50 transition-colors disabled:opacity-50"
            >
              {isExporting ? (
                <Loader2 className="w-5 h-5 text-stone-400 animate-spin" />
              ) : (
                <Download className="w-5 h-5 text-stone-400" />
              )}
              <span className="text-stone-700">Export My Data</span>
            </button>
            
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('life-strategy-progress-v2')
                  localStorage.removeItem('life-strategy-report-v2')
                  alert('Local conversation data cleared.')
                }
              }}
              className="flex items-center gap-2 w-full px-4 py-3 border border-stone-200 
                         rounded-xl hover:bg-stone-50 transition-colors"
            >
              <Trash2 className="w-5 h-5 text-stone-400" />
              <span className="text-stone-700">Clear Local Data</span>
            </button>
          </div>
        </section>
        
        {/* Delete Account Section */}
        <section className="bg-white rounded-2xl border border-red-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h2 className="font-semibold text-red-700">Danger Zone</h2>
          </div>
          
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 border border-red-200 text-red-600 rounded-xl
                         hover:bg-red-50 transition-colors"
            >
              Delete My Account
            </button>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-stone-600">
                This action cannot be undone. All your account data will be permanently deleted.
                Your local conversation data will remain in your browser until you clear it.
              </p>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Type DELETE to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full px-4 py-2 border border-stone-200 rounded-lg
                             focus:outline-none focus:border-red-400"
                  placeholder="DELETE"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting || deleteConfirmText !== 'DELETE'}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl
                             hover:bg-red-600 disabled:bg-stone-300 disabled:cursor-not-allowed 
                             transition-colors"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete Account Permanently
                </button>
                
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setDeleteConfirmText('')
                  }}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
      
      {/* Footer */}
      <footer className="py-8 px-6 border-t border-stone-200 bg-stone-100 mt-12">
        <div className="max-w-3xl mx-auto text-center text-sm text-stone-500">
          <div className="flex justify-center gap-4 mb-4">
            <Link href="/terms" className="hover:text-stone-700">Terms</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-stone-700">Privacy</Link>
            <span>•</span>
            <Link href="/status" className="hover:text-stone-700">Status</Link>
          </div>
          <p>© {new Date().getFullYear()} Life Strategy Planner</p>
        </div>
      </footer>
    </div>
  )
}

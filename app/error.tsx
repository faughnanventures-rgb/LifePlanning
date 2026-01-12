'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console (and Sentry if configured)
    console.error('Application error:', error)
    
    // If Sentry is configured, report the error
    if (typeof window !== 'undefined' && (window as unknown as { Sentry?: { captureException: (e: Error) => void } }).Sentry) {
      (window as unknown as { Sentry: { captureException: (e: Error) => void } }).Sentry.captureException(error)
    }
  }, [error])

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-stone-200 p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        
        <h1 className="text-xl font-bold text-stone-800 mb-2">Something went wrong</h1>
        
        <p className="text-stone-600 mb-6">
          We encountered an unexpected error. Your progress has been saved locally.
        </p>
        
        {error.digest && (
          <p className="text-xs text-stone-400 mb-6 font-mono">
            Error ID: {error.digest}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-sage-400 text-white rounded-xl hover:bg-sage-500 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 border border-stone-200 text-stone-700 rounded-xl hover:bg-stone-50 transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
        
        <p className="text-xs text-stone-400 mt-6">
          If this keeps happening, try clearing your browser cache or using a different browser.
        </p>
      </div>
    </div>
  )
}

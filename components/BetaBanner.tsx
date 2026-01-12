'use client'

import { useState, useEffect } from 'react'
import { X, FlaskConical } from 'lucide-react'

// Set to false to hide the banner site-wide when exiting beta
const SHOW_BETA_BANNER = true

export default function BetaBanner() {
  const [dismissed, setDismissed] = useState(true) // Start hidden to prevent flash

  useEffect(() => {
    // Check if user has dismissed the banner
    const wasDismissed = localStorage.getItem('beta-banner-dismissed')
    setDismissed(!!wasDismissed)
  }, [])

  const handleDismiss = () => {
    localStorage.setItem('beta-banner-dismissed', 'true')
    setDismissed(true)
  }

  if (!SHOW_BETA_BANNER || dismissed) return null

  return (
    <div className="bg-amber-500 text-amber-950 px-4 py-2 text-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4 flex-shrink-0" />
          <span>
            <strong>Beta:</strong> This app is in early testing. Your feedback helps us improve!
            {' '}
            <a 
              href="mailto:feedback@example.com" 
              className="underline hover:no-underline"
            >
              Share feedback
            </a>
          </span>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1 hover:bg-amber-600/20 rounded"
          aria-label="Dismiss beta notice"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

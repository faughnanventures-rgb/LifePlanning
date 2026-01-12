'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Cookie } from 'lucide-react'

const CONSENT_KEY = 'cookie-consent-v1'

type ConsentValue = 'accepted' | 'rejected' | null

export default function CookieConsent() {
  const [consent, setConsent] = useState<ConsentValue>(null)
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    // Check if consent has been given
    const savedConsent = localStorage.getItem(CONSENT_KEY) as ConsentValue
    setConsent(savedConsent)
    
    // Show banner if no consent recorded
    if (!savedConsent) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])
  
  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted')
    setConsent('accepted')
    setIsVisible(false)
    
    // Enable analytics if they were waiting for consent
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
      })
    }
  }
  
  const handleReject = () => {
    localStorage.setItem(CONSENT_KEY, 'rejected')
    setConsent('rejected')
    setIsVisible(false)
    
    // Disable analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
      })
    }
  }
  
  const handleDismiss = () => {
    setIsVisible(false)
  }
  
  if (!isVisible || consent) {
    return null
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-stone-200 p-4 md:p-6">
        <div className="flex items-start gap-4">
          <div className="hidden md:flex w-10 h-10 bg-sage-100 rounded-full items-center justify-center flex-shrink-0">
            <Cookie className="w-5 h-5 text-sage-600" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-stone-800 mb-1">Cookie Preferences</h3>
            <p className="text-sm text-stone-600 mb-4">
              We use cookies and similar technologies to improve your experience, analyze traffic, 
              and personalize content. Your conversation data is stored locally on your device.
              {' '}
              <Link href="/privacy" className="text-sage-600 hover:underline">
                Learn more
              </Link>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleAccept}
                className="px-4 py-2 bg-sage-400 text-white rounded-lg text-sm font-medium
                           hover:bg-sage-500 transition-colors"
              >
                Accept All
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium
                           hover:bg-stone-200 transition-colors"
              >
                Reject Non-Essential
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-stone-500 rounded-lg text-sm
                           hover:text-stone-700 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="p-1 text-stone-400 hover:text-stone-600 flex-shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Type declaration for gtag
declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: Record<string, string>) => void
  }
}

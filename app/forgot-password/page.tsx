'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Target, ArrowLeft, Loader2, Mail, CheckCircle, AlertCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [debugLink, setDebugLink] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setDebugLink(null)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      setSuccess(true)
      
      // For development: show the reset link
      if (data.debugResetLink) {
        setDebugLink(data.debugResetLink)
      }
    } catch (err) {
      setError('Failed to send reset email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sage-400 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-stone-700">Life Strategy</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>

          {!success ? (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-sage-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-sage-600" />
                </div>
                <h1 className="text-2xl font-bold text-stone-800 mb-2">
                  Forgot your password?
                </h1>
                <p className="text-stone-500">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl
                             focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-sage-400 text-white rounded-xl font-medium
                           hover:bg-sage-500 disabled:bg-sage-300 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-stone-800 mb-2">
                Check your email
              </h1>
              <p className="text-stone-500 mb-6">
                If an account exists for {email}, you'll receive a password reset link.
              </p>

              {/* Development: Show reset link directly */}
              {debugLink && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-left">
                  <p className="text-sm font-medium text-amber-800 mb-2">
                    ⚠️ Development Mode - Email not configured
                  </p>
                  <p className="text-sm text-amber-700 mb-2">
                    Use this link to reset your password:
                  </p>
                  <a
                    href={debugLink}
                    className="text-sm text-sage-600 hover:underline break-all"
                  >
                    {debugLink}
                  </a>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setSuccess(false)
                    setEmail('')
                    setDebugLink(null)
                  }}
                  className="w-full py-3 border border-stone-200 text-stone-700 rounded-xl font-medium hover:bg-stone-50"
                >
                  Try another email
                </button>
                <Link
                  href="/login"
                  className="block w-full py-3 bg-sage-400 text-white rounded-xl font-medium hover:bg-sage-500 text-center"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Target, ArrowLeft, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

export default function AdvicePage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [question, setQuestion] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, question })
      })

      if (response.status === 429) {
        setError('Too many requests. Please try again later.')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to submit')
      }

      setSubmitted(true)
    } catch (err) {
      console.error('Submit error:', err)
      setError('Failed to submit. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sage-400 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-stone-700">Life Strategy</span>
            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-medium rounded">
              BETA
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-stone-700 mb-2">Get in Touch</h1>
        <p className="text-stone-500 mb-8">
          Have a question, feedback, or need help? Send us a message and we will get back to you.
        </p>

        {submitted ? (
          <div className="bg-sage-50 border border-sage-200 rounded-xl p-8 text-center">
            <CheckCircle className="w-12 h-12 text-sage-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-stone-700 mb-2">Message Sent!</h2>
            <p className="text-stone-500 mb-6">
              Thank you for reaching out. We will get back to you soon.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-sage-400 text-white rounded-lg hover:bg-sage-500"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="question" className="block text-sm font-medium text-stone-700 mb-1">
                Your Message *
              </label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
                rows={5}
                className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-100 resize-none"
                placeholder="How can we help you?"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !name || !email || !question}
              className="w-full py-4 rounded-xl font-medium text-white transition-all
                         bg-sage-400 hover:bg-sage-500 disabled:bg-stone-300 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </button>
          </form>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-stone-200 bg-stone-100">
        <div className="max-w-3xl mx-auto text-center text-sm text-stone-500">
          © {new Date().getFullYear()} Life Strategy Planner. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

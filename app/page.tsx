import Link from 'next/link'
import { ArrowRight, Target, MessageSquare, CheckCircle, Shield, Lock, Trash2, AlertTriangle } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Beta Banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2">
        <p className="text-center text-sm text-amber-800">
          <span className="font-semibold">🧪 Beta Version</span> — This tool is in testing. Your feedback helps us improve!
        </p>
      </div>

      {/* Header */}
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sage-400 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-stone-700">Life Strategy</span>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
              BETA
            </span>
          </div>
          <Link 
            href="/assess"
            className="text-sage-600 hover:text-sage-700 font-medium"
          >
            Start Planning →
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-stone-50">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-stone-800 mb-6 leading-tight">
            Build a Strategic Plan for Your Life
          </h1>
          <p className="text-xl text-stone-600 mb-10 max-w-2xl mx-auto">
            Apply business planning rigor to personal development. Work through a structured 
            framework with an AI partner who asks tough questions and helps you think clearly.
          </p>
          <Link
            href="/assess"
            className="inline-flex items-center gap-2 px-8 py-4 bg-sage-400 text-white rounded-xl 
                       font-semibold text-lg hover:bg-sage-500 transition-colors shadow-lg shadow-sage-200"
          >
            Start Your Assessment
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* AI Disclaimer Banner */}
      <section className="bg-teal-50 border-y border-teal-200 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-teal-800">
            <strong>Important:</strong> This is an AI-powered reflection tool, not a substitute for professional 
            therapy, counseling, or medical advice. The AI may make mistakes. Always consult qualified 
            professionals for important life decisions.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-stone-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-stone-800 text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-sage-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-7 h-7 text-sage-600" />
              </div>
              <h3 className="font-semibold text-stone-700 mb-2">AI-Guided Conversations</h3>
              <p className="text-stone-500 text-sm">
                Work through 8 structured phases with an AI that pushes back on vague 
                answers and helps you dig deeper.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-sage-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-7 h-7 text-sage-600" />
              </div>
              <h3 className="font-semibold text-stone-700 mb-2">Strategic Pillars</h3>
              <p className="text-stone-500 text-sm">
                Identify 2-3 core focus areas that will organize your energy for the next 6-12 months.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-sage-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-sage-600" />
              </div>
              <h3 className="font-semibold text-stone-700 mb-2">Actionable Output</h3>
              <p className="text-stone-500 text-sm">
                End with a downloadable strategic plan: your pillars, goals, and a one-sentence 
                summary you can print, email, or reference anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The 8 Phases */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-stone-800 text-center mb-4">
            The 8-Phase Framework
          </h2>
          <p className="text-center text-stone-500 mb-12 max-w-2xl mx-auto">
            A structured approach that takes you from assessment to action
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { num: 1, title: 'Current State', desc: 'Assess where you are now' },
              { num: 2, title: 'Energy Audit', desc: 'What energizes vs drains you' },
              { num: 3, title: 'Minimum Viable Stability', desc: 'Define your foundations' },
              { num: 4, title: 'Strategic Pillars', desc: 'Identify 2-3 focus areas' },
              { num: 5, title: 'Tactical Mapping', desc: 'Break pillars into actions' },
              { num: 6, title: 'Goal Setting', desc: 'Specific, time-bound goals' },
              { num: 7, title: 'Relationship Audit', desc: 'Assess your support system' },
              { num: 8, title: 'Reflection', desc: 'Integrate and plan for obstacles' },
            ].map((phase) => (
              <div 
                key={phase.num}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-stone-50 transition-colors"
              >
                <div className="w-10 h-10 bg-sage-400 text-white rounded-lg flex items-center justify-center font-bold flex-shrink-0">
                  {phase.num}
                </div>
                <div>
                  <h3 className="font-semibold text-stone-700">{phase.title}</h3>
                  <p className="text-sm text-stone-500">{phase.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section id="privacy" className="py-20 px-6 bg-stone-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-stone-800 text-center mb-4">
            Your Privacy Matters
          </h2>
          <p className="text-center text-stone-500 mb-12 max-w-2xl mx-auto">
            We take your personal information seriously. Here is how we protect it.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-stone-200">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-stone-700 mb-2">Local Storage Only</h3>
              <p className="text-sm text-stone-500">
                Your assessment data stays in your browser. We do not store your conversations 
                on our servers.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-stone-200">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-stone-700 mb-2">Secure Processing</h3>
              <p className="text-sm text-stone-500">
                AI conversations are processed securely via Anthropic API and not stored 
                permanently.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-stone-200">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-stone-700 mb-2">Easy Deletion</h3>
              <p className="text-sm text-stone-500">
                Clear all your data anytime with one click. You are in complete control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-sage-400">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Build Your Strategy?
          </h2>
          <p className="text-sage-100 mb-8 text-lg">
            Take 30-60 minutes to work through the assessment. Leave with clarity.
          </p>
          <Link
            href="/assess"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-sage-600 rounded-xl 
                       font-semibold text-lg hover:bg-stone-50 transition-colors"
          >
            Start Your Assessment
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-stone-100 border-t border-stone-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-500 mb-6">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-sage-400" />
              <span className="font-medium text-stone-600">Life Strategy Planner</span>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                BETA
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-sage-500">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-sage-500">
                Terms of Service
              </Link>
              <Link href="/advice" className="hover:text-sage-500">
                Contact us →
              </Link>
            </div>
          </div>
          
          {/* Legal Disclaimer */}
          <div className="pt-6 border-t border-stone-200 text-xs text-stone-400 text-center max-w-2xl mx-auto">
            <p>
              <strong>Disclaimer:</strong> This AI-powered tool is for personal reflection and planning purposes only. 
              It does not provide professional therapy, counseling, medical, legal, or financial advice. 
              The AI may make mistakes. Always consult qualified professionals for important life decisions. 
              By using this tool, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-stone-500">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="underline hover:text-stone-500">Privacy Policy</Link>.
            </p>
            <p className="mt-2">
              If you are in crisis or experiencing thoughts of self-harm, please contact a crisis helpline 
              or mental health professional immediately.
            </p>
            <p className="mt-4 text-stone-400">
              © {new Date().getFullYear()} Life Strategy Planner. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

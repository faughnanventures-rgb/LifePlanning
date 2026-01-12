'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  Target, ArrowRight, ArrowLeft, Clock, Brain, Heart,
  CheckCircle, Sparkles, Shield, Users
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ONBOARDING_KEY = 'life-strategy-onboarded-v1'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  content: React.ReactNode
}

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedMode, setSelectedMode] = useState<'quick' | 'full' | null>(null)

  const completeOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true')
    if (selectedMode) {
      router.push(`/assess?mode=${selectedMode}`)
    } else {
      router.push('/assess?mode=quick')
    }
  }

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Life Strategy',
      description: 'Your AI-guided journey to clarity',
      icon: <Sparkles className="w-8 h-8" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-sage-50 to-teal-50 rounded-2xl p-6 sm:p-8 text-center">
            <div className="w-20 h-20 bg-sage-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-stone-800 mb-3">
              Let's find your direction
            </h2>
            <p className="text-stone-600 max-w-md mx-auto">
              Through guided conversations, you'll discover your values, clarify your vision, 
              and create an actionable plan for your life.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Brain, label: 'Discover your values', desc: 'What truly matters to you' },
              { icon: Target, label: 'Clarify your vision', desc: 'Where you want to go' },
              { icon: CheckCircle, label: 'Create your plan', desc: 'How to get there' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="bg-white rounded-xl border border-stone-200 p-4 text-center">
                <Icon className="w-6 h-6 text-sage-500 mx-auto mb-2" />
                <p className="font-medium text-stone-700 text-sm">{label}</p>
                <p className="text-xs text-stone-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'how-it-works',
      title: 'How It Works',
      description: 'A simple 3-step process',
      icon: <Brain className="w-8 h-8" />,
      content: (
        <div className="space-y-6">
          {[
            {
              num: '1',
              title: 'Have a Conversation',
              desc: 'Answer thoughtful questions at your own pace. The AI adapts to you.',
              color: 'bg-sage-100 text-sage-700',
            },
            {
              num: '2',
              title: 'Get Your Report',
              desc: 'Receive a personalized strategic plan based on your responses.',
              color: 'bg-teal-100 text-teal-700',
            },
            {
              num: '3',
              title: 'Track Your Progress',
              desc: 'Use the goals dashboard to stay accountable and celebrate wins.',
              color: 'bg-amber-100 text-amber-700',
            },
          ].map((step, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className={cn('w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0', step.color)}>
                {step.num}
              </div>
              <div>
                <h3 className="font-semibold text-stone-800">{step.title}</h3>
                <p className="text-stone-600 text-sm">{step.desc}</p>
              </div>
            </div>
          ))}
          
          <div className="bg-stone-50 rounded-xl p-4 flex items-start gap-3">
            <Shield className="w-5 h-5 text-stone-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-stone-700">Your privacy is protected</p>
              <p className="text-stone-500">Conversations are stored locally on your device. We don't sell your data.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'choose-mode',
      title: 'Choose Your Mode',
      description: 'Pick the experience that fits your schedule',
      icon: <Clock className="w-8 h-8" />,
      content: (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedMode('quick')}
            className={cn(
              'w-full text-left rounded-2xl border-2 p-5 sm:p-6 transition-all',
              selectedMode === 'quick'
                ? 'border-sage-400 bg-sage-50'
                : 'border-stone-200 hover:border-stone-300 bg-white'
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-sage-500" />
                  <span className="font-semibold text-stone-800">Quick Clarity</span>
                  <span className="text-xs bg-sage-100 text-sage-700 px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                </div>
                <p className="text-stone-600 text-sm mb-3">
                  Perfect for busy schedules. Get clear on your values, focus areas, and next steps.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-stone-100 text-stone-600 px-2 py-1 rounded">30-45 minutes</span>
                  <span className="bg-stone-100 text-stone-600 px-2 py-1 rounded">5 conversations</span>
                  <span className="bg-stone-100 text-stone-600 px-2 py-1 rounded">Can upgrade anytime</span>
                </div>
              </div>
              {selectedMode === 'quick' && (
                <CheckCircle className="w-6 h-6 text-sage-500 flex-shrink-0" />
              )}
            </div>
          </button>

          <button
            onClick={() => setSelectedMode('full')}
            className={cn(
              'w-full text-left rounded-2xl border-2 p-5 sm:p-6 transition-all',
              selectedMode === 'full'
                ? 'border-teal-400 bg-teal-50'
                : 'border-stone-200 hover:border-stone-300 bg-white'
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-5 h-5 text-teal-500" />
                  <span className="font-semibold text-stone-800">Full Assessment</span>
                </div>
                <p className="text-stone-600 text-sm mb-3">
                  Deep dive into every aspect of your life. Includes career exploration and detailed planning.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-stone-100 text-stone-600 px-2 py-1 rounded">2-3 hours</span>
                  <span className="bg-stone-100 text-stone-600 px-2 py-1 rounded">10+ conversations</span>
                  <span className="bg-stone-100 text-stone-600 px-2 py-1 rounded">Career module included</span>
                </div>
              </div>
              {selectedMode === 'full' && (
                <CheckCircle className="w-6 h-6 text-teal-500 flex-shrink-0" />
              )}
            </div>
          </button>

          <p className="text-center text-sm text-stone-500">
            Not sure? Start with Quick Clarity - you can upgrade anytime without losing progress.
          </p>
        </div>
      ),
    },
    {
      id: 'tips',
      title: 'Tips for Success',
      description: 'Get the most out of your session',
      icon: <Heart className="w-8 h-8" />,
      content: (
        <div className="space-y-4">
          {[
            {
              emoji: '🎧',
              title: 'Find a quiet space',
              desc: 'This works best when you can focus without interruptions.',
            },
            {
              emoji: '✍️',
              title: 'Be honest',
              desc: "The more authentic you are, the more useful your plan will be.",
            },
            {
              emoji: '🧘',
              title: 'Take your time',
              desc: "There's no rush. Your progress saves automatically.",
            },
            {
              emoji: '📱',
              title: 'Works on mobile',
              desc: 'Use your phone, tablet, or computer - whatever is comfortable.',
            },
          ].map((tip, i) => (
            <div key={i} className="flex gap-4 items-start bg-white rounded-xl border border-stone-200 p-4">
              <span className="text-2xl">{tip.emoji}</span>
              <div>
                <h3 className="font-medium text-stone-800">{tip.title}</h3>
                <p className="text-stone-600 text-sm">{tip.desc}</p>
              </div>
            </div>
          ))}

          <div className="bg-gradient-to-r from-sage-400 to-teal-400 rounded-2xl p-6 text-center text-white">
            <Users className="w-8 h-8 mx-auto mb-3 opacity-90" />
            <h3 className="font-semibold mb-1">Better with support</h3>
            <p className="text-sm opacity-90">
              Consider sharing your results with a coach, therapist, or trusted friend
            </p>
          </div>
        </div>
      ),
    },
  ]

  const isLastStep = currentStep === steps.length - 1

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sage-400 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-stone-700">Life Strategy</span>
          </Link>
          <button
            onClick={completeOnboarding}
            className="text-sm text-stone-500 hover:text-stone-700"
          >
            Skip
          </button>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-2xl mx-auto px-6">
          <div className="flex gap-2 py-3">
            {steps.map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-colors',
                  i <= currentStep ? 'bg-sage-400' : 'bg-stone-200'
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 flex flex-col">
        <div className="max-w-2xl mx-auto px-6 py-8 flex-1">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-sage-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-sage-600">
              {steps[currentStep].icon}
            </div>
            <h1 className="text-2xl font-bold text-stone-800 mb-2">
              {steps[currentStep].title}
            </h1>
            <p className="text-stone-500">{steps[currentStep].description}</p>
          </div>

          {steps[currentStep].content}
        </div>

        {/* Navigation */}
        <div className="border-t border-stone-200 bg-white">
          <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className={cn(
                'flex items-center gap-1 px-4 py-2 rounded-lg text-sm transition-colors',
                currentStep === 0
                  ? 'text-stone-300 cursor-not-allowed'
                  : 'text-stone-600 hover:bg-stone-100'
              )}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={() => {
                if (isLastStep) {
                  completeOnboarding()
                } else {
                  setCurrentStep(currentStep + 1)
                }
              }}
              className="flex items-center gap-2 px-6 py-2.5 bg-sage-400 text-white rounded-lg font-medium hover:bg-sage-500 transition-colors"
            >
              {isLastStep ? "Let's Begin" : 'Continue'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

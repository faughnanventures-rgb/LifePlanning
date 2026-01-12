'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Target, ChevronDown, ChevronUp, HelpCircle, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const FAQ_ITEMS: FAQItem[] = [
  // About the Tool
  {
    category: 'About the Tool',
    question: 'What is Life Strategy Planner?',
    answer: 'Life Strategy Planner is an AI-guided reflection tool that helps you clarify your values, vision, and goals through structured conversations. It\'s like having a thoughtful coach ask you the right questions to help you think through your life direction.',
  },
  {
    category: 'About the Tool',
    question: 'Is this therapy or coaching?',
    answer: 'No. This is a self-reflection tool, not a replacement for professional therapy, counseling, or coaching. It can complement working with a professional, and we encourage you to share your results with a coach or therapist if you have one. If you\'re experiencing mental health challenges, please seek professional support.',
  },
  {
    category: 'About the Tool',
    question: 'How is this different from journaling?',
    answer: 'While journaling is free-form, Life Strategy Planner provides structure and asks follow-up questions based on your responses. It helps you organize your thoughts across key life areas and generates a comprehensive plan at the end. Think of it as guided journaling with an intelligent assistant.',
  },
  {
    category: 'About the Tool',
    question: 'What\'s the difference between Quick and Full modes?',
    answer: 'Quick Clarity (30-45 min) covers the essentials: current state, values, focus areas, vision, and next steps. Full Assessment (2-3 hours) goes deeper with 10+ conversations including energy audit, goal setting at multiple timeframes, relationship audit, and optional career exploration. You can start with Quick and upgrade anytime without losing progress.',
  },

  // How It Works
  {
    category: 'How It Works',
    question: 'How long does it take?',
    answer: 'Quick Clarity takes 30-45 minutes. Full Assessment takes 2-3 hours, but you don\'t need to do it all at once - your progress saves automatically. Many people spread the Full Assessment over several sessions.',
  },
  {
    category: 'How It Works',
    question: 'Can I pause and come back later?',
    answer: 'Yes! Your progress saves automatically in your browser. Just come back to the same device and browser, and you\'ll pick up where you left off. If you create an account, your progress is tied to your login.',
  },
  {
    category: 'How It Works',
    question: 'What happens after I finish?',
    answer: 'You\'ll receive a personalized strategic plan in a readable report format. You can download it, print it, or share it with a coach or therapist. Then use the Goals Dashboard to track your progress on the actions you\'ve identified.',
  },
  {
    category: 'How It Works',
    question: 'Can I redo the assessment?',
    answer: 'Yes! You can start fresh anytime by clicking "Reset Progress" in the assessment interface. We recommend doing a full re-assessment every 6-12 months as your life evolves.',
  },

  // Privacy & Data
  {
    category: 'Privacy & Data',
    question: 'Where is my data stored?',
    answer: 'Your conversation data is stored locally in your browser (localStorage). It never leaves your device except when sent to the AI for processing. If you create an account, your email and usage stats are stored on our servers, but your conversations remain local.',
  },
  {
    category: 'Privacy & Data',
    question: 'Is my conversation private?',
    answer: 'Your conversations are processed by Claude (Anthropic\'s AI) to generate responses. Anthropic\'s privacy policy applies to this processing. We don\'t store your conversations on our servers or share them with third parties. See our Privacy Policy for full details.',
  },
  {
    category: 'Privacy & Data',
    question: 'Can I delete my data?',
    answer: 'Yes. You can clear your local conversation data anytime by clicking "Reset Progress" in the assessment or clearing your browser\'s localStorage. If you have an account, you can export or delete your account data from the Account page.',
  },
  {
    category: 'Privacy & Data',
    question: 'Do you sell my data?',
    answer: 'No. We don\'t sell your data to anyone. We use Vercel Analytics to understand general usage patterns (anonymized), but your personal information and conversations are never sold.',
  },

  // Using Results
  {
    category: 'Using Your Results',
    question: 'Can I share my report with my therapist or coach?',
    answer: 'Absolutely! We encourage this. You can download your report as HTML, print it, or share the link (if you have a shareable link). Many users find that sharing their report makes their sessions with professionals more productive.',
  },
  {
    category: 'Using Your Results',
    question: 'How do I track my goals?',
    answer: 'Use the Goals Dashboard to add goals and daily actions from your report. You can track completions, build streaks, and see your progress over time. The dashboard syncs with your local browser storage.',
  },
  {
    category: 'Using Your Results',
    question: 'What if my goals change?',
    answer: 'That\'s completely normal! Life changes, and your strategy should too. You can edit your goals in the dashboard, or do a full re-assessment to generate a new plan. We recommend reviewing your plan monthly and doing a fresh assessment every 6-12 months.',
  },

  // Technical
  {
    category: 'Technical',
    question: 'What devices can I use?',
    answer: 'Life Strategy Planner works on any modern web browser - desktop, tablet, or mobile. For the best experience on longer sessions, we recommend a larger screen, but the interface is fully mobile-responsive.',
  },
  {
    category: 'Technical',
    question: 'Do I need to create an account?',
    answer: 'Yes, an account is required to use the assessment. This helps us track usage limits and ensure fair access for everyone. Your email is only used for authentication and important updates.',
  },
  {
    category: 'Technical',
    question: 'Why is there a daily limit?',
    answer: 'AI processing has real costs. We offer a generous free tier (50 requests per day) to make this accessible while keeping the service sustainable. Most users complete their assessment well within this limit.',
  },
  {
    category: 'Technical',
    question: 'What if I hit the limit?',
    answer: 'The limit resets at midnight UTC. You can continue the next day. If you\'re in the middle of a conversation, don\'t worry - your progress saves automatically and you can pick up right where you left off.',
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = [...new Set(FAQ_ITEMS.map(item => item.category))]
  
  const filteredItems = selectedCategory
    ? FAQ_ITEMS.filter(item => item.category === selectedCategory)
    : FAQ_ITEMS

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sage-400 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-stone-700">Life Strategy</span>
          </Link>
          <Link
            href="/onboarding"
            className="text-sm text-sage-600 hover:text-sage-700 font-medium"
          >
            Get Started →
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-sage-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-sage-600" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-stone-800 mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-stone-500 max-w-lg mx-auto">
            Everything you need to know about Life Strategy Planner
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              !selectedCategory
                ? 'bg-sage-400 text-white'
                : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
            )}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                selectedCategory === category
                  ? 'bg-sage-400 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {filteredItems.map((item, index) => {
            const actualIndex = FAQ_ITEMS.indexOf(item)
            const isOpen = openIndex === actualIndex

            return (
              <div
                key={actualIndex}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : actualIndex)}
                  className="w-full flex items-center justify-between px-5 sm:px-6 py-4 text-left"
                >
                  <div className="flex-1 pr-4">
                    <span className="text-xs text-sage-600 font-medium mb-1 block">
                      {item.category}
                    </span>
                    <span className="font-medium text-stone-800">
                      {item.question}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-stone-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-stone-400 flex-shrink-0" />
                  )}
                </button>
                
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-0">
                    <div className="border-t border-stone-100 pt-4">
                      <p className="text-stone-600 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-br from-sage-50 to-teal-50 rounded-2xl p-6 sm:p-8 text-center">
          <h2 className="text-xl font-bold text-stone-800 mb-2">
            Still have questions?
          </h2>
          <p className="text-stone-600 mb-6 max-w-md mx-auto">
            The best way to understand is to try it. Start with Quick Clarity and see how it works.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/example"
              className="px-6 py-3 bg-white text-stone-700 rounded-xl font-medium border border-stone-200 hover:bg-stone-50 transition-colors"
            >
              See Example Report
            </Link>
            <Link
              href="/onboarding"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-sage-400 text-white rounded-xl font-medium hover:bg-sage-500 transition-colors"
            >
              Start Your Assessment
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-8 text-center text-sm text-stone-500">
          <p>
            Can't find what you're looking for?{' '}
            <a href="mailto:support@example.com" className="text-sage-600 hover:underline">
              Contact support
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-stone-200 bg-white mt-12">
        <div className="max-w-4xl mx-auto text-center text-sm text-stone-500">
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

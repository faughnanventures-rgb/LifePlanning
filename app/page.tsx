import Link from 'next/link'
import { Target, Clock, Compass, Brain, Users, AlertTriangle, ArrowRight, Briefcase, Heart, CheckCircle, User, LogIn } from 'lucide-react'
import { auth } from '@/auth'

export default async function Home() {
  const session = await auth()
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-sage-400 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-stone-700 text-lg">Life Strategy Planner</span>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link 
                  href="/account"
                  className="flex items-center gap-2 text-stone-600 hover:text-stone-800 text-sm"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{session.user?.name || 'Account'}</span>
                </Link>
                <Link 
                  href="/assess?mode=quick"
                  className="px-4 py-2 bg-sage-400 text-white rounded-lg text-sm font-medium hover:bg-sage-500"
                >
                  Continue →
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="flex items-center gap-1 text-stone-600 hover:text-stone-800 text-sm"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                <Link 
                  href="/register"
                  className="px-4 py-2 bg-sage-400 text-white rounded-lg text-sm font-medium hover:bg-sage-500"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-b from-white to-stone-50">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-800 mb-4 sm:mb-6 leading-tight">
            Clarity Through Guided Reflection
          </h1>
          <p className="text-lg sm:text-xl text-stone-600 mb-6 sm:mb-8 leading-relaxed">
            An AI-guided reflection and planning exercise to help you think clearly 
            about your life, priorities, and next steps.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Link
              href={session ? "/assess?mode=quick" : "/onboarding"}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-sage-400 text-white rounded-xl font-semibold hover:bg-sage-500 transition-colors text-center"
            >
              {session ? "Continue Assessment" : "Get Started Free"}
            </Link>
            <Link
              href="/example"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-stone-700 border border-stone-200 rounded-xl font-semibold hover:bg-stone-50 transition-colors text-center"
            >
              See Example Report
            </Link>
          </div>
          <p className="text-sm text-stone-500">
            No credit card required • 30-45 minutes for Quick Clarity
          </p>
        </div>
      </section>

      {/* What This Is Section */}
      <section className="py-12 px-6 bg-teal-50 border-y border-teal-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Brain className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-stone-700 mb-2">What This Is</h2>
              <p className="text-stone-600 mb-4">
                This is a <strong>self-guided reflection exercise</strong> powered by AI. Think of it as a 
                structured journaling session with an intelligent guide who asks good questions and helps 
                you organize your thoughts.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  <span className="text-stone-600">Works great as a solo exercise</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  <span className="text-stone-600">Even better with a coach or therapist</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  <span className="text-stone-600">Share your outputs with professionals</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  <span className="text-stone-600">Includes career exploration tools</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Disclaimer */}
      <section className="py-6 px-6 bg-amber-50 border-b border-amber-100">
        <div className="max-w-4xl mx-auto flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            <strong>Important:</strong> This is NOT therapy, counseling, or professional advice. 
            It is a reflection tool. If you are in crisis or struggling with mental health, please 
            reach out to a qualified professional. The AI can make mistakes.
          </p>
        </div>
      </section>

      {/* Choose Your Path */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-stone-800 mb-3">Choose Your Path</h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Start with whichever feels right. You can always upgrade from Quick to Full later - 
              your progress carries over.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Quick Assessment Card */}
            <div className="bg-white rounded-2xl border-2 border-stone-200 p-8 hover:border-sage-300 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-sage-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-700">Quick Clarity</h3>
                  <p className="text-sm text-stone-500">30-45 minutes</p>
                </div>
              </div>
              
              <p className="text-stone-600 mb-6">
                A focused session to get unstuck. Perfect when you need quick perspective 
                on what matters most right now.
              </p>
              
              <ul className="space-y-2 mb-6 text-sm text-stone-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-sage-400 rounded-full" />
                  4 focused conversations
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-sage-400 rounded-full" />
                  Identify 2-3 priorities
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-sage-400 rounded-full" />
                  Clear next steps
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-sage-400 rounded-full" />
                  Downloadable summary
                </li>
              </ul>
              
              <Link
                href="/assess?mode=quick"
                className="block w-full py-3 bg-sage-400 text-white rounded-xl font-semibold 
                         text-center hover:bg-sage-500 transition-colors"
              >
                Start Quick Session
              </Link>
            </div>

            {/* Full Assessment Card */}
            <div className="bg-white rounded-2xl border-2 border-teal-200 p-8 hover:border-teal-300 transition-colors relative overflow-hidden">
              <div className="absolute top-4 right-4 px-2 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded">
                Recommended
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                  <Compass className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-700">Full Strategic Plan</h3>
                  <p className="text-sm text-stone-500">2-3 hours</p>
                </div>
              </div>
              
              <p className="text-stone-600 mb-6">
                A comprehensive deep-dive. Best done in a quiet space where you can 
                really focus and reflect. Life-changing for many.
              </p>
              
              <ul className="space-y-2 mb-6 text-sm text-stone-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                  8 in-depth conversations
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                  Strategic pillars & goals
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                  <strong>Optional:</strong> Career exploration module
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                  Comprehensive strategic plan
                </li>
              </ul>
              
              <Link
                href="/assess?mode=full"
                className="block w-full py-3 bg-teal-600 text-white rounded-xl font-semibold 
                         text-center hover:bg-teal-700 transition-colors"
              >
                Start Full Assessment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Career Exploration Callout */}
      <section className="py-12 px-6 bg-stone-100">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 border border-stone-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-700 mb-2">
                  Navigating a Career Transition?
                </h3>
                <p className="text-stone-600 mb-4">
                  The Full Assessment includes an optional <strong>Career Exploration Module</strong> designed 
                  for people who are changing careers, recently laid off, or reconsidering their professional path.
                </p>
                <ul className="grid sm:grid-cols-2 gap-2 text-sm text-stone-600">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-3 h-3 text-amber-500" />
                    Clarify what you want (and don't want)
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-3 h-3 text-amber-500" />
                    Explore potential career paths
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-3 h-3 text-amber-500" />
                    Get resume and keyword suggestions
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-3 h-3 text-amber-500" />
                    Identify industries to explore
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-stone-800 text-center mb-12">How It Works</h2>
          
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-sage-600">1</span>
              </div>
              <h3 className="font-semibold text-stone-700 mb-2">Choose Your Mode</h3>
              <p className="text-sm text-stone-500">
                Quick for immediate clarity, Full for comprehensive planning.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-sage-600">2</span>
              </div>
              <h3 className="font-semibold text-stone-700 mb-2">Have Conversations</h3>
              <p className="text-sm text-stone-500">
                AI guides you through reflection questions. Answer honestly.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-sage-600">3</span>
              </div>
              <h3 className="font-semibold text-stone-700 mb-2">Get Your Plan</h3>
              <p className="text-sm text-stone-500">
                Receive a personalized strategic plan you can share with others.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coach/Therapist Section */}
      <section className="py-12 px-6 bg-sage-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="w-6 h-6 text-sage-600" />
            <Heart className="w-5 h-5 text-sage-500" />
          </div>
          <h2 className="text-xl font-bold text-stone-700 mb-3">
            Better With Support
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto mb-4">
            While this tool works great solo, the outputs become even more powerful when 
            shared with a coach, therapist, mentor, or trusted friend. They can help you 
            interpret your insights and hold you accountable.
          </p>
          <p className="text-sm text-stone-500">
            Consider scheduling a session with a professional to review your strategic plan together.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-stone-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-stone-300 mb-6 sm:mb-8">
            Find a quiet moment, grab a drink, and give yourself the gift of reflection.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href={session ? "/assess?mode=quick" : "/onboarding"}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-stone-800 rounded-xl font-semibold hover:bg-stone-100 transition-colors text-center"
            >
              Quick Session (30-45 min)
            </Link>
            <Link
              href={session ? "/assess?mode=full" : "/onboarding"}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-colors text-center"
            >
              Full Assessment (2-3 hrs)
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 bg-stone-100 border-t border-stone-200">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
            <div>
              <h4 className="font-semibold text-stone-700 mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-stone-500">
                <li><Link href="/onboarding" className="hover:text-stone-700">Get Started</Link></li>
                <li><Link href="/example" className="hover:text-stone-700">Example Report</Link></li>
                <li><Link href="/goals" className="hover:text-stone-700">Goals Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-stone-700 mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-stone-500">
                <li><Link href="/faq" className="hover:text-stone-700">FAQ</Link></li>
                <li><Link href="/share" className="hover:text-stone-700">Share with Pro</Link></li>
                <li><Link href="/status" className="hover:text-stone-700">System Status</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-stone-700 mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-stone-500">
                <li><Link href="/terms" className="hover:text-stone-700">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-stone-700">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-stone-700 mb-3">Account</h4>
              <ul className="space-y-2 text-sm text-stone-500">
                {session ? (
                  <>
                    <li><Link href="/account" className="hover:text-stone-700">Settings</Link></li>
                    <li><Link href="/assess" className="hover:text-stone-700">Assessment</Link></li>
                    <li><Link href="/report" className="hover:text-stone-700">My Report</Link></li>
                  </>
                ) : (
                  <>
                    <li><Link href="/login" className="hover:text-stone-700">Sign In</Link></li>
                    <li><Link href="/register" className="hover:text-stone-700">Create Account</Link></li>
                  </>
                )}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-stone-200 pt-6 text-center">
            <p className="text-sm text-stone-500 mb-3">
              This is an AI-powered reflection tool, not professional advice. 
              Always consult qualified professionals for important life decisions.
            </p>
            <p className="text-sm text-stone-400">© {new Date().getFullYear()} Life Strategy Planner</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

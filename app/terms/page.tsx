import Link from 'next/link'
import { Target, ArrowLeft, AlertTriangle } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service | Life Strategy Planner',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sage-400 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-stone-700">Life Strategy</span>
          </Link>
          <Link href="/" className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-stone-800 mb-8">Terms of Service</h1>
        
        <div className="prose prose-stone max-w-none space-y-6">
          <p className="text-sm text-stone-500">Last updated: January 2026</p>

          {/* Important Disclaimer Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 my-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-800 mb-2">Important: Not a Substitute for Professional Help</h3>
                <p className="text-amber-700 text-sm leading-relaxed">
                  Life Strategy Planner is an AI-powered reflection tool. It is <strong>NOT</strong> therapy, 
                  counseling, medical advice, financial advice, or any other form of professional service. 
                  The AI can make mistakes and may provide inaccurate information.
                </p>
              </div>
            </div>
          </div>

          <section>
            <h2 className="text-xl font-semibold text-stone-700 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-stone-600 leading-relaxed">
              By using Life Strategy Planner, you agree to these Terms of Service. If you do not agree, 
              please do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-700 mt-8 mb-4">2. Description of Service</h2>
            <p className="text-stone-600 leading-relaxed">
              Life Strategy Planner is an AI-powered tool designed to facilitate personal reflection 
              and planning. It provides guided conversations to help you think through your goals, 
              priorities, and life direction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-700 mt-8 mb-4">3. Mental Health Disclaimer</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm leading-relaxed">
                <strong>This service is NOT a replacement for mental health care.</strong> If you are 
                experiencing a mental health crisis, suicidal thoughts, or emotional distress, please 
                contact a mental health professional or crisis service immediately.
              </p>
              <div className="mt-4 text-sm text-red-700">
                <p className="font-medium mb-2">Crisis Resources:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>National Suicide Prevention Lifeline: 988 (US)</li>
                  <li>Crisis Text Line: Text HOME to 741741</li>
                  <li>International Association for Suicide Prevention: <a href="https://www.iasp.info/resources/Crisis_Centres/" className="underline" target="_blank" rel="noopener noreferrer">Crisis Centers</a></li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-700 mt-8 mb-4">4. AI Limitations</h2>
            <p className="text-stone-600 leading-relaxed mb-4">You acknowledge that:</p>
            <ul className="list-disc pl-6 text-stone-600 space-y-2">
              <li>The AI may provide inaccurate, incomplete, or inappropriate responses</li>
              <li>The AI does not know you personally and cannot fully understand your situation</li>
              <li>The AI cannot provide professional advice of any kind</li>
              <li>You should verify any important information independently</li>
              <li>Career suggestions are starting points for exploration, not definitive guidance</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-700 mt-8 mb-4">5. User Responsibilities</h2>
            <p className="text-stone-600 leading-relaxed mb-4">You agree to:</p>
            <ul className="list-disc pl-6 text-stone-600 space-y-2">
              <li>Use the service only for its intended purpose of personal reflection</li>
              <li>Not attempt to circumvent security measures or rate limits</li>
              <li>Not use the service to generate harmful, illegal, or abusive content</li>
              <li>Not share sensitive personal information (SSN, passwords, financial account numbers)</li>
              <li>Take responsibility for any decisions you make based on using this tool</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-700 mt-8 mb-4">6. Data and Privacy</h2>
            <p className="text-stone-600 leading-relaxed">
              Your use of the service is also governed by our <Link href="/privacy" className="text-sage-600 hover:underline">Privacy Policy</Link>. 
              Your conversation data is stored locally on your device and processed through third-party 
              AI services as described in the Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-700 mt-8 mb-4">7. Disclaimer of Warranties</h2>
            <p className="text-stone-600 leading-relaxed">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE 
              THAT THE SERVICE WILL BE AVAILABLE, ERROR-FREE, OR THAT THE AI RESPONSES WILL BE 
              ACCURATE, HELPFUL, OR APPROPRIATE FOR YOUR SITUATION.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-700 mt-8 mb-4">8. Limitation of Liability</h2>
            <p className="text-stone-600 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, 
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, 
              REVENUE, DATA, OR OPPORTUNITIES ARISING FROM YOUR USE OF THE SERVICE.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-700 mt-8 mb-4">9. Changes to Terms</h2>
            <p className="text-stone-600 leading-relaxed">
              We may modify these terms at any time. Continued use of the service after changes 
              constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-700 mt-8 mb-4">10. Contact</h2>
            <p className="text-stone-600 leading-relaxed">
              For questions about these terms, please reach out through our contact page or GitHub repository.
            </p>
          </section>
        </div>
      </main>

      <footer className="py-8 px-6 border-t border-stone-200 bg-stone-100 mt-12">
        <div className="max-w-3xl mx-auto text-center text-sm text-stone-500">
          <div className="flex justify-center gap-4 mb-4">
            <Link href="/terms" className="hover:text-stone-700">Terms of Service</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-stone-700">Privacy Policy</Link>
          </div>
          <p>© {new Date().getFullYear()} Life Strategy Planner</p>
        </div>
      </footer>
    </div>
  )
}

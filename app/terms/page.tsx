import Link from 'next/link'
import { Target, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service | Life Strategy Planner',
  description: 'Terms of Service for Life Strategy Planner',
}

export default function TermsPage() {
  const lastUpdated = 'January 2025'
  
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

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-stone-700 mb-2">Terms of Service</h1>
        <p className="text-stone-500 mb-8">Last updated: {lastUpdated}</p>

        <div className="space-y-8 text-stone-600">
          
          <section>
            <h2 className="text-xl font-semibold text-stone-700 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Life Strategy Planner (the &quot;Service&quot;), you agree to be bound by these 
              Terms of Service. If you do not agree to these terms, please do not use the Service.
            </p>
            <p className="mt-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
              <strong>Beta Notice:</strong> This Service is currently in beta testing. Features may change, 
              and the service may experience interruptions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-700 mb-3">2. Description of Service</h2>
            <p>
              Life Strategy Planner is an AI-powered tool that helps users create personal strategic plans 
              through guided conversations. The Service uses artificial intelligence to facilitate reflection 
              and planning.
            </p>
            <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">
                <strong>Important:</strong> This Service does NOT provide professional therapy, counseling, 
                medical advice, legal advice, or financial advice. The AI may make mistakes. Always consult 
                qualified professionals for important life decisions.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-700 mb-3">3. User Responsibilities</h2>
            <p>You agree to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
              <li>Use the Service only for personal, non-commercial purposes</li>
              <li>Not use the Service if you are in crisis or experiencing a mental health emergency</li>
              <li>Seek professional help for serious life decisions, mental health concerns, or emergencies</li>
              <li>Not attempt to circumvent any security features or rate limits</li>
              <li>Not use the Service in any way that violates applicable laws</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-700 mb-3">4. Data and Privacy</h2>
            <p>
              Your assessment data is stored locally in your browser using localStorage. We do not store 
              your conversation data on our servers. AI conversations are processed through Anthropic API 
              but are not permanently stored by us.
            </p>
            <p className="mt-2">
              For full details on data handling, please see our{' '}
              <Link href="/privacy" className="text-sage-600 hover:underline">Privacy Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-700 mb-3">5. Intellectual Property</h2>
            <p>
              The Service, including its design, features, and content, is owned by Life Strategy Planner. 
              You retain ownership of the personal information and content you provide. AI-generated reports 
              are provided for your personal use.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-700 mb-3">6. Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, 
              EXPRESS OR IMPLIED. We do not warrant that the Service will be uninterrupted, error-free, 
              or that AI-generated content will be accurate or suitable for your needs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-700 mb-3">7. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE. We are not 
              responsible for any decisions you make based on AI-generated content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-700 mb-3">8. Mental Health Disclaimer</h2>
            <p>
              This Service is not a substitute for professional mental health care. If you are experiencing 
              a mental health crisis, suicidal thoughts, or thoughts of self-harm, please contact emergency 
              services or a crisis helpline immediately:
            </p>
            <ul className="mt-3 space-y-2 ml-2">
              <li><strong>US:</strong> National Suicide Prevention Lifeline: 988</li>
              <li><strong>US:</strong> Crisis Text Line: Text HOME to 741741</li>
              <li><strong>International:</strong> Find your local helpline at <a href="https://www.iasp.info/resources/Crisis_Centres/" target="_blank" rel="noopener noreferrer" className="text-sage-600 hover:underline">IASP</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-700 mb-3">9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of significant 
              changes by updating the &quot;Last updated&quot; date. Continued use of the Service after changes 
              constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-700 mb-3">10. Contact</h2>
            <p>
              For questions about these Terms, please contact us through the{' '}
              <Link href="/advice" className="text-sage-600 hover:underline">Contact page</Link>.
            </p>
          </section>

        </div>

        {/* Related Links */}
        <div className="mt-12 pt-8 border-t border-stone-200">
          <h3 className="font-semibold text-stone-700 mb-4">Related</h3>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/privacy"
              className="text-sage-600 hover:text-sage-700 underline"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/"
              className="text-sage-600 hover:text-sage-700 underline"
            >
              Back to Home
            </Link>
          </div>
        </div>
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

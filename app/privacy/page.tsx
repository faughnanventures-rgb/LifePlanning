import Link from 'next/link'
import { Target, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy | Life Strategy Planner',
  description: 'Privacy policy and data handling practices for Life Strategy Planner',
}

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold text-stone-700 mb-2">Privacy Policy</h1>
        <p className="text-stone-500 mb-8">Last updated: {lastUpdated}</p>

        <div className="space-y-8 text-stone-600">
          
          <section>
            <h2 className="text-xl font-semibold text-stone-700 mb-3">Overview</h2>
            <p className="mb-3">
              Life Strategy Planner (&quot;we&quot;, &quot;our&quot;, or &quot;the Service&quot;) is committed to protecting 
              your privacy. This Privacy Policy explains how we collect, use, and safeguard your information.
            </p>
            <div className="bg-sage-50 border border-sage-200 rounded-lg p-4">
              <p className="text-sage-800 font-medium mb-2">The Short Version:</p>
              <ul className="text-sage-700 text-sm space-y-1">
                <li>✓ Your data is stored locally in your browser, not on our servers</li>
                <li>✓ We do not sell your data to anyone</li>
                <li>✓ You can delete all your data at any time</li>
                <li>✓ AI conversations are processed securely but not permanently stored</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-700 mb-3">Information We Collect</h2>
            
            <h3 className="text-lg font-medium text-stone-700 mt-4 mb-2">Information You Provide</h3>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Assessment Responses:</strong> Your answers during the strategic planning conversations</li>
              <li><strong>Background Documents:</strong> Any resume, DISC, or other information you paste into the tool</li>
              <li><strong>Contact Information:</strong> If you use our contact form, your name and email address</li>
            </ul>

            <h3 className="text-lg font-medium text-stone-700 mt-4 mb-2">Information Collected Automatically</h3>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Analytics Data:</strong> Basic usage statistics (pages visited, time spent) via Vercel Analytics</li>
              <li><strong>IP Address:</strong> Temporarily used for rate limiting to prevent abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-700 mb-3">How Your Data Is Stored</h2>
            
            <div className="bg-stone-100 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-stone-700 mb-2">Local Storage (Your Browser)</h3>
              <p className="text-sm text-stone-600 mb-2">
                The following data is stored only in your browser&apos;s local storage:
              </p>
              <ul className="text-sm text-stone-600 list-disc list-inside space-y-1">
                <li>Your assessment conversation history</li>
                <li>Your generated strategic plan</li>
                <li>Background documents you have added</li>
                <li>Your cookie consent preferences</li>
              </ul>
              <p className="text-sm text-stone-500 mt-2 italic">
                This data never leaves your device unless you explicitly share it (e.g., email your report).
              </p>
            </div>

            <div className="bg-stone-100 rounded-lg p-4">
              <h3 className="font-medium text-stone-700 mb-2">Our Servers</h3>
              <p className="text-sm text-stone-600 mb-2">
                We do NOT permanently store:
              </p>
              <ul className="text-sm text-stone-600 list-disc list-inside space-y-1">
                <li>Your assessment responses</li>
                <li>Your strategic plan</li>
                <li>Your personal information</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-700 mb-3">Third-Party Services</h2>
            <p className="mb-3">We use the following third-party services:</p>
            
            <div className="space-y-3">
              <div className="border border-stone-200 rounded-lg p-3">
                <h4 className="font-medium text-stone-700">Anthropic (Claude AI)</h4>
                <p className="text-sm text-stone-600">Processes your conversations to generate AI responses.</p>
              </div>
              
              <div className="border border-stone-200 rounded-lg p-3">
                <h4 className="font-medium text-stone-700">Vercel (Hosting & Analytics)</h4>
                <p className="text-sm text-stone-600">Hosts our website and provides anonymous analytics.</p>
              </div>
              
              <div className="border border-stone-200 rounded-lg p-3">
                <h4 className="font-medium text-stone-700">Resend (Email)</h4>
                <p className="text-sm text-stone-600">Delivers emails when you share your report.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-700 mb-3">Your Rights</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Access:</strong> View all data stored in your browser via developer tools</li>
              <li><strong>Delete:</strong> Clear all data using the &quot;Reset Progress&quot; button or clearing browser storage</li>
              <li><strong>Portability:</strong> Export your report via email or print</li>
              <li><strong>Opt-out:</strong> Decline analytics cookies via the cookie banner</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-700 mb-3">Children&apos;s Privacy</h2>
            <p>
              This Service is not intended for children under 13 years of age. We do not knowingly 
              collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-700 mb-3">Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact 
              us through the{' '}
              <Link href="/advice" className="text-sage-600 hover:text-sage-700 underline">
                Contact page
              </Link>.
            </p>
          </section>

        </div>

        {/* Related Links */}
        <div className="mt-12 pt-8 border-t border-stone-200">
          <h3 className="font-semibold text-stone-700 mb-4">Related</h3>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/terms"
              className="text-sage-600 hover:text-sage-700 underline"
            >
              Terms of Service
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

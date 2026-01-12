import Link from 'next/link'
import { Target, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy | Life Strategy Planner',
}

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold text-stone-800 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-stone max-w-none space-y-6">
          <p className="text-sm text-stone-500">Last updated: January 2026</p>

          <section>
            <h2 className="text-xl font-semibold text-stone-700 mt-8 mb-4">Overview</h2>
            <p className="text-stone-600 leading-relaxed">
              Life Strategy Planner is designed with privacy as a core principle. We minimize data collection 
              and store your personal information locally on your device whenever possible.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-700 mt-8 mb-4">Data We Collect</h2>
            
            <h3 className="text-lg font-medium text-stone-700 mt-6 mb-2">Data Stored Locally (Your Device)</h3>
            <ul className="list-disc pl-6 text-stone-600 space-y-2">
              <li>Your assessment conversations and responses</li>
              <li>Your generated strategic plan</li>
              <li>Resume text (if you choose to upload it)</li>
              <li>Your progress through the assessment</li>
            </ul>
            <p className="text-stone-600 mt-2">
              This data is stored in your browser&apos;s localStorage and never leaves your device 
              except when sent to the AI for processing.
            </p>

            <h3 className="text-lg font-medium text-stone-700 mt-6 mb-2">Data Processed by Our Servers</h3>
            <ul className="list-disc pl-6 text-stone-600 space-y-2">
              <li>Your messages when chatting with the AI (sent to Anthropic&apos;s Claude API)</li>
              <li>Your IP address (for rate limiting, not stored long-term)</li>
              <li>Basic analytics (page views, feature usage via Vercel Analytics)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-700 mt-8 mb-4">Third-Party Services</h2>
            <ul className="list-disc pl-6 text-stone-600 space-y-2">
              <li>
                <strong>Anthropic (Claude AI)</strong>: Processes your conversations. 
                See <a href="https://www.anthropic.com/privacy" className="text-sage-600 hover:underline" target="_blank" rel="noopener noreferrer">Anthropic&apos;s Privacy Policy</a>.
              </li>
              <li>
                <strong>Vercel</strong>: Hosts the application and provides analytics. 
                See <a href="https://vercel.com/legal/privacy-policy" className="text-sage-600 hover:underline" target="_blank" rel="noopener noreferrer">Vercel&apos;s Privacy Policy</a>.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-700 mt-8 mb-4">Data Retention</h2>
            <ul className="list-disc pl-6 text-stone-600 space-y-2">
              <li>Local data: Remains until you clear your browser data or click &quot;Reset Progress&quot;</li>
              <li>Server logs: Retained for up to 30 days for debugging</li>
              <li>Analytics: Aggregated, anonymized data retained indefinitely</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-700 mt-8 mb-4">Your Rights</h2>
            <p className="text-stone-600 leading-relaxed">
              You can delete all your local data at any time by clicking &quot;Reset Progress&quot; in the 
              assessment interface or by clearing your browser&apos;s localStorage for this site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-700 mt-8 mb-4">Security</h2>
            <p className="text-stone-600 leading-relaxed">
              We implement security measures including rate limiting, input validation, CSRF protection, 
              and secure headers. However, no system is perfectly secure. Please do not share highly 
              sensitive information (like social security numbers, passwords, or financial account details) 
              in your conversations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-700 mt-8 mb-4">Changes to This Policy</h2>
            <p className="text-stone-600 leading-relaxed">
              We may update this policy from time to time. Significant changes will be noted on this page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-700 mt-8 mb-4">Contact</h2>
            <p className="text-stone-600 leading-relaxed">
              For privacy-related questions, please reach out through our contact page or GitHub repository.
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

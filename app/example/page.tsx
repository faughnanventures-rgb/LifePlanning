import Link from 'next/link'
import { Target, ArrowRight, Download, Share2, FileText, Eye } from 'lucide-react'

export const metadata = {
  title: 'Example Report | Life Strategy Planner',
}

const EXAMPLE_REPORT = `# Life Strategy Plan

*Generated for: Sarah M.*  
*Date: January 2026*

---

## Executive Summary

Sarah is transitioning from a decade in corporate marketing to pursue her passion for wellness coaching while maintaining financial stability for her family. Her strategy centers on building a coaching practice part-time while keeping her day job, with a 2-year runway to full independence.

---

## Core Values

1. **Authenticity** - Being true to herself, not playing corporate games
2. **Family First** - Everything must work around her kids' needs
3. **Growth** - Constantly learning and evolving
4. **Impact** - Making a real difference in people's lives
5. **Freedom** - Control over her time and decisions

*Decision filter: "Does this align with my family's wellbeing AND move me toward coaching?"*

---

## Life Vision

*"I am a thriving wellness coach helping busy professionals find balance, while being present for my kids' school events and having summers off to travel as a family."*

**10-Year Picture:**
- Running a successful coaching practice (6-figure revenue)
- Working 25-30 hours/week
- Speaking at 2-3 conferences annually
- Published author of a wellness book
- Kids are thriving and feel supported

---

## Current Reality

**Strengths to Leverage:**
- 10 years of marketing experience (great for building coaching brand)
- Natural connector - large network
- Already certified as a health coach
- Supportive spouse with stable income

**Challenges to Address:**
- Exhausted from corporate job
- No time for self-care (ironic for a wellness coach)
- Imposter syndrome about coaching
- Fear of financial instability

---

## Strategic Pillars

### 1. 🌱 Build the Foundation
*Establish coaching practice infrastructure while employed*

### 2. 💪 Walk the Talk  
*Model the wellness lifestyle I want to teach*

### 3. 👨‍👩‍👧‍👦 Protect Family Time
*Non-negotiable boundaries around kids and marriage*

---

## Goals by Timeframe

### 1-Year Goals
- [ ] Sign 10 paying coaching clients
- [ ] Build email list to 500 subscribers
- [ ] Reduce corporate hours to 4 days/week
- [ ] Establish morning routine I actually keep

### 90-Day Goals
- [ ] Launch basic coaching website
- [ ] Sign 3 beta clients (discounted)
- [ ] Post on LinkedIn 2x/week about wellness
- [ ] Have "reduced hours" conversation with manager

### 30-Day Goals
- [ ] Buy domain name and set up simple website
- [ ] Reach out to 5 people for practice coaching sessions
- [ ] Block 6am-7am daily as sacred self-care time
- [ ] Tell 3 trusted friends about coaching plans

---

## Action Plan

### Daily Habits
- **6:00 AM** - 30 min workout or meditation (before kids wake)
- **7:00 PM** - 15 min planning for tomorrow
- **Ongoing** - Say "no" to any meeting without clear purpose

### Weekly Actions
- **Monday AM** - 1 hour of coaching business work
- **Wednesday** - LinkedIn post about wellness topic
- **Friday** - 30 min reviewing progress on goals

### Implementation Intentions
- *"When I feel imposter syndrome, I will remind myself that 3 people already said they'd pay me"*
- *"When asked to take on more at work, I will say 'let me check my capacity and get back to you'"*
- *"When I'm tempted to skip my morning routine, I will do just 10 minutes instead of zero"*

---

## Support System

**Key Relationships:**
- **Tom (husband)** - Weekly strategy check-ins, he manages finances
- **Maria (former colleague)** - Accountability partner, also starting a business
- **Dr. Chen** - Therapist for imposter syndrome work

**To Spend More Time With:**
- Other coaches and entrepreneurs (join local group)
- Clients and potential clients

**To Set Boundaries With:**
- Boss (no more "quick calls" after 5pm)
- Mom (limit advice-giving conversations)

---

## Potential Obstacles & Solutions

| Obstacle | Pre-Planned Response |
|----------|---------------------|
| Imposter syndrome | Review client testimonials; call Maria |
| Manager says no to reduced hours | Have backup plan: different department or company |
| Kids get sick, everything derails | Grace period built in; adjust weekly goals, not quit |

---

## Success Metrics

**I'm on track if:**
- I'm keeping my morning routine 5+ days/week
- I have at least 2 coaching conversations/week
- I haven't missed a kid event for work in 30 days
- My energy is higher than last month

**Warning signs to watch:**
- Skipping workouts 3+ days in a row
- Saying yes to extra work projects
- Snapping at kids more than usual
- Avoiding looking at coaching business tasks

---

## Review Schedule

**30-Day Check-in:**
- Am I doing my daily habits?
- What's working? What's not?
- Do goals need adjusting?

**90-Day Review:**
- Progress against goals?
- Are my pillars still the right focus?
- What did I learn about myself?

**Annual Reflection:**
- Did I live my values this year?
- Am I closer to my vision?
- What's the strategy for next year?

---

*This plan is a living document. Review and update it regularly. Plans change - that's healthy.*
`

export default function ExamplePage() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sage-400 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-stone-700">Life Strategy</span>
          </Link>
          <Link
            href="/onboarding"
            className="flex items-center gap-1 px-4 py-2 bg-sage-400 text-white rounded-lg text-sm font-medium hover:bg-sage-500"
          >
            Create Yours
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-white to-stone-50 py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
            <Eye className="w-4 h-4" />
            Example Report
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-stone-800 mb-4">
            See What You'll Get
          </h1>
          <p className="text-stone-600 max-w-xl mx-auto">
            Here's an example of the personalized strategic plan you'll receive after completing 
            your assessment. Your report will be tailored to your unique situation.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-6 px-4 sm:px-6 border-b border-stone-200 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm">
            {[
              { icon: FileText, label: 'Comprehensive Plan' },
              { icon: Download, label: 'Downloadable PDF' },
              { icon: Share2, label: 'Shareable with Coach' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-stone-600">
                <Icon className="w-4 h-4 text-sage-500" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Report Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          {/* Report Header */}
          <div className="bg-gradient-to-r from-sage-50 to-teal-50 px-6 sm:px-8 py-6 border-b border-stone-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-stone-500 mb-1">Example Report</p>
                <h2 className="text-xl font-bold text-stone-800">Sarah's Life Strategy Plan</h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-500 bg-white px-3 py-1.5 rounded-full border border-stone-200">
                <FileText className="w-3 h-3" />
                ~10 minute read
              </div>
            </div>
          </div>

          {/* Report Body */}
          <div className="px-6 sm:px-8 py-6 sm:py-8">
            <div 
              className="prose prose-stone max-w-none
                         prose-headings:font-bold prose-headings:text-stone-800
                         prose-h1:text-2xl prose-h1:border-b prose-h1:pb-4 prose-h1:mb-6
                         prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4
                         prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
                         prose-p:text-stone-600 prose-p:leading-relaxed
                         prose-li:text-stone-600
                         prose-strong:text-stone-800
                         prose-table:text-sm
                         prose-th:bg-stone-50 prose-th:px-4 prose-th:py-2
                         prose-td:px-4 prose-td:py-2 prose-td:border-t"
              dangerouslySetInnerHTML={{ 
                __html: EXAMPLE_REPORT
                  .replace(/^# (.+)$/gm, '<h1>$1</h1>')
                  .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                  .replace(/^### (.+)$/gm, '<h3>$1</h3>')
                  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.+?)\*/g, '<em>$1</em>')
                  .replace(/^- \[ \] (.+)$/gm, '<div class="flex items-start gap-2 my-1"><span class="w-4 h-4 border border-stone-300 rounded mt-1 flex-shrink-0"></span><span>$1</span></div>')
                  .replace(/^- (.+)$/gm, '<li>$1</li>')
                  .replace(/^\| (.+) \|$/gm, (match: string) => {
                    const cells = match.slice(1, -1).split('|').map((c: string) => c.trim())
                    if (cells.every((c: string) => c.match(/^-+$/))) return ''
                    const tag = cells[0].includes('Obstacle') ? 'th' : 'td'
                    return `<tr>${cells.map((c: string) => `<${tag}>${c}</${tag}>`).join('')}</tr>`
                  })
                  .replace(/\n\n/g, '</p><p>')
                  .replace(/---/g, '<hr class="my-8 border-stone-200">')
              }}
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 bg-gradient-to-br from-sage-400 to-teal-500 rounded-2xl p-6 sm:p-8 text-center text-white">
          <h3 className="text-xl sm:text-2xl font-bold mb-3">
            Ready to Create Your Own Plan?
          </h3>
          <p className="text-white/90 mb-6 max-w-md mx-auto">
            Your personalized report will be based on your unique values, goals, and life situation.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 bg-white text-sage-700 rounded-xl font-semibold hover:bg-stone-50 transition-colors"
          >
            Start Your Assessment
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-stone-200 bg-white">
        <div className="max-w-4xl mx-auto text-center text-sm text-stone-500">
          <div className="flex justify-center gap-4 mb-4">
            <Link href="/terms" className="hover:text-stone-700">Terms</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-stone-700">Privacy</Link>
            <span>•</span>
            <Link href="/faq" className="hover:text-stone-700">FAQ</Link>
          </div>
          <p>© {new Date().getFullYear()} Life Strategy Planner</p>
        </div>
      </footer>
    </div>
  )
}

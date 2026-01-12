# Life Strategy Planner

AI-guided reflection and planning for your life and career.

## Features

### Core Assessment
- **Values Discovery** - Uncover what truly matters through guided questions
- **Life Vision** - Define your "North Star" for decision-making  
- **Strategic Pillars** - Identify 2-3 core focus areas
- **Goal Setting** - Set specific goals at multiple timeframes (30-day, 90-day, 1-year)
- **Action Planning** - Convert goals into daily habits

### Physical Wellness & Self-Care
- **Wellness Assessment** - Exercise habits, desk time, sleep, stress levels
- **Movement Recommendations** - Personalized based on lifestyle and constraints
- **Mindfulness Suggestions** - Matched to personality (active, analytical, creative)
- **Nature Connection** - Ideas for outdoor time based on environment
- **Hobby Recommendations** - Aligned with values (creativity, connection, achievement, peace)

### Career & Upskilling
- **Career Direction** - Explore paths based on strengths and interests
- **Skill Gap Analysis** - Identify what to learn for target roles
- **Learning Resources** - Specific courses, books, podcasts, communities
- **Learning by Doing** - Side projects, volunteer work, portfolio ideas
- **90-Day Learning Plan** - Week-by-week milestones

### Two Assessment Modes
- **Quick Clarity** (35-50 min): 6 focused conversations including wellness
- **Full Assessment** (2.5-3.5 hrs): 11 in-depth conversations with career & upskilling

### Engagement Features
- **Onboarding Flow** - Guided introduction for new users
- **Progress Celebrations** - Confetti and milestones as you complete phases
- **Goals Dashboard** - Track goals and daily actions with streaks
- **Example Report** - Preview what you'll get before starting

### Professional Integration
- **Share with Pro** - Easy sharing with coaches, therapists, mentors
- **Downloadable Reports** - Export as HTML/PDF
- **Progress Tracking** - Visual progress indicators

## Security & Compliance

### Authentication & Authorization
- Email/password authentication (NextAuth v5)
- Secure JWT sessions
- Per-user usage tracking and limits (50 requests/day)

### Privacy & GDPR
- Cookie consent banner
- Data export (download your data as JSON)
- Account deletion (right to erasure)
- Privacy policy and terms of service

### Security Headers
- Content Security Policy (CSP)
- CSRF protection
- Input validation with Zod schemas
- Rate limiting (Upstash Redis)

### Observability
- Error alerting (Slack, Discord, Email)
- Status page
- Health check endpoint

## Pages

| Page | Description |
|------|-------------|
| `/` | Landing page with features |
| `/onboarding` | First-time user flow |
| `/assess` | Main assessment interface |
| `/report` | Generated strategic plan |
| `/goals` | Goals & actions dashboard |
| `/example` | Example report preview |
| `/faq` | Frequently asked questions |
| `/share` | Share with professionals |
| `/account` | User settings & usage |
| `/status` | System health status |
| `/login` | Sign in |
| `/register` | Create account |
| `/forgot-password` | Request password reset |
| `/reset-password` | Set new password |

## Setup

1. Clone and install:
   ```bash
   npm install
   ```

2. Create `.env.local`:
   ```env
   # Required
   ANTHROPIC_API_KEY=sk-ant-xxxxx
   AUTH_SECRET=xxxxx  # Generate: openssl rand -base64 32
   
   # Recommended
   UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
   UPSTASH_REDIS_REST_TOKEN=xxxxx
   
   # Optional (Alerts)
   SLACK_WEBHOOK_URL=https://hooks.slack.com/...
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
   ALERT_EMAIL=alerts@yourdomain.com
   RESEND_API_KEY=re_xxxxx
   ```

3. Run:
   ```bash
   npm run dev
   ```

4. Run tests:
   ```bash
   npm test
   ```

## Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- NextAuth v5
- Anthropic Claude API
- Upstash Redis
- Vercel Analytics
- Vitest

## Version

0.8.0

# Life Strategy Planner

An AI-powered tool that helps you create a personal strategic plan through guided conversations.

## Features

- **8-Phase Assessment**: Structured conversations covering current state, energy, stability, pillars, tactics, goals, relationships, and reflection
- **AI-Guided Conversations**: Claude AI helps you dig deeper and think clearly
- **Strategic Report**: Generate a comprehensive strategic plan from your assessment
- **Goal Tracking**: Import goals from your report and track progress
- **Export Options**: Download as PDF, email to yourself, or print
- **Privacy-First**: Data stored locally in your browser

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **AI**: Anthropic Claude API
- **Email**: Resend
- **Rate Limiting**: Upstash Redis (optional, falls back to in-memory)
- **Analytics**: Vercel Analytics

## Getting Started

### Prerequisites

- Node.js 18+
- Anthropic API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
4. Add your Anthropic API key to `.env.local`
5. Run the development server:
   ```bash
   npm run dev
   ```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key |
| `RESEND_API_KEY` | No | For email features |
| `UPSTASH_REDIS_REST_URL` | No | For distributed rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | No | For distributed rate limiting |
| `NEXT_PUBLIC_APP_URL` | No | Your app URL for email links |

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Version

Current: v0.4.0 (Beta)

## License

All rights reserved.

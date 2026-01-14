# Personal Strategic Planning App - Phase 0

## Overview

This is the foundation phase establishing security infrastructure, authentication, and database setup for the Personal Strategic Planning application.

**Stack:**
- Next.js 14 (App Router)
- TypeScript 5
- Supabase (Auth + PostgreSQL)
- Tailwind CSS
- Vercel (Deployment)

---

## Prerequisites

Before starting, ensure you have:

- [ ] Node.js 18.17+ installed
- [ ] A Supabase account (free tier works)
- [ ] A Vercel account
- [ ] A GitHub account
- [ ] An Anthropic API key (for Phase 3, but configure now)

---

## Setup Instructions

### Step 1: Create GitHub Repository

```bash
# Create a new directory and initialize
mkdir personal-strategic-plan
cd personal-strategic-plan
git init
```

### Step 2: Copy Project Files

Copy all files from this phase0 package into your project directory, maintaining the folder structure.

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon key from Settings > API
3. Go to SQL Editor and run the contents of `supabase/schema.sql`
4. Go to SQL Editor and run the contents of `supabase/rls-policies.sql`

### Step 5: Configure Environment Variables

```bash
# Copy the example env file
cp .env.example .env.local
```

Edit `.env.local` with your actual values:

```env
# Supabase (from your Supabase dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Encryption (generate a secure 32-byte key)
ENCRYPTION_KEY=your-32-character-encryption-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

To generate a secure encryption key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 6: Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Step 7: Deploy to Vercel

1. Push to GitHub:
```bash
git add .
git commit -m "Phase 0: Foundation and security setup"
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com) and import your repository

3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ENCRYPTION_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel URL)

4. Deploy

---

## Project Structure

```
personal-strategic-plan/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   ├── callback/
│   │   │   └── route.ts
│   │   └── layout.tsx
│   ├── (protected)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   └── health/
│   │       └── route.ts
│   ├── error.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── alert.tsx
│   ├── auth/
│   │   ├── login-form.tsx
│   │   └── signup-form.tsx
│   ├── layout/
│   │   ├── header.tsx
│   │   └── footer.tsx
│   └── error-boundary.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   ├── middleware.ts
│   │   └── types.ts
│   ├── encryption.ts
│   ├── validations.ts
│   └── utils.ts
├── supabase/
│   ├── schema.sql
│   └── rls-policies.sql
├── types/
│   └── index.ts
├── middleware.ts
├── .env.example
├── .env.local (create this - not committed)
├── .gitignore
├── .eslintrc.json
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## Security Features Implemented

### Authentication
- [x] Supabase Auth with email/password
- [x] OAuth ready (Google, GitHub)
- [x] HTTP-only cookie sessions
- [x] PKCE flow for security
- [x] Email verification enabled

### Database Security
- [x] Row Level Security (RLS) on all tables
- [x] Users can only access their own data
- [x] Service role key server-side only

### Application Security
- [x] All sensitive routes protected by middleware
- [x] CSRF protection via Supabase
- [x] Security headers configured
- [x] Input validation with Zod
- [x] Application-layer encryption for sensitive fields

### Environment Security
- [x] Secrets in environment variables only
- [x] .env files gitignored
- [x] Different keys for dev/prod

---

## Verification Checklist

After setup, verify:

- [ ] Can create a new account
- [ ] Can log in with created account
- [ ] Cannot access /dashboard without login (redirects to /login)
- [ ] Can log out successfully
- [ ] Check Supabase dashboard shows user in auth.users
- [ ] Check browser devtools: no sensitive data in localStorage
- [ ] Check Network tab: no API keys in client requests

---

## Next Steps (Phase 1)

Once Phase 0 is verified:
1. Implement plan creation flow
2. Add Current State form components
3. Build Energy Audit module
4. Create Minimum Viable Stability inputs
5. Develop Strategic Pillars interface

---

## Troubleshooting

### "Invalid API key" error
- Verify NEXT_PUBLIC_SUPABASE_ANON_KEY is correct
- Check for trailing whitespace in .env.local

### Redirect loops on login
- Clear browser cookies
- Verify NEXT_PUBLIC_APP_URL matches your actual URL

### RLS policy errors
- Ensure you ran both SQL files in order
- Check Supabase logs for specific policy errors

### Build errors
- Run `npm run lint` to check for issues
- Ensure all imports are correct

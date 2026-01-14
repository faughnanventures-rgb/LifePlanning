# Complete Setup Instructions

## Overview

This document provides step-by-step instructions for setting up the Personal Strategic Planning application from scratch.

**Estimated Time**: 30-45 minutes

---

## Prerequisites

Before starting, ensure you have:

1. **Node.js 18.17 or higher**
   ```bash
   node --version  # Should show v18.17.0 or higher
   ```

2. **Git installed**
   ```bash
   git --version
   ```

3. **Accounts created** (free tiers work):
   - [GitHub](https://github.com) - Code repository
   - [Supabase](https://supabase.com) - Database & Auth
   - [Vercel](https://vercel.com) - Hosting
   - [Anthropic](https://console.anthropic.com) - AI (for Phase 3)

---

## Step 1: Create GitHub Repository

```bash
# 1. Create a new directory
mkdir personal-strategic-plan
cd personal-strategic-plan

# 2. Initialize git
git init

# 3. Create initial commit (after copying files)
git add .
git commit -m "Initial commit: Phase 0 foundation"
```

Then create a new repository on GitHub and push:

```bash
git remote add origin https://github.com/YOUR_USERNAME/personal-strategic-plan.git
git branch -M main
git push -u origin main
```

---

## Step 2: Copy Project Files

### Option A: Download and Extract

If you received these files as a zip:

1. Extract the zip file
2. Copy ALL contents into your `personal-strategic-plan` directory
3. Verify the folder structure matches the expected structure (see below)

### Option B: Manual File Creation

If copying file by file, ensure you create this exact structure:

```
personal-strategic-plan/
├── app/
│   ├── (auth)/
│   │   ├── actions.ts
│   │   ├── callback/
│   │   │   └── route.ts
│   │   ├── layout.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (protected)/
│   │   ├── dashboard/
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   └── health/
│   │       └── route.ts
│   ├── error.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── page.tsx
├── components/
│   ├── auth/
│   │   ├── login-form.tsx
│   │   └── signup-form.tsx
│   ├── error-boundary.tsx
│   ├── layout/
│   │   ├── footer.tsx
│   │   └── header.tsx
│   └── ui/
│       ├── alert.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── spinner.tsx
├── lib/
│   ├── __tests__/
│   │   ├── encryption.test.ts
│   │   ├── utils.test.ts
│   │   └── validations.test.ts
│   ├── encryption.ts
│   ├── rate-limit.ts
│   ├── security.ts
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── middleware.ts
│   │   ├── server.ts
│   │   └── types.ts
│   ├── utils.ts
│   └── validations.ts
├── supabase/
│   ├── rls-policies.sql
│   └── schema.sql
├── types/
│   └── index.ts
├── .env.example
├── .eslintrc.json
├── .gitignore
├── jest.config.ts
├── jest.setup.ts
├── middleware.ts
├── next.config.js
├── package.json
├── postcss.config.js
├── README.md
├── SECURITY_CHECKLIST.md
├── tailwind.config.ts
└── tsconfig.json
```

---

## Step 3: Install Dependencies

```bash
# Navigate to project directory
cd personal-strategic-plan

# Install all dependencies
npm install
```

This will install:
- Next.js 14
- React 18
- Supabase client libraries
- Tailwind CSS
- Zod (validation)
- TypeScript
- Testing libraries
- And other dependencies

---

## Step 4: Set Up Supabase

### 4.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in:
   - **Name**: `personal-strategic-plan`
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users
4. Click "Create new project" (takes 2-3 minutes)

### 4.2 Get API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Note these values (you'll need them in Step 5):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJ...` (safe for client)
   - **service_role key**: `eyJ...` (SECRET - server only!)

### 4.3 Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy the ENTIRE contents of `supabase/schema.sql`
4. Paste into the SQL editor
5. Click **Run** (should show "Success")

### 4.4 Run RLS Policies

1. Still in SQL Editor, click **New query**
2. Copy the ENTIRE contents of `supabase/rls-policies.sql`
3. Paste into the SQL editor
4. Click **Run** (should show "Success")

### 4.5 Verify Setup

1. Go to **Table Editor** in Supabase dashboard
2. You should see these tables:
   - profiles
   - plans
   - strengths
   - assets
   - constraints
   - energy_items
   - pillars

3. Click on any table → **RLS Policies** tab
4. Verify policies are listed (not empty)

### 4.6 Configure Auth Settings

1. Go to **Authentication** → **Providers**
2. Ensure **Email** is enabled
3. Go to **Authentication** → **URL Configuration**
4. Set **Site URL** to your production URL (can update later)
5. Add to **Redirect URLs**:
   - `http://localhost:3000/callback`
   - `https://your-app.vercel.app/callback` (add after Vercel setup)

---

## Step 5: Configure Environment Variables

### 5.1 Create Local Environment File

```bash
# Copy the example file
cp .env.example .env.local
```

### 5.2 Generate Encryption Key

```bash
# Run this command to generate a secure key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output (64 characters).

### 5.3 Fill In Values

Edit `.env.local` with your values:

```env
# Supabase (from Step 4.2)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key

# Encryption (from Step 5.2)
ENCRYPTION_KEY=your-64-character-hex-string

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Anthropic (get from console.anthropic.com - needed for Phase 3)
ANTHROPIC_API_KEY=sk-ant-...
```

**IMPORTANT**: 
- Never commit `.env.local` to git
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret
- Keep `ENCRYPTION_KEY` secret and backed up

---

## Step 6: Test Locally

### 6.1 Start Development Server

```bash
npm run dev
```

### 6.2 Verify Application

1. Open [http://localhost:3000](http://localhost:3000)
2. You should see the landing page
3. Click "Sign Up" and create a test account
4. Check your email for confirmation link
5. After confirming, you should be redirected to /dashboard

### 6.3 Run Tests

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Unit tests
npm run test

# All validation
npm run validate
```

All tests should pass.

### 6.4 Check Health Endpoint

Visit [http://localhost:3000/api/health](http://localhost:3000/api/health)

You should see:
```json
{
  "status": "healthy",
  "database": true,
  "env_supabase_url": true,
  "env_supabase_anon_key": true,
  "env_encryption_key": true,
  ...
}
```

---

## Step 7: Deploy to Vercel

### 7.1 Connect Repository

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### 7.2 Configure Environment Variables

Before deploying, add environment variables in Vercel:

1. In the project setup, expand "Environment Variables"
2. Add each variable:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | All |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | All |
| `ENCRYPTION_KEY` | `your-64-char-key` | All |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | Production |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Development |
| `ANTHROPIC_API_KEY` | `sk-ant-...` | All |

**CRITICAL**: Use a DIFFERENT `ENCRYPTION_KEY` for production than development!

### 7.3 Deploy

1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. Note your production URL: `https://your-app.vercel.app`

### 7.4 Update Supabase Redirect URLs

1. Go back to Supabase dashboard
2. **Authentication** → **URL Configuration**
3. Update **Site URL** to your Vercel URL
4. Add to **Redirect URLs**: `https://your-app.vercel.app/callback`

---

## Step 8: Verify Production Deployment

### 8.1 Test Authentication

1. Visit your Vercel URL
2. Create a new account (use different email than dev)
3. Verify email confirmation works
4. Verify login/logout works

### 8.2 Test Security

1. Try accessing `/dashboard` without logging in → should redirect to `/login`
2. Check browser DevTools:
   - Network tab: No API keys in requests
   - Application tab: No sensitive data in localStorage
3. Visit your health endpoint: `https://your-app.vercel.app/api/health`

### 8.3 Run Security Headers Check

Visit [securityheaders.com](https://securityheaders.com) and enter your URL.
You should get at least a "B" grade.

---

## Step 9: Set Up Monitoring (Optional but Recommended)

### Vercel Analytics
1. In Vercel dashboard, go to your project
2. Click "Analytics" tab
3. Enable Web Analytics

### Error Tracking
Consider adding:
- [Sentry](https://sentry.io) for error tracking
- [LogRocket](https://logrocket.com) for session replay

---

## Troubleshooting

### "Invalid API key" Error
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Check for extra whitespace
- Ensure key is from correct Supabase project

### "RLS Policy" Errors
- Verify you ran both SQL files in order
- Check Supabase logs: **Database** → **Logs**
- Ensure RLS is enabled on all tables

### Build Failures on Vercel
- Check build logs for specific error
- Run `npm run build` locally to reproduce
- Ensure all environment variables are set

### Email Not Sending
- Check Supabase email settings
- Verify email is not in spam
- Check Supabase logs for email errors

### Redirect Loops
- Clear browser cookies
- Verify `NEXT_PUBLIC_APP_URL` matches actual URL
- Check Supabase redirect URLs configuration

---

## Next Steps

Phase 0 is complete! You now have:

✅ Secure authentication system
✅ Database with row-level security
✅ Application-layer encryption
✅ Protected routes
✅ Production deployment

For **Phase 1** (Core Data Entry), you'll add:
- Plan creation workflow
- Current State forms
- Energy Audit module
- Strategic Pillars interface

---

## File Quick Reference

| File/Folder | Purpose |
|-------------|---------|
| `app/` | Next.js App Router pages and layouts |
| `components/` | Reusable React components |
| `lib/` | Utilities, Supabase clients, encryption |
| `supabase/` | Database schema and policies |
| `types/` | TypeScript type definitions |
| `middleware.ts` | Route protection |
| `.env.local` | Local environment variables (NOT committed) |

---

## Support

If you encounter issues:

1. Check this document's Troubleshooting section
2. Review `SECURITY_CHECKLIST.md` for security issues
3. Check Supabase and Vercel logs
4. Search Next.js and Supabase documentation

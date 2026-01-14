# Security Checklist

## Pre-Deployment Security Audit

Use this checklist before deploying to production. All items should be verified.

---

## 1. Authentication & Authorization

- [ ] **Supabase Auth configured correctly**
  - Email confirmation enabled in Supabase dashboard
  - Password requirements enforced (min 8 chars, mixed case, number)
  - Rate limiting enabled on auth endpoints

- [ ] **Session Management**
  - HTTP-only cookies used for session tokens
  - Secure flag set on cookies (HTTPS only)
  - SameSite=Lax or Strict configured
  - Session expiry configured (recommended: 1 hour access, 7 day refresh)

- [ ] **Protected Routes**
  - All /dashboard/* routes require authentication
  - All /plan/* routes require authentication  
  - All /api/* routes (except /api/health) verify authentication
  - Middleware redirects unauthenticated users to /login

---

## 2. Database Security

- [ ] **Row Level Security (RLS)**
  - RLS enabled on ALL tables (verify in Supabase dashboard)
  - Policies verified: users can only access their own data
  - No public access to any table without RLS
  - Test: User A cannot see User B's plans

- [ ] **Service Role Key**
  - NEVER exposed to client-side code
  - Only used in server-side operations
  - Stored in Vercel environment variables (not in code)

- [ ] **Connection Security**
  - SSL/TLS enforced for database connections
  - Connection pooling configured if needed

---

## 3. API Security

- [ ] **Input Validation**
  - All API inputs validated with Zod schemas
  - UUID parameters validated before database queries
  - String lengths limited to prevent DoS

- [ ] **Rate Limiting**
  - Auth endpoints: 5 requests/minute
  - AI endpoints: 20 requests/minute
  - Export endpoints: 3 requests/minute
  - General API: 60 requests/minute

- [ ] **Error Handling**
  - Internal errors never exposed to client
  - Consistent error response format
  - Errors logged server-side for debugging

---

## 4. Data Protection

- [ ] **Encryption**
  - ENCRYPTION_KEY is 64 hex characters (32 bytes)
  - Key stored only in environment variables
  - Key is different between development and production
  - Encrypted fields: context_prompt, enough_description, constraint descriptions, relationship names, reflection content

- [ ] **Sensitive Data**
  - No PII in logs
  - No sensitive data in error messages
  - No sensitive data in URL parameters

---

## 5. Environment & Configuration

- [ ] **Environment Variables**
  - All secrets in Vercel environment variables
  - Different values for development vs production
  - .env.local not committed to git
  - No secrets in next.config.js

- [ ] **Required Variables Set**
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY
  - ENCRYPTION_KEY
  - NEXT_PUBLIC_APP_URL
  - ANTHROPIC_API_KEY (for Phase 3)

---

## 6. HTTPS & Headers

- [ ] **HTTPS**
  - All traffic over HTTPS (Vercel enforces this)
  - HTTP redirects to HTTPS

- [ ] **Security Headers** (configured in next.config.js)
  - Strict-Transport-Security
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - X-XSS-Protection: 1; mode=block
  - Referrer-Policy: strict-origin-when-cross-origin
  - Content-Security-Policy configured

---

## 7. Dependencies

- [ ] **Package Security**
  - Run `npm audit` - no high/critical vulnerabilities
  - Dependencies up to date
  - No unnecessary dependencies

---

## 8. Logging & Monitoring

- [ ] **Security Events**
  - Failed login attempts logged
  - Rate limit violations logged
  - Unusual access patterns detectable

- [ ] **Error Tracking**
  - Server errors captured (but not sensitive data)
  - Client errors captured

---

## 9. Testing

- [ ] **Security Tests**
  - Cannot access other users' data (RLS test)
  - Invalid tokens rejected
  - Expired sessions handled correctly
  - Rate limits enforced

- [ ] **Validation Tests**
  - XSS payloads rejected
  - SQL injection patterns rejected
  - Invalid UUIDs rejected
  - Oversized inputs rejected

---

## 10. Documentation

- [ ] **Security Documentation**
  - Incident response plan documented
  - Key rotation procedure documented
  - Access control documented

---

## Verification Commands

```bash
# Check for npm vulnerabilities
npm audit

# Verify TypeScript compilation
npm run type-check

# Run linter
npm run lint

# Run tests
npm run test

# Full validation
npm run validate
```

---

## Post-Deployment Verification

After deploying to production:

1. [ ] Create a test account and verify email flow
2. [ ] Verify cannot access /dashboard without login
3. [ ] Verify data isolation between test accounts
4. [ ] Check browser DevTools for exposed secrets
5. [ ] Verify security headers at securityheaders.com
6. [ ] Run Lighthouse security audit
7. [ ] Test rate limiting on auth endpoints

---

## Incident Response

If a security issue is discovered:

1. Assess severity and scope
2. If data breach: notify affected users within 72 hours
3. Rotate compromised keys immediately
4. Document the incident
5. Implement fixes and additional controls
6. Post-incident review

---

## Regular Security Tasks

- **Weekly**: Check npm audit, review error logs
- **Monthly**: Review access logs, update dependencies
- **Quarterly**: Security audit, key rotation review
- **Annually**: Full penetration test, compliance review

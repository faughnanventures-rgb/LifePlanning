import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// ===========================================
// Health Check API Route
// ===========================================
// Used by monitoring services to verify app is running

export async function GET() {
  const checks: Record<string, boolean | string> = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? 'unknown',
  };

  // Check database connection
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('profiles').select('id').limit(1);
    checks.database = !error;
  } catch {
    checks.database = false;
  }

  // Check required environment variables (without exposing values)
  checks.env_supabase_url = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  checks.env_supabase_anon_key = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  checks.env_encryption_key = !!process.env.ENCRYPTION_KEY;

  // Determine overall health
  const isHealthy =
    checks.database === true &&
    checks.env_supabase_url === true &&
    checks.env_supabase_anon_key === true &&
    checks.env_encryption_key === true;

  return NextResponse.json(
    {
      ...checks,
      status: isHealthy ? 'healthy' : 'unhealthy',
    },
    {
      status: isHealthy ? 200 : 503,
    }
  );
}

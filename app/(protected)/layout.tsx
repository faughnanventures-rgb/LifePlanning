import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';

// ===========================================
// Protected Layout
// ===========================================
// Layout for all authenticated pages
// Redirects to login if not authenticated

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // This shouldn't happen due to middleware, but double-check
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} />
      <main className="flex-1">{children}</main>
    </div>
  );
}

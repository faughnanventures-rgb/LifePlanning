import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus, FileText } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatRelativeTime } from '@/lib/utils';

// ===========================================
// Dashboard Page
// ===========================================

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your strategic planning dashboard.',
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const supabase = await createClient();

  // Fetch user's plans
  const { data: plans, error } = await supabase
    .from('plans')
    .select('id, title, status, updated_at, created_at')
    .eq('user_id', user?.id)
    .order('updated_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching plans:', error);
  }

  const hasPlans = plans && plans.length > 0;

  return (
    <div className="container py-8">
      {/* Welcome Section */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here are your strategic plans.
          </p>
        </div>
        <Link href="/plan/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Plan
          </Button>
        </Link>
      </div>

      {/* Plans Grid */}
      {hasPlans ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Link key={plan.id} href={`/plan/${plan.id}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        plan.status === 'complete'
                          ? 'bg-green-100 text-green-700'
                          : plan.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {plan.status === 'in_progress'
                        ? 'In Progress'
                        : plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-1">{plan.title}</CardTitle>
                  <CardDescription>
                    Updated {formatRelativeTime(plan.updated_at)}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}

          {/* Create New Plan Card */}
          <Link href="/plan/new">
            <Card className="flex h-full min-h-[140px] items-center justify-center border-dashed transition-colors hover:border-primary hover:bg-muted/50">
              <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
                <Plus className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Create New Plan</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      ) : (
        /* Empty State */
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <div className="rounded-full bg-muted p-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="mt-4 text-xl font-semibold">No plans yet</h2>
          <p className="mt-2 max-w-sm text-muted-foreground">
            Start your strategic planning journey by creating your first plan.
          </p>
          <Link href="/plan/new" className="mt-6">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Plan
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}

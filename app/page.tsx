import Link from 'next/link';
import { ArrowRight, Shield, Target, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ===========================================
// Home Page (Public)
// ===========================================

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-primary" />
            <span className="font-semibold">Strategic Plan</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container flex flex-col items-center justify-center gap-6 pb-8 pt-16 text-center md:pt-24">
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Plan your life with{' '}
            <span className="text-primary">strategic clarity</span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
            A structured framework that helps you apply business planning rigor
            to your personal life. Perfect for navigating career transitions,
            major life changes, or simply getting unstuck.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                Start Your Plan
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="container py-16">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center gap-4 rounded-lg border p-6 text-center">
              <div className="rounded-full bg-primary/10 p-3">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Strategic Framework</h3>
              <p className="text-muted-foreground">
                A proven 8-phase process that guides you from current state
                analysis to actionable goals.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 rounded-lg border p-6 text-center">
              <div className="rounded-full bg-primary/10 p-3">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">AI-Assisted Insights</h3>
              <p className="text-muted-foreground">
                Get thoughtful questions and pattern recognition powered by AI
                that respects your intelligence.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 rounded-lg border p-6 text-center">
              <div className="rounded-full bg-primary/10 p-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Private & Secure</h3>
              <p className="text-muted-foreground">
                Your personal data is encrypted and protected. Only you can
                access your strategic plan.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t bg-muted/50">
          <div className="container flex flex-col items-center gap-6 py-16 text-center">
            <h2 className="text-3xl font-bold">Ready to get started?</h2>
            <p className="max-w-xl text-muted-foreground">
              Create your free account and start building your personal
              strategic plan today.
            </p>
            <Link href="/signup">
              <Button size="lg">Create Your Plan</Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Personal Strategic Plan. All rights
            reserved.
          </p>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

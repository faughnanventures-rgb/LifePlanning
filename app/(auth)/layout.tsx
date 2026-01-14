import Link from 'next/link';
import { Target } from 'lucide-react';

// ===========================================
// Auth Layout
// ===========================================
// Shared layout for login, signup, and other auth pages

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Simple header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-primary" />
            <span className="font-semibold">Strategic Plan</span>
          </Link>
        </div>
      </header>

      {/* Centered content */}
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {children}
        </div>
      </main>

      {/* Simple footer */}
      <footer className="border-t py-4">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Personal Strategic Plan
        </div>
      </footer>
    </div>
  );
}

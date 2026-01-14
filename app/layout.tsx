import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// ===========================================
// Root Layout
// ===========================================

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Personal Strategic Plan',
    template: '%s | Personal Strategic Plan',
  },
  description:
    'A structured framework for personal strategic planning. Apply business planning rigor to your life.',
  keywords: [
    'strategic planning',
    'personal development',
    'life planning',
    'goal setting',
    'career transition',
  ],
  authors: [{ name: 'Personal Strategic Plan' }],
  creator: 'Personal Strategic Plan',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Personal Strategic Plan',
    title: 'Personal Strategic Plan',
    description: 'Apply business planning rigor to your personal life.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Personal Strategic Plan',
    description: 'Apply business planning rigor to your personal life.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0369a1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

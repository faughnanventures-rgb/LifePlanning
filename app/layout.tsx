import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'
import { Providers } from '@/components/Providers'
import CookieConsent from '@/components/CookieConsent'

export const metadata: Metadata = {
  title: 'Life Strategy Planner',
  description: 'Build a strategic plan for your life with AI-guided conversations',
  keywords: ['life planning', 'strategic planning', 'goals', 'personal development'],
  authors: [{ name: 'Life Strategy Planner' }],
  openGraph: {
    title: 'Life Strategy Planner',
    description: 'Build a strategic plan for your life with AI-guided conversations',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-stone-50 text-stone-600 antialiased">
        <Providers>
          {children}
        </Providers>
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  )
}

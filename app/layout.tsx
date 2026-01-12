import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import Providers from '@/components/Providers'
import CookieConsent from '@/components/CookieConsent'
import BetaBanner from '@/components/BetaBanner'
import './globals.css'

export const metadata: Metadata = {
  title: 'Life Strategy Planner',
  description: 'AI-guided reflection and planning for your life and career',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-stone-50 text-stone-600 antialiased">
        <Providers>
          <BetaBanner />
          {children}
          <CookieConsent />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}

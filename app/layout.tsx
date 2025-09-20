import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import AnalyticsProvider from '@/components/AnalyticsProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Xova - Personalized Longevity Smoothies',
  description: 'Turn your mood into a scientifically-optimized smoothie recipe. Find nearby cafés or get custom orders delivered.',
  keywords: 'smoothie, longevity, personalized nutrition, health, wellness, Swiss',
  authors: [{ name: 'Xova Team' }],
  openGraph: {
    title: 'Xova - Personalized Longevity Smoothies',
    description: 'Turn your mood into a scientifically-optimized smoothie recipe.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
        <Toaster />
      </body>
    </html>
  )
}
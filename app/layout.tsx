import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LifeGenix - Personalized Longevity Smoothies',
  description: 'Turn your mood into a scientifically-optimized 3-layer smoothie recipe. Find nearby cafés or get custom orders delivered.',
  keywords: 'smoothie, longevity, personalized nutrition, health, wellness, Swiss',
  authors: [{ name: 'LifeGenix Team' }],
  openGraph: {
    title: 'LifeGenix - Personalized Longevity Smoothies',
    description: 'Turn your mood into a scientifically-optimized 3-layer smoothie recipe.',
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
        {children}
      </body>
    </html>
  )
}

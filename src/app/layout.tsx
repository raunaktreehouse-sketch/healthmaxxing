import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { AuthProvider } from '@/components/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Healthmaxxing - Science-Backed Self-Improvement',
  description: 'Join the community of people dedicated to optimizing their health, looks, and performance through evidence-based methods.',
  keywords: ['health', 'aesthetics', 'self-improvement', 'fitness', 'nutrition', 'skincare'],
  openGraph: {
    title: 'Healthmaxxing',
    description: 'Science-backed health and aesthetics community',
    url: 'https://healthmaxxing.org',
    siteName: 'Healthmaxxing',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="border-t border-zinc-800 py-8 px-4 text-center text-zinc-500 text-sm">
            <p>© 2025 Healthmaxxing.org — Science-backed self-improvement community</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}

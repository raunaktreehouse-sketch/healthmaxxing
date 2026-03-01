import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Providers } from "@/components/providers/Providers"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "HealthMaxxing — Science-Backed Health Optimization",
    template: "%s | HealthMaxxing"
  },
  description: "Join the HealthMaxxing community. Evidence-based discussions on health optimization, skincare, fitness, nutrition, and longevity.",
  keywords: ["health optimization", "maxxing", "skincare", "fitness", "longevity", "biohacking"],
  authors: [{ name: "HealthMaxxing Community" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://healthmaxxing.org",
    siteName: "HealthMaxxing",
    title: "HealthMaxxing — Science-Backed Health Optimization",
    description: "Evidence-based discussions on health optimization.",
  },
  twitter: {
    card: "summary_large_image",
    title: "HealthMaxxing",
    description: "Science-backed health optimization community",
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
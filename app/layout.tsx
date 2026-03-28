import type { Metadata } from 'next'
import { Quicksand, Amiri } from 'next/font/google'
import './globals.css'
import AppShell from '@/components/layout/AppShell'

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-quicksand',
})

const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-amiri',
})

export const metadata: Metadata = {
  title: 'Barakah Journey — 90-Day Planner',
  description: '90-day postpartum wellness tracker — track your spiritual, physical, and emotional recovery',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${quicksand.variable} ${amiri.variable}`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}

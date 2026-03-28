import type { Metadata } from 'next'
import { Quicksand, Amiri } from 'next/font/google'
import './globals.css'

const quicksand = Quicksand({ subsets: ['latin'], variable: '--font-quicksand', weight: ['500','600','700'] })
const amiri = Amiri({ subsets: ['arabic', 'latin'], variable: '--font-amiri', weight: ['400','700'] })

export const metadata: Metadata = {
  title: 'Barakah Basics',
  description: '90-day postpartum wellness tracker',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${quicksand.variable} ${amiri.variable} font-sans bg-gpaper dark:bg-gray-950 text-ink dark:text-gray-100 min-h-screen`}>
        {children}
      </body>
    </html>
  )
}

'use client'
import { useEffect, useState } from 'react'
import { lsGet, KEYS } from '@/lib/storage'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const cfg = lsGet<{ darkMode?: boolean } | null>(KEYS.config, null)
    if (cfg?.darkMode) {
      document.documentElement.classList.add('dark')
      setDarkMode(true)
    }
  }, [])

  const toggleDark = () => {
    const next = !darkMode
    setDarkMode(next)
    document.documentElement.classList.toggle('dark', next)
    const cfg = lsGet<Record<string, unknown>>(KEYS.config, {})
    if (cfg) {
      cfg.darkMode = next
      localStorage.setItem(KEYS.config, JSON.stringify(cfg))
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar darkMode={darkMode} onToggleDark={toggleDark} />
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-60 pb-20 md:pb-6 min-w-0">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  )
}

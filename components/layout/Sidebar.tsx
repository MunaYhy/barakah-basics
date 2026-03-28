'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/daily',    icon: '📋', label: 'Daily' },
  { href: '/selfcare', icon: '💆', label: 'Self-Care' },
  { href: '/weight',   icon: '⚖️', label: 'Weight' },
  { href: '/weekly',   icon: '📊', label: 'Weekly' },
  { href: '/rewards',  icon: '🎁', label: 'Rewards' },
  { href: '/rules',    icon: '📜', label: 'Rules' },
  { href: '/report',   icon: '📈', label: 'Report' },
]

type Props = { darkMode: boolean; onToggleDark: () => void }

export default function Sidebar({ darkMode, onToggleDark }: Props) {
  const path = usePathname()

  return (
    <aside className="fixed top-0 left-0 h-full w-60 bg-white dark:bg-gray-900 border-r border-line dark:border-gray-800 flex flex-col z-40">
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <div className="font-amiri text-sm text-gdot dark:text-gl mb-1 text-center" dir="rtl">
          بِسْمِ اللَّهِ
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <div>
            <div className="font-extrabold text-gd dark:text-gl text-base leading-tight">Barakah Journey</div>
            <div className="text-xs text-inks dark:text-gray-500 font-semibold">90-Day Planner</div>
          </div>
        </div>
      </div>

      {/* Progress teaser */}
      <div className="mx-4 mb-4 bg-gp dark:bg-gray-800 rounded-xl p-3">
        <ProgressTeaser />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {NAV.map(n => (
          <Link key={n.href} href={n.href}
            className={`nav-item ${path.startsWith(n.href) ? 'active' : ''}`}>
            <span className="text-lg w-6 text-center">{n.icon}</span>
            <span>{n.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-line dark:border-gray-800 space-y-1">
        <button onClick={onToggleDark}
          className="nav-item w-full text-left">
          <span className="text-lg w-6 text-center">{darkMode ? '☀️' : '🌙'}</span>
          <span>{darkMode ? 'Light mode' : 'Dark mode'}</span>
        </button>
      </div>
    </aside>
  )
}

function ProgressTeaser() {
  if (typeof window === 'undefined') return null
  const cfg = (() => { try { return JSON.parse(localStorage.getItem('bj_config') || 'null') } catch { return null } })()
  if (!cfg) return <div className="text-xs text-inks dark:text-gray-500 font-semibold">Set up your journey →</div>
  const start = new Date(cfg.startDate); start.setHours(0,0,0,0)
  const now = new Date(); now.setHours(0,0,0,0)
  const day = Math.min(Math.max(Math.round((now.getTime()-start.getTime())/86400000)+1,1),90)
  const pct = Math.round((day/90)*100)
  return (
    <div>
      <div className="flex justify-between text-xs font-extrabold text-gd dark:text-gl mb-1.5">
        <span>Day {day} of 90</span><span>{pct}%</span>
      </div>
      <div className="h-2 bg-white/60 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="progress-bar-fill h-full" style={{width:`${pct}%`}}/>
      </div>
    </div>
  )
}

'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/daily',    icon: '📋', label: 'Daily' },
  { href: '/selfcare', icon: '💆', label: 'Care' },
  { href: '/weight',   icon: '⚖️', label: 'Weight' },
  { href: '/weekly',   icon: '📊', label: 'Weekly' },
  { href: '/rewards',  icon: '🎁', label: 'More' },
]

export default function BottomNav() {
  const path = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-line dark:border-gray-800 z-40 flex">
      {NAV.map(n => {
        const active = path.startsWith(n.href)
        return (
          <Link key={n.href} href={n.href}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs font-bold transition-colors
              ${active ? 'text-gd dark:text-gl' : 'text-inks/60 dark:text-gray-500'}`}>
            <span className="text-xl leading-none">{n.icon}</span>
            <span>{n.label}</span>
            {active && <div className="absolute bottom-0 w-8 h-0.5 bg-gm dark:bg-gl rounded-full"/>}
          </Link>
        )
      })}
    </nav>
  )
}

'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { dateKey, streakCount } from '@/lib/dates'

interface LogRow {
  date: string
  ate: boolean
  vitamins: boolean
  moved: boolean
  water_cups: number
}

export default function ProgressPage() {
  const router = useRouter()
  const [logs, setLogs] = useState<LogRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const uid = session?.user.id
      if (!uid) return router.replace('/onboarding')

      const { data: prof } = await supabase.from('profiles').select('id').eq('anon_id', uid).single()
      if (!prof) return router.replace('/onboarding')

      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
      const from = sevenDaysAgo.toISOString().slice(0, 10)

      const { data } = await supabase
        .from('daily_logs')
        .select('date, ate, vitamins, moved, water_cups')
        .eq('user_id', prof.id)
        .gte('date', from)
        .order('date', { ascending: true })

      setLogs(data ?? [])
      setLoading(false)
    }
    load()
  }, [router])

  const streak = streakCount(logs)

  // Build 7-day grid
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const key = dateKey(d)
    const log = logs.find(l => l.date === key)
    return { key, label: d.toLocaleDateString('en-GB', { weekday: 'short' }), log }
  })

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-gm font-bold animate-pulse">Loading...</p></div>
  }

  return (
    <div className="min-h-screen bg-gpaper dark:bg-gray-950 p-4">
      <div className="max-w-sm mx-auto">

        <button onClick={() => router.back()} className="text-sm text-gm dark:text-gl font-bold mb-4 block">
          ← Back
        </button>

        {/* Streak */}
        <div className="bg-gradient-to-br from-gd to-gm rounded-3xl p-6 text-white text-center mb-4">
          <p className="text-5xl font-extrabold">{streak}</p>
          <p className="font-bold text-sm opacity-80 mt-1">day streak 🔥</p>
          <p className="text-xs opacity-60 mt-1">All 4 habits completed in a row</p>
        </div>

        {/* 7-day grid */}
        <div className="card p-4">
          <h2 className="font-extrabold text-gd dark:text-gl text-sm uppercase tracking-wide mb-4">Last 7 Days</h2>
          <div className="grid grid-cols-7 gap-1">
            {days.map(({ key, label, log }) => (
              <div key={key} className="text-center">
                <p className="text-xs text-inks dark:text-gray-500 font-semibold mb-2">{label}</p>
                <div className="space-y-1">
                  {[
                    { done: !!log && log.water_cups >= 8, emoji: '💧' },
                    { done: !!log?.ate, emoji: '🍽️' },
                    { done: !!log?.vitamins, emoji: '💊' },
                    { done: !!log?.moved, emoji: '🚶' },
                  ].map((h, i) => (
                    <div key={i} className={`w-full aspect-square rounded-full text-center text-xs flex items-center justify-center
                      ${h.done ? 'bg-gm text-white' : 'bg-line dark:bg-gray-800 text-transparent'}`}>
                      {h.done ? h.emoji : '·'}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-3 text-xs text-inks dark:text-gray-500 font-semibold">
            <span>💧 Water</span><span>🍽️ Ate</span><span>💊 Vitamins</span><span>🚶 Moved</span>
          </div>
        </div>

      </div>
    </div>
  )
}

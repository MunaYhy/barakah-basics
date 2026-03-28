'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore, type WeekReview } from '@/hooks/useStore'
import { dayNumber, weekNumber, weekRange } from '@/lib/dates'

const STAR_LABELS = ['', 'Tough week 💪', 'Some wins 🌱', 'Good week 🌿', 'Great week ✨', 'Amazing week 🌟']

export default function WeeklyPage() {
  const router = useRouter()
  const store = useStore()
  const [week, setWeek] = useState(1)

  useEffect(() => {
    if (store.hydrated && !store.config) router.replace('/onboarding')
    if (store.config) {
      const start = new Date(store.config.startDate)
      const dayNum = dayNumber(start, new Date())
      setWeek(weekNumber(dayNum))
    }
  }, [store.hydrated, store.config, router])

  if (!store.hydrated || !store.config) return null

  const start = new Date(store.config.startDate)
  const wr: WeekReview = store.weekly[week] ?? { stars: 0, well: '', impr: '', focus: '', quote: '' }
  const range = weekRange(start, week)

  const save = (updates: Partial<WeekReview>) => {
    store.saveWeekly(week, { ...wr, ...updates })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-r from-gd to-gm text-white px-4 pt-5 pb-4 md:px-8">
        <h1 className="font-extrabold text-xl">📊 Weekly Review</h1>
        <p className="text-xs opacity-75 font-semibold mt-1">{range}</p>
      </div>

      <div className="px-4 py-4 space-y-3 md:px-8">

        {/* Week selector */}
        <div className="card p-3 flex items-center gap-3">
          <button onClick={() => setWeek(w => Math.max(1, w - 1))}
            className="w-8 h-8 rounded-full bg-gp dark:bg-gray-800 flex items-center justify-center font-bold text-gd dark:text-gl hover:bg-gl/30 transition-colors">◀</button>
          <div className="flex-1 text-center">
            <div className="font-extrabold text-gd dark:text-gl">Week {week} of 13</div>
            <div className="text-xs text-inks dark:text-gray-400 font-semibold">{range}</div>
          </div>
          <button onClick={() => setWeek(w => Math.min(13, w + 1))}
            className="w-8 h-8 rounded-full bg-gp dark:bg-gray-800 flex items-center justify-center font-bold text-gd dark:text-gl hover:bg-gl/30 transition-colors">▶</button>
        </div>

        {/* Star rating */}
        <div className="sec-card">
          <div className="sec-label">⭐ Overall Week Rating</div>
          <div className="flex gap-2 mb-2 justify-center">
            {[1, 2, 3, 4, 5].map(s => (
              <button key={s} onClick={() => save({ stars: s })}
                className={`star-btn ${s <= wr.stars ? 'text-gold' : 'text-gray-300 dark:text-gray-700'}`}>
                ★
              </button>
            ))}
          </div>
          {wr.stars > 0 && (
            <div className="text-center text-sm font-bold text-inks dark:text-gray-300">{STAR_LABELS[wr.stars]}</div>
          )}
        </div>

        {/* What went well */}
        <div className="sec-card">
          <div className="sec-label">💪 What went well this week?</div>
          <textarea value={wr.well} onChange={e => save({ well: e.target.value })}
            placeholder="Habits I kept, wins, moments I'm proud of…"
            rows={3} className="inp resize-none"
          />
        </div>

        {/* Improve */}
        <div className="sec-card">
          <div className="sec-label">🔧 What can I improve next week?</div>
          <textarea value={wr.impr} onChange={e => save({ impr: e.target.value })}
            placeholder="Habits I struggled with, what to do differently…"
            rows={3} className="inp resize-none"
          />
        </div>

        {/* Focus */}
        <div className="sec-card">
          <div className="sec-label">🎯 My focus for next week</div>
          <textarea value={wr.focus} onChange={e => save({ focus: e.target.value })}
            placeholder="One main intention or goal for next week…"
            rows={2} className="inp resize-none"
          />
        </div>

        {/* Quote */}
        <div className="sec-card">
          <div className="sec-label">📖 Quote I reflected on this week</div>
          <textarea value={wr.quote} onChange={e => save({ quote: e.target.value })}
            placeholder="A quote or verse that meant something to you this week…"
            rows={2} className="inp resize-none"
          />
        </div>

        <div className="text-center">
          <div className="text-xs text-inks dark:text-gray-500 font-semibold">
            ✅ Changes auto-save as you type
          </div>
        </div>

      </div>
    </div>
  )
}

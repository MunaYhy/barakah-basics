'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore, type RewardData } from '@/hooks/useStore'
import { REWARD_IDEAS } from '@/lib/data'
import { dayNumber, weekNumber, weekRange } from '@/lib/dates'

export default function RewardsPage() {
  const router = useRouter()
  const store = useStore()
  const [currentWeek, setCurrentWeek] = useState(1)

  useEffect(() => {
    if (store.hydrated && !store.config) router.replace('/onboarding')
    if (store.config) {
      const start = new Date(store.config.startDate)
      setCurrentWeek(weekNumber(dayNumber(start, new Date())))
    }
  }, [store.hydrated, store.config, router])

  if (!store.hydrated || !store.config) return null
  const start = new Date(store.config.startDate)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-r from-gd to-gm text-white px-4 pt-5 pb-4 md:px-8">
        <h1 className="font-extrabold text-xl">🎁 Weekly Reward System</h1>
        <p className="text-xs opacity-75 font-semibold mt-1">You earned every single one. Celebrate yourself! 🌟</p>
      </div>

      <div className="px-4 py-4 space-y-3 md:px-8">
        {Array.from({ length: 13 }).map((_, i) => {
          const week = i + 1
          const unlocked = week <= currentWeek
          const rw: RewardData = store.rewards[week] ?? { selectedTag: '', custom: '', done: false }
          const range = weekRange(start, week)

          return (
            <div key={week} className={`card border-l-4 p-4 transition-all ${
              rw.done ? 'border-l-gm bg-gp/50 dark:bg-gd/10' :
              unlocked ? 'border-l-gold' : 'border-l-line dark:border-l-gray-700 opacity-60'
            }`}>
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold
                  ${rw.done ? 'bg-gm text-white' : unlocked ? 'bg-gold text-white' : 'bg-line dark:bg-gray-700 text-inks dark:text-gray-500'}`}>
                  {week}
                </div>
                <div className="flex-1">
                  <div className="font-extrabold text-sm text-gd dark:text-gl">Week {week}</div>
                  <div className="text-xs text-inks dark:text-gray-400 font-semibold">{range}</div>
                </div>
                {!unlocked && <span className="text-xs font-bold text-inks dark:text-gray-500">🔒 Locked</span>}
                {unlocked && !rw.done && <span className="text-xs font-bold text-gold">⭐ Unlocked!</span>}
                {rw.done && <span className="text-xs font-bold text-gm dark:text-gl">✅ Claimed</span>}
              </div>

              {unlocked && (
                <>
                  {/* Reward tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {REWARD_IDEAS.map(idea => (
                      <button key={idea}
                        onClick={() => store.saveReward(week, { ...rw, selectedTag: rw.selectedTag === idea ? '' : idea })}
                        className={`tag-chip ${rw.selectedTag === idea ? 'selected' : ''}`}>
                        {idea}
                      </button>
                    ))}
                  </div>

                  {/* Custom reward */}
                  <input
                    value={rw.custom}
                    onChange={e => store.saveReward(week, { ...rw, custom: e.target.value })}
                    placeholder="Or write your own reward…"
                    className="inp mb-3 text-sm"
                  />

                  {/* Mark done */}
                  <div onClick={() => store.saveReward(week, { ...rw, done: !rw.done })}
                    className="flex items-center gap-2 cursor-pointer select-none">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center text-xs text-white transition-all
                      ${rw.done ? 'bg-gm border-gd' : 'border-gdot dark:border-gray-600 bg-white dark:bg-gray-900'}`}>
                      {rw.done && '✓'}
                    </div>
                    <span className="text-sm font-bold text-inks dark:text-gray-300">
                      {rw.done ? 'Reward claimed! 🎉' : 'Mark as claimed'}
                    </span>
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

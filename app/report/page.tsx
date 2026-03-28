'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/hooks/useStore'
import { dayNumber, weekNumber, weekRange, dateKey, addDays } from '@/lib/dates'
import { MOODS, MOOD_NAMES } from '@/lib/data'
import dynamic from 'next/dynamic'

const MoodChart = dynamic(() => import('@/components/charts/MoodChart'), { ssr: false })
const WeightChart = dynamic(() => import('@/components/charts/WeightChart'), { ssr: false })
const HabitChart = dynamic(() => import('@/components/charts/HabitChart'), { ssr: false })

export default function ReportPage() {
  const router = useRouter()
  const store = useStore()

  useEffect(() => {
    if (store.hydrated && !store.config) router.replace('/onboarding')
  }, [store.hydrated, store.config, router])

  if (!store.hydrated || !store.config) return null

  const start = new Date(store.config.startDate)
  const today = new Date()
  const dayNum = dayNumber(start, today)
  const weekNum = weekNumber(dayNum)

  // ── Compute 21-day summaries ──────────────────────────────────────────────
  const period1 = summarizePeriod(store.daily, store.habits, start, 1, 21)
  const period2 = summarizePeriod(store.daily, store.habits, start, 22, 42)
  const period3 = summarizePeriod(store.daily, store.habits, start, 43, 63)
  const periods = [
    { label: 'Days 1–21', data: period1 },
    { label: 'Days 22–42', data: period2 },
    { label: 'Days 43–63', data: period3 },
  ]

  // Most common mood overall
  const allMoods = Object.values(store.daily)
    .map(d => d.mood).filter(m => m >= 0)
  const moodCounts = MOODS.map((_, i) => allMoods.filter(m => m === i).length)
  const topMoodIdx = moodCounts.indexOf(Math.max(...moodCounts))
  const avgMood = allMoods.length ? (allMoods.reduce((a, b) => a + b, 0) / allMoods.length + 1).toFixed(1) : '—'

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-r from-gd to-gm text-white px-4 pt-5 pb-4 md:px-8">
        <h1 className="font-extrabold text-xl">📈 Progress Report</h1>
        <p className="text-xs opacity-75 font-semibold mt-1">Day {dayNum} of 90 — Week {weekNum} of 13</p>
      </div>

      <div className="px-4 py-4 space-y-3 md:px-8">

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-2">
          <StatCard icon="📅" label="Day" value={`${dayNum}`} sub="of 90" />
          <StatCard icon="😊" label="Avg mood" value={avgMood} sub={allMoods.length > 0 ? MOOD_NAMES[topMoodIdx] : '—'} />
          <StatCard icon="⚖️" label="Weight" value={store.weight[1] ? `${store.weight[1]}kg` : '—'} sub="start" />
        </div>

        {/* Mood chart */}
        <div className="sec-card">
          <div className="sec-label">😊 Mood — First 30 Days</div>
          <MoodChart daily={store.daily} startDate={start} />
        </div>

        {/* Weight chart */}
        <div className="sec-card">
          <div className="sec-label">⚖️ Weight Progress</div>
          <WeightChart weight={store.weight} startWeight={store.config.startWeight} />
          {store.config.startWeight > 0 && store.weight[90] && (
            <div className="mt-2 text-center text-sm font-extrabold">
              {Number(store.weight[90]) < store.config.startWeight
                ? <span className="text-gd dark:text-gl">Lost {(store.config.startWeight - Number(store.weight[90])).toFixed(1)} kg over 90 days 💪</span>
                : <span className="text-inks dark:text-gray-400">Keep going — every day counts 🌿</span>
              }
            </div>
          )}
        </div>

        {/* Habit completion chart */}
        <div className="sec-card">
          <div className="sec-label">✅ Habit Completion by Week</div>
          <HabitChart daily={store.daily} habits={store.habits} startDate={start} />
          <div className="flex gap-3 mt-2 text-xs font-bold justify-center">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gd inline-block"/>≥80%</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gl inline-block"/>50–79%</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gp border border-line dark:bg-gray-700 inline-block"/>≤49%</span>
          </div>
        </div>

        {/* 21-day period summaries */}
        <div className="sec-label mt-2">📋 21-Day Period Summaries</div>
        {periods.map(({ label, data }) => (
          <div key={label} className="sec-card">
            <div className="font-extrabold text-sm text-gd dark:text-gl mb-3">{label}</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <SummaryRow label="Avg mood" value={data.avgMood} />
              <SummaryRow label="Prayers complete" value={`${data.prayerPct}%`} />
              <SummaryRow label="Habit completion" value={`${data.habitPct}%`} />
              <SummaryRow label="Water goal days" value={`${data.waterDays}d`} />
              <SummaryRow label="Days journalled" value={`${data.journalDays}d`} />
              <SummaryRow label="Total feeds" value={`${data.totalBF}`} />
            </div>
          </div>
        ))}

        {/* Weekly review summaries */}
        {Object.keys(store.weekly).length > 0 && (
          <div className="sec-card">
            <div className="sec-label">📊 Weekly Review Highlights</div>
            <div className="space-y-3">
              {Object.entries(store.weekly).map(([w, wr]) => (
                <div key={w} className="border-b border-line dark:border-gray-800 pb-3 last:border-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-extrabold text-gd dark:text-gl">Week {w}</span>
                    {wr.stars > 0 && <span className="text-gold text-sm">{'★'.repeat(wr.stars)}</span>}
                  </div>
                  {wr.well && <div className="text-xs text-inks dark:text-gray-300 font-semibold">💪 {wr.well}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

// ── Helpers ────────────────────────────────────────────────────────────────

function summarizePeriod(
  daily: Record<string, Record<string, unknown>>,
  habits: { id: number; subs: string[] }[],
  start: Date,
  dayFrom: number,
  dayTo: number
) {
  let moods: number[] = [], prayerDone = 0, prayerTotal = 0
  let habitDone = 0, habitTotal = 0, waterDays = 0, journalDays = 0, totalBF = 0

  for (let i = dayFrom - 1; i < dayTo; i++) {
    const d = addDays(start, i)
    const dk = dateKey(d)
    const day = daily[dk] as Record<string, unknown> | undefined
    if (!day) continue

    if (typeof day.mood === 'number' && day.mood >= 0) moods.push(day.mood)
    const pr = (day.pr as Record<string, boolean>) ?? {}
    const su = (day.su as Record<string, boolean>) ?? {}
    prayerDone += Object.values(pr).filter(Boolean).length + Object.values(su).filter(Boolean).length
    prayerTotal += 9
    const ha = (day.ha as Record<string, boolean>) ?? {}
    habits.forEach(g => g.subs.forEach(s => {
      habitTotal++
      if (ha[`${g.id}:${s}`]) habitDone++
    }))
    if ((day.cu as number) >= 6) waterDays++
    if (typeof day.jn === 'string' && day.jn.length > 10) journalDays++
    totalBF += (day.bf as number) ?? 0
  }

  const avgMood = moods.length
    ? `${MOODS[Math.round(moods.reduce((a, b) => a + b, 0) / moods.length)]} ${(moods.reduce((a, b) => a + b, 0) / moods.length + 1).toFixed(1)}`
    : '—'

  return {
    avgMood,
    prayerPct: prayerTotal ? Math.round((prayerDone / prayerTotal) * 100) : 0,
    habitPct: habitTotal ? Math.round((habitDone / habitTotal) * 100) : 0,
    waterDays,
    journalDays,
    totalBF,
  }
}

function StatCard({ icon, label, value, sub }: { icon: string; label: string; value: string; sub: string }) {
  return (
    <div className="card p-3 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xl font-extrabold text-gd dark:text-gl">{value}</div>
      <div className="text-xs font-bold text-inks dark:text-gray-400">{label}</div>
      <div className="text-xs text-inks/60 dark:text-gray-600 font-semibold">{sub}</div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center bg-gpaper dark:bg-gray-800/50 rounded-lg px-3 py-2">
      <span className="font-bold text-inks dark:text-gray-400">{label}</span>
      <span className="font-extrabold text-gd dark:text-gl">{value}</span>
    </div>
  )
}

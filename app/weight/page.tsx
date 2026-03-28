'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/hooks/useStore'
import { WT_DAYS, MEAS_LABELS } from '@/lib/data'
import { dateKey, dayNumber } from '@/lib/dates'

export default function WeightPage() {
  const router = useRouter()
  const store = useStore()

  useEffect(() => {
    if (store.hydrated && !store.config) router.replace('/onboarding')
  }, [store.hydrated, store.config, router])

  if (!store.hydrated || !store.config) return null

  const start = new Date(store.config.startDate)
  const today = new Date()
  const currentDay = dayNumber(start, today)
  const startW = store.config.startWeight

  const dk = dateKey(today)
  const d = store.getDayData(dk)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-r from-gd to-gm text-white px-4 pt-5 pb-4 md:px-8">
        <h1 className="font-extrabold text-xl">⚖️ Weight Journey</h1>
        <p className="text-xs opacity-75 font-semibold mt-1">Track your progress at key milestones</p>
      </div>

      <div className="px-4 py-4 space-y-3 md:px-8">

        {/* Info box */}
        <div className="bg-gp dark:bg-gray-800 rounded-xl px-4 py-3 text-sm font-semibold text-inks dark:text-gray-300 border-l-4 border-gl leading-relaxed">
          📅 Weigh yourself on <b className="text-gd dark:text-gl">Day 1, 22, 43, 64</b> and <b className="text-gd dark:text-gl">Day 90</b>.
          {startW > 0 && <> Starting weight: <b className="text-gd dark:text-gl">{startW} kg</b>.</>} Progress calculated automatically 💪
        </div>

        {/* Weight milestones */}
        <div className="sec-card">
          <div className="sec-label">⚖️ Weight — Every 21 Days</div>
          <div className="space-y-3 relative">
            <div className="absolute left-[27px] top-8 bottom-8 w-0.5 bg-line dark:bg-gray-700"/>
            {WT_DAYS.map((dayMile, i) => {
              const isCurrent = currentDay >= dayMile
              const val = store.weight[dayMile] ?? ''
              const prev = i > 0 ? (store.weight[WT_DAYS[i - 1]] ?? startW) : startW
              const diff = val && prev ? (Number(val) - Number(prev)).toFixed(1) : null

              return (
                <div key={dayMile} className="flex items-start gap-3 relative">
                  {/* Timeline dot */}
                  <div className={`w-8 h-8 rounded-full border-3 flex items-center justify-center text-xs font-extrabold flex-shrink-0 z-10
                    ${i === 0 ? 'bg-gd border-gd text-white' : isCurrent ? 'bg-white dark:bg-gray-900 border-gm text-gm dark:text-gl' : 'bg-white dark:bg-gray-900 border-line dark:border-gray-700 text-gdot dark:text-gray-600'}`}>
                    {dayMile === 1 ? '★' : `D${dayMile}`}
                  </div>

                  <div className="flex-1 bg-gpaper dark:bg-gray-800/50 rounded-xl p-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-extrabold text-gd dark:text-gl">Day {dayMile}</span>
                      {i === 0 && <span className="text-xs bg-gd text-white px-2 py-0.5 rounded-full font-bold">Start</span>}
                      {diff && <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${Number(diff) < 0 ? 'bg-gp text-gd dark:bg-gd/20 dark:text-gl' : Number(diff) > 0 ? 'bg-rose/20 text-rose' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                        {Number(diff) <= 0 ? '' : '+'}{diff} kg
                      </span>}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="number" step="0.1" min="30" max="200"
                        placeholder="Enter weight"
                        value={val}
                        onChange={e => store.saveWeight(dayMile, parseFloat(e.target.value))}
                        className="inp w-28 text-center"
                      />
                      <span className="text-sm font-bold text-inks dark:text-gray-400">kg</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Measurements */}
        <div className="sec-card">
          <div className="sec-label">📏 Body Measurements (cm)</div>
          <div className="text-xs text-inks dark:text-gray-400 font-semibold mb-3">
            💡 Measure at the same milestones as your weight (Day 1, 22, 43, 64, 90)
          </div>

          {/* Milestone tabs */}
          <MeasurementTabs store={store} />
        </div>

        {/* Notes */}
        <div className="sec-card">
          <div className="sec-label">📝 Notes & Goals</div>
          <textarea
            value={d.nt}
            onChange={e => store.updateDay(dk, d => ({ ...d, nt: e.target.value }))}
            placeholder="Your goal weight, how you feel, energy levels, observations…"
            rows={4} className="inp resize-none"
          />
        </div>

      </div>
    </div>
  )
}

function MeasurementTabs({ store }: { store: ReturnType<typeof useStore> }) {
  const [activeMile, setActiveMile] = useState(1)

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto">
        {WT_DAYS.map(m => (
          <button key={m} onClick={() => setActiveMile(m)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors
              ${activeMile === m ? 'bg-gm text-white' : 'bg-gp dark:bg-gray-800 text-inks dark:text-gray-400 hover:bg-gl/30'}`}>
            Day {m}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-2">
        {MEAS_LABELS.map(label => {
          const val = store.measurements[activeMile]?.[label] ?? ''
          return (
            <div key={label} className="bg-gp dark:bg-gray-800 rounded-xl p-3">
              <div className="text-xs font-extrabold text-gd dark:text-gl mb-2">{label}</div>
              <input
                type="number" step="0.5" min="20" max="200"
                placeholder="—"
                value={val}
                onChange={e => store.saveMeasurement(activeMile, label, e.target.value)}
                className="inp text-center"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

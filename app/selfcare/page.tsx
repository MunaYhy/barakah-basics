'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/hooks/useStore'
import { dateKey } from '@/lib/dates'
import { SCM, SCE, SCH, SCB, SCT, SCBF } from '@/lib/data'

type SelfCareGroup = { key: string; label: string; icon: string; items: string[]; freq: string; color: string }

const GROUPS: SelfCareGroup[] = [
  { key: 'bf', label: 'Breast Care', icon: '🤱', items: SCBF, freq: 'Daily', color: 'border-rose bg-rose/5 dark:bg-rose/10' },
  { key: 'scm', label: 'Morning Skincare', icon: '🌅', items: SCM, freq: 'Daily', color: 'border-gl bg-gp dark:bg-gray-800' },
  { key: 'sce', label: 'Evening Skincare', icon: '🌙', items: SCE, freq: 'Daily', color: 'border-lav bg-lav/10 dark:bg-lav/5' },
  { key: 'sch', label: 'Hair Care', icon: '💆', items: SCH, freq: 'Weekly', color: 'border-lav bg-lav/10 dark:bg-lav/5' },
  { key: 'scb', label: 'Body Care', icon: '✨', items: SCB, freq: 'Weekly', color: 'border-lav bg-lav/10 dark:bg-lav/5' },
  { key: 'sct', label: 'Teeth Care', icon: '🦷', items: SCT, freq: 'Daily', color: 'border-gl bg-gp dark:bg-gray-800' },
]

export default function SelfCarePage() {
  const router = useRouter()
  const store = useStore()
  const [viewDate] = useState(new Date())

  useEffect(() => {
    if (store.hydrated && !store.config) router.replace('/onboarding')
  }, [store.hydrated, store.config, router])

  if (!store.hydrated || !store.config) return null

  const dk = dateKey(viewDate)
  const d = store.getDayData(dk)

  const toggle = (groupKey: string, item: string) => {
    const key = `${groupKey}:${item}`
    store.updateDay(dk, d => ({ ...d, sb: { ...d.sb, [key]: !d.sb[key] } }))
  }

  const totalItems = GROUPS.reduce((s, g) => s + g.items.length, 0)
  const doneItems = GROUPS.reduce((s, g) =>
    s + g.items.filter(item => d.sb[`${g.key}:${item}`]).length, 0)

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-gd to-gm text-white px-4 pt-5 pb-4 md:px-8">
        <h1 className="font-extrabold text-xl">💆 Self-Care</h1>
        <p className="text-xs opacity-75 font-semibold mt-1">Your daily & weekly care routine</p>
        <div className="mt-3">
          <div className="flex justify-between text-xs font-bold opacity-80 mb-1">
            <span>Today's score</span><span>{doneItems}/{totalItems}</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white/70 rounded-full transition-all duration-500"
              style={{width: totalItems ? `${(doneItems/totalItems)*100}%` : '0'}}/>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3 md:px-8">
        {GROUPS.map(grp => {
          const done = grp.items.filter(item => d.sb[`${grp.key}:${item}`]).length
          return (
            <div key={grp.key} className={`card border-l-4 p-4 ${grp.color}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{grp.icon}</span>
                <span className="font-extrabold text-sm text-ink dark:text-gray-100">{grp.label}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ml-1
                  ${grp.freq === 'Weekly' ? 'bg-lav/30 text-purple-700 dark:text-lav' : 'bg-gm/20 text-gd dark:text-gl'}`}>
                  {grp.freq}
                </span>
                <span className="ml-auto text-xs font-extrabold text-inks dark:text-gray-400">{done}/{grp.items.length}</span>
              </div>
              <div className="space-y-1.5">
                {grp.items.map(item => {
                  const checked = !!d.sb[`${grp.key}:${item}`]
                  return (
                    <div key={item}
                      onClick={() => toggle(grp.key, item)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer select-none transition-colors
                        ${checked ? 'bg-gl/30 dark:bg-gl/20' : 'bg-white/60 dark:bg-gray-900/40'} hover:bg-gp dark:hover:bg-gray-800`}>
                      <div className={`circle-check ${checked ? 'checked' : ''}`}>{checked && '✓'}</div>
                      <span className={`text-sm font-semibold ${checked ? 'line-through opacity-60' : ''} text-ink dark:text-gray-200`}>
                        {item}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Notes */}
        <div className="sec-card">
          <div className="sec-label">📝 Self-Care Notes</div>
          <textarea value={d.scn} onChange={e => store.updateDay(dk, d => ({ ...d, scn: e.target.value }))}
            placeholder="Products used, skin observations, tips for yourself…"
            rows={4} className="inp resize-none"
          />
        </div>
      </div>
    </div>
  )
}

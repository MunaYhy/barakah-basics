'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'
import { dateKey, addDays } from '@/lib/dates'
import { type HabitGroup } from '@/lib/data'

type Props = {
  daily: Record<string, { ha?: Record<string, boolean> }>
  habits: HabitGroup[]
  startDate: Date
}

export default function HabitChart({ daily, habits, startDate }: Props) {
  const totalSubs = habits.reduce((s, g) => s + g.subs.length, 0)
  if (totalSubs === 0) return (
    <div className="h-40 flex items-center justify-center text-sm text-inks dark:text-gray-400 font-semibold">
      No habits configured yet
    </div>
  )

  const data = Array.from({ length: 13 }).map((_, wi) => {
    let done = 0, total = 0
    Array.from({ length: 7 }).forEach((_, di) => {
      const d = addDays(startDate, wi * 7 + di)
      const dk = dateKey(d)
      const ha = daily[dk]?.ha ?? {}
      habits.forEach(g => g.subs.forEach(s => {
        total++
        if (ha[`${g.id}:${s}`]) done++
      }))
    })
    return { name: `W${wi + 1}`, pct: total > 0 ? Math.round((done / total) * 100) : 0 }
  })

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#b5e3cc33" vertical={false}/>
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#3d6b52' }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#3d6b52' }}
          tickFormatter={v => `${v}%`} />
        <Tooltip formatter={(v: number) => [`${v}%`, 'Habit completion']}
          contentStyle={{ borderRadius: 12, border: '1px solid #b5e3cc', fontFamily: 'Quicksand' }}/>
        <Bar dataKey="pct" radius={[6, 6, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.pct >= 80 ? '#2d8653' : entry.pct >= 50 ? '#5bbf85' : '#d4f0e0'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

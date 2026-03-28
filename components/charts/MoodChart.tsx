'use client'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { MOODS, MOOD_NAMES } from '@/lib/data'
import { dateKey, addDays } from '@/lib/dates'

type Props = { daily: Record<string, { mood?: number }>; startDate: Date }

export default function MoodChart({ daily, startDate }: Props) {
  const data = Array.from({ length: 30 }).map((_, i) => {
    const d = addDays(startDate, i)
    const dk = dateKey(d)
    const mood = daily[dk]?.mood ?? -1
    return {
      day: `D${i + 1}`,
      mood: mood >= 0 ? mood + 1 : null,
      label: mood >= 0 ? MOODS[mood] : '',
    }
  }).filter(d => d.mood !== null)

  if (data.length === 0) return <EmptyState msg="No mood data yet — start tracking daily!" />

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#b5e3cc33"/>
        <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#3d6b52' }} />
        <YAxis domain={[1, 5]} ticks={[1,2,3,4,5]}
          tickFormatter={v => MOODS[v - 1] ?? ''} tick={{ fontSize: 12 }} />
        <Tooltip formatter={(v: number) => [MOOD_NAMES[v - 1], 'Mood']}
          contentStyle={{ borderRadius: 12, border: '1px solid #b5e3cc', fontFamily: 'Quicksand' }}/>
        <Line type="monotone" dataKey="mood" stroke="#2d8653" strokeWidth={2}
          dot={{ fill: '#2d8653', r: 4 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

function EmptyState({ msg }: { msg: string }) {
  return <div className="h-40 flex items-center justify-center text-sm text-inks dark:text-gray-400 font-semibold">{msg}</div>
}

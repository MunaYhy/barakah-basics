'use client'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts'
import { WT_DAYS } from '@/lib/data'

type Props = { weight: Record<number, number>; startWeight: number }

export default function WeightChart({ weight, startWeight }: Props) {
  const data = WT_DAYS.map(d => ({
    name: `Day ${d}`,
    weight: weight[d] ?? null,
  })).filter(d => d.weight !== null)

  if (data.length === 0) return (
    <div className="h-40 flex items-center justify-center text-sm text-inks dark:text-gray-400 font-semibold">
      No weight data yet — enter your first measurement
    </div>
  )

  const minW = Math.min(...data.map(d => d.weight!)) - 2
  const maxW = Math.max(startWeight, ...data.map(d => d.weight!)) + 2

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#5bbf85" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#5bbf85" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#b5e3cc33"/>
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#3d6b52' }} />
        <YAxis domain={[minW, maxW]} tick={{ fontSize: 10, fill: '#3d6b52' }}
          tickFormatter={v => `${v}kg`} />
        {startWeight > 0 && (
          <ReferenceLine y={startWeight} stroke="#c9a84c" strokeDasharray="4 4"
            label={{ value: 'Start', position: 'right', fontSize: 10, fill: '#c9a84c' }} />
        )}
        <Tooltip formatter={(v: number) => [`${v} kg`, 'Weight']}
          contentStyle={{ borderRadius: 12, border: '1px solid #b5e3cc', fontFamily: 'Quicksand' }}/>
        <Area type="monotone" dataKey="weight" stroke="#2d8653" strokeWidth={2}
          fill="url(#wGrad)" dot={{ fill: '#2d8653', r: 5 }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

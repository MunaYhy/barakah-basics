'use client'
import { useState } from 'react'
import { QUOTES } from '@/lib/data'

type Props = { dayNum: number; reflection: string; onChange: (v: string) => void }

export default function QuoteCard({ dayNum, reflection, onChange }: Props) {
  const defaultIdx = (dayNum - 1) % QUOTES.length
  const [idx, setIdx] = useState(defaultIdx)
  const q = QUOTES[idx]

  return (
    <div className="bg-gradient-to-br from-gpaper to-gp dark:from-gray-800 dark:to-gray-900 rounded-2xl p-4 border-r-4 border-gm dark:border-gl relative overflow-hidden">
      <div className="absolute top-0 left-2 text-6xl text-gp dark:text-gray-700 font-serif leading-none select-none">❝</div>
      <div className="relative z-10">
        <div className="font-amiri text-xl text-gd dark:text-gl text-center mb-2 leading-loose" dir="rtl">{q.ar}</div>
        <div className="text-sm font-semibold text-inks dark:text-gray-300 text-center italic mb-1 leading-relaxed">"{q.en}"</div>
        <div className="text-xs font-extrabold text-gm dark:text-gl text-center mb-3">— {q.src}</div>

        <div className="border-t border-dashed border-line dark:border-gray-700 pt-3">
          <div className="text-xs font-extrabold uppercase tracking-wider text-gm dark:text-gl mb-1.5">💡 What I learn from this…</div>
          <input
            value={reflection}
            onChange={e => onChange(e.target.value)}
            placeholder="Write your reflection…"
            className="w-full bg-transparent border-none outline-none border-b border-dashed border-line dark:border-gray-600 text-sm font-semibold text-ink dark:text-gray-200 pb-1 placeholder:text-gdot dark:placeholder:text-gray-600"
          />
        </div>

        <div className="flex items-center justify-center gap-3 mt-3">
          <button onClick={() => setIdx((idx - 1 + QUOTES.length) % QUOTES.length)}
            className="text-xs font-bold px-3 py-1.5 rounded-full bg-gp dark:bg-gray-700 text-gd dark:text-gl hover:bg-gl hover:text-white transition-colors">
            ◀ Prev
          </button>
          <span className="text-xs font-bold text-inks dark:text-gray-400">{idx + 1}/{QUOTES.length}</span>
          <button onClick={() => setIdx((idx + 1) % QUOTES.length)}
            className="text-xs font-bold px-3 py-1.5 rounded-full bg-gp dark:bg-gray-700 text-gd dark:text-gl hover:bg-gl hover:text-white transition-colors">
            Next ▶
          </button>
        </div>
      </div>
    </div>
  )
}

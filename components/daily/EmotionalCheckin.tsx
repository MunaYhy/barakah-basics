'use client'
import { BB_FEELINGS } from '@/lib/data'

type Props = {
  feelings: string[]
  note: string
  onToggle: (f: string) => void
  onNote: (v: string) => void
}

export default function EmotionalCheckin({ feelings, note, onToggle, onNote }: Props) {
  return (
    <div className="space-y-3">
      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl px-3 py-2 border-l-3 border-blue-300 dark:border-blue-700 text-xs font-semibold text-blue-800 dark:text-blue-300 leading-relaxed">
        💛 Postpartum emotions are real and valid. No feeling is wrong. This is just for you.
      </div>
      <div>
        <div className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
          Today I felt…
        </div>
        <div className="flex flex-wrap gap-1.5">
          {BB_FEELINGS.map(f => (
            <button key={f} onClick={() => onToggle(f)}
              className={`tag-chip ${feelings.includes(f) ? 'selected' : ''}`}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <input value={note} onChange={e => onNote(e.target.value)}
        placeholder="Anything on your heart today… (just for you 💛)"
        className="inp"
      />
    </div>
  )
}

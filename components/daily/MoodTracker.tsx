'use client'
import { MOODS, MOOD_NAMES } from '@/lib/data'

type Props = {
  mood: number
  moodNote: string
  onSetMood: (i: number) => void
  onSetNote: (v: string) => void
}

export default function MoodTracker({ mood, moodNote, onSetMood, onSetNote }: Props) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-sm font-bold text-inks dark:text-gray-300 flex-shrink-0">How are you?</span>
      <div className="flex gap-1.5">
        {MOODS.map((m, i) => (
          <button key={i} onClick={() => onSetMood(i)}
            title={MOOD_NAMES[i]}
            className={`mood-btn ${mood === i ? 'selected' : ''}`}>
            {m}
          </button>
        ))}
      </div>
      <input
        value={moodNote}
        onChange={e => onSetNote(e.target.value)}
        placeholder="Any note…"
        className="flex-1 min-w-28 bg-transparent border-none outline-none border-b border-dashed border-line dark:border-gray-600 text-sm font-semibold text-ink dark:text-gray-200 pb-1 placeholder:text-gdot dark:placeholder:text-gray-600"
      />
    </div>
  )
}

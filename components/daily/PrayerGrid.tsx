'use client'
import { PRAYERS, SUNNAH } from '@/lib/data'

type Props = {
  fard: Record<string, boolean>
  sunnah: Record<string, boolean>
  onToggleFard: (name: string) => void
  onToggleSunnah: (name: string) => void
}

export default function PrayerGrid({ fard, sunnah, onToggleFard, onToggleSunnah }: Props) {
  return (
    <div className="space-y-4">
      {/* Fard prayers */}
      <div>
        <div className="text-xs font-extrabold uppercase tracking-wider text-inks dark:text-gray-400 mb-2">
          5 Daily Prayers
        </div>
        <div className="grid grid-cols-5 gap-2">
          {PRAYERS.map(p => (
            <button key={p} onClick={() => onToggleFard(p)}
              className={`prayer-dot flex-col gap-0.5 h-14 rounded-xl w-full ${fard[p] ? 'done' : ''}`}>
              <span className="text-base">{fard[p] ? '✓' : '○'}</span>
              <span className={`text-xs font-bold leading-none ${fard[p] ? 'text-white' : 'text-inks dark:text-gray-400'}`}>{p}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sunnah */}
      <div>
        <div className="text-xs font-extrabold uppercase tracking-wider text-inks dark:text-gray-400 mb-2">
          Sunnah & Extras
        </div>
        <div className="grid grid-cols-4 gap-2">
          {SUNNAH.map(s => (
            <button key={s} onClick={() => onToggleSunnah(s)}
              className={`prayer-dot flex-col gap-0.5 h-14 rounded-xl w-full ${sunnah[s] ? 'done' : ''}`}>
              <span className="text-base">{sunnah[s] ? '✓' : '○'}</span>
              <span className={`text-xs font-bold leading-none ${sunnah[s] ? 'text-white' : 'text-inks dark:text-gray-400'}`}>{s}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

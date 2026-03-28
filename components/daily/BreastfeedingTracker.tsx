'use client'

type Props = {
  bf: number; pump: number; bfside: string; bfdur: number
  onBF: (n: number) => void; onPump: (n: number) => void
  onSide: (s: string) => void; onDur: (n: number) => void
}

export default function BreastfeedingTracker({ bf, pump, bfside, bfdur, onBF, onPump, onSide, onDur }: Props) {
  return (
    <div className="space-y-3">
      {/* Feeds + pump row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gp dark:bg-gray-800 rounded-xl p-3 text-center">
          <div className="text-2xl font-extrabold text-gd dark:text-gl">{bf}</div>
          <div className="text-xs font-bold text-inks dark:text-gray-400 mb-2">Feeds today</div>
          <div className="flex gap-2">
            <button onClick={() => onBF(bf + 1)} className="btn-green flex-1 py-1.5 text-xs">+ Feed</button>
            <button onClick={() => onBF(Math.max(0, bf - 1))} className="btn-ghost flex-1 py-1.5 text-xs">– Undo</button>
          </div>
        </div>
        <div className="bg-amber-50 dark:bg-gray-800 border border-amber-200 dark:border-gray-700 rounded-xl p-3 text-center">
          <div className="text-xs font-extrabold text-amber-700 dark:text-gold mb-1">Pumping?</div>
          <div className="text-2xl font-extrabold text-gold">{pump}</div>
          <div className="flex gap-2 mt-2 justify-center">
            <button onClick={() => onPump(pump + 1)} className="text-xs font-bold px-3 py-1 rounded-lg bg-gold text-white hover:bg-amber-600 transition-colors">+</button>
            <button onClick={() => onPump(Math.max(0, pump - 1))} className="text-xs font-bold px-3 py-1 rounded-lg border border-amber-300 dark:border-gray-600 text-amber-700 dark:text-gold hover:bg-amber-50 dark:hover:bg-gray-700 transition-colors">−</button>
          </div>
        </div>
      </div>

      {/* Side + duration */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-bold text-inks dark:text-gray-300 flex-shrink-0">Last side:</span>
        {['L', 'R'].map(s => (
          <button key={s} onClick={() => onSide(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold border-2 transition-colors
              ${bfside === s ? 'bg-gm border-gd text-white' : 'bg-white dark:bg-gray-900 border-gl text-gm dark:text-gl'}`}>
            {s === 'L' ? '⬅️ Left' : 'Right ➡️'}
          </button>
        ))}
        <span className="text-sm font-bold text-inks dark:text-gray-300 ml-2 flex-shrink-0">Duration:</span>
        <input type="number" min="1" max="60" placeholder="mins"
          value={bfdur || ''}
          onChange={e => onDur(Number(e.target.value))}
          className="inp w-20 text-center"
        />
      </div>
    </div>
  )
}

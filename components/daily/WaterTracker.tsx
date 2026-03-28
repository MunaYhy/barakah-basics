'use client'

type Props = { cups: number; max?: number; onChange: (n: number) => void }

const CupIcon = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 24 28" className="w-8 h-9 water-cup" fill="none">
    <path d="M5 6h14l-2 16H7L5 6z" className={filled ? 'fill-gm' : 'fill-gp dark:fill-gray-700'} stroke="#2d8653" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M4 6h16" stroke="#2d8653" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

export default function WaterTracker({ cups, max = 6, onChange }: Props) {
  return (
    <div>
      <div className="text-xs text-inks dark:text-gray-400 font-semibold mb-2 leading-relaxed bg-gp dark:bg-gray-800 rounded-xl px-3 py-2">
        🤱 Breastfeeding goal: <b>6 × 500ml bottles</b> = 3 litres. Your milk is mostly water — keep going, mama!
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm font-bold text-inks dark:text-gray-300">Bottles:</span>
        <div className="flex gap-1.5 flex-wrap">
          {Array.from({ length: max }).map((_, i) => (
            <div key={i} onClick={() => onChange(i < cups ? i : i + 1)}>
              <CupIcon filled={i < cups} />
            </div>
          ))}
        </div>
        <span className="text-sm font-extrabold text-gm dark:text-gl">{cups}/{max}</span>
      </div>
    </div>
  )
}

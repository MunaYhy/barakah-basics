interface WaterCounterProps {
  cups: number
  onChange: (cups: number) => void
}

export default function WaterCounter({ cups, onChange }: WaterCounterProps) {
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {Array.from({ length: 8 }, (_, i) => (
          <button
            key={i}
            onClick={() => onChange(i < cups ? i : i + 1)}
            className={`text-2xl transition-transform active:scale-90 ${i < cups ? 'opacity-100' : 'opacity-25'}`}
          >
            💧
          </button>
        ))}
      </div>
      <p className="text-xs text-inks dark:text-gray-400 font-semibold">
        {cups} / 8 cups{cups >= 8 ? ' ✓' : ''}
      </p>
    </div>
  )
}

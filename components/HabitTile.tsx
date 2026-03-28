interface HabitTileProps {
  emoji: string
  label: string
  done: boolean
  onToggle: () => void
}

export default function HabitTile({ emoji, label, done, onToggle }: HabitTileProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex flex-col items-center gap-1 p-4 rounded-2xl border-2 transition-all font-bold text-sm
        ${done
          ? 'border-gm bg-gp dark:bg-gm/20 text-gd dark:text-gl'
          : 'border-line dark:border-gray-700 bg-white dark:bg-gray-900 text-inks dark:text-gray-400'
        }`}
    >
      <span className="text-2xl">{emoji}</span>
      <span>{label}</span>
      {done && <span className="text-xs text-gm dark:text-gl">✓ Done</span>}
    </button>
  )
}

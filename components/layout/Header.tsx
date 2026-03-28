'use client'
import { type Config } from '@/hooks/useStore'
import { dateLabel, dayNumber, progressPercent, addDays, dateKey } from '@/lib/dates'

type Props = {
  config: Config
  viewDate: Date
  onChangeDate: (d: Date) => void
}

export default function Header({ config, viewDate, onChangeDate }: Props) {
  const start = new Date(config.startDate)
  const dayNum = dayNumber(start, viewDate)
  const pct = progressPercent(dayNum)

  return (
    <div className="bg-gradient-to-r from-gd to-gm text-white px-4 pt-4 pb-3 md:px-8 md:pt-5">
      {/* Day nav */}
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => onChangeDate(addDays(viewDate, -1))}
          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center font-bold transition-colors">
          ◀
        </button>
        <div className="text-center">
          <div className="font-extrabold text-base leading-tight">{dateLabel(viewDate)}</div>
          <div className="text-xs opacity-75 font-semibold mt-0.5">Day {dayNum} of 90</div>
        </div>
        <button onClick={() => onChangeDate(addDays(viewDate, 1))}
          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center font-bold transition-colors">
          ▶
        </button>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs font-bold opacity-75 mb-1">
          <span>Progress</span><span>{pct}%</span>
        </div>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-white/70 transition-all duration-500" style={{width:`${pct}%`}}/>
        </div>
      </div>
    </div>
  )
}

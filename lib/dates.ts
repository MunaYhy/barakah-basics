export function dateKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10)
}

export function daysSince(isoDate: string): number {
  const start = new Date(isoDate)
  const now = new Date()
  const diff = now.getTime() - start.getTime()
  return Math.max(0, Math.floor(diff / 86400000))
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Count consecutive days (going back from today) where all 4 habits were done
export function streakCount(logs: Array<{ date: string; ate: boolean; vitamins: boolean; moved: boolean; water_cups: number }>): number {
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 90; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = dateKey(d)
    const log = logs.find(l => l.date === key)
    if (log && log.ate && log.vitamins && log.moved && log.water_cups >= 8) {
      streak++
    } else {
      break
    }
  }
  return streak
}

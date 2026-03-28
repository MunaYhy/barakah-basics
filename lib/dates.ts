// Date utilities based on a journey start date

export function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function dayNumber(startDate: Date, viewDate: Date): number {
  const start = new Date(startDate); start.setHours(0, 0, 0, 0)
  const view = new Date(viewDate); view.setHours(0, 0, 0, 0)
  const n = Math.round((view.getTime() - start.getTime()) / 86400000) + 1
  return Math.min(Math.max(n, 1), 90)
}

export function weekNumber(dayNum: number): number {
  return Math.min(Math.ceil(dayNum / 7), 13)
}

export function weekRange(startDate: Date, week: number): string {
  const s = new Date(startDate)
  s.setDate(s.getDate() + (week - 1) * 7)
  const e = new Date(s)
  e.setDate(e.getDate() + 6)
  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  return `${fmt(s)} – ${fmt(e)}`
}

export function dateLabel(d: Date): string {
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

export function progressPercent(dayNum: number): number {
  return Math.round((dayNum / 90) * 100)
}

// Returns the weight milestone that falls on or before this day number
export function weightMilestone(dayNum: number): number | null {
  const milestones = [1, 22, 43, 64, 90]
  const m = milestones.filter(m => m <= dayNum)
  return m.length ? m[m.length - 1] : null
}

// SSR-safe localStorage helpers

export function lsGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function lsSet<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage full or unavailable — silent fail
  }
}

export function lsDel(key: string): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(key)
}

// Storage keys
export const KEYS = {
  config: 'bj_config',
  daily: 'bj_daily',
  habits: 'bj_habits',
  weight: 'bj_weight',
  measurements: 'bj_measurements',
  weekly: 'bj_weekly',
  rewards: 'bj_rewards',
} as const

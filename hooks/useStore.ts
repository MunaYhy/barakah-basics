'use client'
import { useState, useCallback, useEffect } from 'react'
import { lsGet, lsSet, KEYS } from '@/lib/storage'
import { DEFAULT_HABITS, type HabitGroup } from '@/lib/data'

// ── Types ─────────────────────────────────────────────────────────────────────

export type Config = {
  startDate: string   // ISO date string e.g. "2026-03-23"
  startWeight: number
  darkMode: boolean
}

export type DayData = {
  mood: number          // -1 = unset, 0-4
  moodNote: string
  pr: Record<string, boolean>   // prayer key → done
  su: Record<string, boolean>   // sunnah key → done
  ha: Record<string, boolean>   // habit sub key → done
  sb: Record<string, boolean>   // self-care body key → done
  cu: number            // cups of water
  steps: number
  bf: number            // breastfeeds
  pump: number
  bfside: string        // 'L' | 'R' | ''
  bfdur: number
  bbfeelings: string[]  // selected baby blues feelings
  bbnote: string
  letgo: string
  dua: string
  pri: { t: string; done: boolean }[]
  gr: string[]          // gratitude (3)
  lr: string[]          // learned (3)
  sl: string[]          // about self (2)
  jn: string            // journal
  nt: string            // notes
  scn: string           // self-care notes
  qlearn: string        // quote reflection
  babyslp: number       // baby sleep hours
  babywin: string       // baby win of the day
  restChecks: Record<string, boolean>
}

export type WeekReview = {
  stars: number
  well: string
  impr: string
  focus: string
  quote: string
}

export type RewardData = {
  selectedTag: string
  custom: string
  done: boolean
}

export type Measurements = Record<string, string>  // label → value

const defaultDayData = (): DayData => ({
  mood: -1, moodNote: '', pr: {}, su: {}, ha: {}, sb: {}, cu: 0, steps: 0,
  bf: 0, pump: 0, bfside: '', bfdur: 0, bbfeelings: [], bbnote: '',
  letgo: '', dua: '',
  pri: [{t:'',done:false},{t:'',done:false},{t:'',done:false},{t:'',done:false}],
  gr: ['','',''], lr: ['','',''], sl: ['',''], jn: '', nt: '', scn: '',
  qlearn: '', babyslp: 0, babywin: '', restChecks: {},
})

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useStore() {
  const [config, setConfigState] = useState<Config | null>(null)
  const [daily, setDailyState] = useState<Record<string, DayData>>({})
  const [habits, setHabitsState] = useState<HabitGroup[]>(DEFAULT_HABITS)
  const [weight, setWeightState] = useState<Record<number, number>>({})
  const [measurements, setMeasurementsState] = useState<Record<number, Measurements>>({})
  const [weekly, setWeeklyState] = useState<Record<number, WeekReview>>({})
  const [rewards, setRewardsState] = useState<Record<number, RewardData>>({})
  const [hydrated, setHydrated] = useState(false)

  // Load from localStorage once on mount
  useEffect(() => {
    const cfg = lsGet<Config | null>(KEYS.config, null)
    const d = lsGet<Record<string, DayData>>(KEYS.daily, {})
    const h = lsGet<HabitGroup[]>(KEYS.habits, DEFAULT_HABITS)
    const w = lsGet<Record<number, number>>(KEYS.weight, {})
    const m = lsGet<Record<number, Measurements>>(KEYS.measurements, {})
    const wr = lsGet<Record<number, WeekReview>>(KEYS.weekly, {})
    const rw = lsGet<Record<number, RewardData>>(KEYS.rewards, {})
    setConfigState(cfg)
    setDailyState(d)
    setHabitsState(h)
    setWeightState(w)
    setMeasurementsState(m)
    setWeeklyState(wr)
    setRewardsState(rw)
    // Apply dark mode
    if (cfg?.darkMode) document.documentElement.classList.add('dark')
    setHydrated(true)
  }, [])

  // ── Config ─────────────────────────────────────────────────────────────────

  const saveConfig = useCallback((c: Config) => {
    setConfigState(c)
    lsSet(KEYS.config, c)
    if (c.darkMode) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [])

  const toggleDarkMode = useCallback(() => {
    setConfigState(prev => {
      if (!prev) return prev
      const next = { ...prev, darkMode: !prev.darkMode }
      lsSet(KEYS.config, next)
      document.documentElement.classList.toggle('dark', next.darkMode)
      return next
    })
  }, [])

  // ── Daily data ─────────────────────────────────────────────────────────────

  const getDayData = useCallback((key: string): DayData => {
    return daily[key] ?? defaultDayData()
  }, [daily])

  const updateDay = useCallback((key: string, updater: (d: DayData) => DayData) => {
    setDailyState(prev => {
      const cur = prev[key] ?? defaultDayData()
      const next = { ...prev, [key]: updater(cur) }
      lsSet(KEYS.daily, next)
      return next
    })
  }, [])

  // ── Habits ─────────────────────────────────────────────────────────────────

  const saveHabits = useCallback((h: HabitGroup[]) => {
    setHabitsState(h)
    lsSet(KEYS.habits, h)
  }, [])

  // ── Weight ─────────────────────────────────────────────────────────────────

  const saveWeight = useCallback((milestone: number, val: number) => {
    setWeightState(prev => {
      const next = { ...prev, [milestone]: val }
      lsSet(KEYS.weight, next)
      return next
    })
  }, [])

  // ── Measurements ───────────────────────────────────────────────────────────

  const saveMeasurement = useCallback((milestone: number, label: string, val: string) => {
    setMeasurementsState(prev => {
      const next = {
        ...prev,
        [milestone]: { ...(prev[milestone] ?? {}), [label]: val }
      }
      lsSet(KEYS.measurements, next)
      return next
    })
  }, [])

  // ── Weekly review ──────────────────────────────────────────────────────────

  const saveWeekly = useCallback((week: number, data: WeekReview) => {
    setWeeklyState(prev => {
      const next = { ...prev, [week]: data }
      lsSet(KEYS.weekly, next)
      return next
    })
  }, [])

  // ── Rewards ────────────────────────────────────────────────────────────────

  const saveReward = useCallback((week: number, data: RewardData) => {
    setRewardsState(prev => {
      const next = { ...prev, [week]: data }
      lsSet(KEYS.rewards, next)
      return next
    })
  }, [])

  return {
    config, hydrated,
    saveConfig, toggleDarkMode,
    daily, getDayData, updateDay,
    habits, saveHabits,
    weight, saveWeight,
    measurements, saveMeasurement,
    weekly, saveWeekly,
    rewards, saveReward,
  }
}

export type Store = ReturnType<typeof useStore>

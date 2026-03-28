'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import { lsGet, lsSet, KEYS } from '@/lib/storage'
import { DEFAULT_HABITS, type HabitGroup } from '@/lib/data'
import { supabase, getAnonId } from '@/lib/supabase'

// ── Types ─────────────────────────────────────────────────────────────────────

export type Config = {
  startDate: string
  startWeight: number
  darkMode: boolean
}

export type DayData = {
  mood: number
  moodNote: string
  pr: Record<string, boolean>
  su: Record<string, boolean>
  ha: Record<string, boolean>
  sb: Record<string, boolean>
  cu: number
  steps: number
  bf: number
  pump: number
  bfside: string
  bfdur: number
  bbfeelings: string[]
  bbnote: string
  letgo: string
  dua: string
  pri: { t: string; done: boolean }[]
  gr: string[]
  lr: string[]
  sl: string[]
  jn: string
  nt: string
  scn: string
  qlearn: string
  babyslp: number
  babywin: string
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

export type Measurements = Record<string, string>

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
  const userIdRef = useRef<string | null>(null)

  // Always-reliable userId — checks memory → localStorage cache → Supabase
  const getUserId = useCallback(async (): Promise<string | null> => {
    if (userIdRef.current) return userIdRef.current
    const cached = lsGet<string | null>('bj_uid', null)
    if (cached) { userIdRef.current = cached; return cached }
    const anonId = await getAnonId()
    if (!anonId) return null
    const { data } = await supabase
      .from('bj_profiles')
      .select('id')
      .eq('anon_id', anonId)
      .maybeSingle()
    if (data?.id) {
      userIdRef.current = data.id
      lsSet('bj_uid', data.id)
      return data.id
    }
    return null
  }, [])

  // Load from localStorage on mount
  useEffect(() => {
    setConfigState(lsGet<Config | null>(KEYS.config, null))
    setDailyState(lsGet<Record<string, DayData>>(KEYS.daily, {}))
    setHabitsState(lsGet<HabitGroup[]>(KEYS.habits, DEFAULT_HABITS))
    setWeightState(lsGet<Record<number, number>>(KEYS.weight, {}))
    setMeasurementsState(lsGet<Record<number, Measurements>>(KEYS.measurements, {}))
    setWeeklyState(lsGet<Record<number, WeekReview>>(KEYS.weekly, {}))
    setRewardsState(lsGet<Record<number, RewardData>>(KEYS.rewards, {}))
    const cfg = lsGet<Config | null>(KEYS.config, null)
    if (cfg?.darkMode) document.documentElement.classList.add('dark')
    setHydrated(true)
  }, [])

  // ── Config ─────────────────────────────────────────────────────────────────

  const saveConfig = useCallback((c: Config) => {
    setConfigState(c)
    lsSet(KEYS.config, c)
    if (c.darkMode) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')

    getAnonId().then(anonId => {
      if (!anonId) return
      return supabase.from('bj_profiles').upsert({
        anon_id: anonId,
        start_date: c.startDate,
        start_weight: c.startWeight,
        dark_mode: c.darkMode,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'anon_id' }).select('id').single()
    }).then((res: unknown) => {
      const id = (res as { data?: { id: string } } | null)?.data?.id
      if (id) { userIdRef.current = id; lsSet('bj_uid', id) }
    })
  }, [])

  const toggleDarkMode = useCallback(() => {
    setConfigState((prev: Config | null) => {
      if (!prev) return prev
      const next = { ...prev, darkMode: !prev.darkMode }
      lsSet(KEYS.config, next)
      document.documentElement.classList.toggle('dark', next.darkMode)
      getUserId().then((uid: string | null) => {
        if (uid) supabase.from('bj_profiles').update({ dark_mode: next.darkMode }).eq('id', uid)
      })
      return next
    })
  }, [getUserId])

  // ── Daily data ─────────────────────────────────────────────────────────────

  const getDayData = useCallback((key: string): DayData => {
    return daily[key] ?? defaultDayData()
  }, [daily])

  const updateDay = useCallback((key: string, updater: (d: DayData) => DayData) => {
    setDailyState((prev: Record<string, DayData>) => {
      const next = { ...prev, [key]: updater(prev[key] ?? defaultDayData()) }
      lsSet(KEYS.daily, next)
      getUserId().then((uid: string | null) => {
        if (!uid) return
        supabase.from('bj_daily').upsert({
          user_id: uid, date: key, data: next[key],
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,date' })
      })
      return next
    })
  }, [getUserId])

  // ── Habits ─────────────────────────────────────────────────────────────────

  const saveHabits = useCallback((h: HabitGroup[]) => {
    setHabitsState(h)
    lsSet(KEYS.habits, h)
    getUserId().then(uid => {
      if (!uid) return
      supabase.from('bj_habits').upsert(
        { user_id: uid, habits: h, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      )
    })
  }, [getUserId])

  // ── Weight ─────────────────────────────────────────────────────────────────

  const saveWeight = useCallback((milestone: number, val: number) => {
    setWeightState((prev: Record<number, number>) => {
      const next = { ...prev, [milestone]: val }
      lsSet(KEYS.weight, next)
      getUserId().then((uid: string | null) => {
        if (!uid) return
        supabase.from('bj_weight').upsert(
          { user_id: uid, milestone, weight: val, updated_at: new Date().toISOString() },
          { onConflict: 'user_id,milestone' }
        )
      })
      return next
    })
  }, [getUserId])

  // ── Measurements ───────────────────────────────────────────────────────────

  const saveMeasurement = useCallback((milestone: number, label: string, val: string) => {
    setMeasurementsState((prev: Record<number, Measurements>) => {
      const next = { ...prev, [milestone]: { ...(prev[milestone] ?? {}), [label]: val } }
      lsSet(KEYS.measurements, next)
      getUserId().then((uid: string | null) => {
        if (!uid) return
        supabase.from('bj_measurements').upsert(
          { user_id: uid, milestone, data: next[milestone], updated_at: new Date().toISOString() },
          { onConflict: 'user_id,milestone' }
        )
      })
      return next
    })
  }, [getUserId])

  // ── Weekly review ──────────────────────────────────────────────────────────

  const saveWeekly = useCallback((week: number, data: WeekReview) => {
    setWeeklyState((prev: Record<number, WeekReview>) => {
      const next = { ...prev, [week]: data }
      lsSet(KEYS.weekly, next)
      getUserId().then((uid: string | null) => {
        if (!uid) return
        supabase.from('bj_weekly').upsert(
          { user_id: uid, week, stars: data.stars, well: data.well, impr: data.impr, focus: data.focus, quote: data.quote, updated_at: new Date().toISOString() },
          { onConflict: 'user_id,week' }
        )
      })
      return next
    })
  }, [getUserId])

  // ── Rewards ────────────────────────────────────────────────────────────────

  const saveReward = useCallback((week: number, data: RewardData) => {
    setRewardsState((prev: Record<number, RewardData>) => {
      const next = { ...prev, [week]: data }
      lsSet(KEYS.rewards, next)
      getUserId().then((uid: string | null) => {
        if (!uid) return
        supabase.from('bj_rewards').upsert(
          { user_id: uid, week, selected_tag: data.selectedTag, custom: data.custom, done: data.done, updated_at: new Date().toISOString() },
          { onConflict: 'user_id,week' }
        )
      })
      return next
    })
  }, [getUserId])

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

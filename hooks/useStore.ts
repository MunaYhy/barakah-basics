'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import { lsGet, lsSet, KEYS } from '@/lib/storage'
import { DEFAULT_HABITS, type HabitGroup } from '@/lib/data'
import { supabase, getAnonId } from '@/lib/supabase'

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

  const anonIdRef = useRef<string | null>(null)   // Supabase auth.uid()
  const userIdRef = useRef<string | null>(null)    // bj_profiles.id

  // Load from localStorage once on mount, then sync Supabase in background
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
    if (cfg?.darkMode) document.documentElement.classList.add('dark')
    setHydrated(true)

    // Init Supabase in background (non-blocking)
    initDb()
  }, [])

  const initDb = async () => {
    const anonId = await getAnonId()
    if (!anonId) return
    anonIdRef.current = anonId

    // Look up existing profile
    const { data: profile } = await supabase
      .from('bj_profiles')
      .select('id, start_date, start_weight, dark_mode')
      .eq('anon_id', anonId)
      .single()

    if (!profile) return // New user — profile created on saveConfig (onboarding)
    userIdRef.current = profile.id

    // Load all data from Supabase (takes precedence over localStorage)
    const [dailyRes, habitsRes, weightRes, measureRes, weeklyRes, rewardRes] = await Promise.all([
      supabase.from('bj_daily').select('date, data').eq('user_id', profile.id),
      supabase.from('bj_habits').select('habits').eq('user_id', profile.id).maybeSingle(),
      supabase.from('bj_weight').select('milestone, weight').eq('user_id', profile.id),
      supabase.from('bj_measurements').select('milestone, data').eq('user_id', profile.id),
      supabase.from('bj_weekly').select('week, stars, well, impr, focus, quote').eq('user_id', profile.id),
      supabase.from('bj_rewards').select('week, selected_tag, custom, done').eq('user_id', profile.id),
    ])

    if (dailyRes.data?.length) {
      const merged: Record<string, DayData> = {}
      for (const row of dailyRes.data) merged[row.date] = row.data as DayData
      setDailyState(merged)
      lsSet(KEYS.daily, merged)
    }

    if (habitsRes.data?.habits) {
      setHabitsState(habitsRes.data.habits as HabitGroup[])
      lsSet(KEYS.habits, habitsRes.data.habits)
    }

    if (weightRes.data?.length) {
      const w: Record<number, number> = {}
      for (const row of weightRes.data) w[row.milestone] = row.weight
      setWeightState(w)
      lsSet(KEYS.weight, w)
    }

    if (measureRes.data?.length) {
      const m: Record<number, Measurements> = {}
      for (const row of measureRes.data) m[row.milestone] = row.data as Measurements
      setMeasurementsState(m)
      lsSet(KEYS.measurements, m)
    }

    if (weeklyRes.data?.length) {
      const wr: Record<number, WeekReview> = {}
      for (const row of weeklyRes.data) {
        wr[row.week] = { stars: row.stars, well: row.well, impr: row.impr, focus: row.focus, quote: row.quote }
      }
      setWeeklyState(wr)
      lsSet(KEYS.weekly, wr)
    }

    if (rewardRes.data?.length) {
      const rw: Record<number, RewardData> = {}
      for (const row of rewardRes.data) {
        rw[row.week] = { selectedTag: row.selected_tag, custom: row.custom, done: row.done }
      }
      setRewardsState(rw)
      lsSet(KEYS.rewards, rw)
    }
  }

  // ── Config ─────────────────────────────────────────────────────────────────

  const saveConfig = useCallback((c: Config) => {
    setConfigState(c)
    lsSet(KEYS.config, c)
    if (c.darkMode) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')

    // Upsert profile in Supabase (creates on first save, updates on subsequent)
    if (anonIdRef.current) {
      supabase.from('bj_profiles').upsert({
        anon_id: anonIdRef.current,
        start_date: c.startDate,
        start_weight: c.startWeight,
        dark_mode: c.darkMode,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'anon_id' }).select('id').single().then(({ data }: { data: { id: string } | null }) => {
        if (data) userIdRef.current = data.id
      })
    }
  }, [])

  const toggleDarkMode = useCallback(() => {
    setConfigState((prev: Config | null) => {
      if (!prev) return prev
      const next = { ...prev, darkMode: !prev.darkMode }
      lsSet(KEYS.config, next)
      document.documentElement.classList.toggle('dark', next.darkMode)
      if (userIdRef.current) {
        supabase.from('bj_profiles').update({ dark_mode: next.darkMode, updated_at: new Date().toISOString() }).eq('id', userIdRef.current)
      }
      return next
    })
  }, [])

  // ── Daily data ─────────────────────────────────────────────────────────────

  const getDayData = useCallback((key: string): DayData => {
    return daily[key] ?? defaultDayData()
  }, [daily])

  const updateDay = useCallback((key: string, updater: (d: DayData) => DayData) => {
    setDailyState((prev: Record<string, DayData>) => {
      const cur = prev[key] ?? defaultDayData()
      const next = { ...prev, [key]: updater(cur) }
      lsSet(KEYS.daily, next)
      if (userIdRef.current) {
        supabase.from('bj_daily').upsert({
          user_id: userIdRef.current,
          date: key,
          data: next[key],
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,date' })
      }
      return next
    })
  }, [])

  // ── Habits ─────────────────────────────────────────────────────────────────

  const saveHabits = useCallback((h: HabitGroup[]) => {
    setHabitsState(h)
    lsSet(KEYS.habits, h)
    if (userIdRef.current) {
      supabase.from('bj_habits').upsert({
        user_id: userIdRef.current,
        habits: h,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
    }
  }, [])

  // ── Weight ─────────────────────────────────────────────────────────────────

  const saveWeight = useCallback((milestone: number, val: number) => {
    setWeightState((prev: Record<number, number>) => {
      const next = { ...prev, [milestone]: val }
      lsSet(KEYS.weight, next)
      if (userIdRef.current) {
        supabase.from('bj_weight').upsert({
          user_id: userIdRef.current,
          milestone,
          weight: val,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,milestone' })
      }
      return next
    })
  }, [])

  // ── Measurements ───────────────────────────────────────────────────────────

  const saveMeasurement = useCallback((milestone: number, label: string, val: string) => {
    setMeasurementsState((prev: Record<number, Measurements>) => {
      const next = {
        ...prev,
        [milestone]: { ...(prev[milestone] ?? {}), [label]: val }
      }
      lsSet(KEYS.measurements, next)
      if (userIdRef.current) {
        supabase.from('bj_measurements').upsert({
          user_id: userIdRef.current,
          milestone,
          data: next[milestone],
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,milestone' })
      }
      return next
    })
  }, [])

  // ── Weekly review ──────────────────────────────────────────────────────────

  const saveWeekly = useCallback((week: number, data: WeekReview) => {
    setWeeklyState((prev: Record<number, WeekReview>) => {
      const next = { ...prev, [week]: data }
      lsSet(KEYS.weekly, next)
      if (userIdRef.current) {
        supabase.from('bj_weekly').upsert({
          user_id: userIdRef.current,
          week,
          stars: data.stars,
          well: data.well,
          impr: data.impr,
          focus: data.focus,
          quote: data.quote,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,week' })
      }
      return next
    })
  }, [])

  // ── Rewards ────────────────────────────────────────────────────────────────

  const saveReward = useCallback((week: number, data: RewardData) => {
    setRewardsState((prev: Record<number, RewardData>) => {
      const next = { ...prev, [week]: data }
      lsSet(KEYS.rewards, next)
      if (userIdRef.current) {
        supabase.from('bj_rewards').upsert({
          user_id: userIdRef.current,
          week,
          selected_tag: data.selectedTag,
          custom: data.custom,
          done: data.done,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,week' })
      }
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

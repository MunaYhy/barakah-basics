'use client'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { dateKey } from '@/lib/dates'

export interface DailyLog {
  id?: string
  user_id: string
  date: string
  intention: string
  water_cups: number
  ate: boolean
  vitamins: boolean
  moved: boolean
  reflection_answer: string
}

export interface FeedEntry {
  id: string
  logged_at: string
  duration_minutes: number | null
}

export interface Profile {
  id: string
  anon_id: string
  name: string | null
  baby_birth_date: string | null
  start_date: string
}

const EMPTY_LOG = (userId: string): DailyLog => ({
  user_id: userId,
  date: dateKey(),
  intention: '',
  water_cups: 0,
  ate: false,
  vitamins: false,
  moved: false,
  reflection_answer: '',
})

export function useDaily() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [log, setLog] = useState<DailyLog | null>(null)
  const [feeds, setFeeds] = useState<FeedEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      // Ensure anonymous session
      let { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        await supabase.auth.signInAnonymously()
        session = (await supabase.auth.getSession()).data.session
      }
      const uid = session?.user.id
      if (!uid) return

      // Fetch profile
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('anon_id', uid)
        .single()
      setProfile(prof)
      if (!prof) return

      // Fetch today's log
      const today = dateKey()
      const { data: logData } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', prof.id)
        .eq('date', today)
        .single()
      setLog(logData ?? EMPTY_LOG(prof.id))

      // Fetch today's feeds
      const { data: feedData } = await supabase
        .from('baby_feeds')
        .select('id, logged_at, duration_minutes')
        .eq('user_id', prof.id)
        .eq('date', today)
        .order('logged_at', { ascending: false })
      setFeeds(feedData ?? [])

      setLoading(false)
    }
    init()
  }, [])

  const saveLog = useCallback(async (updates: Partial<DailyLog>) => {
    if (!log) return
    const merged = { ...log, ...updates }
    setLog(merged)
    await supabase.from('daily_logs').upsert(merged, { onConflict: 'user_id,date' })
  }, [log])

  const addFeed = useCallback(async () => {
    if (!profile) return
    const now = new Date().toISOString()
    const { data } = await supabase
      .from('baby_feeds')
      .insert({ user_id: profile.id, logged_at: now, date: dateKey() })
      .select('id, logged_at, duration_minutes')
      .single()
    if (data) setFeeds(prev => [data, ...prev])
  }, [profile])

  return { profile, log, feeds, saveLog, addFeed, loading }
}

'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        await supabase.auth.signInAnonymously()
      }
      const uid = (await supabase.auth.getUser()).data.user?.id
      if (!uid) return router.replace('/onboarding')

      const { data } = await supabase.from('profiles').select('id').eq('anon_id', uid).single()
      router.replace(data ? '/daily' : '/onboarding')
    }
    check()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gm font-bold animate-pulse">بِسْمِ اللَّهِ</div>
    </div>
  )
}

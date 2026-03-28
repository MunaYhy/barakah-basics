'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { lsGet, KEYS } from '@/lib/storage'

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    const config = lsGet(KEYS.config, null)
    if (!config) router.replace('/onboarding')
    else router.replace('/daily')
  }, [router])
  return null
}

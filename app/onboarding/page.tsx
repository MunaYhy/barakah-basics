'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { dateKey } from '@/lib/dates'

type Step = 'info' | 'welcome'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('info')
  const [name, setName] = useState('')
  const [babyDate, setBabyDate] = useState(dateKey())
  const [saving, setSaving] = useState(false)

  const handleContinue = async () => {
    setSaving(true)
    let { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      await supabase.auth.signInAnonymously()
      session = (await supabase.auth.getSession()).data.session
    }
    const uid = session?.user.id
    if (!uid) return

    await supabase.from('profiles').insert({
      anon_id: uid,
      name: name.trim() || null,
      baby_birth_date: babyDate,
      start_date: dateKey(),
    })
    setSaving(false)
    setStep('welcome')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gp to-gpaper dark:from-gray-950 dark:to-gray-900">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="bg-gradient-to-br from-gd to-gm rounded-3xl p-7 text-white text-center mb-4 shadow-xl">
          <div className="font-amiri text-lg text-gdot mb-2" dir="rtl">بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيمِ</div>
          <div className="text-3xl mb-2">🌿</div>
          <h1 className="font-extrabold text-2xl leading-tight">Barakah Basics</h1>
          <p className="text-xs opacity-80 font-semibold mt-1">Simple Daily Tracker for New Moms</p>
        </div>

        {step === 'info' && (
          <div className="card p-6">
            <h2 className="font-extrabold text-lg text-gd dark:text-gl mb-5 text-center">Let's get you set up</h2>

            <label className="text-xs font-bold text-inks dark:text-gray-400 uppercase tracking-wide block mb-1">
              Your name (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Fatima"
              value={name}
              onChange={e => setName(e.target.value)}
              className="inp mb-4"
            />

            <label className="text-xs font-bold text-inks dark:text-gray-400 uppercase tracking-wide block mb-1">
              Baby's birth date
            </label>
            <input
              type="date"
              value={babyDate}
              onChange={e => setBabyDate(e.target.value)}
              className="inp mb-6"
            />

            <button
              onClick={handleContinue}
              disabled={saving}
              className="btn-green w-full"
            >
              {saving ? 'Setting up...' : 'Continue →'}
            </button>
          </div>
        )}

        {step === 'welcome' && (
          <div className="card p-6 text-center">
            <div className="text-4xl mb-3">✨</div>
            <h2 className="font-extrabold text-xl text-gd dark:text-gl mb-2">
              {name ? `Ahlan, ${name}!` : 'You are ready!'}
            </h2>
            <p className="text-sm text-inks dark:text-gray-300 font-semibold leading-relaxed mb-4">
              You just grew a human being. You are extraordinary. This app is here to gently remind you to take care of yourself — one small habit at a time.
            </p>
            <div className="bg-gp dark:bg-gray-800 rounded-xl p-3 mb-5 text-xs">
              <div className="font-amiri text-gd dark:text-gl text-base mb-1" dir="rtl">
                إِنَّ مَعَ الْعُسْرِ يُسْرًا
              </div>
              <div className="text-inks dark:text-gray-400 font-semibold italic">
                "Indeed, with hardship comes ease." — Quran 94:6
              </div>
            </div>
            <button onClick={() => router.replace('/daily')} className="btn-green w-full text-base py-3">
              🌿 Start Today
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

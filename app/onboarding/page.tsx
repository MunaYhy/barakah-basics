'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { lsSet, KEYS } from '@/lib/storage'

type Step = 'date' | 'weight' | 'welcome'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('date')
  const [startDate, setStartDate] = useState('2026-03-23')
  const [startWeight, setStartWeight] = useState('')

  const finishOnboarding = () => {
    lsSet(KEYS.config, {
      startDate,
      startWeight: parseFloat(startWeight) || 0,
      darkMode: false,
    })
    router.replace('/daily')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gp to-gpaper dark:from-gray-950 dark:to-gray-900">
      <div className="w-full max-w-sm">
        {/* Header card */}
        <div className="bg-gradient-to-br from-gd to-gm rounded-3xl p-7 text-white text-center mb-4 shadow-xl">
          <div className="font-amiri text-lg text-gdot mb-2" dir="rtl">بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيمِ</div>
          <div className="text-3xl mb-2">🌿</div>
          <h1 className="font-extrabold text-2xl leading-tight">Barakah Journey</h1>
          <p className="text-xs opacity-80 font-semibold mt-1">90-Day Postpartum Wellness Planner</p>
        </div>

        {/* Step: date */}
        {step === 'date' && (
          <div className="card p-6">
            <div className="text-center mb-5">
              <div className="text-3xl mb-2">📅</div>
              <h2 className="font-extrabold text-lg text-gd dark:text-gl">When does your journey start?</h2>
              <p className="text-xs text-inks dark:text-gray-400 font-semibold mt-1">
                This sets Day 1 of your 90-day challenge
              </p>
            </div>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="inp mb-4"
            />
            <button onClick={() => setStep('weight')} className="btn-green w-full">
              Continue →
            </button>
          </div>
        )}

        {/* Step: weight */}
        {step === 'weight' && (
          <div className="card p-6">
            <div className="text-center mb-5">
              <div className="text-3xl mb-2">⚖️</div>
              <h2 className="font-extrabold text-lg text-gd dark:text-gl">Starting weight</h2>
              <p className="text-xs text-inks dark:text-gray-400 font-semibold mt-1">
                Optional — used to track your progress over 90 days
              </p>
            </div>
            <div className="relative mb-4">
              <input
                type="number"
                step="0.1"
                min="30"
                max="200"
                placeholder="e.g. 72.5"
                value={startWeight}
                onChange={e => setStartWeight(e.target.value)}
                className="inp pr-10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-inks dark:text-gray-400">kg</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep('date')} className="btn-ghost flex-1">← Back</button>
              <button onClick={() => setStep('welcome')} className="btn-green flex-1">Continue →</button>
            </div>
            <button onClick={() => setStep('welcome')}
              className="w-full text-center text-xs text-inks dark:text-gray-500 font-semibold mt-3 hover:underline">
              Skip for now
            </button>
          </div>
        )}

        {/* Step: welcome */}
        {step === 'welcome' && (
          <div className="card p-6 text-center">
            <div className="text-4xl mb-3">✨</div>
            <h2 className="font-extrabold text-xl text-gd dark:text-gl mb-2">بِسْمِ اللَّهِ — You are ready!</h2>
            <p className="text-sm text-inks dark:text-gray-300 font-semibold leading-relaxed mb-4">
              You just grew a human being. You are extraordinary. This journey is yours — take it one day at a time, with barakah.
            </p>
            <div className="bg-gp dark:bg-gray-800 rounded-xl p-3 mb-5 text-xs">
              <div className="font-amiri text-gd dark:text-gl text-base mb-1" dir="rtl">
                إِنَّ مَعَ الْعُسْرِ يُسْرًا
              </div>
              <div className="text-inks dark:text-gray-400 font-semibold italic">
                "Indeed, with hardship comes ease." — Quran 94:6
              </div>
            </div>
            <button onClick={finishOnboarding} className="btn-green w-full text-base py-3">
              🌿 Start My Journey
            </button>
          </div>
        )}

        {/* Step indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {(['date', 'weight', 'welcome'] as Step[]).map((s, i) => (
            <div key={s} className={`w-2 h-2 rounded-full transition-all ${step === s ? 'bg-gm w-5' : 'bg-line dark:bg-gray-700'}`}/>
          ))}
        </div>
      </div>
    </div>
  )
}

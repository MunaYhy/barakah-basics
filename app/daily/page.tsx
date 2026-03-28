'use client'
import { useRouter } from 'next/navigation'
import { useDaily } from '@/hooks/useDaily'
import { daysSince } from '@/lib/dates'
import { getTodayQuestion } from '@/lib/questions'
import HabitTile from '@/components/HabitTile'
import WaterCounter from '@/components/WaterCounter'
import FeedLog from '@/components/FeedLog'
import ReflectionCard from '@/components/ReflectionCard'

export default function DailyPage() {
  const router = useRouter()
  const { profile, log, feeds, saveLog, addFeed, loading } = useDaily()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-gm font-bold animate-pulse">Loading...</p></div>
  }
  if (!profile || !log) {
    router.replace('/onboarding')
    return null
  }

  const dayNum = profile.baby_birth_date ? daysSince(profile.baby_birth_date) + 1 : null
  const question = getTodayQuestion()
  const habitsComplete = log.ate && log.vitamins && log.moved && log.water_cups >= 8
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="min-h-screen bg-gpaper dark:bg-gray-950 pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-gd to-gm text-white px-5 pt-10 pb-6">
        <p className="text-xs font-bold opacity-70 uppercase tracking-wide">{today}</p>
        <h1 className="font-extrabold text-2xl mt-1">
          {profile.name ? `Ahlan, ${profile.name} 🌿` : 'Good day, mama 🌿'}
        </h1>
        {dayNum && (
          <p className="text-sm opacity-80 font-semibold mt-1">Day {dayNum} postpartum</p>
        )}
        {habitsComplete && (
          <div className="mt-3 bg-white/20 rounded-xl px-3 py-1 inline-block text-sm font-bold">
            ✨ All habits done today!
          </div>
        )}
      </div>

      <div className="px-4 pt-5 space-y-4">

        {/* Intention */}
        <div className="card p-4">
          <h2 className="font-extrabold text-gd dark:text-gl text-sm uppercase tracking-wide mb-3">Today's Intention</h2>
          <textarea
            value={log.intention}
            onChange={e => saveLog({ intention: e.target.value })}
            placeholder="What is my intention for today?"
            rows={2}
            className="inp resize-none"
          />
        </div>

        {/* Habits */}
        <div className="card p-4">
          <h2 className="font-extrabold text-gd dark:text-gl text-sm uppercase tracking-wide mb-3">Daily Habits</h2>

          {/* Water */}
          <div className="mb-4">
            <p className="text-xs font-bold text-inks dark:text-gray-400 mb-2">💧 Water</p>
            <WaterCounter cups={log.water_cups} onChange={cups => saveLog({ water_cups: cups })} />
          </div>

          {/* 3 checkboxes */}
          <div className="grid grid-cols-3 gap-2">
            <HabitTile emoji="🍽️" label="Ate" done={log.ate} onToggle={() => saveLog({ ate: !log.ate })} />
            <HabitTile emoji="💊" label="Vitamins" done={log.vitamins} onToggle={() => saveLog({ vitamins: !log.vitamins })} />
            <HabitTile emoji="🚶" label="Moved" done={log.moved} onToggle={() => saveLog({ moved: !log.moved })} />
          </div>
        </div>

        {/* Baby Feeds */}
        <div className="card p-4">
          <h2 className="font-extrabold text-gd dark:text-gl text-sm uppercase tracking-wide mb-3">Baby Feeds</h2>
          <FeedLog feeds={feeds} onAdd={addFeed} />
        </div>

        {/* Reflection */}
        <div className="card p-4">
          <h2 className="font-extrabold text-gd dark:text-gl text-sm uppercase tracking-wide mb-3">Reflection</h2>
          <ReflectionCard
            question={question}
            answer={log.reflection_answer}
            onChange={v => saveLog({ reflection_answer: v })}
            onSave={() => {}}
          />
        </div>

        {/* Progress link */}
        <button
          onClick={() => router.push('/progress')}
          className="w-full text-center text-sm text-gm dark:text-gl font-bold py-2 hover:underline"
        >
          View my streak →
        </button>

      </div>
    </div>
  )
}

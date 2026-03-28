'use client'
import { RULES } from '@/lib/data'

const CAT_COLOR: Record<string, string> = {
  Spiritual: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  Physical:  'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  Mind:      'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  'Self-Care': 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300',
}

export default function RulesPage() {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-gd to-gm px-4 pt-5 pb-6 md:px-8 text-center text-white">
        <div className="font-amiri text-lg text-gdot mb-2" dir="rtl">بِسْمِ اللَّهِ</div>
        <h1 className="font-extrabold text-2xl mb-1">📜 Your 90-Day Rules</h1>
        <p className="text-sm opacity-80 font-semibold">Commit to these. They will change your life.</p>
      </div>

      <div className="px-4 py-4 space-y-2 md:px-8">
        {RULES.map(rule => (
          <div key={rule.n} className="card flex items-start gap-4 p-4">
            <div className="w-7 h-7 rounded-full bg-gp dark:bg-gray-800 border-2 border-gl dark:border-gray-600 flex items-center justify-center text-xs font-extrabold text-gd dark:text-gl flex-shrink-0 mt-0.5">
              {rule.n}
            </div>
            <span className="text-xl flex-shrink-0 mt-0.5">{rule.ico}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink dark:text-gray-200 leading-relaxed">{rule.t}</p>
              <span className={`inline-block text-xs font-extrabold px-2 py-0.5 rounded-full mt-1.5 ${CAT_COLOR[rule.cl] ?? ''}`}>
                {rule.cl}
              </span>
            </div>
          </div>
        ))}

        <div className="text-center py-6">
          <div className="font-amiri text-2xl text-gd dark:text-gl mb-2" dir="rtl">وَاللَّهُ مَعَكُمْ</div>
          <div className="text-sm font-semibold text-inks dark:text-gray-400">And Allah is with you. 🌿</div>
        </div>
      </div>
    </div>
  )
}

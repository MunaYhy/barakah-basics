'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore, type DayData } from '@/hooks/useStore'
import { dateKey, dayNumber } from '@/lib/dates'
import Header from '@/components/layout/Header'
import QuoteCard from '@/components/daily/QuoteCard'
import MoodTracker from '@/components/daily/MoodTracker'
import PrayerGrid from '@/components/daily/PrayerGrid'
import HabitList from '@/components/daily/HabitList'
import WaterTracker from '@/components/daily/WaterTracker'
import BreastfeedingTracker from '@/components/daily/BreastfeedingTracker'
import EmotionalCheckin from '@/components/daily/EmotionalCheckin'

const REST_ITEMS = [
  "Rested when baby slept 😴",
  "Asked for help today 💛",
  "Took a moment for myself 🌿",
  "No screens before sleep 📵",
]
const PRIORITIES_COUNT = 4
const GRATITUDE_COUNT = 3
const LEARN_COUNT = 3
const SELF_COUNT = 2

export default function DailyPage() {
  const router = useRouter()
  const store = useStore()
  const [viewDate, setViewDate] = useState(new Date())

  useEffect(() => {
    if (store.hydrated && !store.config) router.replace('/onboarding')
  }, [store.hydrated, store.config, router])

  if (!store.hydrated || !store.config) return <LoadingSpinner />

  const start = new Date(store.config.startDate + 'T00:00:00')
  const dk = dateKey(viewDate)
  const d = store.getDayData(dk)
  const dayNum = dayNumber(start, viewDate)

  const upd = (fn: (d: DayData) => DayData) => store.updateDay(dk, fn)

  // Score calculation
  const prayersDone = Object.values(d.pr).filter(Boolean).length +
    Object.values(d.su).filter(Boolean).length
  const habitsDone = Object.values(d.ha).filter(Boolean).length
  const habitsTotal = store.habits.reduce((s, g) => s + g.subs.length, 0)
  const total = 5 + 4 + habitsTotal + 6 + 4  // prayers + sunnah + habits + water + rest
  const done = prayersDone + habitsDone + d.cu + Object.values(d.restChecks).filter(Boolean).length
  const score = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div className="max-w-2xl mx-auto">
      <Header config={store.config} viewDate={viewDate} onChangeDate={setViewDate} />

      <div className="px-4 py-4 space-y-3 md:px-8">

        {/* Score bar */}
        <div className="card p-3 flex items-center gap-3">
          <div className="text-center min-w-16">
            <div className="text-2xl font-extrabold text-gd dark:text-gl">{score}%</div>
            <div className="text-xs font-bold text-inks dark:text-gray-400">Score</div>
          </div>
          <div className="flex-1">
            <div className="h-3 bg-gp dark:bg-gray-800 rounded-full overflow-hidden">
              <div className="progress-bar-fill" style={{width:`${score}%`}}/>
            </div>
            <div className="text-xs text-inks dark:text-gray-400 font-semibold mt-1">{done} / {total} completed today</div>
          </div>
          <button onClick={() => upd(d => ({ ...d, pr:{}, su:{}, ha:{}, cu:0, restChecks:{}, mood:-1, bf:0 }))}
            className="text-xs font-bold text-rose/70 hover:text-rose border border-rose/30 rounded-xl px-2 py-1.5 transition-colors">
            🔄 Reset
          </button>
        </div>

        {/* ── Inspiration ── */}
        <Section icon="✨" title="Daily Inspiration">
          <QuoteCard
            dayNum={dayNum}
            reflection={d.qlearn}
            onChange={v => upd(d => ({ ...d, qlearn: v }))}
          />
        </Section>

        {/* ── Mood ── */}
        <Section icon="😊" title="Mood & Energy">
          <MoodTracker
            mood={d.mood}
            moodNote={d.moodNote}
            onSetMood={i => upd(d => ({ ...d, mood: i }))}
            onSetNote={v => upd(d => ({ ...d, moodNote: v }))}
          />
        </Section>

        {/* ── Prayers ── */}
        <Section icon="🕌" title="Daily Prayers">
          <PrayerGrid
            fard={d.pr}
            sunnah={d.su}
            onToggleFard={p => upd(d => ({ ...d, pr: { ...d.pr, [p]: !d.pr[p] } }))}
            onToggleSunnah={s => upd(d => ({ ...d, su: { ...d.su, [s]: !d.su[s] } }))}
          />
        </Section>

        {/* ── Habits ── */}
        <Section icon="✅" title="Daily Habits">
          <HabitList
            habits={store.habits}
            checked={d.ha}
            onToggle={key => upd(d => ({ ...d, ha: { ...d.ha, [key]: !d.ha[key] } }))}
            onAddHabit={name => {
              const next = [...store.habits, {
                id: Date.now(), name, emoji: '⭐', subs: [], pick: true, op: false
              }]
              store.saveHabits(next)
            }}
            onDeleteHabit={id => store.saveHabits(store.habits.filter(h => h.id !== id))}
          />
        </Section>

        {/* ── Water ── */}
        <Section icon="💧" title="Water Intake">
          <WaterTracker
            cups={d.cu}
            onChange={n => upd(d => ({ ...d, cu: n }))}
          />
        </Section>

        {/* ── Rest ── */}
        <Section icon="🌙" title="Rest & Recovery">
          <div className="bg-gp dark:bg-gray-800 rounded-xl px-3 py-2 text-xs font-semibold text-inks dark:text-gray-300 mb-3 leading-relaxed border-l-3 border-gl">
            💛 You're postpartum — rest is not laziness, it's healing. Every nap counts.
          </div>
          <div className="space-y-2">
            {REST_ITEMS.map(item => {
              const done = !!d.restChecks[item]
              return (
                <div key={item} onClick={() => upd(d => ({ ...d, restChecks: { ...d.restChecks, [item]: !d.restChecks[item] } }))}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer select-none transition-colors
                    ${done ? 'bg-gl/30 dark:bg-gl/20' : 'bg-gpaper dark:bg-gray-800/40'} hover:bg-gp dark:hover:bg-gray-800`}>
                  <div className={`circle-check ${done ? 'checked' : ''}`}>{done && '✓'}</div>
                  <span className={`text-sm font-semibold ${done ? 'line-through opacity-60' : ''} text-ink dark:text-gray-200`}>{item}</span>
                </div>
              )
            })}
          </div>
        </Section>

        {/* ── Priorities ── */}
        <Section icon="⭐" title="Today's Priorities">
          <div className="space-y-2">
            {Array.from({ length: PRIORITIES_COUNT }).map((_, i) => {
              const p = d.pri[i] ?? { t: '', done: false }
              return (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-gp dark:bg-gray-800 border-2 border-gl dark:border-gray-600 flex items-center justify-center text-xs font-extrabold text-gd dark:text-gl flex-shrink-0">{i + 1}</span>
                  <input value={p.t}
                    onChange={e => {
                      const pri = [...d.pri]
                      while (pri.length <= i) pri.push({ t: '', done: false })
                      pri[i] = { ...pri[i], t: e.target.value }
                      upd(d => ({ ...d, pri }))
                    }}
                    placeholder={`Priority ${i + 1}…`}
                    className="flex-1 bg-transparent border-b border-dashed border-line dark:border-gray-600 outline-none text-sm font-semibold text-ink dark:text-gray-200 pb-1 placeholder:text-gdot dark:placeholder:text-gray-600"
                  />
                  <div onClick={() => {
                    const pri = [...d.pri]
                    while (pri.length <= i) pri.push({ t: '', done: false })
                    pri[i] = { ...pri[i], done: !pri[i].done }
                    upd(d => ({ ...d, pri }))
                  }}
                    className={`w-4 h-4 rounded border-2 cursor-pointer flex items-center justify-center text-xs text-white transition-all
                      ${p.done ? 'bg-gm border-gd' : 'border-gdot dark:border-gray-600 bg-white dark:bg-gray-900'}`}>
                    {p.done && '✓'}
                  </div>
                </div>
              )
            })}
          </div>
        </Section>

        {/* ── Breastfeeding ── */}
        <Section icon="🤱" title="Breastfeeding Today">
          <BreastfeedingTracker
            bf={d.bf} pump={d.pump} bfside={d.bfside} bfdur={d.bfdur}
            onBF={n => upd(d => ({ ...d, bf: n }))}
            onPump={n => upd(d => ({ ...d, pump: n }))}
            onSide={s => upd(d => ({ ...d, bfside: s }))}
            onDur={n => upd(d => ({ ...d, bfdur: n }))}
          />
        </Section>

        {/* ── Emotional check-in ── */}
        <Section icon="💙" title="How are you really feeling?">
          <EmotionalCheckin
            feelings={d.bbfeelings}
            note={d.bbnote}
            onToggle={f => {
              const next = d.bbfeelings.includes(f)
                ? d.bbfeelings.filter(x => x !== f)
                : [...d.bbfeelings, f]
              upd(d => ({ ...d, bbfeelings: next }))
            }}
            onNote={v => upd(d => ({ ...d, bbnote: v }))}
          />
        </Section>

        {/* ── Let it go ── */}
        <Section icon="🌿" title="Let It Go Today">
          <div className="text-xs text-inks dark:text-gray-400 font-semibold mb-2">✍️ I give myself permission to let go of…</div>
          <input value={d.letgo} onChange={e => upd(d => ({ ...d, letgo: e.target.value }))}
            placeholder="e.g. the messy house, not replying to messages…"
            className="inp" />
        </Section>

        {/* ── Intention / Dua ── */}
        <Section icon="🤲" title="Today's Intention / Dua">
          <input value={d.dua} onChange={e => upd(d => ({ ...d, dua: e.target.value }))}
            placeholder="Write your intention or dua…"
            className="inp" />
        </Section>

        {/* ── Gratitude ── */}
        <Section icon="🌸" title="Gratitude — I'm Grateful For…">
          <div className="space-y-2">
            {Array.from({ length: GRATITUDE_COUNT }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-base flex-shrink-0">🌸</span>
                <input value={d.gr[i] ?? ''}
                  onChange={e => {
                    const gr = [...d.gr]
                    while (gr.length <= i) gr.push('')
                    gr[i] = e.target.value
                    upd(d => ({ ...d, gr }))
                  }}
                  placeholder={`Grateful for ${i + 1}…`}
                  className="flex-1 bg-transparent border-b border-dashed border-line dark:border-gray-600 outline-none text-sm font-semibold text-ink dark:text-gray-200 pb-1 placeholder:text-gdot dark:placeholder:text-gray-600"
                />
              </div>
            ))}
          </div>
        </Section>

        {/* ── Learn ── */}
        <Section icon="💡" title="What I Learned Today">
          <div className="space-y-2 mb-3">
            {Array.from({ length: LEARN_COUNT }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-base flex-shrink-0">💡</span>
                <input value={d.lr[i] ?? ''}
                  onChange={e => {
                    const lr = [...d.lr]
                    while (lr.length <= i) lr.push('')
                    lr[i] = e.target.value
                    upd(d => ({ ...d, lr }))
                  }}
                  placeholder="I learned…"
                  className="flex-1 bg-transparent border-b border-dashed border-line dark:border-gray-600 outline-none text-sm font-semibold text-ink dark:text-gray-200 pb-1 placeholder:text-gdot dark:placeholder:text-gray-600"
                />
              </div>
            ))}
          </div>
          <div className="text-xs font-extrabold uppercase tracking-wider text-inks dark:text-gray-400 mb-2">About Myself</div>
          <div className="space-y-2">
            {Array.from({ length: SELF_COUNT }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-base flex-shrink-0">🪞</span>
                <input value={d.sl[i] ?? ''}
                  onChange={e => {
                    const sl = [...d.sl]
                    while (sl.length <= i) sl.push('')
                    sl[i] = e.target.value
                    upd(d => ({ ...d, sl }))
                  }}
                  placeholder="I discovered about myself…"
                  className="flex-1 bg-transparent border-b border-dashed border-line dark:border-gray-600 outline-none text-sm font-semibold text-ink dark:text-gray-200 pb-1 placeholder:text-gdot dark:placeholder:text-gray-600"
                />
              </div>
            ))}
          </div>
        </Section>

        {/* ── Baby Today ── */}
        <Section icon="👶" title="Baby Today">
          <div className="flex items-center gap-3 flex-wrap mb-3">
            <span className="text-sm font-bold text-inks dark:text-gray-300">Longest sleep stretch:</span>
            <input type="number" min="0" max="12" step="0.5" placeholder="hrs"
              value={d.babyslp || ''}
              onChange={e => upd(d => ({ ...d, babyslp: Number(e.target.value) }))}
              className="inp w-20 text-center"
            />
            <span className="text-sm text-inks dark:text-gray-400 font-semibold">hours</span>
          </div>
          <div className="text-xs font-extrabold uppercase tracking-wider text-gm dark:text-gl mb-2">🌟 Today's win just for baby</div>
          <input value={d.babywin} onChange={e => upd(d => ({ ...d, babywin: e.target.value }))}
            placeholder="First smile, held my finger, made a new sound… 🥹"
            className="inp"
          />
        </Section>

        {/* ── Journal ── */}
        <Section icon="📝" title="Journal & Thoughts">
          <textarea value={d.jn} onChange={e => upd(d => ({ ...d, jn: e.target.value }))}
            placeholder="Write freely… your thoughts, reflections…"
            rows={5}
            className="inp resize-none leading-7"
            style={{background:'repeating-linear-gradient(to bottom,transparent,transparent 27px,rgba(181,227,204,0.4) 27px,rgba(181,227,204,0.4) 28px)'}}
          />
        </Section>

        {/* ── Notes ── */}
        <Section icon="💭" title="Reminders & Notes">
          <textarea value={d.nt} onChange={e => upd(d => ({ ...d, nt: e.target.value }))}
            placeholder="Quick notes, reminders, ideas…"
            rows={3}
            className="inp resize-none"
          />
        </Section>

      </div>
    </div>
  )
}

function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="sec-card">
      <div className="sec-label">{icon} {title}</div>
      {children}
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-4xl animate-pulse">🌿</div>
    </div>
  )
}

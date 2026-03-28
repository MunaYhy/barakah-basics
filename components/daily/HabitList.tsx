'use client'
import { useState } from 'react'
import { type HabitGroup } from '@/lib/data'

type Props = {
  habits: HabitGroup[]
  checked: Record<string, boolean>
  onToggle: (key: string) => void
  onAddHabit: (name: string) => void
  onDeleteHabit: (id: number) => void
}

export default function HabitList({ habits, checked, onToggle, onAddHabit, onDeleteHabit }: Props) {
  const [newName, setNewName] = useState('')
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

  const add = () => {
    if (!newName.trim()) return
    onAddHabit(newName.trim())
    setNewName('')
  }

  const toggleExpand = (id: number) => {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-2">
      {habits.map(grp => {
        const isOpen = expanded.has(grp.id)
        const doneCount = grp.subs.filter(s => checked[`${grp.id}:${s}`]).length

        return (
          <div key={grp.id}>
            {/* Group header */}
            <div
              className={`habit-row ${doneCount === grp.subs.length && grp.subs.length > 0 ? 'checked' : ''}`}
              onClick={() => toggleExpand(grp.id)}>
              <div className="flex-1 flex items-center gap-2">
                <span className="text-lg">{grp.emoji}</span>
                <span className="font-bold text-sm text-ink dark:text-gray-100">{grp.name}</span>
                <span className="text-xs font-bold text-inks dark:text-gray-400">{doneCount}/{grp.subs.length}</span>
              </div>
              <span className="text-xs text-inks dark:text-gray-400 transition-transform duration-200"
                style={{transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}}>▼</span>
              <button
                onClick={e => { e.stopPropagation(); onDeleteHabit(grp.id) }}
                className="text-xs text-rose/60 hover:text-rose px-1 transition-colors">✕</button>
            </div>

            {/* Sub-habits */}
            {isOpen && (
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-dashed border-gdot dark:border-gray-700 pl-3">
                {grp.subs.map(sub => {
                  const key = `${grp.id}:${sub}`
                  const done = !!checked[key]
                  return (
                    <div key={sub}
                      onClick={() => onToggle(key)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer select-none transition-colors
                        ${done ? 'bg-gl/30 dark:bg-gl/20' : 'bg-gpaper dark:bg-gray-800/40'} hover:bg-gp dark:hover:bg-gray-800`}>
                      <div className={`circle-check ${done ? 'checked' : ''}`}>
                        {done && '✓'}
                      </div>
                      <span className={`text-sm font-semibold ${done ? 'line-through opacity-60 text-ink dark:text-gray-400' : 'text-ink dark:text-gray-200'}`}>
                        {sub}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

      {/* Add new habit group */}
      <div className="flex gap-2 mt-2">
        <input
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="+ Add habit group…"
          maxLength={40}
          className="inp flex-1"
        />
        <button onClick={add} className="btn-green px-4">Add</button>
      </div>
    </div>
  )
}

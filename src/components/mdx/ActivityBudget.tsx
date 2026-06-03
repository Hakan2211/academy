import { useState } from 'react'
import { cn } from '#/lib/cn'
import { clamp, formatMinutes } from '#/lib/health'

// Add activities to a weekly plan. Vigorous activities count double toward
// the ~150-min moderate equivalent target (guideline: 150 min mod OR 75 min vig).
// Shows how multiple small bouts add up.

type Activity = {
  id: string
  label: string
  emoji: string
  vigorous: boolean
  defaultMin: number
}

const ACTIVITIES: Array<Activity> = [
  { id: 'walk', label: 'Brisk walk', emoji: '🚶', vigorous: false, defaultMin: 30 },
  { id: 'cycle', label: 'Cycling', emoji: '🚲', vigorous: false, defaultMin: 30 },
  { id: 'gym', label: 'Gym session', emoji: '🏋️', vigorous: true, defaultMin: 45 },
  { id: 'sport', label: 'Team sport', emoji: '⚽', vigorous: true, defaultMin: 60 },
  { id: 'garden', label: 'Gardening', emoji: '🌱', vigorous: false, defaultMin: 40 },
  { id: 'swim', label: 'Swimming', emoji: '🏊', vigorous: true, defaultMin: 30 },
  { id: 'yoga', label: 'Yoga / stretch', emoji: '🧘', vigorous: false, defaultMin: 30 },
  { id: 'dance', label: 'Dancing', emoji: '💃', vigorous: false, defaultMin: 30 },
]

const TARGET_MIN = 150 // weekly moderate-equivalent minutes

type Entry = { activityId: string; minutes: number }

export function ActivityBudget() {
  const [entries, setEntries] = useState<Array<Entry>>([
    { activityId: 'walk', minutes: 30 },
  ])

  const addEntry = (id: string) => {
    const act = ACTIVITIES.find((a) => a.id === id)
    if (!act) return
    setEntries((prev) => [...prev, { activityId: id, minutes: act.defaultMin }])
  }

  const removeEntry = (idx: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== idx))
  }

  const updateMinutes = (idx: number, val: number) => {
    setEntries((prev) => prev.map((e, i) => (i === idx ? { ...e, minutes: clamp(val, 5, 120) } : e)))
  }

  // Vigorous counts double toward the moderate-equivalent total
  const moderateEquiv = entries.reduce((sum, e) => {
    const act = ACTIVITIES.find((a) => a.id === e.activityId)
    return sum + (act?.vigorous ? e.minutes * 2 : e.minutes)
  }, 0)

  const totalRaw = entries.reduce((sum, e) => sum + e.minutes, 0)
  const pct = clamp(moderateEquiv / TARGET_MIN, 0, 1)
  const met = moderateEquiv >= TARGET_MIN

  const barColor = met ? '#2ECC71' : pct >= 0.6 ? '#E67E22' : 'var(--color-accent)'

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-xs text-muted">
        Build your weekly activity plan. <span className="font-semibold text-ink">Vigorous</span> activities count
        double toward the{' '}
        <span className="font-semibold text-ink">~150-min moderate-equivalent</span> weekly target.
      </p>

      {/* Entry list */}
      <div className="mb-3 space-y-2">
        {entries.map((entry, idx) => {
          const act = ACTIVITIES.find((a) => a.id === entry.activityId)
          if (!act) return null
          return (
            <div key={idx} className="flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-3 py-2">
              <span className="text-base">{act.emoji}</span>
              <span className="min-w-0 flex-1 text-xs text-ink truncate">{act.label}</span>
              {act.vigorous && (
                <span className="shrink-0 rounded-full border border-warn/40 bg-warn/10 px-1.5 py-0.5 text-xs text-warn">
                  ×2
                </span>
              )}
              <div className="flex items-center gap-1.5">
                <input
                  type="range"
                  className="accent-accent w-20"
                  min={5}
                  max={120}
                  step={5}
                  value={entry.minutes}
                  onChange={(e) => updateMinutes(idx, Number(e.target.value))}
                  aria-label={`${act.label} minutes`}
                />
                <span className="w-9 text-right font-mono text-xs text-ink">{entry.minutes}m</span>
              </div>
              <button
                type="button"
                onClick={() => removeEntry(idx)}
                className="shrink-0 rounded-lg border border-border px-1.5 py-0.5 text-xs text-muted hover:text-ink transition-colors"
                aria-label="Remove"
              >
                ✕
              </button>
            </div>
          )
        })}

        {entries.length === 0 && (
          <p className="py-3 text-center text-xs text-muted">No activities yet — add one below.</p>
        )}
      </div>

      {/* Add activity */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {ACTIVITIES.map((act) => (
          <button
            key={act.id}
            type="button"
            onClick={() => addEntry(act.id)}
            className={cn(
              'flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs text-muted hover:text-ink transition-colors',
            )}
          >
            <span>{act.emoji}</span>
            <span>+ {act.label}</span>
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mb-2">
        <div className="mb-1 flex justify-between text-xs">
          <span className="text-muted">
            Weekly total (moderate-equivalent)
          </span>
          <span className="font-mono font-semibold text-ink">
            {formatMinutes(moderateEquiv)} / {formatMinutes(TARGET_MIN)}
          </span>
        </div>
        <div className="h-4 w-full overflow-hidden rounded-full bg-surface-2 border border-border">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${pct * 100}%`, backgroundColor: barColor }}
          />
        </div>
        {met && (
          <p className="mt-1 text-xs font-semibold" style={{ color: '#2ECC71' }}>
            Weekly guideline met!
          </p>
        )}
      </div>

      {/* Summary row */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-xl border border-border bg-surface-2 py-2">
          <div className="font-bold text-ink">{formatMinutes(totalRaw)}</div>
          <div className="text-muted">actual time</div>
        </div>
        <div className="rounded-xl border border-border bg-surface-2 py-2">
          <div className="font-bold text-ink">{formatMinutes(moderateEquiv)}</div>
          <div className="text-muted">mod. equivalent</div>
        </div>
        <div className="rounded-xl border border-border bg-surface-2 py-2">
          <div className="font-bold" style={{ color: barColor }}>
            {Math.min(Math.round(pct * 100), 100)}%
          </div>
          <div className="text-muted">of target</div>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted">
        Even short bouts (10–15 min) count — the total across the week is what matters most.
      </p>
    </div>
  )
}

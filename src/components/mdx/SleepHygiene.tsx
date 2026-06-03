import { useState } from 'react'
import { cn } from '#/lib/cn'

// Toggle sleep-hygiene factors on/off → a sleep-quality score updates.
// Each factor has a short "why" note. The score sums weighted points.

type Factor = {
  id: string
  label: string
  why: string
  points: number
}

const FACTORS: Array<Factor> = [
  {
    id: 'schedule',
    label: 'Consistent wake time (7 days)',
    why: 'Anchors your circadian rhythm — the most powerful single sleep habit.',
    points: 20,
  },
  {
    id: 'dark',
    label: 'Dark bedroom',
    why: 'Even dim light suppresses melatonin and reduces slow-wave sleep depth.',
    points: 12,
  },
  {
    id: 'cool',
    label: 'Cool bedroom (~18°C / 65°F)',
    why: 'Core body temperature must fall ~1°C to initiate and maintain sleep.',
    points: 12,
  },
  {
    id: 'screens',
    label: 'No screens 60 min before bed',
    why: 'Blue-spectrum light delays melatonin onset by up to 3 hours.',
    points: 14,
  },
  {
    id: 'caffeine',
    label: 'No caffeine after 2 pm',
    why: "Caffeine's half-life is ~5–7 h; it blocks adenosine (sleepiness) signals.",
    points: 14,
  },
  {
    id: 'windown',
    label: 'Wind-down routine (30+ min)',
    why: 'Signals to the nervous system that the day is over; lowers arousal.',
    points: 10,
  },
  {
    id: 'alcohol',
    label: 'No alcohol in the evening',
    why: 'Alcohol fragments sleep and suppresses REM — you may fall asleep fast but sleep poorly.',
    points: 10,
  },
  {
    id: 'bedrule',
    label: 'Bed is for sleep only (no phones/TV)',
    why: 'Strengthens the mental association between bed and sleepiness (stimulus control).',
    points: 8,
  },
]

const MAX_SCORE = FACTORS.reduce((s, f) => s + f.points, 0)

function scoreLabel(score: number): { text: string; cls: string } {
  const pct = score / MAX_SCORE
  if (pct >= 0.9) return { text: 'Excellent — great sleep architecture likely', cls: 'text-success' }
  if (pct >= 0.7) return { text: 'Good — minor tweaks would help', cls: 'text-accent' }
  if (pct >= 0.5) return { text: 'Fair — several habits are undermining sleep quality', cls: 'text-warn' }
  if (pct >= 0.3) return { text: 'Poor — sleep is probably fragmented and unrefreshing', cls: 'text-warn' }
  return { text: 'Very poor — addressing even 2–3 factors will make a noticeable difference', cls: 'text-red-400' }
}

export function SleepHygiene() {
  const [enabled, setEnabled] = useState<Set<string>>(new Set())
  const [expanded, setExpanded] = useState<string | null>(null)

  function toggle(id: string) {
    setEnabled((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const score = FACTORS.filter((f) => enabled.has(f.id)).reduce((s, f) => s + f.points, 0)
  const pct = Math.round((score / MAX_SCORE) * 100)
  const { text: lbl, cls } = scoreLabel(score)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-1 text-sm font-semibold text-ink">Sleep hygiene score</p>
      <p className="mb-4 text-xs text-muted">
        Toggle which habits you currently practice. Tap a habit to see why it matters.
      </p>

      {/* Score bar */}
      <div className="mb-4">
        <div className="flex items-end justify-between mb-1">
          <span className="text-xs text-muted">Sleep quality</span>
          <span className={cn('text-2xl font-bold', cls)}>{pct}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-surface-2 border border-border">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${pct}%`,
              background:
                pct >= 70
                  ? 'var(--color-accent)'
                  : pct >= 50
                    ? '#f97316'
                    : '#ef4444',
            }}
          />
        </div>
        <p className={cn('mt-1.5 text-xs font-medium', cls)}>{lbl}</p>
      </div>

      {/* Factor toggles */}
      <div className="flex flex-col gap-2">
        {FACTORS.map((f) => {
          const on = enabled.has(f.id)
          const open = expanded === f.id
          return (
            <div key={f.id} className={cn(
              'rounded-xl border transition-colors',
              on ? 'border-accent bg-accent/8' : 'border-border bg-surface-2',
            )}>
              <div className="flex items-center gap-3 px-3 py-2.5">
                {/* Toggle */}
                <button
                  type="button"
                  onClick={() => toggle(f.id)}
                  aria-pressed={on}
                  className={cn(
                    'flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors',
                    on ? 'border-accent bg-accent' : 'border-border bg-surface',
                  )}
                >
                  <span
                    className={cn(
                      'inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform',
                      on ? 'translate-x-[18px]' : 'translate-x-[2px]',
                    )}
                  />
                </button>

                {/* Label + points */}
                <button
                  type="button"
                  className="flex flex-1 items-center justify-between text-left"
                  onClick={() => setExpanded(open ? null : f.id)}
                >
                  <span className={cn('text-xs font-medium', on ? 'text-ink' : 'text-muted')}>
                    {f.label}
                  </span>
                  <span className={cn('ml-2 text-xs font-semibold shrink-0', on ? 'text-accent' : 'text-muted')}>
                    +{f.points} pts
                  </span>
                </button>
              </div>

              {/* Expandable why */}
              {open && (
                <div className="border-t border-border px-3 pb-2.5 pt-2">
                  <p className="text-xs text-muted leading-relaxed">
                    <span className="font-semibold text-ink">Why it helps: </span>
                    {f.why}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p className="mt-3 text-xs text-muted">
        Tap the label or "+pts" badge to expand the science behind each habit.
      </p>
    </div>
  )
}

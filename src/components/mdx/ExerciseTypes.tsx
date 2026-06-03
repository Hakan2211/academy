import { useState } from 'react'
import { cn } from '#/lib/cn'

// The four pillars of exercise. Click a type to see what it improves
// and example activities. A note below reinforces that all four belong
// in a complete routine.

type ExType = {
  id: string
  label: string
  emoji: string
  color: string
  improves: string[]
  examples: string[]
  why: string
}

const TYPES: Array<ExType> = [
  {
    id: 'cardio',
    label: 'Cardio / Aerobic',
    emoji: '🏃',
    color: '#E74C3C',
    improves: ['Heart & lung capacity', 'Endurance', 'Mood & mental health', 'Sleep quality', 'Calorie metabolism'],
    examples: ['Running or jogging', 'Cycling', 'Swimming', 'Dancing'],
    why: 'Aerobic exercise trains your heart and lungs to deliver oxygen more efficiently — the foundation of cardiovascular health.',
  },
  {
    id: 'strength',
    label: 'Strength / Resistance',
    emoji: '🏋️',
    color: '#E67E22',
    improves: ['Muscle size & strength', 'Bone density', 'Metabolic rate', 'Posture', 'Injury resilience'],
    examples: ['Weight lifting', 'Bodyweight exercises (push-ups, squats)', 'Resistance bands', 'Kettlebell work'],
    why: 'Resistance training forces muscles and bones to adapt by growing stronger — essential for countering age-related muscle loss (sarcopenia).',
  },
  {
    id: 'flexibility',
    label: 'Flexibility / Mobility',
    emoji: '🧘',
    color: '#9B59B6',
    improves: ['Range of motion', 'Posture', 'Injury prevention', 'Recovery between sessions', 'Reduced muscle tension'],
    examples: ['Static stretching', 'Yoga', 'Pilates', 'Foam rolling'],
    why: 'Keeping muscles and joints supple reduces injury risk and allows you to move well during every other type of exercise.',
  },
  {
    id: 'balance',
    label: 'Balance & Stability',
    emoji: '🤸',
    color: '#2ECC71',
    improves: ['Fall prevention', 'Core strength', 'Joint stability', 'Coordination', 'Athletic performance'],
    examples: ['Tai chi', 'Single-leg exercises', 'Stability ball work', 'Standing yoga poses'],
    why: 'Balance training strengthens the small stabilising muscles around joints and trains the nervous system — especially important as we age.',
  },
]

export function ExerciseTypes() {
  const [activeId, setActiveId] = useState<string>('cardio')
  const active = TYPES.find((t) => t.id === activeId) ?? TYPES[0]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Type selector */}
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {TYPES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveId(t.id)}
            className={cn(
              'rounded-xl border px-3 py-2.5 text-left text-xs transition-colors',
              activeId === t.id
                ? 'border-accent bg-accent/15 font-semibold text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
            style={
              activeId === t.id
                ? { borderColor: t.color, color: t.color, backgroundColor: t.color + '22' }
                : {}
            }
          >
            <span className="mr-1">{t.emoji}</span>
            <span className="leading-tight">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Info panel */}
      <div
        className="rounded-xl border p-3 text-sm"
        style={{ borderColor: active.color + '66', backgroundColor: active.color + '11' }}
      >
        <p className="mb-2 text-xs text-muted italic">{active.why}</p>

        <div className="flex flex-col gap-3 sm:flex-row">
          {/* What it improves */}
          <div className="flex-1">
            <p className="mb-1 text-xs font-semibold text-ink">What it improves:</p>
            <ul className="space-y-0.5">
              {active.improves.map((item) => (
                <li key={item} className="flex items-center gap-1.5 text-xs text-muted">
                  <span style={{ color: active.color }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Example activities */}
          <div className="flex-1">
            <p className="mb-1 text-xs font-semibold text-ink">Example activities:</p>
            <ul className="space-y-0.5">
              {active.examples.map((ex) => (
                <li key={ex} className="flex items-center gap-1.5 text-xs text-muted">
                  <span style={{ color: active.color }}>→</span>
                  {ex}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* All-four reminder */}
      <div className="mt-3 rounded-xl border border-border bg-surface-2 px-3 py-2 text-xs text-muted">
        <span className="font-semibold text-ink">A complete routine uses all four.</span>{' '}
        Cardio builds the engine, strength builds the frame, flexibility keeps it mobile, and balance keeps it stable.
        Most people overdo one and neglect the others — try to rotate across all four each week.
      </div>
    </div>
  )
}

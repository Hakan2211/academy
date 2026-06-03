import { useState } from 'react'
import { cn } from '#/lib/cn'
import { clamp } from '#/lib/health'

// Toggle protective resilience factors → a "resilience reservoir" gauge fills.
// Shows how a fuller reservoir shrinks the impact of the same stressor.

type Factor = { id: string; label: string; icon: string; detail: string; points: number }

const FACTORS: Array<Factor> = [
  { id: 'social',    label: 'Strong social support',  icon: '🤝', detail: 'Close relationships buffer stress — you have people to lean on.',        points: 18 },
  { id: 'sleep',     label: 'Good sleep',              icon: '😴', detail: 'Sleep restores the brain and regulates cortisol — the repair window.',   points: 18 },
  { id: 'reframe',   label: 'Reframing skill',         icon: '🔄', detail: 'Seeing setbacks as temporary and manageable reduces their sting.',        points: 15 },
  { id: 'meaning',   label: 'Sense of meaning',        icon: '🧭', detail: 'Having a "why" helps you endure almost any "how".',                       points: 15 },
  { id: 'exercise',  label: 'Regular exercise',        icon: '🏃', detail: 'Physical activity blunts the cortisol response and boosts mood.',         points: 14 },
  { id: 'control',   label: 'Sense of control',        icon: '🎯', detail: 'Feeling you can influence outcomes reduces helplessness and anxiety.',     points: 12 },
  { id: 'mindful',   label: 'Mindfulness practice',    icon: '🌿', detail: 'Present-moment awareness shrinks rumination and lowers baseline arousal.', points: 8  },
]

const TOTAL = FACTORS.reduce((s, f) => s + f.points, 0)

// Stressor impact shrinks as reservoir grows
function impactPct(reservoirPct: number): number {
  return clamp(85 - reservoirPct * 0.75, 10, 85)
}

export function ResilienceFactors() {
  const [active, setActive] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    setActive((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const points      = FACTORS.filter((f) => active.has(f.id)).reduce((s, f) => s + f.points, 0)
  const reservoirPct = Math.round(clamp((points / TOTAL) * 100, 0, 100))
  const impact      = impactPct(reservoirPct)

  const reservoirColor =
    reservoirPct >= 65 ? '#27AE60' :
    reservoirPct >= 35 ? '#F39C12' : '#E74C3C'

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-xs text-muted">Toggle the protective factors you have in place:</p>

      {/* Factor toggles */}
      <div className="mb-4 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {FACTORS.map((f) => {
          const on = active.has(f.id)
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => toggle(f.id)}
              className={cn(
                'rounded-xl border px-3 py-2 text-left text-xs transition-colors',
                on
                  ? 'border-accent bg-accent/15 text-accent'
                  : 'border-border text-muted hover:text-ink',
              )}
            >
              <span className="mr-1.5">{f.icon}</span>
              <span className="font-semibold">{f.label}</span>
              {on && <p className="mt-1 text-[10px] leading-tight opacity-80">{f.detail}</p>}
            </button>
          )
        })}
      </div>

      {/* Reservoir gauge */}
      <div className="mb-3">
        <div className="mb-1 flex justify-between text-xs">
          <span className="text-muted">Resilience reservoir</span>
          <span className="font-semibold" style={{ color: reservoirColor }}>{reservoirPct}% full</span>
        </div>
        <div className="relative h-5 w-full overflow-hidden rounded-full bg-surface-2" style={{ border: '1px solid var(--color-border)' }}>
          <div
            className="absolute top-0 h-full rounded-full transition-all duration-500"
            style={{ width: `${reservoirPct}%`, backgroundColor: reservoirColor, opacity: 0.75 }}
          />
        </div>
      </div>

      {/* Stressor impact bar */}
      <div className="mb-3">
        <div className="mb-1 flex justify-between text-xs">
          <span className="text-muted">Same stressor — felt impact</span>
          <span className="font-semibold text-ink">{Math.round(impact)}%</span>
        </div>
        <div className="relative h-5 w-full overflow-hidden rounded-full bg-surface-2" style={{ border: '1px solid var(--color-border)' }}>
          <div
            className="absolute top-0 h-full rounded-full transition-all duration-500"
            style={{ width: `${impact}%`, backgroundColor: '#E74C3C', opacity: 0.65 }}
          />
        </div>
        <p className="mt-1 text-[10px] text-muted">
          The same stressor hits much harder when the reservoir is empty, and much lighter when it's full.
        </p>
      </div>

      {/* Insight */}
      <div
        className="rounded-xl px-3 py-2 text-xs font-medium transition-all duration-300"
        style={{ backgroundColor: reservoirColor + '18', color: reservoirColor, border: `1px solid ${reservoirColor}44` }}
      >
        {reservoirPct === 0
          ? 'No protective factors active — stress hits at full force. Resilience is built before you need it.'
          : reservoirPct < 35
            ? 'Low reservoir — some buffer, but still vulnerable. Adding one or two factors makes a real difference.'
            : reservoirPct < 65
              ? 'Building up — a meaningful buffer is forming. Each additional factor compounds the protection.'
              : 'Strong reservoir — the same stressors land much softer. Resilience is a skill, and you\'ve been practising it.'}
      </div>
    </div>
  )
}

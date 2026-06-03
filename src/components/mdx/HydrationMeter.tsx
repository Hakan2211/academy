import { useState } from 'react'
import { cn } from '#/lib/cn'
import { clamp } from '#/lib/health'

type OutDriver = {
  id: string
  label: string
  extra: number // extra glasses needed
}

const OUT_DRIVERS: Array<OutDriver> = [
  { id: 'hot', label: 'Hot day (>28 °C)', extra: 2 },
  { id: 'exercise', label: 'Exercise (30+ min)', extra: 2 },
  { id: 'alcohol', label: 'Alcohol (any)', extra: 1 },
  { id: 'caffeine', label: 'High caffeine (3+ cups)', extra: 1 },
]

type Status = 'dehydrated' | 'low' | 'good' | 'great'

function getStatus(net: number): Status {
  if (net < 0) return 'dehydrated'
  if (net < 2) return 'low'
  if (net < 4) return 'good'
  return 'great'
}

const STATUS_META: Record<Status, { label: string; sub: string; color: string; fill: string }> = {
  dehydrated: {
    label: 'Dehydrated',
    sub: 'You are behind on fluids. Signs: thirst, darker urine, headache, fatigue.',
    color: 'text-red-500',
    fill: '#ef4444',
  },
  low: {
    label: 'Slightly low',
    sub: 'Getting there, but not quite enough. Keep sipping — thirst lags well behind actual need.',
    color: 'text-amber-500',
    fill: '#f59e0b',
  },
  good: {
    label: 'Well hydrated',
    sub: 'Great — urine should be pale yellow. Maintain this through the day.',
    color: 'text-emerald-500',
    fill: '#10b981',
  },
  great: {
    label: 'Excellent hydration',
    sub: 'You are comfortably ahead of your needs. This is the target zone on hot/active days.',
    color: 'text-sky-500',
    fill: '#0ea5e9',
  },
}

export function HydrationMeter() {
  const [glasses, setGlasses] = useState(6)
  const [active, setActive] = useState<Set<string>>(new Set())

  const baseTarget = 8 // glasses (~2 L)
  const extraNeeded = OUT_DRIVERS.filter((d) => active.has(d.id)).reduce((s, d) => s + d.extra, 0)
  const target = baseTarget + extraNeeded
  const net = glasses - target
  const status = getStatus(net)
  const meta = STATUS_META[status]

  // Gauge: fill from 0..target+2
  const maxDisplay = target + 2
  const pct = clamp((glasses / maxDisplay) * 100, 0, 100)

  function toggle(id: string) {
    setActive((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-4 text-sm text-muted">
        Adjust today's fluid intake and toggle any extra-drain factors to see your net hydration status.
      </p>

      {/* Slider */}
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between text-sm">
          <span className="font-medium text-ink">Glasses of water drunk today</span>
          <span className="font-semibold text-accent">{glasses} glasses (~{(glasses * 250 / 1000).toFixed(1)} L)</span>
        </div>
        <input
          type="range"
          min={0}
          max={16}
          value={glasses}
          onChange={(e) => setGlasses(Number(e.target.value))}
          className="w-full accent-accent"
        />
        <div className="mt-0.5 flex justify-between text-xs text-muted">
          <span>0</span>
          <span>8 glasses</span>
          <span>16</span>
        </div>
      </div>

      {/* Toggles */}
      <div className="mb-4">
        <p className="mb-2 text-sm font-medium text-ink">Extra factors that increase your fluid needs:</p>
        <div className="grid grid-cols-2 gap-2">
          {OUT_DRIVERS.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => toggle(d.id)}
              className={cn(
                'rounded-xl border px-3 py-2 text-left text-sm transition-colors',
                active.has(d.id)
                  ? 'border-accent bg-accent/15 text-accent'
                  : 'border-border text-muted hover:text-ink',
              )}
            >
              <div className="font-medium">{d.label}</div>
              <div className="text-xs opacity-80">+{d.extra} glasses needed</div>
            </button>
          ))}
        </div>
      </div>

      {/* Gauge */}
      <div className="mb-3 rounded-xl border border-border bg-surface-2 p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted">Target today</span>
          <span className="font-semibold text-ink">{target} glasses ({(target * 0.25).toFixed(1)} L)</span>
        </div>

        <div className="relative mb-1 h-5 w-full overflow-hidden rounded-full bg-surface">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: meta.fill }}
          />
          {/* target marker */}
          <div
            className="absolute inset-y-0 w-0.5 bg-ink/30"
            style={{ left: `${clamp((target / maxDisplay) * 100, 0, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted">
          <span>Empty</span>
          <span>▲ target</span>
          <span>+2 above</span>
        </div>

        <div className="mt-3 text-center">
          <div className={cn('text-lg font-bold', meta.color)}>{meta.label}</div>
          <p className="mt-1 text-xs text-muted">{meta.sub}</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface-2 p-3 text-xs text-muted">
        <span className="font-semibold text-ink">Remember: </span>
        Thirst is a late signal — by the time you feel thirsty, you are already mildly dehydrated. Pale, straw-coloured
        urine is the most reliable indicator that your hydration is on track.
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// The "happiness pie" popularised by Lyubomirsky, Sheldon & Schkade: a rough,
// much-debated estimate that long-term happiness is ~50% genetic set point,
// ~10% life circumstances, and ~40% intentional activity. The empowering point
// isn't the exact numbers but which slice you actually control. Click a slice.
const W = 220
const R = 90
const CX = W / 2
const CY = W / 2

type Slice = {
  key: string
  label: string
  pct: number
  icon: string
  color: string
  note: string
}

const SLICES: Array<Slice> = [
  {
    key: 'genes',
    label: 'Genetic set point',
    pct: 50,
    icon: 'Dna',
    color: '#9575CD',
    note: 'Each of us has an inherited baseline temperament — a happiness "set point" we tend to drift back toward. It is real, but it is not your destiny, and it is not the part you act on.',
  },
  {
    key: 'circumstances',
    label: 'Life circumstances',
    pct: 10,
    icon: 'MapPin',
    color: '#FF8A65',
    note: 'Income, where you live, your looks, your job title. Surprisingly small — because of hedonic adaptation, we adjust to most circumstances and they stop moving the needle. Chasing them is the slow lane.',
  },
  {
    key: 'activity',
    label: 'Intentional activity',
    pct: 40,
    icon: 'Sparkles',
    color: '#FFD54A',
    note: 'What you deliberately think and do: gratitude, kindness, savouring, exercise, nurturing relationships, pursuing meaning. This is the big slice you actually control — and the one well-being practices target.',
  },
]

// Build an SVG arc path for a slice spanning [a0, a1] radians.
function arc(a0: number, a1: number): string {
  const x0 = CX + R * Math.cos(a0)
  const y0 = CY + R * Math.sin(a0)
  const x1 = CX + R * Math.cos(a1)
  const y1 = CY + R * Math.sin(a1)
  const large = a1 - a0 > Math.PI ? 1 : 0
  return `M${CX} ${CY} L${x0.toFixed(2)} ${y0.toFixed(2)} A${R} ${R} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`
}

export function HappinessFactors() {
  const [active, setActive] = useState('activity')

  // accumulate angles, starting at the top (-90°)
  let cursor = -Math.PI / 2
  const arcs = SLICES.map((s) => {
    const a0 = cursor
    const a1 = cursor + (s.pct / 100) * Math.PI * 2
    cursor = a1
    return { ...s, a0, a1 }
  })

  const sel = SLICES.find((s) => s.key === active) ?? SLICES[0]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <svg viewBox={`0 0 ${W} ${W}`} className="w-40 shrink-0">
          {arcs.map((a) => {
            const isSel = a.key === active
            const mid = (a.a0 + a.a1) / 2
            const lift = isSel ? 6 : 0
            return (
              <path
                key={a.key}
                d={arc(a.a0, a.a1)}
                fill={a.color}
                opacity={isSel ? 1 : 0.55}
                stroke="var(--color-surface)"
                strokeWidth="2"
                transform={`translate(${(Math.cos(mid) * lift).toFixed(2)} ${(Math.sin(mid) * lift).toFixed(2)})`}
                onClick={() => setActive(a.key)}
                style={{ cursor: 'pointer' }}
              />
            )
          })}
        </svg>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2">
            {SLICES.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setActive(s.key)}
                className={cn(
                  'flex items-center gap-2 rounded-lg border px-2 py-1.5 text-left text-sm transition-colors',
                  active === s.key ? 'border-accent bg-accent/10' : 'border-transparent hover:border-border',
                )}
              >
                <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: s.color }} />
                <span className="flex-1 text-ink">{s.label}</span>
                <span className="font-mono text-muted">~{s.pct}%</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-surface-2 p-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: `${sel.color}22`, color: sel.color }}>
            <Icon name={sel.icon} size={16} />
          </span>
          <span className="text-sm font-semibold text-ink">
            {sel.label} — <span style={{ color: sel.color }}>~{sel.pct}%</span>
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">{sel.note}</p>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        These figures are rough and much debated — but the lesson holds: you can&apos;t pick your genes and circumstances move
        the needle little, so the <span className="text-ink">intentional-activity</span> slice is where your leverage lives.
      </p>
    </div>
  )
}

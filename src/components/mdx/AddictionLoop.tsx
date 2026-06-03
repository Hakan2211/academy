import { useState } from 'react'
import { cn } from '#/lib/cn'

// The addiction cycle — a loop showing how repeated substance use hijacks the
// brain's reward system. Biology, not weakness.

type Stage = {
  id: string
  label: string
  short: string
  color: string
  desc: string
}

const STAGES: Stage[] = [
  {
    id: 'use',
    label: 'Use',
    short: 'Substance taken',
    color: '#9B59B6',
    desc: 'The substance enters the body and reaches the brain. Many addictive substances flood the reward pathway with dopamine — far beyond what natural rewards (food, connection, achievement) produce.',
  },
  {
    id: 'reward',
    label: 'Dopamine surge',
    short: 'Brain reward fires',
    color: '#8e44ad',
    desc: 'The nucleus accumbens (the brain\'s reward centre) is flooded with dopamine. The brain registers a powerful "do that again" signal — much stronger than everyday pleasures.',
  },
  {
    id: 'adapt',
    label: 'Brain adapts',
    short: 'Tolerance builds',
    color: '#6c3483',
    desc: 'With repeated use, the brain reduces its own dopamine receptors (downregulation) to compensate for the constant flooding. The same dose produces less effect — tolerance. Everyday pleasures feel flat by comparison.',
  },
  {
    id: 'craving',
    label: 'Craving & withdrawal',
    short: 'Discomfort without it',
    color: '#5b2c6f',
    desc: 'Without the substance, dopamine activity drops well below normal. The result is craving, anxiety, irritability, or physical withdrawal. The brain is now wired to seek the substance to feel okay — not even to feel good.',
  },
]

const HEALTHY: { label: string; color: string; desc: string }[] = [
  { label: 'Everyday reward', color: '#00b894', desc: 'A meal, a walk in sunlight, a kind word — these also release dopamine, at a gentle, sustainable level.' },
  { label: 'Normal baseline', color: '#00b894', desc: 'Dopamine returns to a healthy resting level. No adaptation, no depletion — the system stays balanced.' },
]

// SVG circle layout helpers
const CX = 130
const CY = 110
const STAGE_R = 80
const NODE_R = 28

function nodePos(i: number, total: number) {
  const angle = (i / total) * 2 * Math.PI - Math.PI / 2
  return {
    x: CX + STAGE_R * Math.cos(angle),
    y: CY + STAGE_R * Math.sin(angle),
  }
}

function arcPath(from: number, to: number, total: number) {
  const a = nodePos(from, total)
  const b = nodePos(to, total)
  const mx = (a.x + b.x) / 2 + (CY - (a.y + b.y) / 2) * 0.18
  const my = (a.y + b.y) / 2 - (CX - (a.x + b.x) / 2) * 0.18
  return `M${a.x.toFixed(1)},${a.y.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${b.x.toFixed(1)},${b.y.toFixed(1)}`
}

export function AddictionLoop() {
  const [active, setActive] = useState<string>('use')
  const [showHealthy, setShowHealthy] = useState(false)

  const activeIdx = STAGES.findIndex(s => s.id === active)
  const stage = STAGES[activeIdx]
  const n = STAGES.length

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4 space-y-4">
      <div>
        <p className="text-sm font-semibold text-ink">The Addiction Cycle</p>
        <p className="text-xs text-muted mt-0.5">
          Tap each stage to understand the biology. This is a brain-chemistry process — not a moral failing.
        </p>
      </div>

      {/* SVG loop */}
      <svg viewBox="0 0 260 220" className="w-full max-w-xs mx-auto">
        {/* arrows between nodes */}
        {STAGES.map((_, i) => (
          <path key={i}
            d={arcPath(i, (i + 1) % n, n)}
            fill="none"
            stroke={STAGES[i].color}
            strokeWidth={1.8}
            strokeDasharray="4 3"
            markerEnd="url(#arr)"
            opacity={0.6}
          />
        ))}
        <defs>
          <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--color-border)" />
          </marker>
        </defs>

        {/* node circles */}
        {STAGES.map((s, i) => {
          const pos = nodePos(i, n)
          const isActive = s.id === active
          return (
            <g key={s.id} className="cursor-pointer" onClick={() => setActive(s.id)}>
              <circle cx={pos.x} cy={pos.y} r={NODE_R}
                fill={isActive ? s.color : 'var(--color-surface-2)'}
                stroke={s.color}
                strokeWidth={isActive ? 2.5 : 1.5}
                style={{ transition: 'all 0.25s' }} />
              <text x={pos.x} y={pos.y - 4} textAnchor="middle" fontSize={7.5}
                fontWeight={600}
                fill={isActive ? '#fff' : s.color}>
                {s.label}
              </text>
              <text x={pos.x} y={pos.y + 7} textAnchor="middle" fontSize={6}
                fill={isActive ? '#ffffff99' : 'var(--color-muted)'}>
                {s.short}
              </text>
            </g>
          )
        })}

        {/* centre label */}
        <text x={CX} y={CY - 6} textAnchor="middle" fontSize={8} fontWeight={700}
          className="fill-muted">ADDICTION</text>
        <text x={CX} y={CY + 5} textAnchor="middle" fontSize={7}
          className="fill-muted">CYCLE</text>
      </svg>

      {/* Detail panel */}
      {stage && (
        <div className="rounded-xl border p-3 transition-colors"
          style={{ borderColor: stage.color + '66', backgroundColor: stage.color + '11' }}>
          <p className="font-semibold text-sm" style={{ color: stage.color }}>{stage.label}</p>
          <p className="mt-1 text-xs text-muted">{stage.desc}</p>
        </div>
      )}

      {/* Healthy comparison toggle */}
      <button type="button"
        onClick={() => setShowHealthy(v => !v)}
        className={cn(
          'w-full rounded-xl border py-2 text-xs font-medium transition-colors',
          showHealthy
            ? 'border-[#00b894] bg-[#00b894]/10 text-[#00b894]'
            : 'border-border text-muted hover:text-ink',
        )}>
        {showHealthy ? 'Hide' : 'Compare with'} healthy reward system
      </button>

      {showHealthy && (
        <div className="space-y-2">
          {HEALTHY.map(h => (
            <div key={h.label} className="rounded-xl border p-2.5"
              style={{ borderColor: h.color + '55', backgroundColor: h.color + '0e' }}>
              <p className="text-xs font-semibold" style={{ color: h.color }}>{h.label}</p>
              <p className="text-xs text-muted mt-0.5">{h.desc}</p>
            </div>
          ))}
          <p className="text-xs text-muted px-1">
            A healthy reward system stays sensitive and bounces back. Addictive substances
            repeatedly overwhelm it, eroding that sensitivity over time. Recovery means
            letting the system heal — which it can, given time and support.
          </p>
        </div>
      )}

      <p className="text-xs text-muted border-t border-border pt-2">
        Addiction involves lasting changes in the prefrontal cortex (planning, impulse control)
        as well as the reward pathway. This is why it feels impossible to simply "choose" to stop —
        and why effective treatment addresses brain chemistry, not willpower.
      </p>
    </div>
  )
}

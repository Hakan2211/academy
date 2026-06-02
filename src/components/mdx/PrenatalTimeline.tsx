import { useState } from 'react'
import { cn } from '#/lib/cn'

// The prenatal arc in three stages — germinal, embryonic, fetal — across ~9
// months. The embryonic stage is when organs first form, which makes it the
// window most vulnerable to teratogens (alcohol, drugs, viruses). A stepper
// walks the milestones; the sensitivity bar shows how the danger window shifts.
type Stage = {
  name: string
  weeks: string
  blurb: string
  teratogen: string
  risk: 'low' | 'high' | 'medium'
  color: string
}

const STAGES: Array<Stage> = [
  {
    name: 'Germinal',
    weeks: 'Weeks 0–2',
    blurb: 'The fertilised egg (zygote) divides rapidly into a ball of cells and burrows into the uterine wall. Many zygotes never implant.',
    teratogen: 'Low: it is mostly all-or-nothing — a serious disruption ends the pregnancy rather than damaging a specific organ.',
    risk: 'low',
    color: '#FDCB6E',
  },
  {
    name: 'Embryonic',
    weeks: 'Weeks 2–8',
    blurb: 'Now an embryo. The heart begins to beat and the brain, spine, arms, legs and major organs all take shape with astonishing speed.',
    teratogen: 'HIGH: because every major organ is being built right now, a teratogen here can cause its worst, most lasting structural damage.',
    risk: 'high',
    color: '#E17055',
  },
  {
    name: 'Fetal',
    weeks: 'Week 9 – birth',
    blurb: 'Now a fetus. Organs mature and grow, the brain wires furiously, and by ~24 weeks the baby may survive outside the womb (viability).',
    teratogen: 'Medium: organs already exist, so damage is less likely to be structural — but the brain keeps developing and stays vulnerable.',
    risk: 'medium',
    color: '#74B9FF',
  },
]

const RISK_COLOR = { low: 'var(--color-success)', medium: '#F39C12', high: '#E74C3C' } as const
const RISK_HEIGHT = { low: 16, medium: 38, high: 60 } as const

export function PrenatalTimeline() {
  const [i, setI] = useState(0)
  const s = STAGES[i]

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="mb-3 flex gap-1">
        {STAGES.map((st, k) => (
          <button
            key={st.name}
            type="button"
            onClick={() => setI(k)}
            className={cn(
              'flex-1 rounded-lg border px-2 py-2 text-center transition-colors',
              k === i ? 'border-accent bg-accent/15' : 'border-border hover:border-accent/40',
            )}
          >
            <span className={cn('block text-sm font-semibold', k === i ? 'text-accent' : 'text-ink')}>{st.name}</span>
            <span className="block text-[11px] text-muted">{st.weeks}</span>
          </button>
        ))}
      </div>

      <svg viewBox="0 0 360 96" className="w-full">
        {/* timeline track, split by month */}
        <line x1={16} y1={70} x2={344} y2={70} stroke="var(--color-border)" strokeWidth="2" />
        {STAGES.map((st, k) => {
          const x0 = [16, 80, 150][k]
          const x1 = [80, 150, 344][k]
          const active = k === i
          return (
            <g key={st.name}>
              <rect x={x0} y={66} width={x1 - x0} height={8} fill={st.color} opacity={active ? 1 : 0.35} rx={4} />
              {/* teratogen-sensitivity bar */}
              <rect
                x={x0 + 4}
                y={70 - RISK_HEIGHT[st.risk]}
                width={x1 - x0 - 8}
                height={RISK_HEIGHT[st.risk]}
                fill={RISK_COLOR[st.risk]}
                opacity={active ? 0.85 : 0.25}
                rx={3}
              />
            </g>
          )
        })}
        <text x={16} y={90} fontSize="9" fill="var(--color-muted)">
          conception
        </text>
        <text x={344} y={90} textAnchor="end" fontSize="9" fill="var(--color-muted)">
          birth (~40 wks)
        </text>
        <text x={180} y={14} textAnchor="middle" fontSize="9" fill="var(--color-muted)">
          bar height = teratogen sensitivity
        </text>
      </svg>

      <div className="mt-2 rounded-xl bg-surface-2 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: s.color }}>
          {s.name} stage · {s.weeks}
        </p>
        <p className="mt-1 text-sm leading-snug text-muted">{s.blurb}</p>
        <p className="mt-2 text-sm leading-snug" style={{ color: RISK_COLOR[s.risk] }}>
          <span className="font-semibold">Teratogen risk — </span>
          {s.teratogen}
        </p>
      </div>
    </div>
  )
}

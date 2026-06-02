import { useState } from 'react'
import { cn } from '#/lib/cn'

// A fair test, taken apart. One experiment — "does more light grow taller
// plants?" — with three roles to spot: the one thing you change (independent),
// the thing you measure (dependent), and everything you deliberately keep the
// same (controlled).
type Role = 'independent' | 'dependent' | 'controlled'

const ROLE_INFO: Record<Role, { label: string; color: string; blurb: string }> = {
  independent: {
    label: 'Independent variable',
    color: '#FDCB6E',
    blurb: 'The ONE thing you deliberately change. Here: the hours of light each plant gets.',
  },
  dependent: {
    label: 'Dependent variable',
    color: '#00CEC9',
    blurb: 'The thing you measure to see the effect. Here: the height each plant reaches.',
  },
  controlled: {
    label: 'Controlled variables',
    color: '#2ECC71',
    blurb: 'Everything you keep the SAME so the test is fair — water, soil, pot, temperature, species.',
  },
}

// the five pots, each with more light
const POTS = [2, 4, 6, 8, 10]

export function VariableLab() {
  const [role, setRole] = useState<Role>('independent')
  const info = ROLE_INFO[role]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* the experiment */}
      <svg viewBox="0 0 360 170" className="w-full">
        {POTS.map((hours, i) => {
          const x = 24 + i * 66
          const growth = role === 'controlled' ? 6 : hours // when controlled, all equal-ish
          const h = 24 + growth * 5
          const showLight = role === 'independent'
          const showHeight = role === 'dependent'
          return (
            <g key={i}>
              {/* light rays */}
              {showLight && (
                <text x={x} y={20} textAnchor="middle" className="text-[13px]">
                  {'☀️'.repeat(Math.min(3, Math.ceil(hours / 4)))}
                </text>
              )}
              {/* plant */}
              <line x1={x} y1={130} x2={x} y2={130 - h} stroke="#2ECC71" strokeWidth={3} strokeLinecap="round" />
              <circle cx={x} cy={130 - h} r={6} fill="#2ECC71" />
              {showHeight && (
                <text x={x} y={130 - h - 12} textAnchor="middle" className="fill-accent-2 text-[10px] font-mono">
                  {h}mm
                </text>
              )}
              {/* pot */}
              <path d={`M ${x - 14} 130 L ${x + 14} 130 L ${x + 10} 150 L ${x - 10} 150 Z`} fill={role === 'controlled' ? '#2ECC71' : 'var(--color-surface-2)'} stroke="var(--color-border)" strokeWidth={1.5} />
              <text x={x} y={166} textAnchor="middle" className="fill-muted text-[9px]">
                {hours}h light
              </text>
            </g>
          )
        })}
      </svg>

      {/* role tabs */}
      <div className="mt-2 flex flex-wrap gap-2">
        {(Object.keys(ROLE_INFO) as Array<Role>).map((r) => {
          const active = r === role
          return (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={cn(
                'rounded-full border px-3 py-1 text-sm transition-colors',
                active ? 'text-white' : 'border-border text-muted hover:text-ink',
              )}
              style={{
                borderColor: ROLE_INFO[r].color,
                background: active ? ROLE_INFO[r].color : undefined,
              }}
            >
              {ROLE_INFO[r].label}
            </button>
          )
        })}
      </div>

      <p className="mt-3 rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted">
        <span className="font-semibold" style={{ color: info.color }}>
          {info.label}:{' '}
        </span>
        {info.blurb}
      </p>
    </div>
  )
}

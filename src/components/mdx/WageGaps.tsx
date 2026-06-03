import { useState } from 'react'
import { cn } from '#/lib/cn'
import { formatUSD } from '#/lib/econ'

// Why do wages differ so much? Two big reasons, each shown as its own set of
// bars. HUMAN CAPITAL: education and training make workers more productive, so
// employers pay more for what they produce — average wages climb steeply with
// schooling. COMPENSATING DIFFERENTIALS: among jobs needing similar skill,
// the riskier, dirtier or less pleasant ones must pay MORE to attract anyone —
// a premium that compensates for the bad conditions, not for productivity.
type Mode = 'human-capital' | 'compensating'

type Bar = { label: string; wage: number; note: string }

const HUMAN_CAPITAL: Array<Bar> = [
  { label: 'No diploma', wage: 32000, note: 'least training' },
  { label: 'High school', wage: 44000, note: '' },
  { label: 'Some college', wage: 52000, note: '' },
  { label: "Bachelor's", wage: 72000, note: '' },
  { label: 'Advanced degree', wage: 98000, note: 'most human capital' },
]

const COMPENSATING: Array<Bar> = [
  { label: 'Office clerk', wage: 46000, note: 'safe, pleasant' },
  { label: 'Warehouse', wage: 50000, note: '' },
  { label: 'Night shift', wage: 58000, note: 'unsocial hours' },
  { label: 'Roofer', wage: 64000, note: 'physical, risky' },
  { label: 'Deep-sea diver', wage: 92000, note: 'dangerous' },
]

const COPY: Record<Mode, string> = {
  'human-capital':
    'Human capital. More education and training raise a worker’s productivity, so the value they add — and the wage employers will pay — rises with each level of schooling.',
  compensating:
    'Compensating differentials. These jobs need similar skill, yet the nastier and riskier ones must pay a premium to attract workers. The extra pay compensates for bad conditions, not for higher productivity.',
}

const VW = 360
const H = 210
const Y0 = 168
const PADX = 18

export function WageGaps() {
  const [mode, setMode] = useState<Mode>('human-capital')
  const bars = mode === 'human-capital' ? HUMAN_CAPITAL : COMPENSATING
  const maxWage = 100000
  const slotW = (VW - PADX * 2) / bars.length
  const barW = slotW * 0.62
  const scale = (Y0 - 22) / maxWage

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex gap-2 p-3">
        {(['human-capital', 'compensating'] as Array<Mode>).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              'flex-1 rounded-full border px-3 py-1 text-sm transition-colors',
              mode === m
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {m === 'human-capital' ? 'Human capital' : 'Compensating pay'}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${VW} ${H}`} className="w-full">
        {/* baseline */}
        <line x1={PADX} y1={Y0} x2={VW - PADX} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        {bars.map((b, i) => {
          const cx = PADX + slotW * (i + 0.5)
          const h = b.wage * scale
          const isExtreme = i === 0 || i === bars.length - 1
          return (
            <g key={b.label}>
              <rect
                x={cx - barW / 2}
                y={Y0 - h}
                width={barW}
                height={h}
                rx="3"
                fill={isExtreme ? 'var(--color-accent-2)' : 'var(--color-accent)'}
                opacity={isExtreme ? 1 : 0.85}
              />
              <text x={cx} y={Y0 - h - 5} textAnchor="middle" fontSize="9" fill="var(--color-ink)">
                {formatUSD(b.wage)}
              </text>
              <text x={cx} y={Y0 + 13} textAnchor="middle" fontSize="9" fill="var(--color-muted)">
                {b.label}
              </text>
              {b.note && (
                <text x={cx} y={Y0 + 24} textAnchor="middle" fontSize="8" fill="var(--color-muted)" opacity="0.8">
                  {b.note}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      <p className="px-4 pb-4 pt-1 text-center text-sm text-muted">{COPY[mode]}</p>
    </div>
  )
}

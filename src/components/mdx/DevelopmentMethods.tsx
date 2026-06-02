import { useState } from 'react'
import { cn } from '#/lib/cn'

// Two ways to study how people change with age. CROSS-SECTIONAL compares
// different age groups all at once (fast, but cohorts differ in more than age).
// LONGITUDINAL follows one group across years (clean, but slow and people drop
// out). Click a design to see how it samples the same set of people.
type Design = 'cross' | 'long'

const COHORTS = [
  { born: '1950s', color: '#FDCB6E' },
  { born: '1970s', color: '#74B9FF' },
  { born: '1990s', color: '#A29BFE' },
] as const

const COPY: Record<Design, { title: string; how: string; up: string; down: string }> = {
  cross: {
    title: 'Cross-sectional',
    how: 'Test people of different ages all in the same year. Each colour is a different generation, measured once.',
    up: 'Fast and cheap — you get a whole age span from a single round of testing.',
    down: 'Cohort effects: an 80-year-old and a 20-year-old differ in schooling, diet and history — not just age. A "decline" may be a generation gap in disguise.',
  },
  long: {
    title: 'Longitudinal',
    how: 'Follow ONE group of people and re-test them as they age. One colour, measured again and again across the decades.',
    up: 'Truly tracks change within the same people — the cleanest picture of development over time.',
    down: 'Slow and costly, and attrition bites: participants move, lose interest or die, and the hardiest survivors can skew the results.',
  },
}

export function DevelopmentMethods() {
  const [design, setDesign] = useState<Design>('cross')
  const c = COPY[design]

  // Years across the x-axis; ages we want to compare on the y-axis.
  const YEARS = design === 'cross' ? ['2026'] : ['2026', '2046', '2066']

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="mb-3 flex flex-wrap gap-2 px-1">
        {(['cross', 'long'] as Array<Design>).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDesign(d)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              design === d
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {COPY[d].title}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 360 180" className="w-full">
        <line x1={40} y1={150} x2={344} y2={150} stroke="var(--color-border)" strokeWidth="1.5" />
        <text x={192} y={170} textAnchor="middle" fontSize="10" fill="var(--color-muted)">
          Year tested →
        </text>
        {YEARS.map((yr, j) => {
          const x = YEARS.length === 1 ? 192 : 70 + j * 120
          return (
            <g key={yr}>
              <text x={x} y={144} textAnchor="middle" fontSize="10" fill="var(--color-muted)">
                {yr}
              </text>
              {COHORTS.map((co, i) => {
                // In cross-sectional all three cohorts appear once, at different ages.
                // In longitudinal only the first cohort appears, ageing across years.
                if (design === 'long' && i !== 0) return null
                const age = design === 'cross' ? [76, 56, 36][i] : 36 + j * 20
                const cy = 120 - i * 36 - (design === 'long' ? j * 0 : 0)
                const yy = design === 'long' ? 90 : cy
                return (
                  <g key={co.born}>
                    <circle cx={x} cy={yy} r={13} fill={`${co.color}33`} stroke={co.color} strokeWidth="2" />
                    <text x={x} y={yy + 4} textAnchor="middle" fontSize="10" fontWeight="600" fill={co.color}>
                      {age}
                    </text>
                  </g>
                )
              })}
            </g>
          )
        })}
        {design === 'long' && (
          <line x1={70} y1={90} x2={310} y2={90} stroke={COHORTS[0].color} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
        )}
      </svg>

      <div className="mt-2 rounded-xl bg-surface-2 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">{c.title}</p>
        <p className="mt-1 text-sm leading-snug text-muted">{c.how}</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <p className="text-sm leading-snug" style={{ color: 'var(--color-success)' }}>
            <span className="font-semibold">Strength: </span>
            {c.up}
          </p>
          <p className="text-sm leading-snug" style={{ color: '#E74C3C' }}>
            <span className="font-semibold">Cost: </span>
            {c.down}
          </p>
        </div>
      </div>
    </div>
  )
}

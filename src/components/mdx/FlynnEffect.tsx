import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// The Flynn effect: raw IQ-test performance climbed steadily across the 20th
// century — roughly three points per decade. Because tests are re-normed to a
// mean of 100 each generation, this rise is normally hidden. This chart plots
// what the average person of each decade would score *on today's test* (mean
// 100 = year 2000). Toggle the causes to see the leading explanations.
const W = 360
const H = 220
const PAD_L = 40
const PAD_R = 14
const PAD_T = 16
const PAD_B = 38

// ~3 points / decade, anchored so 2000 ≈ 100 on a modern test.
const DATA: Array<{ year: number; iq: number }> = [
  { year: 1930, iq: 79 },
  { year: 1940, iq: 82 },
  { year: 1950, iq: 85 },
  { year: 1960, iq: 88 },
  { year: 1970, iq: 91 },
  { year: 1980, iq: 94 },
  { year: 1990, iq: 97 },
  { year: 2000, iq: 100 },
]

const X0 = 1930
const X1 = 2000
const Y0 = 70
const Y1 = 105

const xOf = (year: number) => PAD_L + ((year - X0) / (X1 - X0)) * (W - PAD_L - PAD_R)
const yOf = (iq: number) => PAD_T + (1 - (iq - Y0) / (Y1 - Y0)) * (H - PAD_T - PAD_B)

const CAUSES = [
  {
    name: 'Nutrition',
    icon: 'Apple',
    color: '#27AE60',
    body: 'Better food and health let brains develop more fully — the same forces that made each generation taller also raised cognitive performance.',
  },
  {
    name: 'Schooling',
    icon: 'GraduationCap',
    color: '#3498DB',
    body: 'More years of education, for more people, trains exactly the abstract, test-taking skills that IQ tests reward.',
  },
  {
    name: 'Abstraction',
    icon: 'Shapes',
    color: '#E67E22',
    body: 'Modern life trains us to think in categories and hypotheticals ("classify these", "what if…") — the kind of abstract reasoning tests prize most.',
  },
]

export function FlynnEffect() {
  const [cause, setCause] = useState(0)
  const c = CAUSES[cause]

  const line = DATA.map((d, i) => `${i ? 'L' : 'M'}${xOf(d.year).toFixed(1)} ${yOf(d.iq).toFixed(1)}`).join(' ')
  const baseline = H - PAD_B
  const area = `M${xOf(X0).toFixed(1)} ${baseline} ${DATA.map((d) => `L${xOf(d.year).toFixed(1)} ${yOf(d.iq).toFixed(1)}`).join(' ')} L${xOf(X1).toFixed(1)} ${baseline} Z`

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* y gridlines */}
        {[70, 80, 90, 100].map((iq) => (
          <g key={iq}>
            <line x1={PAD_L} y1={yOf(iq)} x2={W - PAD_R} y2={yOf(iq)} stroke="var(--color-border)" strokeWidth="0.5" opacity="0.5" />
            <text x={PAD_L - 6} y={yOf(iq) + 3} textAnchor="end" fontSize="9" fill="var(--color-muted)">
              {iq}
            </text>
          </g>
        ))}
        {/* reference: today's mean */}
        <line x1={PAD_L} y1={yOf(100)} x2={W - PAD_R} y2={yOf(100)} stroke="var(--color-success)" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />

        {/* axes labels */}
        {DATA.filter((_, i) => i % 2 === 0).map((d) => (
          <text key={d.year} x={xOf(d.year)} y={H - 20} textAnchor="middle" fontSize="9" fill="var(--color-muted)">
            {d.year}
          </text>
        ))}
        <text x={PAD_L} y={H - 6} fontSize="9" fill="var(--color-muted)">
          Year tested
        </text>
        <text x={6} y={PAD_T + 4} fontSize="9" fill="var(--color-muted)" transform={`rotate(-90 10 ${H / 2})`}>
          Score on today&apos;s test
        </text>

        <path d={area} fill="var(--color-accent)" opacity="0.12" />
        <path d={line} fill="none" stroke="var(--color-accent)" strokeWidth="2.5" />
        {DATA.map((d) => (
          <circle key={d.year} cx={xOf(d.year)} cy={yOf(d.iq)} r="3.5" fill="var(--color-accent)" />
        ))}
      </svg>

      <p className="px-1 text-center text-sm text-muted">
        The average score rose about <span className="font-semibold text-ink">3 points a decade</span> — roughly{' '}
        <span className="font-semibold text-ink">+21 points</span> across these 70 years.
      </p>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {CAUSES.map((ca, i) => (
          <button
            key={ca.name}
            type="button"
            onClick={() => setCause(i)}
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors',
              cause === i ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            <Icon name={ca.icon} size={14} />
            {ca.name}
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-xl border border-border bg-surface-2 p-3">
        <div className="mb-1 flex items-center gap-2 text-sm font-semibold" style={{ color: c.color }}>
          <Icon name={c.icon} size={15} />
          {c.name}
        </div>
        <p className="text-sm leading-snug text-muted">{c.body}</p>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        Genes can&apos;t change this fast across two generations — so a large share of IQ differences must come from <span className="text-ink">environment</span>.
      </p>
    </div>
  )
}

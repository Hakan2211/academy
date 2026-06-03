import { useState } from 'react'
import { cn } from '#/lib/cn'

// A gallery of the five textbook elasticity cases. Each is a demand curve with a
// distinctive slope, an |E| label, and a real-world example. The extremes are
// the teaching anchors: a perfectly inelastic curve is vertical (insulin — you
// buy the same amount at any price), a perfectly elastic curve is horizontal (a
// single farmer's identical wheat — charge a cent more and you sell nothing).
// In between sit relatively inelastic (necessities), unit-elastic, and
// relatively elastic (a specific brand with close substitutes).
type Kind = 'perfectInelastic' | 'inelastic' | 'unit' | 'elastic' | 'perfectElastic'

type Case = {
  key: Kind
  label: string
  e: string
  example: string
  blurb: string
  // demand drawn as a line from (Qa, Pa) to (Qb, Pb) in 0..100 plot units
  a: { q: number; p: number }
  b: { q: number; p: number }
}

const X0 = 44
const Y0 = 168
const PW = 188
const PH = 150

const CASES: Array<Case> = [
  {
    key: 'perfectInelastic',
    label: 'Perfectly inelastic',
    e: '|E| = 0',
    example: 'Insulin for a diabetic',
    blurb: 'Quantity does not change at all when price moves — a life-saving necessity with no substitute. The curve is vertical.',
    a: { q: 50, p: 8 },
    b: { q: 50, p: 92 },
  },
  {
    key: 'inelastic',
    label: 'Relatively inelastic',
    e: '|E| < 1',
    example: 'Petrol, salt, electricity',
    blurb: 'Quantity responds only weakly to price — a necessity with few substitutes, so the curve is steep.',
    a: { q: 30, p: 92 },
    b: { q: 62, p: 8 },
  },
  {
    key: 'unit',
    label: 'Unit elastic',
    e: '|E| = 1',
    example: 'A spending-share benchmark',
    blurb: 'Quantity changes in exactly the same proportion as price — the dividing line. Total spending stays constant.',
    a: { q: 16, p: 92 },
    b: { q: 84, p: 8 },
  },
  {
    key: 'elastic',
    label: 'Relatively elastic',
    e: '|E| > 1',
    example: "One brand of soda",
    blurb: 'Quantity responds strongly — a luxury or a product with many close substitutes, so the curve is flat.',
    a: { q: 8, p: 78 },
    b: { q: 92, p: 22 },
  },
  {
    key: 'perfectElastic',
    label: 'Perfectly elastic',
    e: '|E| = ∞',
    example: "One farmer's wheat",
    blurb: 'Buyers will take any amount at the going price but none a penny above it — identical goods from many sellers. The curve is horizontal.',
    a: { q: 6, p: 50 },
    b: { q: 94, p: 50 },
  },
]

const sx = (q: number) => X0 + (q / 100) * PW
const sy = (p: number) => Y0 - (p / 100) * PH

export function ElasticityTypes() {
  const [kind, setKind] = useState<Kind>('perfectInelastic')
  const c = CASES.find((x) => x.key === kind)!
  const accent = kind === 'perfectInelastic' || kind === 'inelastic'
    ? 'var(--color-accent-2)'
    : kind === 'unit'
      ? 'var(--color-success)'
      : 'var(--color-accent)'

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        {CASES.map((x) => (
          <button
            key={x.key}
            type="button"
            onClick={() => setKind(x.key)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              kind === x.key
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {x.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 px-4 sm:grid-cols-2">
        <svg viewBox="0 0 250 200" className="w-full">
          {/* axes */}
          <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
          <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
          <text x={X0 + PW} y={Y0 + 16} textAnchor="end" fontSize="10" fill="var(--color-muted)">Quantity →</text>
          <text x={X0 - 4} y={Y0 - PH + 2} textAnchor="end" fontSize="10" fill="var(--color-muted)">↑ P</text>

          <line x1={sx(c.a.q)} y1={sy(c.a.p)} x2={sx(c.b.q)} y2={sy(c.b.p)} stroke={accent} strokeWidth="3" />
          <text
            x={sx((c.a.q + c.b.q) / 2) + (kind === 'perfectElastic' ? 0 : 8)}
            y={sy((c.a.p + c.b.p) / 2) - 6}
            fontSize="11"
            fill={accent}
          >
            {c.e}
          </text>
        </svg>

        <div className="flex flex-col justify-center gap-2 pb-2">
          <div className="text-xs uppercase tracking-wide text-muted">Real-world example</div>
          <div className="text-lg text-ink">{c.example}</div>
          <p className="text-sm text-muted">{c.blurb}</p>
        </div>
      </div>

      <p className="px-4 pb-4 pt-1 text-sm text-muted">
        The flatter the curve, the more <span className="text-accent">elastic</span> demand is: a small price change
        swings quantity a lot. The steeper it is, the more <span className="text-accent-2">inelastic</span>: buyers stick
        with it whatever the price.
      </p>
    </div>
  )
}

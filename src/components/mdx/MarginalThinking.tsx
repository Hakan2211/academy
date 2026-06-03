import { useState } from 'react'
import { cn } from '#/lib/cn'

// Thinking at the margin: good decisions weigh the benefit of ONE MORE unit
// against its cost — not totals, not what's already spent. Each extra slice is
// worth a little less (falling marginal benefit) while costing a little more
// (rising marginal cost). The sweet spot is the last unit where MB ≥ MC.
// Reused (as marginal product) by the Firms & Production world.
const N = 8
const mb = (k: number) => 9 - 1.0 * k // marginal benefit of the k-th unit
const mc = (k: number) => 1.5 + 0.85 * k // marginal cost of the k-th unit

// optimal quantity = largest k where MB ≥ MC
let OPT = 0
for (let k = 1; k <= N; k++) if (mb(k) >= mc(k)) OPT = k

const VW = 360
const H = 200
const Y0 = 170
const colW = VW / (N + 1)
const scale = 11 // value units → px

export function MarginalThinking() {
  const [q, setQ] = useState(2)

  let net = 0
  for (let k = 1; k <= q; k++) net += mb(k) - mc(k)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox={`0 0 ${VW} ${H}`} className="w-full">
        {/* optimum marker */}
        <line
          x1={colW * (OPT + 0.5)} y1={18} x2={colW * (OPT + 0.5)} y2={Y0}
          stroke="var(--color-success)" strokeWidth="1.5" strokeDasharray="4 3"
        />
        <text x={colW * (OPT + 0.5)} y={14} textAnchor="middle" fontSize="10" fill="var(--color-success)">
          MB = MC (best stop)
        </text>

        {Array.from({ length: N }, (_, i) => i + 1).map((k) => {
          const cx = colW * k
          const within = k <= q
          const benefit = mb(k)
          const cost = mc(k)
          return (
            <g key={k} opacity={within ? 1 : 0.3}>
              <rect
                x={cx - 11} y={Y0 - benefit * scale} width="10" height={benefit * scale}
                rx="2" fill="var(--color-accent)"
              />
              <rect
                x={cx + 1} y={Y0 - cost * scale} width="10" height={cost * scale}
                rx="2" fill="var(--color-accent-2)"
              />
              <text x={cx} y={Y0 + 14} textAnchor="middle" fontSize="10" fill="var(--color-muted)">{k}</text>
            </g>
          )
        })}
        <line x1={colW * 0.4} y1={Y0} x2={VW - 6} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <text x={colW * 0.4} y={Y0 + 14} fontSize="10" fill="var(--color-muted)">unit →</text>
      </svg>

      <div className="flex items-center justify-center gap-3 px-4">
        <span className="inline-flex items-center gap-1 text-xs text-muted"><span className="inline-block h-2 w-3 rounded-sm" style={{ background: 'var(--color-accent)' }} /> marginal benefit</span>
        <span className="inline-flex items-center gap-1 text-xs text-muted"><span className="inline-block h-2 w-3 rounded-sm" style={{ background: 'var(--color-accent-2)' }} /> marginal cost</span>
      </div>

      <div className="flex items-center justify-center gap-4 p-4">
        <button
          type="button"
          onClick={() => setQ((x) => Math.max(0, x - 1))}
          className="grid h-9 w-9 place-items-center rounded-full border border-border text-lg text-ink hover:border-accent"
        >−</button>
        <div className="text-center">
          <div className="font-mono text-xl text-ink">{q}</div>
          <div className="text-xs text-muted">units</div>
        </div>
        <button
          type="button"
          onClick={() => setQ((x) => Math.min(N, x + 1))}
          className="grid h-9 w-9 place-items-center rounded-full border border-border text-lg text-ink hover:border-accent"
        >+</button>
        <div className={cn('ml-2 rounded-xl border px-3 py-2 text-center', net >= 0 ? 'border-success/50' : 'border-accent-2/50')}>
          <div className={cn('font-mono text-lg', net >= 0 ? 'text-success' : 'text-accent-2')}>{net >= 0 ? '+' : ''}{net.toFixed(1)}</div>
          <div className="text-xs text-muted">net value</div>
        </div>
      </div>

      <p className="px-4 pb-4 text-sm text-muted">
        {q < OPT && `Push further — unit ${q + 1} still adds more benefit than cost.`}
        {q === OPT && `Right on the margin. Stopping at ${OPT} squeezes out the most total value.`}
        {q > OPT && `Too far — units past ${OPT} cost more than they're worth, dragging net value down.`}
      </p>
    </div>
  )
}

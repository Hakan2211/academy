import { useState } from 'react'
import { cn } from '#/lib/cn'

// Total vs marginal utility. Economists measure satisfaction in imaginary units
// called "utils". As you consume more of the same thing, TOTAL utility keeps
// rising — but by smaller and smaller steps. Each of those steps is the
// MARGINAL utility (the extra utility from one more unit), and it falls. The bars
// show the marginal utility of each unit; the line traces the running total.
const N = 8
// Marginal utility of the k-th slice of pizza, in utils — falling, eventually 0.
const mu = (k: number) => Math.max(0, 11 - 2 * k)
// Total utility after k units = sum of the marginal utilities.
const totalAt = (k: number) => {
  let t = 0
  for (let i = 1; i <= k; i++) t += mu(i)
  return t
}
const TU_MAX = totalAt(N)

const VW = 360
const H = 210
const X0 = 30
const Y0 = 178
const PW = VW - X0 - 14
const PH = Y0 - 22
const colW = PW / N

export function UtilityLab() {
  const [q, setQ] = useState(3)

  const muNow = mu(q)
  const tuNow = totalAt(q)

  const cx = (k: number) => X0 + (k - 0.5) * colW
  const cy = (tu: number) => Y0 - (tu / TU_MAX) * PH

  // total-utility polyline through (0,0) and each consumed unit's running total
  let line = `M ${X0} ${Y0}`
  for (let k = 1; k <= N; k++) line += ` L ${cx(k).toFixed(1)} ${cy(totalAt(k)).toFixed(1)}`

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox={`0 0 ${VW} ${H}`} className="w-full">
        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 16} textAnchor="end" fontSize="10" fill="var(--color-muted)">slices →</text>
        <text x={X0 - 6} y={Y0 - PH + 2} textAnchor="end" fontSize="10" fill="var(--color-muted)">↑ utils</text>

        {/* marginal-utility bars */}
        {Array.from({ length: N }, (_, i) => i + 1).map((k) => {
          const within = k <= q
          const h = (mu(k) / TU_MAX) * PH
          return (
            <g key={k} opacity={within ? 1 : 0.25}>
              <rect
                x={cx(k) - colW * 0.35} y={Y0 - h} width={colW * 0.7} height={h}
                rx="2" fill="var(--color-accent-2)"
              />
              <text x={cx(k)} y={Y0 + 16} textAnchor="middle" fontSize="10" fill="var(--color-muted)">{k}</text>
            </g>
          )
        })}

        {/* total-utility curve (drawn full but dimmed past q) */}
        <path d={line} fill="none" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="3 3" opacity="0.35" />
        {/* solid up to current q */}
        <path
          d={`M ${X0} ${Y0} ${Array.from({ length: q }, (_, i) => i + 1).map((k) => `L ${cx(k).toFixed(1)} ${cy(totalAt(k)).toFixed(1)}`).join(' ')}`}
          fill="none" stroke="var(--color-accent)" strokeWidth="2.5"
        />
        {q > 0 && <circle cx={cx(q)} cy={cy(tuNow)} r="5" fill="var(--color-accent)" />}
      </svg>

      <div className="flex items-center justify-center gap-3 px-4">
        <span className="inline-flex items-center gap-1 text-xs text-muted"><span className="inline-block h-2 w-3 rounded-sm" style={{ background: 'var(--color-accent-2)' }} /> marginal utility</span>
        <span className="inline-flex items-center gap-1 text-xs text-muted"><span className="inline-block h-1 w-3 rounded-sm" style={{ background: 'var(--color-accent)' }} /> total utility</span>
      </div>

      <div className="flex items-center justify-center gap-4 p-4">
        <button
          type="button"
          onClick={() => setQ((x) => Math.max(0, x - 1))}
          className="grid h-9 w-9 place-items-center rounded-full border border-border text-lg text-ink hover:border-accent"
        >−</button>
        <div className="text-center">
          <div className="font-mono text-xl text-ink">{q}</div>
          <div className="text-xs text-muted">slices eaten</div>
        </div>
        <button
          type="button"
          onClick={() => setQ((x) => Math.min(N, x + 1))}
          className="grid h-9 w-9 place-items-center rounded-full border border-border text-lg text-ink hover:border-accent"
        >+</button>
        <div className="ml-2 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-accent/50 px-3 py-1.5 text-center">
            <div className="font-mono text-lg text-accent">{tuNow}</div>
            <div className="text-xs text-muted">total utility</div>
          </div>
          <div className={cn('rounded-xl border px-3 py-1.5 text-center', muNow > 0 ? 'border-accent-2/50' : 'border-border')}>
            <div className={cn('font-mono text-lg', muNow > 0 ? 'text-accent-2' : 'text-muted')}>{q === 0 ? '—' : `+${muNow}`}</div>
            <div className="text-xs text-muted">this slice</div>
          </div>
        </div>
      </div>

      <p className="px-4 pb-4 text-sm text-muted">
        {q === 0 && 'Eat a slice to start piling up utils.'}
        {q > 0 && muNow > 0 && `The ${ordinal(q)} slice added ${muNow} utils — less than the one before. Total utility still rises, but the climb is flattening.`}
        {q > 0 && muNow === 0 && `You're stuffed: the ${ordinal(q)} slice added nothing. Total utility has stopped growing — extra units bring no extra satisfaction.`}
      </p>
    </div>
  )
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

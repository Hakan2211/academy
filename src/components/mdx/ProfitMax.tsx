import { useMemo, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { clamp, formatUSD } from '#/lib/econ'

// Choosing how much to produce. A price-taking firm sells every unit at the
// market price, so total revenue is a straight line (slope = price = marginal
// revenue) while total cost curves upward. Profit — the gap between them — is
// largest exactly where MARGINAL revenue meets MARGINAL cost: the last unit
// whose price still covers the cost of making it. The shaded rectangle is the
// profit, (price − average total cost) × quantity.
const X0 = 50
const Y0 = 232
const PW = 290
const PH = 198
const QMAX = 12

const FC = 60
const A = 28
const B = 4
const C = 0.42
const vc = (q: number) => A * q - B * q * q + C * q * q * q
const tc = (q: number) => FC + vc(q)
const mc = (q: number) => A - 2 * B * q + 3 * C * q * q

// profit-maximising output for a given price: largest q (integer) with MC ≤ price
function bestQ(price: number): number {
  let best = 0
  for (let q = 1; q <= QMAX; q++) if (mc(q) <= price) best = q
  return best
}

const TCMAX = tc(QMAX)

export function ProfitMax() {
  const [price, setPrice] = useState(40)
  const [q, setQ] = useState(6)

  const yMax = Math.ceil(Math.max(TCMAX, price * QMAX) / 50) * 50
  const sx = (x: number) => X0 + (x / QMAX) * PW
  const sy = (y: number) => Y0 - (clamp(y, 0, yMax) / yMax) * PH

  const tcPath = useMemo(() => {
    const N = 60
    let d = ''
    for (let i = 0; i <= N; i++) {
      const x = (i / N) * QMAX
      d += `${i === 0 ? 'M' : 'L'}${sx(x).toFixed(1)} ${sy(tc(x)).toFixed(1)} `
    }
    return d
  }, [yMax])

  const opt = bestQ(price)
  const tr = price * q
  const total = tc(q)
  const profit = tr - total
  const atQ = q

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 270" className="w-full">
        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 18} textAnchor="end" fontSize="11" fill="var(--color-muted)">Quantity →</text>
        <text x={X0 - 6} y={Y0 - PH} textAnchor="end" fontSize="11" fill="var(--color-muted)">↑ $</text>

        {/* profit rectangle between TR and TC at the chosen output */}
        <rect
          x={X0}
          y={sy(Math.max(tr, total))}
          width={sx(atQ) - X0}
          height={Math.abs(sy(total) - sy(tr))}
          fill={profit >= 0 ? 'var(--color-success)' : 'var(--color-accent)'}
          opacity="0.18"
        />

        {/* total revenue (straight line, slope = price) */}
        <line x1={sx(0)} y1={sy(0)} x2={sx(QMAX)} y2={sy(price * QMAX)} stroke="var(--color-accent-2)" strokeWidth="3" />
        {/* total cost */}
        <path d={tcPath} fill="none" stroke="var(--color-ink)" strokeWidth="3" />

        {/* optimum marker (MR = MC) */}
        <line x1={sx(opt)} y1={Y0} x2={sx(opt)} y2={Y0 - PH} stroke="var(--color-success)" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x={sx(opt)} y={Y0 - PH - 4} textAnchor="middle" fontSize="10" fill="var(--color-success)">MR = MC</text>

        {/* chosen-output guide + points */}
        <line x1={sx(atQ)} y1={Y0} x2={sx(atQ)} y2={Y0 - PH} stroke="var(--color-muted)" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
        <circle cx={sx(atQ)} cy={sy(tr)} r="5" fill="var(--color-accent-2)" />
        <circle cx={sx(atQ)} cy={sy(total)} r="5" fill="var(--color-ink)" />

        <text x={sx(QMAX) + 2} y={clamp(sy(price * QMAX), 22, Y0)} fontSize="11" fill="var(--color-accent-2)">TR</text>
        <text x={sx(QMAX) + 2} y={clamp(sy(TCMAX), 22, Y0)} fontSize="11" fill="var(--color-ink)">TC</text>
      </svg>

      <div className="grid grid-cols-3 gap-2 px-4 text-center text-sm">
        <div><div className="font-mono text-accent-2">{formatUSD(tr)}</div><div className="text-xs text-muted">revenue</div></div>
        <div><div className="font-mono text-ink">{formatUSD(total)}</div><div className="text-xs text-muted">total cost</div></div>
        <div>
          <div className={profit >= 0 ? 'font-mono text-success' : 'font-mono text-accent'}>{profit >= 0 ? '+' : ''}{formatUSD(profit)}</div>
          <div className="text-xs text-muted">profit</div>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <SceneSlider label="Market price (= marginal revenue)" value={price} min={20} max={60} step={1} unit="$" onChange={setPrice} />
        <SceneSlider label="Output chosen" value={q} min={0} max={QMAX} step={1} unit="units" onChange={setQ} />
        <p className="text-sm text-muted">
          {q < opt && `Make more: at ${q} units the price still beats the marginal cost. Profit peaks at ${opt} units.`}
          {q === opt && `Profit-maximising output: ${opt} units, where the next unit's cost just reaches the price (MR = MC).`}
          {q > opt && `Too far: units past ${opt} cost more to make than the price they fetch, shrinking profit. The best output is ${opt}.`}
        </p>
      </div>
    </div>
  )
}

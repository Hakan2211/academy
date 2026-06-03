import { useMemo, useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'
import { midpointElasticity } from '#/lib/econ'

// The total-revenue test. On a straight-line demand curve, total revenue
// (price × quantity = the area of the rectangle under the chosen point) rises,
// peaks, then falls as price drops. The peak sits exactly at the unit-elastic
// midpoint. Above it demand is elastic, so cutting price RAISES revenue (you
// win more than enough extra buyers); below it demand is inelastic, so cutting
// price LOWERS revenue. We draw the rectangle on the demand curve plus a tiny
// revenue-vs-price curve that bows to its peak.
const X0 = 50
const Y0 = 192
const PW = 168
const PH = 158

// Demand: P = A - Q. Qmax = A at P=0; midpoint (max revenue) at P = A/2.
const A = 100
const QMAX = A
const PMAX = A
const qtyAt = (p: number) => A - p
const revAt = (p: number) => p * qtyAt(p)
const REV_MAX = revAt(A / 2) // = A²/4

// second (small) panel for revenue-vs-price
const RX0 = 262
const RY0 = 192
const RW = 80
const RH = 158

export function TotalRevenueTest() {
  const [price, setPrice] = useState(70)
  const q = qtyAt(price)
  const rev = revAt(price)
  // elasticity of a small step around this price (1 unit) → classify the slope
  const e = midpointElasticity(price, q, price - 1, qtyAt(price - 1))
  const zone = e > 1.001 ? 'elastic' : e < 0.999 ? 'inelastic' : 'unit'

  const sx = (qq: number) => X0 + (qq / QMAX) * PW
  const sy = (p: number) => Y0 - (p / PMAX) * PH

  // revenue-curve path (rev on x-ish? we plot price on Y, revenue on X)
  const revPath = useMemo(() => {
    const N = 40
    let d = ''
    for (let i = 0; i <= N; i++) {
      const p = (i / N) * PMAX
      const x = RX0 + (revAt(p) / REV_MAX) * RW
      const y = RY0 - (p / PMAX) * RH
      d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)} `
    }
    return d
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 230" className="w-full">
        {/* ---- left panel: demand + revenue rectangle ---- */}
        {/* revenue rectangle (P × Q) */}
        <rect
          x={X0} y={sy(price)} width={sx(q) - X0} height={Y0 - sy(price)}
          fill="var(--color-accent)" opacity={zone === 'unit' ? 0.28 : 0.16}
        />
        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 16} textAnchor="end" fontSize="10" fill="var(--color-muted)">Quantity →</text>
        <text x={X0 - 4} y={Y0 - PH + 2} textAnchor="end" fontSize="10" fill="var(--color-muted)">↑ Price</text>

        {/* demand line */}
        <line x1={sx(0)} y1={sy(A)} x2={sx(QMAX)} y2={sy(0)} stroke="var(--color-ink)" strokeWidth="2.5" />
        <text x={sx(QMAX) - 4} y={sy(0) - 6} textAnchor="end" fontSize="10" fill="var(--color-ink)">D</text>

        {/* unit-elastic midpoint */}
        <circle cx={sx(QMAX / 2)} cy={sy(PMAX / 2)} r="3.5" fill="var(--color-success)" />

        {/* chosen point + guides */}
        <line x1={X0} y1={sy(price)} x2={sx(q)} y2={sy(price)} stroke="var(--color-muted)" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
        <line x1={sx(q)} y1={sy(price)} x2={sx(q)} y2={Y0} stroke="var(--color-muted)" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
        <circle cx={sx(q)} cy={sy(price)} r="5" fill="var(--color-accent)" />

        {/* ---- right panel: revenue vs price ---- */}
        <line x1={RX0} y1={RY0} x2={RX0 + RW + 14} y2={RY0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={RX0} y1={RY0} x2={RX0} y2={RY0 - RH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={RX0} y={RY0 - RH - 4} textAnchor="middle" fontSize="9" fill="var(--color-muted)">revenue ↑price</text>
        <path d={revPath} fill="none" stroke="var(--color-accent-2)" strokeWidth="2.5" />
        {/* peak marker at unit elasticity */}
        <circle cx={RX0 + RW} cy={RY0 - (PMAX / 2 / PMAX) * RH} r="3.5" fill="var(--color-success)" />
        {/* current revenue dot */}
        <circle cx={RX0 + (rev / REV_MAX) * RW} cy={RY0 - (price / PMAX) * RH} r="4" fill="var(--color-accent)" />
      </svg>

      <div className="grid grid-cols-3 gap-2 px-4 text-center text-sm">
        <div><div className="font-mono text-ink">{Math.round(price)}</div><div className="text-xs text-muted">price</div></div>
        <div><div className="font-mono text-ink">{Math.round(rev).toLocaleString()}</div><div className="text-xs text-muted">total revenue</div></div>
        <div>
          <div className={cn('font-mono capitalize', zone === 'elastic' ? 'text-accent' : zone === 'inelastic' ? 'text-accent-2' : 'text-success')}>{zone}</div>
          <div className="text-xs text-muted">here</div>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <SceneSlider label="Set the price" value={price} min={5} max={95} step={1} unit="" onChange={setPrice} />
        <p className="text-sm text-muted">
          {zone === 'elastic' && 'Demand is elastic up here — CUT the price and total revenue rises, because you gain more than enough extra buyers to offset the lower price.'}
          {zone === 'unit' && 'Right at the unit-elastic midpoint — total revenue is at its maximum. A small move either way leaves it almost unchanged.'}
          {zone === 'inelastic' && 'Demand is inelastic down here — cutting the price now LOWERS total revenue, because the extra buyers do not make up for charging everyone less. You would raise the price.'}
        </p>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'
import { midpointElasticity, clamp } from '#/lib/econ'

// FLAGSHIP for the Elasticity world. A single straight-line demand curve, and
// two points you slide along it. We compute the MIDPOINT (arc) elasticity
// between them. The key lesson: a straight line has the SAME slope everywhere,
// yet its elasticity is NOT constant — demand is elastic (|E| > 1) on the upper
// (high-price) half and inelastic (|E| < 1) on the lower (high-quantity) half,
// passing through unit-elastic (|E| = 1) at the midpoint. Slope ≠ elasticity.
const X0 = 52
const Y0 = 250
const PW = 286
const PH = 222

// Demand line: P = A - B·Q. Choke price A at Q=0, max quantity A/B at P=0.
const A = 100
const B = 1 // so Qmax = 100, midpoint at Q=50, P=50
const QMAX = A / B
const PMAX = A

const qtyAt = (p: number) => (A - p) / B

export function ElasticityLab() {
  // two prices on the curve (p1 > p2 — sliding "down" the demand curve)
  const [p1, setP1] = useState(70)
  const [p2, setP2] = useState(50)

  const q1 = qtyAt(p1)
  const q2 = qtyAt(p2)
  const e = midpointElasticity(p1, q1, p2, q2)

  // classify the midpoint of the chosen span against the unit-elastic midpoint
  const midP = (p1 + p2) / 2
  const zone =
    e > 1.001 ? 'elastic' : e < 0.999 ? 'inelastic' : 'unit'

  const sx = (q: number) => X0 + (q / QMAX) * PW
  const sy = (p: number) => Y0 - (p / PMAX) * PH

  // the unit-elastic midpoint of the WHOLE curve (P = A/2, Q = Qmax/2)
  const midQ = QMAX / 2
  const midPrice = PMAX / 2

  // demand line endpoints (Q=0 .. Q=QMAX)
  const lineTop = { x: sx(0), y: sy(A) }
  const lineBot = { x: sx(QMAX), y: sy(0) }
  // boundary between elastic (upper) and inelastic (lower) halves = the midpoint
  const midX = sx(midQ)
  const midY = sy(midPrice)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 290" className="w-full">
        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 18} textAnchor="end" fontSize="11" fill="var(--color-muted)">Quantity →</text>
        <text x={X0 - 6} y={Y0 - PH} textAnchor="end" fontSize="11" fill="var(--color-muted)">↑ Price</text>

        {/* elastic (upper) half of the demand line — thick coloured overlay */}
        <line x1={lineTop.x} y1={lineTop.y} x2={midX} y2={midY} stroke="var(--color-accent)" strokeWidth="6" opacity="0.28" />
        {/* inelastic (lower) half */}
        <line x1={midX} y1={midY} x2={lineBot.x} y2={lineBot.y} stroke="var(--color-accent-2)" strokeWidth="6" opacity="0.28" />

        {/* the demand line itself */}
        <line x1={lineTop.x} y1={lineTop.y} x2={lineBot.x} y2={lineBot.y} stroke="var(--color-ink)" strokeWidth="2.5" />
        <text x={lineBot.x - 4} y={lineBot.y - 6} textAnchor="end" fontSize="11" fill="var(--color-ink)">D</text>

        {/* unit-elastic midpoint marker */}
        <circle cx={midX} cy={midY} r="4" fill="var(--color-success)" />
        <text x={midX + 8} y={midY - 4} fontSize="9" fill="var(--color-success)">unit elastic</text>

        {/* region labels */}
        <text x={sx(QMAX * 0.13)} y={sy(PMAX * 0.84)} fontSize="10" fill="var(--color-accent)">elastic (|E| &gt; 1)</text>
        <text x={sx(QMAX * 0.55)} y={sy(PMAX * 0.16)} fontSize="10" fill="var(--color-accent-2)">inelastic (|E| &lt; 1)</text>

        {/* the chosen span p1 → p2 */}
        <line x1={sx(q1)} y1={sy(p1)} x2={sx(q2)} y2={sy(p2)} stroke="var(--color-ink)" strokeWidth="3" />
        {/* guide lines for point 1 */}
        <line x1={sx(q1)} y1={sy(p1)} x2={X0} y2={sy(p1)} stroke="var(--color-muted)" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
        <line x1={sx(q1)} y1={sy(p1)} x2={sx(q1)} y2={Y0} stroke="var(--color-muted)" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
        {/* guide lines for point 2 */}
        <line x1={sx(q2)} y1={sy(p2)} x2={X0} y2={sy(p2)} stroke="var(--color-muted)" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
        <line x1={sx(q2)} y1={sy(p2)} x2={sx(q2)} y2={Y0} stroke="var(--color-muted)" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />

        <circle cx={sx(q1)} cy={sy(p1)} r="6" fill="var(--color-accent)" />
        <circle cx={sx(q2)} cy={sy(p2)} r="6" fill="var(--color-accent-2)" />
      </svg>

      <div className="grid grid-cols-3 gap-2 px-4 text-center text-sm">
        <div><div className="font-mono text-ink">{e.toFixed(2)}</div><div className="text-xs text-muted">|E_d| (midpoint)</div></div>
        <div><div className="font-mono text-ink">{Math.round(midP)}</div><div className="text-xs text-muted">avg price</div></div>
        <div>
          <div className={cn('font-mono capitalize', zone === 'elastic' ? 'text-accent' : zone === 'inelastic' ? 'text-accent-2' : 'text-success')}>{zone}</div>
          <div className="text-xs text-muted">over this span</div>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <SceneSlider label="Upper price point" value={p1} min={5} max={95} step={1} unit="" onChange={(v) => setP1(clamp(v, p2 + 5, 95))} />
        <SceneSlider label="Lower price point" value={p2} min={5} max={95} step={1} unit="" onChange={(v) => setP2(clamp(v, 5, p1 - 5))} />
        <p className="text-sm text-muted">
          The demand line has the <span className="text-ink">same slope everywhere</span>, yet elasticity changes as you
          slide. High up (low quantity) a small price cut wins lots of buyers — demand is <span className="text-accent">elastic</span>.
          Low down (high quantity) the same change barely moves quantity — <span className="text-accent-2">inelastic</span>. They
          balance at the <span className="text-success">unit-elastic</span> midpoint. Slope is not elasticity.
        </p>
      </div>
    </div>
  )
}

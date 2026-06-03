import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { clamp, lerp } from '#/lib/econ'

// Why branding pays. A firm selling a perfect commodity faces a nearly FLAT
// (very elastic) demand curve: charge a cent above rivals and buyers vanish to
// the identical product next door. Differentiate — through brand, design,
// quality, location, loyalty — and the firm carves out customers who see its
// product as special. Their demand becomes STEEPER (less elastic): the firm can
// raise price and keep most of them. That gentle downward slope is the source
// of a monopolistically-competitive firm's modest price-setting power.
const X0 = 50
const Y0 = 200
const PW = 250
const PH = 160
const QMAX = 100
const PMAX = 100

export function ProductDifferentiation() {
  const [d, setD] = useState(20) // 0 = commodity, 100 = highly differentiated

  const sx = (q: number) => X0 + (q / QMAX) * PW
  const sy = (p: number) => Y0 - (clamp(p, 0, PMAX) / PMAX) * PH

  const t = d / 100
  // demand rotates about a pivot point as differentiation rises: flat → steep.
  // slope = price drop needed per extra unit sold.
  const pivotQ = 50
  const pivotP = 50
  const slope = lerp(0.06, 1.3, t)
  const demP = (q: number) => pivotP + slope * (pivotQ - q)
  const d1 = { x: sx(0), y: sy(clamp(demP(0), 0, PMAX)) }
  const d2 = { x: sx(QMAX), y: sy(clamp(demP(QMAX), 0, PMAX)) }

  // how much price the firm can add over the going rate before losing half its
  // buyers — a friendly proxy for pricing power.
  const power = Math.round(lerp(1, 38, t))
  const elastic = t < 0.35

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 240" className="w-full">
        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 18} textAnchor="end" fontSize="11" fill="var(--color-muted)">Quantity →</text>
        <text x={X0 - 6} y={Y0 - PH} textAnchor="end" fontSize="11" fill="var(--color-muted)">↑ Price</text>

        {/* the firm's demand curve */}
        <line x1={d1.x} y1={d1.y} x2={d2.x} y2={d2.y} stroke="var(--color-accent)" strokeWidth="3" />
        <text x={d2.x - 4} y={clamp(d2.y - 6, 16, Y0)} textAnchor="end" fontSize="10" fill="var(--color-accent)">demand</text>

        {/* pivot point */}
        <circle cx={sx(pivotQ)} cy={sy(pivotP)} r="5" fill="var(--color-ink)" />
      </svg>

      <div className="grid grid-cols-2 gap-2 px-4 text-center text-sm">
        <div>
          <div className="font-mono text-accent">{elastic ? 'flat / elastic' : 'steep / less elastic'}</div>
          <div className="text-xs text-muted">demand curve</div>
        </div>
        <div>
          <div className="font-mono text-accent-2">+{power}%</div>
          <div className="text-xs text-muted">price the firm can add</div>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <SceneSlider label="How differentiated is the product?" value={d} min={0} max={100} step={1} unit="%" onChange={setD} />
        <p className="text-sm text-muted">
          {elastic
            ? 'A near-commodity: buyers see little difference, so demand is almost flat. Nudge the price up and customers flee to a rival. The firm is nearly a price taker.'
            : 'Branding and differentiation have won loyal customers. Demand slopes down more steeply, so the firm can raise price and keep most buyers — modest but real price-setting power, the hallmark of monopolistic competition.'}
        </p>
      </div>
    </div>
  )
}

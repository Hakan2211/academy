import { useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'
import { clamp } from '#/lib/econ'

// The law of demand, drawn: as price falls, the quantity buyers want rises, so
// the demand curve slopes DOWN. Drag the price to read quantity demanded off the
// curve (a movement ALONG it). The shifter toggles move the whole curve right
// (more buyers / higher income) or left (fewer) — a SHIFT, a different curve.
const X0 = 48
const Y0 = 250
const PW = 292
const PH = 222
const QMAX = 140
const PMAX = 140

// demand: P = intercept − Q  →  Q = intercept − P
type Shifter = { id: string; label: string; delta: number }
const SHIFTERS: Array<Shifter> = [
  { id: 'income', label: 'Higher income', delta: 30 },
  { id: 'buyers', label: 'More buyers', delta: 24 },
  { id: 'tastes', label: 'Out of fashion', delta: -28 },
]

export function DemandCurve() {
  const [on, setOn] = useState<Record<string, boolean>>({})
  const [price, setPrice] = useState(70)

  const shift = SHIFTERS.reduce((s, f) => s + (on[f.id] ? f.delta : 0), 0)
  const intercept = 110 + shift // price-axis intercept of the demand line

  const sx = (q: number) => X0 + (q / QMAX) * PW
  const sy = (p: number) => Y0 - (p / PMAX) * PH

  // quantity demanded at the chosen price
  const qd = clamp(intercept - price, 0, QMAX)

  // demand line endpoints (clipped visually by the plot box)
  const dem = { x1: sx(intercept - PMAX), y1: sy(PMAX), x2: sx(intercept), y2: sy(0) }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 290" className="w-full">
        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 18} textAnchor="end" fontSize="11" fill="var(--color-muted)">Quantity →</text>
        <text x={X0 - 6} y={Y0 - PH + 4} textAnchor="end" fontSize="11" fill="var(--color-muted)">↑ Price</text>

        {/* the demand curve */}
        <line x1={dem.x1} y1={dem.y1} x2={dem.x2} y2={dem.y2} stroke="var(--color-accent)" strokeWidth="3" />
        <text x={clamp(dem.x2 + 4, X0, X0 + PW - 10)} y={Y0 - 6} fontSize="11" fill="var(--color-accent)">D</text>

        {/* chosen price line → quantity read-off */}
        <line x1={X0} y1={sy(price)} x2={sx(qd)} y2={sy(price)} stroke="var(--color-muted)" strokeWidth="1" strokeDasharray="4 3" />
        <line x1={sx(qd)} y1={sy(price)} x2={sx(qd)} y2={Y0} stroke="var(--color-muted)" strokeWidth="1" strokeDasharray="4 3" />
        <circle cx={sx(qd)} cy={sy(price)} r="6" fill="var(--color-accent)" />
      </svg>

      <div className="grid grid-cols-2 gap-2 px-4 text-center text-sm">
        <div><div className="font-mono text-ink">{Math.round(price)}</div><div className="text-xs text-muted">price</div></div>
        <div><div className="font-mono text-accent">{Math.round(qd)}</div><div className="text-xs text-muted">quantity demanded</div></div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <SceneSlider label="Set the price" value={price} min={10} max={130} step={1} unit="" onChange={setPrice} />
        <div className="flex flex-wrap gap-2">
          {SHIFTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setOn((o) => ({ ...o, [f.id]: !o[f.id] }))}
              className={cn(
                'rounded-full border px-3 py-1 text-sm transition-colors',
                on[f.id]
                  ? 'border-accent bg-accent/15 text-accent'
                  : 'border-border text-muted hover:text-ink',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted">
          Sliding the price moves you <span className="text-ink">along</span> one curve — a change in{' '}
          <span className="text-ink">quantity demanded</span>. A toggle <span className="text-ink">shifts</span> the whole
          curve — a change in <span className="text-ink">demand</span> itself.
        </p>
      </div>
    </div>
  )
}

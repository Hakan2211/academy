import { useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'
import { clamp } from '#/lib/econ'

// The law of supply, drawn: as price rises, sellers find it worth making more,
// so the supply curve slopes UP. Drag the price to read quantity supplied off
// the curve (a movement ALONG it). The shifter toggles move the whole curve
// right (cheaper inputs / better tech) or left (costlier inputs) — a SHIFT.
const X0 = 48
const Y0 = 250
const PW = 292
const PH = 222
const QMAX = 140
const PMAX = 140

// supply: P = intercept + Q  →  Q = P − intercept
type Shifter = { id: string; label: string; delta: number }
const SHIFTERS: Array<Shifter> = [
  { id: 'tech', label: 'Better technology', delta: -28 },
  { id: 'sellers', label: 'More sellers', delta: -22 },
  { id: 'inputs', label: 'Costlier inputs', delta: 30 },
]

export function SupplyCurve() {
  const [on, setOn] = useState<Record<string, boolean>>({})
  const [price, setPrice] = useState(70)

  const shift = SHIFTERS.reduce((s, f) => s + (on[f.id] ? f.delta : 0), 0)
  const intercept = 10 + shift // price-axis intercept of the supply line

  const sx = (q: number) => X0 + (q / QMAX) * PW
  const sy = (p: number) => Y0 - (p / PMAX) * PH

  // quantity supplied at the chosen price (zero below the intercept)
  const qs = clamp(price - intercept, 0, QMAX)

  // supply line endpoints (clipped visually by the plot box)
  const sup = { x1: sx(0), y1: sy(intercept), x2: sx(PMAX - intercept), y2: sy(PMAX) }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 290" className="w-full">
        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 18} textAnchor="end" fontSize="11" fill="var(--color-muted)">Quantity →</text>
        <text x={X0 - 6} y={Y0 - PH + 4} textAnchor="end" fontSize="11" fill="var(--color-muted)">↑ Price</text>

        {/* the supply curve */}
        <line x1={sup.x1} y1={sup.y1} x2={sup.x2} y2={sup.y2} stroke="var(--color-accent-2)" strokeWidth="3" />
        <text x={clamp(sup.x2 + 4, X0, X0 + PW - 10)} y={sy(PMAX) + 12} fontSize="11" fill="var(--color-accent-2)">S</text>

        {/* chosen price line → quantity read-off */}
        <line x1={X0} y1={sy(price)} x2={sx(qs)} y2={sy(price)} stroke="var(--color-muted)" strokeWidth="1" strokeDasharray="4 3" />
        <line x1={sx(qs)} y1={sy(price)} x2={sx(qs)} y2={Y0} stroke="var(--color-muted)" strokeWidth="1" strokeDasharray="4 3" />
        <circle cx={sx(qs)} cy={sy(price)} r="6" fill="var(--color-accent-2)" />
      </svg>

      <div className="grid grid-cols-2 gap-2 px-4 text-center text-sm">
        <div><div className="font-mono text-ink">{Math.round(price)}</div><div className="text-xs text-muted">price</div></div>
        <div><div className="font-mono text-accent-2">{Math.round(qs)}</div><div className="text-xs text-muted">quantity supplied</div></div>
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
          A higher price draws out more output — that&apos;s a movement <span className="text-ink">along</span> the curve, a
          change in <span className="text-ink">quantity supplied</span>. Cheaper inputs or better technology{' '}
          <span className="text-ink">shift</span> the whole curve, a change in <span className="text-ink">supply</span>.
        </p>
      </div>
    </div>
  )
}

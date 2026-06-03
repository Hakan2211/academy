import { useId, useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'
import { clamp } from '#/lib/econ'

// The workhorse of microeconomics: a demand curve (downward) and a supply curve
// (upward) on price–quantity axes. Shift either curve and the equilibrium —
// where they cross — moves. Set a price away from equilibrium to reveal a
// surplus (price too high) or shortage (price too low). Reused by the
// Elasticity, Market Failure, Labour and Trade worlds.
const X0 = 48
const Y0 = 250
const PW = 292
const PH = 222
const QMAX = 140
const PMAX = 140

export function SupplyDemand({
  showPrice = true,
}: {
  showPrice?: boolean
}) {
  const clipId = useId()
  const [dShift, setDShift] = useState(0) // + = demand increases (rightward)
  const [sShift, setSShift] = useState(0) // + = supply increases (rightward)
  const [price, setPrice] = useState(55)

  // demand P = aD - Q ; supply P = aS + Q
  const aD = 100 + dShift
  const aS = 10 - sShift
  const qStar = clamp((aD - aS) / 2, 0, QMAX)
  const pStar = aS + qStar

  const sx = (q: number) => X0 + (q / QMAX) * PW
  const sy = (p: number) => Y0 - (p / PMAX) * PH

  // long line endpoints (clipped to the plot box via clipPath)
  const dem = { x1: sx(-20), y1: sy(aD + 20), x2: sx(160), y2: sy(aD - 160) }
  const sup = { x1: sx(-20), y1: sy(aS - 20), x2: sx(160), y2: sy(aS + 160) }

  // at the chosen price: quantity demanded vs supplied
  const qd = clamp(aD - price, 0, QMAX)
  const qs = clamp(price - aS, 0, QMAX)
  const gap = qs - qd // + surplus, - shortage
  const state = Math.abs(price - pStar) < 0.5 ? 'eq' : gap > 0 ? 'surplus' : 'shortage'

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 290" className="w-full">
        <defs>
          <clipPath id={clipId}>
            <rect x={X0} y={Y0 - PH} width={PW} height={PH} />
          </clipPath>
        </defs>

        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 18} textAnchor="end" fontSize="11" fill="var(--color-muted)">Quantity →</text>
        <text x={X0 - 6} y={Y0 - PH + 4} textAnchor="end" fontSize="11" fill="var(--color-muted)">↑ Price</text>

        <g clipPath={`url(#${clipId})`}>
          {/* surplus / shortage bracket at the chosen price */}
          {showPrice && state !== 'eq' && (
            <line
              x1={sx(Math.min(qd, qs))} y1={sy(price)} x2={sx(Math.max(qd, qs))} y2={sy(price)}
              stroke={state === 'surplus' ? 'var(--color-accent-2)' : 'var(--color-accent)'}
              strokeWidth="6" opacity="0.5"
            />
          )}
          {/* curves */}
          <line x1={dem.x1} y1={dem.y1} x2={dem.x2} y2={dem.y2} stroke="var(--color-accent)" strokeWidth="3" />
          <line x1={sup.x1} y1={sup.y1} x2={sup.x2} y2={sup.y2} stroke="var(--color-accent-2)" strokeWidth="3" />

          {/* chosen-price line */}
          {showPrice && (
            <line x1={X0} y1={sy(price)} x2={X0 + PW} y2={sy(price)} stroke="var(--color-muted)" strokeWidth="1" strokeDasharray="4 3" />
          )}

          {/* equilibrium guides + point */}
          <line x1={sx(qStar)} y1={sy(pStar)} x2={sx(qStar)} y2={Y0} stroke="var(--color-ink)" strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
          <line x1={sx(qStar)} y1={sy(pStar)} x2={X0} y2={sy(pStar)} stroke="var(--color-ink)" strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
          <circle cx={sx(qStar)} cy={sy(pStar)} r="6" fill="var(--color-ink)" />
        </g>

        {/* curve labels */}
        <text x={dem.x2 + 2} y={clamp(dem.y2, 24, Y0)} fontSize="11" fill="var(--color-accent)">D</text>
        <text x={X0 + PW - 8} y={clamp(sy(aS + QMAX), 24, Y0)} fontSize="11" fill="var(--color-accent-2)">S</text>
      </svg>

      <div className="grid grid-cols-2 gap-2 px-4 text-center text-sm">
        <div><div className="font-mono text-ink">{Math.round(pStar)}</div><div className="text-xs text-muted">equilibrium price</div></div>
        <div><div className="font-mono text-ink">{Math.round(qStar)}</div><div className="text-xs text-muted">equilibrium quantity</div></div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <SceneSlider label="Shift demand" value={dShift} min={-30} max={30} step={1} unit="" onChange={setDShift} />
        <SceneSlider label="Shift supply" value={sShift} min={-30} max={30} step={1} unit="" onChange={setSShift} />
        {showPrice && (
          <>
            <SceneSlider label="Set the market price" value={price} min={10} max={130} step={1} unit="" onChange={setPrice} />
            <div
              className={cn(
                'rounded-xl border px-3 py-2 text-center text-sm',
                state === 'eq' ? 'border-success/50 text-success'
                  : state === 'surplus' ? 'border-accent-2/50 text-accent-2'
                    : 'border-accent/50 text-accent',
              )}
            >
              {state === 'eq' && 'Market clears — quantity supplied equals quantity demanded.'}
              {state === 'surplus' && `Surplus: at this price sellers offer ${Math.round(gap)} more units than buyers want. Price will fall.`}
              {state === 'shortage' && `Shortage: buyers want ${Math.round(-gap)} more units than sellers offer. Price will rise.`}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

import { useId, useState } from 'react'
import { cn } from '#/lib/cn'
import { clamp } from '#/lib/econ'

// Two ways the economy can be knocked off course, on one AD/AS diagram. A DEMAND
// shock (a slump in spending) shifts AD LEFT: the price level AND real GDP both
// fall together. A supply shock (an oil-price spike that raises firms' costs)
// shifts SRAS LEFT: real GDP falls while the price level RISES — the nasty
// combination called STAGFLATION. Toggle between the two to compare which way
// the price level moves. Faint lines are the starting curves; bold lines are
// after the shock; the arrow tracks the equilibrium.
const X0 = 48
const Y0 = 246
const PW = 290
const PH = 216
const YMAX = 140
const PMAX = 140

type Shock = 'demand' | 'supply'

export function SupplyShock() {
  const clipId = useId()
  const [shock, setShock] = useState<Shock>('supply')

  // baseline AD: P = 110 - Y ; baseline SRAS: P = 10 + Y
  const aAD0 = 110
  const aSRAS0 = 10
  const SHIFT = 34

  // an adverse shock shifts ONE curve left
  const aAD = shock === 'demand' ? aAD0 - SHIFT : aAD0
  const aSRAS = shock === 'supply' ? aSRAS0 + SHIFT : aSRAS0

  const eq = (ad: number, sras: number) => {
    const y = clamp((ad - sras) / 2, 0, YMAX)
    return { y, p: sras + y }
  }
  const before = eq(aAD0, aSRAS0)
  const after = eq(aAD, aSRAS)

  const sx = (y: number) => X0 + (y / YMAX) * PW
  const sy = (p: number) => Y0 - (p / PMAX) * PH

  const line = (intercept: number, slope: 1 | -1) => ({
    x1: sx(-20), y1: sy(intercept + slope * -20),
    x2: sx(160), y2: sy(intercept + slope * 160),
  })
  const ad0 = line(aAD0, -1)
  const sras0 = line(aSRAS0, 1)
  const adNow = line(aAD, -1)
  const srasNow = line(aSRAS, 1)

  const pUp = after.p > before.p + 0.5
  const yDown = after.y < before.y - 0.5

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        {(['demand', 'supply'] as Array<Shock>).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setShock(s)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm capitalize transition-colors',
              shock === s
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {s} shock
          </button>
        ))}
      </div>

      <svg viewBox="0 0 360 286" className="w-full">
        <defs>
          <clipPath id={clipId}>
            <rect x={X0} y={Y0 - PH} width={PW} height={PH} />
          </clipPath>
        </defs>

        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 18} textAnchor="end" fontSize="11" fill="var(--color-muted)">Real GDP →</text>
        <text x={X0 - 6} y={Y0 - PH + 4} textAnchor="end" fontSize="11" fill="var(--color-muted)">↑ Price level</text>

        <g clipPath={`url(#${clipId})`}>
          {/* starting curves (faint) */}
          <line x1={ad0.x1} y1={ad0.y1} x2={ad0.x2} y2={ad0.y2} stroke="var(--color-accent)" strokeWidth="2" opacity="0.3" />
          <line x1={sras0.x1} y1={sras0.y1} x2={sras0.x2} y2={sras0.y2} stroke="var(--color-accent-2)" strokeWidth="2" opacity="0.3" />

          {/* shocked curves (bold) */}
          <line x1={adNow.x1} y1={adNow.y1} x2={adNow.x2} y2={adNow.y2} stroke="var(--color-accent)" strokeWidth="3" />
          <line x1={srasNow.x1} y1={srasNow.y1} x2={srasNow.x2} y2={srasNow.y2} stroke="var(--color-accent-2)" strokeWidth="3" />

          {/* equilibria + move arrow */}
          <circle cx={sx(before.y)} cy={sy(before.p)} r="4" fill="var(--color-muted)" />
          <line
            x1={sx(before.y)} y1={sy(before.p)} x2={sx(after.y)} y2={sy(after.p)}
            stroke="var(--color-ink)" strokeWidth="1.5" strokeDasharray="4 3"
          />
          <circle cx={sx(after.y)} cy={sy(after.p)} r="6" fill="var(--color-ink)" />
        </g>

        {/* curve labels */}
        <text x={clamp(adNow.x2 - 12, X0, X0 + PW)} y={clamp(adNow.y2 + 4, 22, Y0)} fontSize="11" fill="var(--color-accent)">AD</text>
        <text x={X0 + PW - 22} y={clamp(sy(aSRAS + YMAX) + 6, 22, Y0)} fontSize="11" fill="var(--color-accent-2)">SRAS</text>
      </svg>

      <div className="grid grid-cols-2 gap-2 px-4 text-center text-sm">
        <div>
          <div className={cn('font-mono', pUp ? 'text-accent-2' : 'text-success')}>
            {Math.round(before.p)} → {Math.round(after.p)}
          </div>
          <div className="text-xs text-muted">price level {pUp ? '↑' : '↓'}</div>
        </div>
        <div>
          <div className={cn('font-mono', yDown ? 'text-accent' : 'text-success')}>
            {Math.round(before.y)} → {Math.round(after.y)}
          </div>
          <div className="text-xs text-muted">real GDP {yDown ? '↓' : '↑'}</div>
        </div>
      </div>

      <p className="px-4 pb-4 pt-3 text-center text-sm text-muted">
        {shock === 'demand'
          ? 'Demand shock: AD shifts left. Output and the price level fall together — a slump, but no inflation.'
          : 'Supply shock: SRAS shifts left. Output falls while the price level rises at the same time — stagflation, the policymaker’s nightmare.'}
      </p>
    </div>
  )
}

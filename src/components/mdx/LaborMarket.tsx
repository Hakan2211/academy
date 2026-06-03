import { useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'
import { clamp } from '#/lib/econ'

// The labour market is just supply and demand wearing different clothes. The
// PRICE on the vertical axis is the wage; the QUANTITY on the horizontal axis is
// the number of workers (hours of labour). Firms' demand for labour slopes down:
// each extra worker adds a little less output, so firms only hire more if the
// wage falls. Workers' supply slopes up: higher wages coax more people to work.
// Where they cross is the equilibrium wage. Crucially, labour demand is DERIVED
// from how productive workers are — raise productivity (the marginal revenue
// product of labour) and the whole demand curve shifts right, lifting the wage.
const X0 = 48
const Y0 = 250
const PW = 292
const PH = 222
const QMAX = 140
const WMAX = 140

export function LaborMarket() {
  // productivity shifts labour demand right (+) when workers produce more value
  const [prod, setProd] = useState(0)

  // demand W = aD - L (downward) ; supply W = aS + L (upward)
  const aD = 100 + prod
  const aS = 10
  const lStar = clamp((aD - aS) / 2, 0, QMAX)
  const wStar = aS + lStar

  const sx = (l: number) => X0 + (l / QMAX) * PW
  const sy = (w: number) => Y0 - (w / WMAX) * PH

  const dem = { x1: sx(0), y1: sy(clamp(aD, 0, WMAX)), x2: sx(QMAX), y2: sy(clamp(aD - QMAX, 0, WMAX)) }
  const sup = { x1: sx(0), y1: sy(aS), x2: sx(QMAX), y2: sy(clamp(aS + QMAX, 0, WMAX)) }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 290" className="w-full">
        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 18} textAnchor="end" fontSize="11" fill="var(--color-muted)">Workers (quantity of labour) →</text>
        <text x={X0 - 6} y={Y0 - PH + 4} textAnchor="end" fontSize="11" fill="var(--color-muted)">↑ Wage</text>

        {/* curves */}
        <line x1={dem.x1} y1={dem.y1} x2={dem.x2} y2={dem.y2} stroke="var(--color-accent)" strokeWidth="3" />
        <line x1={sup.x1} y1={sup.y1} x2={sup.x2} y2={sup.y2} stroke="var(--color-accent-2)" strokeWidth="3" />
        <text x={dem.x2 - 4} y={clamp(dem.y2 - 6, 16, Y0)} textAnchor="end" fontSize="11" fill="var(--color-accent)">labour demand (firms)</text>
        <text x={sup.x2 - 4} y={clamp(sup.y2 - 6, 16, Y0)} textAnchor="end" fontSize="11" fill="var(--color-accent-2)">labour supply (workers)</text>

        {/* equilibrium guides + point */}
        <line x1={sx(lStar)} y1={sy(wStar)} x2={sx(lStar)} y2={Y0} stroke="var(--color-ink)" strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
        <line x1={sx(lStar)} y1={sy(wStar)} x2={X0} y2={sy(wStar)} stroke="var(--color-ink)" strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
        <circle cx={sx(lStar)} cy={sy(wStar)} r="6" fill="var(--color-ink)" />
        <text x={X0 + 6} y={sy(wStar) - 5} fontSize="10" fill="var(--color-muted)">equilibrium wage</text>
      </svg>

      <div className="grid grid-cols-2 gap-2 px-4 text-center text-sm">
        <div><div className="font-mono text-ink">{Math.round(wStar)}</div><div className="text-xs text-muted">equilibrium wage</div></div>
        <div><div className="font-mono text-ink">{Math.round(lStar)}</div><div className="text-xs text-muted">workers hired</div></div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <SceneSlider
          label="Worker productivity (marginal revenue product)"
          value={prod} min={-40} max={40} step={1} unit="" onChange={setProd}
        />
        <div
          className={cn(
            'rounded-xl border px-3 py-2 text-center text-sm',
            prod > 0 ? 'border-success/50 text-success'
              : prod < 0 ? 'border-accent/50 text-accent'
                : 'border-border text-muted',
          )}
        >
          {prod > 0 &&
            'More productive workers are worth more to firms, so labour demand shifts RIGHT — the equilibrium wage and the number hired both rise. Wages ultimately track productivity.'}
          {prod < 0 &&
            'Less productive workers add less value, so labour demand shifts LEFT — the equilibrium wage falls. The wage is the price firms pay for what a worker produces.'}
          {prod === 0 &&
            'The wage is just the price of labour, set where firms’ demand meets workers’ supply. Slide productivity to shift demand.'}
        </div>
      </div>
    </div>
  )
}

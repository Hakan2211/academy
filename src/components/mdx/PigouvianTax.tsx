import { useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'
import { clamp } from '#/lib/econ'

// A Pigouvian tax INTERNALISES a negative externality. Left alone, a polluting
// market produces where Demand meets Private MC (supply), ignoring the harm to
// third parties — so it over-produces. A per-unit tax equal to the external
// cost lifts the private cost curve up by exactly that amount until it lines up
// with the SOCIAL cost curve; the new market quantity then equals the social
// optimum and the welfare loss vanishes. Slide the tax and watch the supply
// curve climb toward the social-cost line; when tax = external cost the gap
// closes. Builds directly on ExternalityGraph.
const X0 = 50
const Y0 = 250
const PW = 290
const PH = 222
const QMAX = 100
const PMAX = 100

// Demand P = 100 - Q.  Private MC (supply) P = Q.  Untaxed eq = (50, 50).
const EXTERNAL = 28 // the true per-unit external cost (target tax)

export function PigouvianTax() {
  const [tax, setTax] = useState(0)

  const sx = (q: number) => X0 + (q / QMAX) * PW
  const sy = (p: number) => Y0 - (p / PMAX) * PH

  // Taxed supply: P = Q + tax. Market: 100 - Q = Q + tax → Q = (100 - tax)/2.
  const qMarket = clamp((100 - tax) / 2, 0, QMAX)
  const pBuy = 100 - qMarket // price buyers pay (on demand)

  // Social optimum: where Demand = SocialMC (P = Q + EXTERNAL) → Q = (100 - EXTERNAL)/2.
  const qSocial = clamp((100 - EXTERNAL) / 2, 0, QMAX)

  // curves spanning the box
  const dem = { x1: sx(0), y1: sy(100), x2: sx(QMAX), y2: sy(0) }
  const supPriv = { x1: sx(0), y1: sy(0), x2: sx(QMAX), y2: sy(100) }
  const supTax = { x1: sx(0), y1: sy(clamp(tax, 0, PMAX)), x2: sx(QMAX), y2: sy(clamp(100 + tax, 0, PMAX)) }
  const socMC = { x1: sx(0), y1: sy(EXTERNAL), x2: sx(QMAX), y2: sy(clamp(100 + EXTERNAL, 0, PMAX)) }

  // residual welfare-loss triangle between current qMarket and qSocial
  const gap = Math.abs(qMarket - qSocial)
  const closed = gap < 0.5
  const dwl = closed
    ? ''
    : `M ${sx(qSocial)} ${sy(100 - qSocial)} L ${sx(qMarket)} ${sy(pBuy)} L ${sx(qSocial)} ${sy(qSocial + EXTERNAL)} Z`

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 290" className="w-full">
        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 18} textAnchor="end" fontSize="11" fill="var(--color-muted)">Quantity →</text>
        <text x={X0 - 6} y={Y0 - PH} textAnchor="end" fontSize="11" fill="var(--color-muted)">↑ Price</text>

        {/* residual welfare loss */}
        {dwl && <path d={dwl} fill="var(--color-muted)" opacity="0.3" />}

        {/* demand */}
        <line x1={dem.x1} y1={dem.y1} x2={dem.x2} y2={dem.y2} stroke="var(--color-accent)" strokeWidth="3" />
        {/* social MC target (dashed) */}
        <line x1={socMC.x1} y1={socMC.y1} x2={socMC.x2} y2={socMC.y2} stroke="var(--color-success)" strokeWidth="2.5" strokeDasharray="6 4" />
        {/* private MC (faint, where supply started) */}
        <line x1={supPriv.x1} y1={supPriv.y1} x2={supPriv.x2} y2={supPriv.y2} stroke="var(--color-accent-2)" strokeWidth="1.5" opacity="0.35" />
        {/* taxed supply (the live curve climbing toward social MC) */}
        <line x1={supTax.x1} y1={supTax.y1} x2={supTax.x2} y2={supTax.y2} stroke="var(--color-accent-2)" strokeWidth="3" />

        {/* labels */}
        <text x={dem.x2 - 4} y={sy(2) - 6} textAnchor="end" fontSize="11" fill="var(--color-accent)">Demand</text>
        <text x={sx(QMAX) - 4} y={clamp(socMC.y2 - 6, 16, Y0)} textAnchor="end" fontSize="11" fill="var(--color-success)">Social MC</text>
        <text x={sx(QMAX) - 4} y={clamp(supTax.y2 + 14, 16, Y0)} textAnchor="end" fontSize="11" fill="var(--color-accent-2)">Supply + tax</text>

        {/* social optimum marker */}
        <line x1={sx(qSocial)} y1={Y0} x2={sx(qSocial)} y2={sy(100 - qSocial)} stroke="var(--color-success)" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
        <circle cx={sx(qSocial)} cy={sy(100 - qSocial)} r="5" fill="var(--color-success)" />
        <text x={sx(qSocial)} y={Y0 + 28} textAnchor="middle" fontSize="9" fill="var(--color-success)">Q optimal</text>

        {/* current market point */}
        <line x1={sx(qMarket)} y1={Y0} x2={sx(qMarket)} y2={sy(pBuy)} stroke="var(--color-ink)" strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
        <circle cx={sx(qMarket)} cy={sy(pBuy)} r="5" fill="var(--color-ink)" />
        <text x={sx(qMarket)} y={Y0 + 16} textAnchor="middle" fontSize="9" fill="var(--color-ink)">Q market</text>
      </svg>

      <div className="grid grid-cols-3 gap-2 px-4 text-center text-sm">
        <div><div className="font-mono text-ink">{tax.toFixed(0)}</div><div className="text-xs text-muted">tax per unit</div></div>
        <div><div className="font-mono text-success">{EXTERNAL}</div><div className="text-xs text-muted">external cost</div></div>
        <div><div className="font-mono text-muted">{Math.round(gap)}</div><div className="text-xs text-muted">units off optimum</div></div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <SceneSlider label="Pigouvian tax per unit" value={tax} min={0} max={48} step={1} unit="" onChange={setTax} />
        <div
          className={cn(
            'rounded-xl border px-3 py-2 text-center text-sm',
            closed ? 'border-success/50 text-success'
              : tax < EXTERNAL ? 'border-accent/50 text-accent'
                : 'border-accent-2/50 text-accent-2',
          )}
        >
          {closed && 'Tax = external cost. The supply curve now lines up with the social-cost curve, so firms face the full cost of what they produce. The market quantity equals the social optimum — the externality is internalised and the welfare loss is gone.'}
          {!closed && tax < EXTERNAL && 'The tax is too small: firms still pay less than the true social cost, so the market over-produces. Push the tax up toward the external cost.'}
          {!closed && tax > EXTERNAL && 'The tax now exceeds the harm it corrects: the market under-produces and a new welfare loss opens up on the other side. Bring the tax back down to the external cost.'}
        </div>
      </div>
    </div>
  )
}

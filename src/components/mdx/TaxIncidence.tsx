import { useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'
import { clamp } from '#/lib/econ'

// Tax incidence. A per-unit tax drives a wedge between the price buyers PAY
// (top of the wedge, on the demand curve) and the price sellers RECEIVE (bottom,
// on the supply curve). Who actually bears the tax depends on RELATIVE
// elasticity, NOT on whom the law charges: the more INELASTIC side — the one
// less able to walk away — swallows more of the burden. The shaded triangle to
// the right of the new (lower) quantity is the deadweight loss: mutually
// beneficial trades the tax destroys. Reused by Market Failure (Pigouvian
// taxes) and the Trade world (tariffs).
const X0 = 50
const Y0 = 248
const PW = 290
const PH = 222
const QMAX = 100
const PMAX = 100

// Demand: P = aD - dSlope·Q.  Supply: P = aS + sSlope·Q.
// We hold the no-tax equilibrium fixed at (Q*, P*) = (50, 50) and rotate the
// curves around it as elasticity changes, so the picture stays centred.
const QSTAR = 50
const PSTAR = 50

export function TaxIncidence() {
  // elasticity balance: -1 = demand very elastic (sellers pay), +1 = supply very
  // elastic (buyers pay). 0 = balanced.
  const [balance, setBalance] = useState(0)
  const [tax, setTax] = useState(24)

  // Map the balance to relative slopes. Flatter (smaller slope) = more elastic.
  // demand slope magnitude dS, supply slope sS. Keep product-ish reasonable.
  const t = balance // -1..1
  const dSlope = 0.4 + 0.9 * (t + 1) // t=-1 → 0.4 (flat/elastic demand), t=1 → 2.2 (steep/inelastic demand)
  const sSlope = 0.4 + 0.9 * (1 - t) // mirror: elastic supply when demand inelastic

  // intercepts pinned so both curves pass through (QSTAR, PSTAR)
  const aD = PSTAR + dSlope * QSTAR // P = aD - dSlope·Q
  const aS = PSTAR - sSlope * QSTAR // P = aS + sSlope·Q

  // With a per-unit tax τ, buyers pay Pb, sellers get Ps = Pb - τ.
  // Demand sets Qd from Pb; supply sets Qs from Ps; trade where Qd = Qs.
  // aD - dSlope·Q = (aS + sSlope·Q) + τ  →  Q_t = (aD - aS - τ)/(dSlope + sSlope)
  const qTax = clamp((aD - aS - tax) / (dSlope + sSlope), 0, QSTAR)
  const pBuy = aD - dSlope * qTax // price buyers pay
  const pSell = pBuy - tax // price sellers receive

  // burden split (when there is no tax, fall back to a 50/50 display)
  const buyerBurden = clamp(pBuy - PSTAR, 0, tax)
  const sellerBurden = clamp(PSTAR - pSell, 0, tax)
  const totalBurden = buyerBurden + sellerBurden
  const buyerPct = totalBurden > 0 ? Math.round((buyerBurden / totalBurden) * 100) : 50
  const sellerPct = 100 - buyerPct

  const sx = (q: number) => X0 + (q / QMAX) * PW
  const sy = (p: number) => Y0 - (p / PMAX) * PH

  // demand & supply line endpoints (clamped to plot)
  const dem = { x1: sx(0), y1: sy(clamp(aD, 0, PMAX)), x2: sx(QMAX), y2: sy(clamp(aD - dSlope * QMAX, 0, PMAX)) }
  const sup = { x1: sx(0), y1: sy(clamp(aS, 0, PMAX)), x2: sx(QMAX), y2: sy(clamp(aS + sSlope * QMAX, 0, PMAX)) }

  // deadweight-loss triangle: between qTax and QSTAR, bounded by D (top) and S (bottom)
  const dwl = `M ${sx(qTax)} ${sy(pBuy)} L ${sx(QSTAR)} ${sy(PSTAR)} L ${sx(qTax)} ${sy(pSell)} Z`

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 290" className="w-full">
        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 18} textAnchor="end" fontSize="11" fill="var(--color-muted)">Quantity →</text>
        <text x={X0 - 6} y={Y0 - PH} textAnchor="end" fontSize="11" fill="var(--color-muted)">↑ Price</text>

        {/* deadweight loss */}
        <path d={dwl} fill="var(--color-muted)" opacity="0.28" />

        {/* curves */}
        <line x1={dem.x1} y1={dem.y1} x2={dem.x2} y2={dem.y2} stroke="var(--color-accent)" strokeWidth="3" />
        <line x1={sup.x1} y1={sup.y1} x2={sup.x2} y2={sup.y2} stroke="var(--color-accent-2)" strokeWidth="3" />
        <text x={dem.x2 - 4} y={clamp(dem.y2 - 6, 16, Y0)} textAnchor="end" fontSize="11" fill="var(--color-accent)">D</text>
        <text x={sup.x2 - 4} y={clamp(sup.y2 - 6, 16, Y0)} textAnchor="end" fontSize="11" fill="var(--color-accent-2)">S</text>

        {/* the tax wedge at the taxed quantity */}
        <line x1={sx(qTax)} y1={sy(pBuy)} x2={sx(qTax)} y2={sy(pSell)} stroke="var(--color-ink)" strokeWidth="2" strokeDasharray="2 2" />

        {/* price-buyers-pay line + dot */}
        <line x1={X0} y1={sy(pBuy)} x2={sx(qTax)} y2={sy(pBuy)} stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="3 2" opacity="0.7" />
        <circle cx={sx(qTax)} cy={sy(pBuy)} r="5" fill="var(--color-accent)" />
        {/* price-sellers-receive line + dot */}
        <line x1={X0} y1={sy(pSell)} x2={sx(qTax)} y2={sy(pSell)} stroke="var(--color-accent-2)" strokeWidth="1" strokeDasharray="3 2" opacity="0.7" />
        <circle cx={sx(qTax)} cy={sy(pSell)} r="5" fill="var(--color-accent-2)" />

        {/* original equilibrium */}
        <circle cx={sx(QSTAR)} cy={sy(PSTAR)} r="4" fill="var(--color-ink)" />

        {/* wedge labels */}
        <text x={sx(qTax) + 8} y={sy(pBuy) + 4} fontSize="9" fill="var(--color-accent)">buyers pay</text>
        <text x={sx(qTax) + 8} y={sy(pSell) + 12} fontSize="9" fill="var(--color-accent-2)">sellers get</text>
      </svg>

      <div className="grid grid-cols-3 gap-2 px-4 text-center text-sm">
        <div><div className="font-mono text-accent">{buyerPct}%</div><div className="text-xs text-muted">buyers bear</div></div>
        <div><div className="font-mono text-accent-2">{sellerPct}%</div><div className="text-xs text-muted">sellers bear</div></div>
        <div><div className="font-mono text-ink">{Math.round(QSTAR - qTax)}</div><div className="text-xs text-muted">trades lost (DWL)</div></div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <SceneSlider label="Tax per unit" value={tax} min={0} max={48} step={1} unit="" onChange={setTax} />
        <SceneSlider
          label="← demand elastic   ·   supply elastic →"
          value={balance} min={-1} max={1} step={0.05} unit="" onChange={setBalance}
        />
        <div
          className={cn(
            'rounded-xl border px-3 py-2 text-center text-sm',
            buyerPct > sellerPct ? 'border-accent/50 text-accent'
              : buyerPct < sellerPct ? 'border-accent-2/50 text-accent-2'
                : 'border-border text-muted',
          )}
        >
          {buyerPct > sellerPct && 'Demand is the more inelastic side, so BUYERS bear most of the tax — they cannot easily walk away.'}
          {buyerPct < sellerPct && 'Supply is the more inelastic side, so SELLERS bear most of the tax — they cannot easily exit the market.'}
          {buyerPct === sellerPct && 'Both sides are equally elastic, so the tax splits evenly. The grey triangle is the deadweight loss — the mutually beneficial trades the tax wipes out.'}
        </div>
      </div>
    </div>
  )
}

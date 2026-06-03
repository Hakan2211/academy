import { useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'
import { clamp } from '#/lib/econ'

// What a tariff does, drawn on a standard supply/demand diagram. Left to itself
// a small country reaches its domestic equilibrium. Open it to trade and a LOWER
// world price floods in: buyers consume a lot, domestic firms produce a little,
// and the gap between them is IMPORTS. Slap on a per-unit tariff and the price
// inside the country rises toward the no-trade level: home production climbs,
// consumption falls, and imports shrink. The tariff revenue (price gap × the
// imports that still cross the border) goes to the government — but two little
// triangles of surplus vanish entirely. That is the DEADWEIGHT LOSS: trades that
// were worth making, now killed by the barrier.

// Domestic demand  P = aD - Q ;  domestic supply  P = aS + Q.
const X0 = 50
const Y0 = 250
const PW = 290
const PH = 222
const QMAX = 130
const PMAX = 130

const AD = 120 // demand intercept
const AS = 20 // supply intercept
const WORLD = 45 // world price (below the domestic equilibrium of 70)

export function TradeBarriers() {
  const [tariff, setTariff] = useState(15)

  const sx = (q: number) => X0 + (q / QMAX) * PW
  const sy = (p: number) => Y0 - (p / PMAX) * PH

  // domestic no-trade equilibrium (for reference)
  const qEq = (AD - AS) / 2 // = 50
  const pEq = AS + qEq // = 70

  // price inside the country = world price + tariff, but never above the
  // closed-economy equilibrium (a tariff that high simply chokes off all imports)
  const pIn = clamp(WORLD + tariff, WORLD, pEq)

  // quantities at the internal price
  const qd = clamp(AD - pIn, 0, QMAX) // consumed
  const qs = clamp(pIn - AS, 0, QMAX) // produced at home
  const imports = Math.max(0, qd - qs)

  // free-trade benchmark (tariff = 0 → price = world price)
  const qdFree = AD - WORLD
  const qsFree = WORLD - AS

  // government tariff revenue = tariff actually paid per unit × imported units
  const revenue = (pIn - WORLD) * imports

  // deadweight loss = the two triangles (production + consumption distortions)
  const dwlProd = 0.5 * (pIn - WORLD) * (qs - qsFree)
  const dwlCons = 0.5 * (pIn - WORLD) * (qdFree - qd)
  const dwl = dwlProd + dwlCons

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 290" className="w-full">
        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 18} textAnchor="end" fontSize="11" fill="var(--color-muted)">Quantity →</text>
        <text x={X0 - 6} y={Y0 - PH} textAnchor="end" fontSize="11" fill="var(--color-muted)">↑ Price</text>

        {/* government tariff-revenue rectangle: between qs and qd, from world price to internal price */}
        <rect
          x={sx(qs)} y={sy(pIn)} width={sx(qd) - sx(qs)} height={sy(WORLD) - sy(pIn)}
          fill="var(--color-success)" opacity="0.22"
        />
        {/* deadweight-loss triangles */}
        <path d={`M ${sx(qsFree)} ${sy(WORLD)} L ${sx(qs)} ${sy(pIn)} L ${sx(qs)} ${sy(WORLD)} Z`} fill="var(--color-muted)" opacity="0.32" />
        <path d={`M ${sx(qd)} ${sy(pIn)} L ${sx(qdFree)} ${sy(WORLD)} L ${sx(qd)} ${sy(WORLD)} Z`} fill="var(--color-muted)" opacity="0.32" />

        {/* curves */}
        <line x1={sx(0)} y1={sy(AD)} x2={sx(QMAX)} y2={sy(clamp(AD - QMAX, 0, PMAX))} stroke="var(--color-accent)" strokeWidth="3" />
        <line x1={sx(0)} y1={sy(AS)} x2={sx(QMAX)} y2={sy(clamp(AS + QMAX, 0, PMAX))} stroke="var(--color-accent-2)" strokeWidth="3" />
        <text x={sx(QMAX) - 4} y={sy(clamp(AD - QMAX, 0, PMAX)) + 14} textAnchor="end" fontSize="11" fill="var(--color-accent)">D</text>
        <text x={sx(QMAX) - 4} y={sy(clamp(AS + QMAX, 0, PMAX)) - 6} textAnchor="end" fontSize="11" fill="var(--color-accent-2)">S</text>

        {/* world-price line */}
        <line x1={X0} y1={sy(WORLD)} x2={X0 + PW} y2={sy(WORLD)} stroke="var(--color-muted)" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x={X0 + PW} y={sy(WORLD) - 4} textAnchor="end" fontSize="9" fill="var(--color-muted)">world price</text>
        {/* internal price line (world + tariff) */}
        <line x1={X0} y1={sy(pIn)} x2={sx(qd)} y2={sy(pIn)} stroke="var(--color-ink)" strokeWidth="1.5" />
        <text x={X0 + 4} y={sy(pIn) - 4} fontSize="9" fill="var(--color-ink)">price + tariff</text>

        {/* domestic-supply & demand dots at the internal price */}
        <circle cx={sx(qs)} cy={sy(pIn)} r="4" fill="var(--color-accent-2)" />
        <circle cx={sx(qd)} cy={sy(pIn)} r="4" fill="var(--color-accent)" />
      </svg>

      <div className="flex flex-wrap items-center justify-center gap-3 px-4 pb-1 text-xs text-muted">
        <span className="inline-flex items-center gap-1"><span className="inline-block h-2 w-3 rounded-sm" style={{ background: 'var(--color-success)' }} /> tariff revenue</span>
        <span className="inline-flex items-center gap-1"><span className="inline-block h-2 w-3 rounded-sm" style={{ background: 'var(--color-muted)' }} /> deadweight loss</span>
      </div>

      <div className="grid grid-cols-3 gap-2 px-4 pt-1 text-center text-sm">
        <div><div className="font-mono text-ink">{Math.round(imports)}</div><div className="text-xs text-muted">imports left</div></div>
        <div><div className="font-mono text-success">{Math.round(revenue)}</div><div className="text-xs text-muted">gov. revenue</div></div>
        <div><div className="font-mono text-muted">{Math.round(dwl)}</div><div className="text-xs text-muted">deadweight loss</div></div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <SceneSlider label="Tariff per unit" value={tariff} min={0} max={pEq - WORLD} step={1} unit="" onChange={setTariff} />
        <div
          className={cn(
            'rounded-xl border px-3 py-2 text-center text-sm',
            tariff <= 0 ? 'border-accent/50 text-accent'
              : pIn >= pEq - 0.5 ? 'border-accent-2/50 text-accent-2'
                : 'border-border text-muted',
          )}
        >
          {tariff <= 0 && `Free trade: ${Math.round(qdFree)} consumed at the low world price, ${Math.round(qsFree)} made at home, the rest imported. Buyers win big.`}
          {tariff > 0 && pIn < pEq - 0.5 && 'The tariff lifts the home price: domestic firms produce more and consumers buy less, so imports shrink. Government pockets the green rectangle — but the two grey triangles are surplus destroyed outright.'}
          {tariff > 0 && pIn >= pEq - 0.5 && 'The tariff is so high the home price has reached the no-trade level: imports stop entirely, government collects nothing, and the country is back to producing everything itself at the highest deadweight cost.'}
        </div>
      </div>
    </div>
  )
}

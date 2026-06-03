import { useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'
import { clamp } from '#/lib/econ'

// An externality drives a wedge between PRIVATE and SOCIAL value. With a
// NEGATIVE externality (pollution) the true marginal cost to society sits ABOVE
// the firm's private supply curve, so the free market — which ignores the
// spill-over — over-produces past the social optimum; the grey triangle is the
// resulting welfare loss. With a POSITIVE externality (vaccination) social
// benefit sits ABOVE private demand, so the market UNDER-produces. Slide the
// size of the spill-over to grow or shrink the gap. Companion to PigouvianTax,
// which closes exactly this gap with a corrective tax or subsidy.
const X0 = 50
const Y0 = 250
const PW = 290
const PH = 222
const QMAX = 100
const PMAX = 100

// No-externality equilibrium pinned at (50, 50); curves have unit slopes.
const QSTAR = 50
const PSTAR = 50

type Kind = 'negative' | 'positive'

export function ExternalityGraph() {
  const [kind, setKind] = useState<Kind>('negative')
  const [spill, setSpill] = useState(28) // size of the per-unit external cost/benefit

  const sx = (q: number) => X0 + (q / QMAX) * PW
  const sy = (p: number) => Y0 - (p / PMAX) * PH

  // Demand  P = 100 - Q.  Supply  P = Q.  Private equilibrium = (50, 50).
  // Negative externality: social cost curve = supply shifted UP by `spill`.
  //   Social optimum where Demand = SupplyPrivate + spill → Q = 50 - spill/2.
  // Positive externality: social benefit curve = demand shifted UP by `spill`.
  //   Social optimum where SocialBenefit = Supply → Q = 50 + spill/2.
  const isNeg = kind === 'negative'
  const qSocial = clamp(isNeg ? QSTAR - spill / 2 : QSTAR + spill / 2, 0, QMAX)

  // The third curve (social cost for negative; social benefit for positive).
  // Negative: social MC line  P = Q + spill.  Positive: social MB line P = (100 - Q) + spill.
  const socStart = isNeg ? spill : 100 + spill // P at Q=0
  const socEnd = isNeg ? QMAX + spill : 100 - QMAX + spill // P at Q=QMAX
  const soc = { x1: sx(0), y1: sy(clamp(socStart, 0, PMAX)), x2: sx(QMAX), y2: sy(clamp(socEnd, 0, PMAX)) }

  // Base demand & supply spanning the box.
  const dem = { x1: sx(0), y1: sy(100), x2: sx(QMAX), y2: sy(0) }
  const sup = { x1: sx(0), y1: sy(0), x2: sx(QMAX), y2: sy(100) }

  // Welfare-loss triangle between qSocial and the market quantity (QSTAR),
  // bounded by demand (top) and the marginal-cost-to-society line (bottom for
  // the negative case; for positive it is between social-benefit and supply).
  const dwl = isNeg
    ? `M ${sx(qSocial)} ${sy(100 - qSocial)} L ${sx(QSTAR)} ${sy(PSTAR)} L ${sx(qSocial)} ${sy(qSocial + spill)} Z`
    : `M ${sx(QSTAR)} ${sy(PSTAR)} L ${sx(qSocial)} ${sy(qSocial)} L ${sx(QSTAR)} ${sy(100 - QSTAR + spill)} Z`

  const over = QSTAR - qSocial // + = market over-produces, - = under-produces

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        {(['negative', 'positive'] as Array<Kind>).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              kind === k
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {k === 'negative' ? 'Negative (pollution)' : 'Positive (vaccination)'}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 360 290" className="w-full">
        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 18} textAnchor="end" fontSize="11" fill="var(--color-muted)">Quantity →</text>
        <text x={X0 - 6} y={Y0 - PH} textAnchor="end" fontSize="11" fill="var(--color-muted)">↑ Price</text>

        {/* welfare-loss triangle */}
        <path d={dwl} fill="var(--color-muted)" opacity="0.3" />

        {/* base demand & supply */}
        <line x1={dem.x1} y1={dem.y1} x2={dem.x2} y2={dem.y2} stroke="var(--color-accent)" strokeWidth="3" />
        <line x1={sup.x1} y1={sup.y1} x2={sup.x2} y2={sup.y2} stroke="var(--color-accent-2)" strokeWidth="3" />

        {/* the social curve (dashed, the same hue as the curve it sits over) */}
        <line
          x1={soc.x1} y1={soc.y1} x2={soc.x2} y2={soc.y2}
          stroke={isNeg ? 'var(--color-accent-2)' : 'var(--color-accent)'}
          strokeWidth="3" strokeDasharray="6 4"
        />

        {/* labels */}
        <text x={dem.x2 - 4} y={sy(2) - 6} textAnchor="end" fontSize="11" fill="var(--color-accent)">
          {isNeg ? 'Demand' : 'Private MB'}
        </text>
        <text x={sup.x2 - 4} y={clamp(sy(100) - 6, 16, Y0)} textAnchor="end" fontSize="11" fill="var(--color-accent-2)">
          {isNeg ? 'Private MC (supply)' : 'Supply'}
        </text>
        <text
          x={sx(QMAX) - 4} y={clamp(soc.y2 - 6, 16, Y0)} textAnchor="end" fontSize="11"
          fill={isNeg ? 'var(--color-accent-2)' : 'var(--color-accent)'}
        >
          {isNeg ? 'Social MC' : 'Social MB'}
        </text>

        {/* market quantity (private equilibrium) */}
        <line x1={sx(QSTAR)} y1={Y0} x2={sx(QSTAR)} y2={sy(PSTAR)} stroke="var(--color-ink)" strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
        <circle cx={sx(QSTAR)} cy={sy(PSTAR)} r="5" fill="var(--color-ink)" />
        <text x={sx(QSTAR)} y={Y0 + 16} textAnchor="middle" fontSize="9" fill="var(--color-ink)">Q market</text>

        {/* social optimum */}
        <line x1={sx(qSocial)} y1={Y0} x2={sx(qSocial)} y2={sy(isNeg ? 100 - qSocial : qSocial)} stroke="var(--color-success)" strokeWidth="1" strokeDasharray="3 2" opacity="0.7" />
        <circle cx={sx(qSocial)} cy={sy(isNeg ? 100 - qSocial : qSocial)} r="5" fill="var(--color-success)" />
        <text x={sx(qSocial)} y={Y0 + 28} textAnchor="middle" fontSize="9" fill="var(--color-success)">Q optimal</text>
      </svg>

      <div className="grid grid-cols-3 gap-2 px-4 text-center text-sm">
        <div><div className="font-mono text-ink">{Math.round(QSTAR)}</div><div className="text-xs text-muted">market quantity</div></div>
        <div><div className="font-mono text-success">{Math.round(qSocial)}</div><div className="text-xs text-muted">socially optimal</div></div>
        <div><div className="font-mono text-muted">{Math.abs(Math.round(over))}</div><div className="text-xs text-muted">units {over >= 0 ? 'over' : 'under'}-produced</div></div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <SceneSlider label="Size of the spill-over" value={spill} min={0} max={48} step={1} unit="" onChange={setSpill} />
        <div
          className={cn(
            'rounded-xl border px-3 py-2 text-center text-sm',
            spill === 0 ? 'border-success/50 text-success'
              : isNeg ? 'border-accent-2/50 text-accent-2'
                : 'border-accent/50 text-accent',
          )}
        >
          {spill === 0 && 'No spill-over: private and social value coincide, so the free market lands exactly on the optimum.'}
          {spill > 0 && isNeg && 'A negative externality: every unit harms third parties (pollution), so the TRUE cost line sits above supply. The market ignores it and OVER-produces past the optimum. The grey triangle is the welfare loss.'}
          {spill > 0 && !isNeg && 'A positive externality: every unit also benefits third parties (vaccination, education), so the TRUE benefit line sits above demand. The market UNDER-produces. The grey triangle is the foregone welfare.'}
        </div>
      </div>
    </div>
  )
}

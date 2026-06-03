import { useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'
import { clamp } from '#/lib/econ'

// A currency has a price too — its exchange rate — and that price is set the same
// way as any other: by supply and demand in the foreign-exchange market. People
// DEMAND a country's currency to buy its exports, visit as tourists, or invest
// when its interest rates are high; the SUPPLY comes from locals selling their
// currency to buy foreign goods. Anything that lifts demand (or cuts supply)
// pushes the rate up — an APPRECIATION; the opposite is a DEPRECIATION. The twist
// learners always miss: a STRONGER currency makes your exports pricier abroad and
// imports cheaper at home, while a weaker one does the reverse.

// Vertical axis = the price of one unit of the home currency, in foreign money
// (e.g. dollars per peso). Demand slopes down, supply slopes up.
const X0 = 50
const Y0 = 250
const PW = 290
const PH = 222
const QMAX = 130
const RMAX = 130

// base demand  R = aD - Q ;  base supply  R = aS + Q
const AD0 = 110
const AS = 20

const SHIFTERS: Array<{ key: string; label: string; shift: number; note: string }> = [
  { key: 'none', label: 'Baseline', shift: 0, note: 'No pressure on the currency — the rate sits at its market level.' },
  { key: 'exports', label: 'Export boom', shift: 28, note: 'Foreigners need more of our currency to pay for our hot exports → demand rises → the currency APPRECIATES.' },
  { key: 'rates', label: 'Higher interest rates', shift: 22, note: 'Investors chase our higher returns, buying our currency to deposit here → demand rises → APPRECIATION.' },
  { key: 'tourism', label: 'Tourism slump', shift: -24, note: 'Fewer visitors means less demand for our currency → demand falls → the currency DEPRECIATES.' },
]

export function ExchangeRate() {
  const [idx, setIdx] = useState(0)
  const sh = SHIFTERS[idx]

  const sx = (q: number) => X0 + (q / QMAX) * PW
  const sy = (r: number) => Y0 - (r / RMAX) * PH

  const aD = AD0 + sh.shift
  // equilibrium: aD - Q = aS + Q
  const qStar = clamp((aD - AS) / 2, 0, QMAX)
  const rStar = AS + qStar

  // baseline rate (shift = 0) for comparison
  const rBase = AS + (AD0 - AS) / 2
  const dir = rStar > rBase + 0.5 ? 'up' : rStar < rBase - 0.5 ? 'down' : 'flat'

  // export & import price effect, indexed to 100 at the baseline rate
  const exportPrice = Math.round((rStar / rBase) * 100) // exports cost foreigners more when strong
  const importPrice = Math.round((rBase / rStar) * 100) // imports cost us less when strong

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        {SHIFTERS.map((s, i) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setIdx(i)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              idx === i ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 360 290" className="w-full">
        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 18} textAnchor="end" fontSize="11" fill="var(--color-muted)">Quantity of currency →</text>
        <text x={X0 - 6} y={Y0 - PH} textAnchor="end" fontSize="11" fill="var(--color-muted)">↑ Exchange rate</text>

        {/* baseline rate guide */}
        <line x1={X0} y1={sy(rBase)} x2={X0 + PW} y2={sy(rBase)} stroke="var(--color-muted)" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

        {/* supply (fixed) */}
        <line x1={sx(0)} y1={sy(AS)} x2={sx(QMAX)} y2={sy(clamp(AS + QMAX, 0, RMAX))} stroke="var(--color-accent-2)" strokeWidth="3" />
        {/* base demand (faint) */}
        <line x1={sx(0)} y1={sy(clamp(AD0, 0, RMAX))} x2={sx(AD0)} y2={sy(0)} stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />
        {/* shifted demand */}
        <line x1={sx(0)} y1={sy(clamp(aD, 0, RMAX))} x2={sx(clamp(aD, 0, QMAX))} y2={sy(clamp(aD - clamp(aD, 0, QMAX), 0, RMAX))} stroke="var(--color-accent)" strokeWidth="3" />
        <text x={sx(QMAX) - 4} y={sy(clamp(AS + QMAX, 0, RMAX)) - 6} textAnchor="end" fontSize="11" fill="var(--color-accent-2)">S</text>
        <text x={sx(clamp(aD, 0, QMAX)) - 2} y={sy(0) - 4} textAnchor="end" fontSize="11" fill="var(--color-accent)">D</text>

        {/* equilibrium */}
        <line x1={sx(qStar)} y1={sy(rStar)} x2={X0} y2={sy(rStar)} stroke="var(--color-ink)" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
        <circle cx={sx(qStar)} cy={sy(rStar)} r="6" fill="var(--color-ink)" />
        {dir !== 'flat' && (
          <text x={sx(qStar) + 10} y={sy(rStar) + 4} fontSize="10" fill={dir === 'up' ? 'var(--color-success)' : 'var(--color-accent)'}>
            {dir === 'up' ? '↑ appreciates' : '↓ depreciates'}
          </text>
        )}
      </svg>

      <div className="grid grid-cols-3 gap-2 px-4 text-center text-sm">
        <div>
          <div className={cn('font-mono', dir === 'up' ? 'text-success' : dir === 'down' ? 'text-accent' : 'text-ink')}>{Math.round(rStar)}</div>
          <div className="text-xs text-muted">exchange rate</div>
        </div>
        <div><div className="font-mono text-ink">{exportPrice}</div><div className="text-xs text-muted">our exports cost (index)</div></div>
        <div><div className="font-mono text-ink">{importPrice}</div><div className="text-xs text-muted">imports cost us (index)</div></div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <SceneSlider label="Shift currency demand by hand" value={idx} min={0} max={SHIFTERS.length - 1} step={1} unit="" onChange={(v) => setIdx(Math.round(v))} />
        <p className="text-sm leading-relaxed text-muted">{sh.note}</p>
        <div
          className={cn(
            'rounded-xl border px-3 py-2 text-center text-sm',
            dir === 'up' ? 'border-success/50 text-success'
              : dir === 'down' ? 'border-accent/50 text-accent'
                : 'border-border text-muted',
          )}
        >
          {dir === 'up' && 'A STRONGER currency: great for tourists and importers (foreign stuff is cheaper) but it prices our exporters out of foreign markets.'}
          {dir === 'down' && 'A WEAKER currency: our exports look like a bargain abroad and tourism booms, but imported goods and overseas trips cost us more.'}
          {dir === 'flat' && 'At the baseline rate, exports and imports trade at their reference prices.'}
        </div>
      </div>
    </div>
  )
}

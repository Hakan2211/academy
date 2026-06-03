import { useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'
import { formatUSD } from '#/lib/econ'

// The equimarginal rule (consumer equilibrium). To get the most satisfaction
// from a fixed budget, spend so the LAST dollar on each good buys the same extra
// utility — i.e. equalise marginal utility per dollar (MU/$) across goods. If
// one good gives more bang per buck, shift spending toward it; doing so lowers
// its MU (diminishing utility) and raises the other's, until they meet. Here you
// split a budget between two goods of different prices and see MU/$ for each, and
// whether you've hit the optimum.
const BUDGET = 60

const PRICE_A = 4 // a snack
const PRICE_B = 6 // a song download

// Diminishing marginal utility for each good as a function of units consumed.
const muA = (units: number) => Math.max(0, 40 - 3 * units)
const muB = (units: number) => Math.max(0, 54 - 4 * units)

const VW = 360
const H = 150

export function EquimarginalRule() {
  // share of the budget put on good A (the rest goes to good B)
  const [shareA, setShareA] = useState(50)

  const spendA = (shareA / 100) * BUDGET
  const spendB = BUDGET - spendA
  const unitsA = spendA / PRICE_A
  const unitsB = spendB / PRICE_B

  // marginal utility of the LAST unit bought, per dollar
  const muPerA = unitsA > 0 ? muA(Math.ceil(unitsA)) / PRICE_A : muA(1) / PRICE_A
  const muPerB = unitsB > 0 ? muB(Math.ceil(unitsB)) / PRICE_B : muB(1) / PRICE_B

  // total utility for this split
  let totalU = 0
  for (let k = 1; k <= Math.floor(unitsA); k++) totalU += muA(k)
  for (let k = 1; k <= Math.floor(unitsB); k++) totalU += muB(k)

  const diff = muPerA - muPerB
  const balanced = Math.abs(diff) < 0.25

  const maxBar = 11 // px scale per (MU/$) unit
  const barH = (v: number) => Math.min(110, v * maxBar)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox={`0 0 ${VW} ${H}`} className="w-full">
        {[
          { x: 96, v: muPerA, label: 'Snacks', color: 'var(--color-accent)' },
          { x: 240, v: muPerB, label: 'Songs', color: 'var(--color-accent-2)' },
        ].map((b) => (
          <g key={b.label}>
            <rect
              x={b.x - 34} y={120 - barH(b.v)} width="68" height={barH(b.v)}
              rx="4" fill={b.color}
            />
            <text x={b.x} y={138} textAnchor="middle" fontSize="11" fill="var(--color-muted)">{b.label}</text>
            <text x={b.x} y={115 - barH(b.v)} textAnchor="middle" fontSize="11" fill={b.color} fontWeight={600}>
              {b.v.toFixed(1)}
            </text>
          </g>
        ))}
        {/* equal-line when balanced */}
        {balanced && (
          <line x1="50" y1={120 - barH(muPerA)} x2="290" y2={120 - barH(muPerB)} stroke="var(--color-success)" strokeWidth="1.5" strokeDasharray="4 3" />
        )}
        <text x={VW - 8} y={16} textAnchor="end" fontSize="10" fill="var(--color-muted)">MU per $</text>
      </svg>

      <div className="grid grid-cols-3 gap-2 px-4 text-center text-sm">
        <div><div className="font-mono text-accent">{formatUSD(spendA)}</div><div className="text-xs text-muted">on snacks ({Math.floor(unitsA)})</div></div>
        <div><div className="font-mono text-accent-2">{formatUSD(spendB)}</div><div className="text-xs text-muted">on songs ({Math.floor(unitsB)})</div></div>
        <div><div className="font-mono text-ink">{Math.round(totalU)}</div><div className="text-xs text-muted">total utils</div></div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <SceneSlider label={`Split the ${formatUSD(BUDGET)} budget`} value={shareA} min={0} max={100} step={5} unit="% on snacks" onChange={setShareA} />
        <div
          className={cn(
            'rounded-xl border px-3 py-2 text-sm',
            balanced ? 'border-success/50 text-success' : 'border-accent/50 text-muted',
          )}
        >
          {balanced ? (
            <>Optimum reached. The last dollar on snacks and on songs buys the <span className="text-ink">same</span> extra utility (MU/$ equal) — no reshuffle can do better. This is the <span className="text-success">equimarginal rule</span>.</>
          ) : diff > 0 ? (
            <>Snacks give more utility per dollar right now. <span className="text-ink">Shift spending toward snacks</span> — as you buy more, their MU falls and songs&apos; rises, until the two bars meet.</>
          ) : (
            <>Songs give more utility per dollar right now. <span className="text-ink">Shift spending toward songs</span> until the MU-per-dollar bars even out.</>
          )}
        </div>
      </div>
    </div>
  )
}

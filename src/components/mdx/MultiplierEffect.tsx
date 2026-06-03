import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { formatUSD } from '#/lib/econ'

// The spending multiplier. An initial injection of new spending (say government
// builds a road) becomes income for the people paid. They spend a fraction of it
// — their MARGINAL PROPENSITY TO CONSUME (MPC) — which becomes income for the next
// group, who spend a fraction of THAT, and so on. Each round is smaller than the
// last, but the rounds sum to a total far larger than the original injection:
// injection × 1/(1 − MPC). Slide the MPC to watch the rounds and the total grow.
const INJECTION = 1000
const ROUNDS = 12
const BAR_X = 150
const BAR_MAX_W = 188 // pixel width of the first (largest) bar
const ROW_H = 18
const TOP = 14

export function MultiplierEffect() {
  const [mpc, setMpc] = useState(0.6)

  // round k spending = injection × mpc^k ; first bar (k=0) is the injection
  const rounds: Array<number> = []
  let cumulative = 0
  for (let k = 0; k < ROUNDS; k++) {
    const v = INJECTION * mpc ** k
    rounds.push(v)
    cumulative += v
  }
  const multiplier = 1 / (1 - mpc)
  const total = INJECTION * multiplier
  const shown = cumulative // sum of the rounds we actually draw

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox={`0 0 360 ${TOP + ROUNDS * ROW_H + 16}`} className="w-full">
        {rounds.map((v, k) => {
          const w = Math.max(1, (v / INJECTION) * BAR_MAX_W)
          const y = TOP + k * ROW_H
          return (
            <g key={k}>
              <text x={BAR_X - 8} y={y + ROW_H / 2 + 3} textAnchor="end" fontSize="9" fill="var(--color-muted)">
                {k === 0 ? 'injection' : `round ${k}`}
              </text>
              <rect
                x={BAR_X}
                y={y + 2}
                width={w}
                height={ROW_H - 5}
                rx="2"
                fill={k === 0 ? 'var(--color-accent-2)' : 'var(--color-accent)'}
                opacity={k === 0 ? 1 : 0.85}
              />
              <text x={BAR_X + w + 5} y={y + ROW_H / 2 + 3} fontSize="8.5" fill="var(--color-muted)">
                {formatUSD(v)}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="grid grid-cols-3 gap-2 px-4 text-center text-sm">
        <div><div className="font-mono text-accent-2">{formatUSD(INJECTION)}</div><div className="text-xs text-muted">injection</div></div>
        <div><div className="font-mono text-ink">{multiplier.toFixed(2)}×</div><div className="text-xs text-muted">multiplier</div></div>
        <div><div className="font-mono text-accent">{formatUSD(total)}</div><div className="text-xs text-muted">total spending</div></div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <SceneSlider label="Marginal propensity to consume (MPC)" value={mpc} min={0.1} max={0.9} step={0.05} unit="" onChange={setMpc} />
        <p className="text-sm text-muted">
          The first {ROUNDS} rounds already add up to <span className="text-ink">{formatUSD(shown)}</span>, closing in on the{' '}
          full <span className="text-ink">{formatUSD(total)}</span>. A higher MPC means each group passes more along, so the
          rounds fade slowly and the multiplier — <span className="text-ink">1 / (1 &minus; MPC)</span> — grows.
        </p>
      </div>
    </div>
  )
}

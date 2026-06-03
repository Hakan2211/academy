import { useState } from 'react'
import { cn } from '#/lib/cn'

// A public-goods contribution game — the free-rider problem made playable. Four
// people share a common pot. Each may put in their $10 token or keep it. Every
// token contributed is MULTIPLIED (by the social value of the public good) and
// the proceeds are split EQUALLY among all four — including those who gave
// nothing. So if everyone contributes, everyone is richer; but for any single
// player, keeping your token always beats giving it, because you still collect
// your share of everyone else's gift. That gap between the privately rational
// choice (free-ride) and the socially best outcome (all contribute) is exactly
// why public goods are under-supplied by markets. You choose; the other three
// are quietly rational and free-ride.
const TOKEN = 10
const MULT = 2 // each contributed token is worth this much to the group
const N = 4

export function PublicGoodGame() {
  const [youContribute, setYouContribute] = useState<boolean | null>(null)

  // The three computer players are rational free-riders → they keep their tokens.
  const others = [false, false, false] // contribute?
  const youDid = youContribute === true
  const contributions = (youDid ? 1 : 0) + others.filter(Boolean).length
  const pot = contributions * TOKEN * MULT
  const sharePerPlayer = pot / N

  // your payoff = kept money + your share of the pot
  const yourPayoff = (youDid ? 0 : TOKEN) + sharePerPlayer
  // counterfactual: same others' choices, but YOU switch your decision.
  const altContrib = (youDid ? 0 : 1) + others.filter(Boolean).length
  const altPot = altContrib * TOKEN * MULT
  const switchedPayoff = (youDid ? TOKEN : 0) + altPot / N
  // best case: what if everyone (incl. you) had contributed?
  const allContributePayoff = (N * TOKEN * MULT) / N // = TOKEN * MULT = 20 each

  const players = [
    { name: 'You', contribute: youDid, you: true },
    { name: 'Bao', contribute: others[0], you: false },
    { name: 'Cleo', contribute: others[1], you: false },
    { name: 'Dev', contribute: others[2], you: false },
  ]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 196" className="w-full">
        {/* the shared pot */}
        <ellipse cx={180} cy={150} rx="60" ry="20" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="2" />
        <text x={180} y={146} textAnchor="middle" fontSize="11" fill="var(--color-muted)">Public pot</text>
        <text x={180} y={161} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--color-ink)">
          {youContribute === null ? '—' : `$${pot}`}
        </text>

        {/* the four players around the top */}
        {players.map((p, i) => {
          const x = 54 + i * 84
          const y = 40
          const gave = p.contribute
          const color = p.you ? 'var(--color-accent)' : 'var(--color-accent-2)'
          return (
            <g key={p.name}>
              <circle cx={x} cy={y} r="18" fill={p.you ? 'var(--color-accent)' : 'var(--color-surface-2)'} opacity={p.you ? 0.18 : 1} stroke={color} strokeWidth="2" />
              <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--color-ink)">{p.name}</text>
              <text x={x} y={y + 34} textAnchor="middle" fontSize="9" fill={gave ? 'var(--color-success)' : 'var(--color-muted)'}>
                {youContribute === null && p.you ? 'choose' : gave ? 'gave $10' : 'kept $10'}
              </text>
              {/* arrow from player toward the pot when contributing */}
              {gave && (
                <line x1={x} y1={y + 40} x2={180} y2={132} stroke="var(--color-success)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              )}
            </g>
          )
        })}
      </svg>

      {youContribute !== null && (
        <div className="grid grid-cols-3 gap-2 px-4 text-center text-sm">
          <div><div className="font-mono text-ink">${Math.round(yourPayoff)}</div><div className="text-xs text-muted">you end with</div></div>
          <div><div className="font-mono text-muted">${Math.round(switchedPayoff)}</div><div className="text-xs text-muted">if you'd switched</div></div>
          <div><div className="font-mono text-success">${allContributePayoff}</div><div className="text-xs text-muted">if all 4 gave</div></div>
        </div>
      )}

      <div className="flex flex-col gap-3 p-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setYouContribute(true)}
            className={cn(
              'flex-1 rounded-full border px-4 py-1.5 text-sm transition-colors',
              youContribute === true
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            Contribute $10
          </button>
          <button
            type="button"
            onClick={() => setYouContribute(false)}
            className={cn(
              'flex-1 rounded-full border px-4 py-1.5 text-sm transition-colors',
              youContribute === false
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            Keep your $10
          </button>
        </div>
        <div
          className={cn(
            'rounded-xl border px-3 py-2 text-center text-sm',
            youContribute === null ? 'border-border text-muted'
              : youDid ? 'border-accent-2/50 text-accent-2'
                : 'border-accent/50 text-accent',
          )}
        >
          {youContribute === null && `Each token you give is doubled and split among all four — so it benefits everyone, even free-riders. The other three are rational and keep their money. What will you do?`}
          {youContribute === false && `Free-riding pays for YOU: you kept $${TOKEN} and still collect your share of the pot, so keeping always beats giving. But because everyone reasons this way, the pot stays tiny — far below the $${allContributePayoff} each you'd all get if everyone contributed. The public good is under-supplied.`}
          {youContribute === true && `Generous, but notice: had you kept your token you'd have ended with MORE, because you'd still collect your share of the pot. That private temptation is why public goods need taxes, mandates, or social norms to fund them — markets alone leave them under-provided.`}
        </div>
      </div>
    </div>
  )
}

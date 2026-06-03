import { useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'
import { formatUSD } from '#/lib/econ'

// A miniature auction, the showpiece of MECHANISM DESIGN — the art of designing
// rules so that self-interested players reveal the truth. A painting is worth
// $80 to YOU. Three rival bidders value it at fixed amounts and bid. Choose the
// rule:
//   FIRST-PRICE (sealed bid): highest bid wins and PAYS its own bid. Here you
//     must shade your bid below your value to leave room for profit — guessing
//     wrong means overpaying or losing.
//   SECOND-PRICE (Vickrey): highest bid wins but PAYS the second-highest bid.
//     The famous result: bidding your TRUE value is a dominant strategy — you
//     can never do better by lying. The rule does the strategic work for you.
// Slide your bid and toggle the rule to feel why honest bidding is safe under
// second-price but dangerous under first-price.

const MY_VALUE = 80
// Deterministic rival bids (their actual willingness to pay). No randomness.
const RIVALS = [
  { name: 'Rival 1', bid: 62 },
  { name: 'Rival 2', bid: 71 },
  { name: 'Rival 3', bid: 55 },
]

type Rule = 'first' | 'second'

export function AuctionLab() {
  const [myBid, setMyBid] = useState(80)
  const [rule, setRule] = useState<Rule>('second')

  const entrants = [{ name: 'You', bid: myBid, isYou: true }, ...RIVALS.map((r) => ({ ...r, isYou: false }))]
  const sorted = [...entrants].sort((a, b) => b.bid - a.bid)
  const winner = sorted[0]
  const secondBid = sorted[1].bid
  const youWin = winner.isYou

  // price the winner pays
  const price = youWin ? (rule === 'first' ? myBid : secondBid) : 0
  const surplus = youWin ? MY_VALUE - price : 0 // your profit if you win

  const maxBid = 120
  const bx = (v: number) => (v / maxBid) * 320

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {([
          { key: 'second' as Rule, label: 'Second-price (Vickrey)' },
          { key: 'first' as Rule, label: 'First-price sealed bid' },
        ]).map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => setRule(r.key)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              rule === r.key ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {r.label}
          </button>
        ))}
      </div>

      <p className="mb-3 text-center text-sm text-muted">
        The painting is worth <span className="text-ink font-mono">{formatUSD(MY_VALUE)}</span> to you. Set your bid:
      </p>

      {/* bid bars */}
      <svg viewBox="0 0 360 150" className="w-full">
        {/* your-value reference line */}
        <line x1={20 + bx(MY_VALUE)} y1={6} x2={20 + bx(MY_VALUE)} y2={132} stroke="var(--color-success)" strokeWidth="1" strokeDasharray="4 3" />
        <text x={20 + bx(MY_VALUE)} y={146} textAnchor="middle" fontSize="9" fill="var(--color-success)">your value</text>

        {sorted.map((e, i) => {
          const y = 8 + i * 30
          const isWinner = i === 0
          return (
            <g key={e.name}>
              <text x={16} y={y + 14} textAnchor="end" fontSize="10" fill={e.isYou ? 'var(--color-accent)' : 'var(--color-muted)'}>{e.name}</text>
              <rect
                x={20}
                y={y + 4}
                width={Math.max(1, bx(e.bid))}
                height={16}
                rx="3"
                fill={e.isYou ? 'var(--color-accent)' : 'var(--color-accent-2)'}
                opacity={isWinner ? 1 : 0.5}
              />
              <text x={20 + bx(e.bid) + 6} y={y + 16} fontSize="9.5" fill="var(--color-ink)" className="font-mono">{formatUSD(e.bid)}</text>
            </g>
          )
        })}
      </svg>

      <div className="grid grid-cols-3 gap-2 px-1 text-center text-sm">
        <div>
          <div className={cn('font-mono', youWin ? 'text-success' : 'text-muted')}>{youWin ? 'You' : winner.name}</div>
          <div className="text-xs text-muted">winner</div>
        </div>
        <div>
          <div className="font-mono text-ink">{youWin ? formatUSD(price) : '—'}</div>
          <div className="text-xs text-muted">price paid</div>
        </div>
        <div>
          <div className={cn('font-mono', surplus > 0 ? 'text-success' : surplus < 0 ? 'text-accent' : 'text-muted')}>
            {youWin ? formatUSD(surplus) : '—'}
          </div>
          <div className="text-xs text-muted">your profit</div>
        </div>
      </div>

      <div className="mt-3">
        <SceneSlider label="Your bid" value={myBid} min={0} max={maxBid} step={1} unit="$" onChange={setMyBid} />
      </div>

      <div className="mt-3 rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-muted">
        {rule === 'second' && (
          <>
            {youWin && price <= MY_VALUE && (
              <>You win and pay the <span className="text-ink">second-highest bid</span> ({formatUSD(secondBid)}), pocketing {formatUSD(surplus)} of value. Notice: raising your bid never raises your price, and bidding below {formatUSD(MY_VALUE)} only risks losing a deal you wanted. <span className="text-success">Bidding your true value is the dominant strategy.</span></>
            )}
            {!youWin && (
              <>You bid below the top rival, so you lose. Under second-price you could safely bid your full <span className="text-ink">{formatUSD(MY_VALUE)}</span> value — you'd win and still pay only {formatUSD(secondBid)}. Honesty costs you nothing here.</>
            )}
            {youWin && price > MY_VALUE && (
              <>You won but the price exceeds your value — a loss. Under second-price this can't happen if you simply bid your true {formatUSD(MY_VALUE)}.</>
            )}
          </>
        )}
        {rule === 'first' && (
          <>
            {youWin && (
              <>You win but pay your <span className="text-ink">own bid</span> ({formatUSD(myBid)}), so profit is whatever value you left on the table. Bid too close to {formatUSD(MY_VALUE)} and profit vanishes; here the trick is to <span className="text-accent">shade</span> your bid just above the top rival.</>
            )}
            {!youWin && (
              <>You lose — you shaded too far below the winning bid. First-price forces a gamble: bid low to keep profit, but risk losing; bid high to win, but surrender your surplus.</>
            )}
          </>
        )}
      </div>
    </div>
  )
}

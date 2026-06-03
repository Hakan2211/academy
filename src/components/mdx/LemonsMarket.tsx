import { useState } from 'react'
import { cn } from '#/lib/cn'

// Akerlof's market for lemons — adverse selection in action. A used-car lot
// holds a mix of good cars ('peaches', worth more) and bad ones ('lemons').
// Buyers CANNOT tell them apart, so they will only pay the AVERAGE value of
// what they think is on the lot. But that average price is below what a peach is
// actually worth, so peach owners refuse to sell and pull their cars off the
// market. Now the lot is more lemon-heavy, the average drops further, and even
// more good cars exit — quality spirals down until mostly lemons remain. Step
// through the rounds and watch the asymmetry of information unravel the market.
// Each peach is worth PEACH; each lemon LEMON. A round: price = average value of
// cars still listed; any peach whose value exceeds that price withdraws.
const PEACH = 100
const LEMON = 40
const N0 = 12 // cars initially listed (half peaches, half lemons)

type Car = { id: number; peach: boolean; listed: boolean }

function initialCars(): Array<Car> {
  const cars: Array<Car> = []
  for (let i = 0; i < N0; i++) cars.push({ id: i, peach: i % 2 === 0, listed: true })
  return cars
}

export function LemonsMarket() {
  const [round, setRound] = useState(0)
  const [cars, setCars] = useState<Array<Car>>(initialCars)

  const listed = cars.filter((c) => c.listed)
  const peaches = listed.filter((c) => c.peach).length
  const lemons = listed.length - peaches
  // price buyers will pay = average value of currently listed cars
  const price = listed.length > 0
    ? (peaches * PEACH + lemons * LEMON) / listed.length
    : 0
  // a peach owner withdraws when the going price is below the car's true value
  const peachWillExit = price < PEACH && peaches > 0
  const collapsed = peaches === 0 && round > 0

  const advance = () => {
    setCars((prev) => {
      const ls = prev.filter((c) => c.listed)
      const ps = ls.filter((c) => c.peach).length
      const lm = ls.length - ps
      const p = ls.length > 0 ? (ps * PEACH + lm * LEMON) / ls.length : 0
      if (!(p < PEACH && ps > 0)) return prev // stable
      // every still-listed peach withdraws this round
      return prev.map((c) => (c.listed && c.peach ? { ...c, listed: false } : c))
    })
    setRound((r) => r + 1)
  }

  const replay = () => {
    setCars(initialCars())
    setRound(0)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 200" className="w-full">
        <text x={20} y={22} fontSize="11" fill="var(--color-muted)">The used-car lot</text>
        {cars.map((c, i) => {
          const col = i % 6
          const row = Math.floor(i / 6)
          const cx = 36 + col * 56
          const cy = 48 + row * 46
          const color = c.peach ? 'var(--color-success)' : 'var(--color-accent)'
          return (
            <g key={c.id} opacity={c.listed ? 1 : 0.22}>
              {/* simple car glyph */}
              <rect x={cx - 18} y={cy - 7} width="36" height="14" rx="4" fill={color} opacity={c.listed ? 0.85 : 0.4} />
              <rect x={cx - 10} y={cy - 13} width="20" height="9" rx="3" fill={color} opacity={c.listed ? 0.85 : 0.4} />
              <circle cx={cx - 9} cy={cy + 8} r="3.5" fill="var(--color-ink)" />
              <circle cx={cx + 9} cy={cy + 8} r="3.5" fill="var(--color-ink)" />
              {!c.listed && (
                <line x1={cx - 20} y1={cy - 14} x2={cx + 20} y2={cy + 12} stroke="var(--color-muted)" strokeWidth="2" />
              )}
            </g>
          )
        })}
      </svg>

      <div className="flex items-center justify-center gap-4 px-4 pb-1">
        <span className="inline-flex items-center gap-1 text-xs text-muted">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: 'var(--color-success)' }} /> peach (worth ${PEACH})
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-muted">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: 'var(--color-accent)' }} /> lemon (worth ${LEMON})
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 px-4 pt-2 text-center text-sm">
        <div><div className="font-mono text-ink">{round}</div><div className="text-xs text-muted">round</div></div>
        <div><div className="font-mono text-success">{peaches}</div><div className="text-xs text-muted">peaches left</div></div>
        <div><div className="font-mono text-accent">{lemons}</div><div className="text-xs text-muted">lemons left</div></div>
        <div><div className="font-mono text-ink">${Math.round(price)}</div><div className="text-xs text-muted">market price</div></div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={advance}
            disabled={!peachWillExit}
            className={cn(
              'flex-1 rounded-full border px-4 py-1.5 text-sm transition-colors',
              peachWillExit
                ? 'border-accent bg-accent/15 text-accent hover:bg-accent/25'
                : 'border-border text-muted',
            )}
          >
            Next round →
          </button>
          <button
            type="button"
            onClick={replay}
            className="rounded-full border border-border px-4 py-1.5 text-sm text-ink hover:bg-surface-2"
          >
            ↺ Replay
          </button>
        </div>
        <div
          className={cn(
            'rounded-xl border px-3 py-2 text-center text-sm',
            collapsed ? 'border-accent/50 text-accent'
              : peachWillExit ? 'border-accent-2/50 text-accent-2'
                : 'border-success/50 text-success',
          )}
        >
          {round === 0 && 'Buyers cannot tell a peach from a lemon, so they only offer the AVERAGE value of the lot. That price is below what a peach is worth. Press Next round.'}
          {round > 0 && peachWillExit && `At $${Math.round(price)} the remaining peach owners are underpaid, so they withdraw their cars. The lot gets more lemon-heavy and the price falls again.`}
          {round > 0 && !peachWillExit && !collapsed && 'The market has reached a resting point with the cars still listed.'}
          {collapsed && 'Market for lemons. Asymmetric information drove every good car out — only lemons remain, the price collapsed toward $40, and a market that could have served everyone has mostly unravelled. This is adverse selection.'}
        </div>
      </div>
    </div>
  )
}

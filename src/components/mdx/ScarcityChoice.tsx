import { useState } from 'react'
import { cn } from '#/lib/cn'
import { formatUSD } from '#/lib/econ'

// Scarcity in one cart: a fixed budget can't buy everything you want, so you're
// forced to choose. Toggle items on/off; the running total can't exceed the
// budget — that hard limit IS scarcity, and picking some means skipping others.
type Item = { id: string; label: string; price: number }

const BUDGET = 50
const ITEMS: Array<Item> = [
  { id: 'game', label: '🎮 New game', price: 30 },
  { id: 'book', label: '📚 Textbook', price: 25 },
  { id: 'food', label: '🍔 Week of lunches', price: 20 },
  { id: 'shoes', label: '👟 Running shoes', price: 28 },
  { id: 'concert', label: '🎟️ Concert ticket', price: 18 },
]

export function ScarcityChoice() {
  const [picked, setPicked] = useState<Set<string>>(new Set())

  const spent = ITEMS.filter((i) => picked.has(i.id)).reduce((s, i) => s + i.price, 0)
  const left = BUDGET - spent

  const toggle = (id: string, price: number) => {
    setPicked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else if (price <= BUDGET - spent) next.add(id)
      return next
    })
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-muted">Your budget</span>
        <span className="font-mono text-ink">{formatUSD(BUDGET)}</span>
      </div>

      <div className="grid gap-2">
        {ITEMS.map((i) => {
          const on = picked.has(i.id)
          const affordable = on || i.price <= left
          return (
            <button
              key={i.id}
              type="button"
              disabled={!affordable}
              onClick={() => toggle(i.id, i.price)}
              className={cn(
                'flex items-center justify-between rounded-xl border px-3 py-2 text-sm transition-colors',
                on
                  ? 'border-accent bg-accent/15 text-accent'
                  : affordable
                    ? 'border-border text-ink hover:border-accent/50'
                    : 'cursor-not-allowed border-border/50 text-muted/50',
              )}
            >
              <span>{i.label}</span>
              <span className="font-mono">{formatUSD(i.price)}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm">
        <span className="text-muted">Spent {formatUSD(spent)}</span>
        <span className={cn('font-mono', left === 0 ? 'text-success' : 'text-ink')}>
          {formatUSD(left)} left
        </span>
      </div>
      <p className="mt-3 text-sm text-muted">
        You want all five — but {formatUSD(BUDGET)} can&apos;t stretch that far. <span className="text-ink">Scarcity</span> forces a
        choice, and every item you add quietly rules another out. That trade-off is the heart of economics.
      </p>
    </div>
  )
}

import { useState } from 'react'
import { cn } from '#/lib/cn'

// Opportunity cost = the value of the NEXT-BEST option you give up. Pick how to
// spend a free Saturday; the cost of your choice isn't "nothing" — it's the most
// valuable thing you didn't do.
type Opt = { id: string; label: string; worth: number; note: string }

const OPTIONS: Array<Opt> = [
  { id: 'study', label: 'Study for the exam', worth: 9, note: 'a better grade next week' },
  { id: 'shift', label: 'Pick up a paid shift', worth: 7, note: '$80 in your pocket today' },
  { id: 'friends', label: 'Day out with friends', worth: 8, note: 'fun and connection' },
  { id: 'sleep', label: 'Rest and recharge', worth: 5, note: 'energy for the week' },
]

export function OpportunityCost() {
  const [chosen, setChosen] = useState<string | null>(null)

  const forgone = chosen
    ? OPTIONS.filter((o) => o.id !== chosen).reduce((best, o) => (o.worth > best.worth ? o : best))
    : null
  const chosenOpt = OPTIONS.find((o) => o.id === chosen)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">You have one free Saturday. Pick how to spend it:</p>
      <div className="grid grid-cols-2 gap-2">
        {OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setChosen(o.id)}
            className={cn(
              'rounded-xl border px-3 py-2 text-left text-sm transition-colors',
              chosen === o.id
                ? 'border-accent bg-accent/15 text-accent'
                : forgone && o.id === forgone.id
                  ? 'border-accent-2/60 bg-surface-2 text-ink'
                  : 'border-border text-muted hover:text-ink',
            )}
          >
            <div className="font-semibold">{o.label}</div>
            <div className="text-xs opacity-80">{o.note}</div>
          </button>
        ))}
      </div>

      {chosenOpt && forgone && (
        <div className="mt-4 rounded-xl border border-border bg-surface-2 p-3 text-sm">
          <p className="text-ink">
            You chose <span className="font-semibold text-accent">{chosenOpt.label}</span>.
          </p>
          <p className="mt-1 text-muted">
            Its <span className="font-semibold text-accent-2">opportunity cost</span> is the next-best thing you gave up
            — <span className="text-ink">{forgone.label}</span> ({forgone.note}). Not the sum of everything else, just
            the single best alternative.
          </p>
        </div>
      )}
      {!chosen && <p className="mt-4 text-center text-xs text-muted">Choose one to reveal its opportunity cost.</p>}
    </div>
  )
}

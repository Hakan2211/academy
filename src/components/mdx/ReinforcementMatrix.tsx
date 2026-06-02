import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// The operant 2x2. Two questions: are we ADDING or REMOVING a stimulus, and is
// the stimulus PLEASANT or AVERSIVE? The four answers are the four operant
// consequences. Reinforcement (top, by intent) increases behaviour; punishment
// (bottom) decreases it. Click a cell to read a concrete example.

type Cell = {
  key: string
  name: string
  effect: 'increases' | 'decreases'
  icon: string
  defn: string
  example: string
}

// rows = operation (add / remove); cols = stimulus valence (pleasant / aversive)
const CELLS: Record<string, Cell> = {
  addPleasant: {
    key: 'addPleasant',
    name: 'Positive reinforcement',
    effect: 'increases',
    icon: 'PlusCircle',
    defn: 'ADD a pleasant stimulus → behaviour increases.',
    example: 'Your dog sits, so you give it a treat. It sits more often.',
  },
  removeAversive: {
    key: 'removeAversive',
    name: 'Negative reinforcement',
    effect: 'increases',
    icon: 'MinusCircle',
    defn: 'REMOVE an aversive stimulus → behaviour increases.',
    example: 'You buckle your seatbelt to stop the car\'s annoying beep. You buckle up more.',
  },
  addAversive: {
    key: 'addAversive',
    name: 'Positive punishment',
    effect: 'decreases',
    icon: 'PlusCircle',
    defn: 'ADD an aversive stimulus → behaviour decreases.',
    example: 'A child touches a hot stove and gets burned. They stop reaching for it.',
  },
  removePleasant: {
    key: 'removePleasant',
    name: 'Negative punishment',
    effect: 'decreases',
    icon: 'MinusCircle',
    defn: 'REMOVE a pleasant stimulus → behaviour decreases.',
    example: 'A teen breaks curfew, so you take away their phone. They break curfew less.',
  },
}

const GRID: Array<Array<string>> = [
  ['addPleasant', 'addAversive'],
  ['removePleasant', 'removeAversive'],
]

export function ReinforcementMatrix() {
  const [active, setActive] = useState<string>('addPleasant')
  const cell = CELLS[active]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      {/* column headers */}
      <div className="mb-2 grid grid-cols-[auto_1fr_1fr] gap-2 text-center text-xs font-semibold text-muted">
        <span />
        <span className="text-success">Pleasant stimulus</span>
        <span style={{ color: '#E74C3C' }}>Aversive stimulus</span>
      </div>

      {GRID.map((row, r) => (
        <div key={r} className="mb-2 grid grid-cols-[auto_1fr_1fr] items-stretch gap-2">
          <div className="flex w-16 items-center justify-center text-center text-xs font-semibold text-muted">
            {r === 0 ? 'ADD stimulus' : 'REMOVE stimulus'}
          </div>
          {row.map((k) => {
            const c = CELLS[k]
            const isReinf = c.effect === 'increases'
            return (
              <button
                key={k}
                type="button"
                onClick={() => setActive(k)}
                className={cn(
                  'rounded-xl border p-3 text-left transition-colors',
                  active === k ? 'border-accent bg-accent/15' : 'border-border bg-surface-2 hover:border-accent/50',
                )}
              >
                <div className="flex items-center gap-1.5">
                  <Icon name={c.icon} size={14} className={isReinf ? 'text-accent' : 'text-muted'} />
                  <span className="text-sm font-semibold text-ink">{c.name}</span>
                </div>
                <span className={cn('mt-1 inline-block text-xs font-medium', isReinf ? 'text-success' : 'text-muted')}>
                  behaviour {c.effect}
                </span>
              </button>
            )
          })}
        </div>
      ))}

      <div className="mt-3 rounded-xl bg-surface-2 p-3">
        <p className="text-sm font-semibold text-accent">{cell.name}</p>
        <p className="mt-1 text-sm text-ink">{cell.defn}</p>
        <p className="mt-1.5 text-sm leading-snug text-muted">
          <span className="font-medium text-ink">Example: </span>{cell.example}
        </p>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        Tip: <span className="text-ink">positive/negative</span> means add/remove — not good/bad. <span className="text-ink">Reinforcement</span> always strengthens; <span className="text-ink">punishment</span> always weakens.
      </p>
    </div>
  )
}

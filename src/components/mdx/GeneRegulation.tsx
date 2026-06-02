import { useState } from 'react'
import { cn } from '#/lib/cn'

// Every cell in your body carries the SAME complete DNA — yet a skin cell and a
// neuron look nothing alike. The difference is gene regulation: each cell type
// switches a different set of genes ON. Pick a cell type and see which fire.
type Cell = 'skin' | 'muscle' | 'neuron'

const GENES = [
  { id: 'house', name: 'Respiration enzymes' },
  { id: 'keratin', name: 'Keratin' },
  { id: 'collagen', name: 'Collagen' },
  { id: 'myosin', name: 'Myosin' },
  { id: 'channel', name: 'Ion channels' },
  { id: 'transmitter', name: 'Neurotransmitters' },
]

const ON: Record<Cell, Array<string>> = {
  skin: ['house', 'keratin', 'collagen'],
  muscle: ['house', 'myosin'],
  neuron: ['house', 'channel', 'transmitter'],
}

const BLURB: Record<Cell, string> = {
  skin: 'A skin cell switches on keratin and collagen — tough, protective proteins.',
  muscle: 'A muscle cell switches on myosin, the motor protein that makes it contract.',
  neuron: 'A neuron switches on ion channels and neurotransmitter genes so it can fire signals.',
}

export function GeneRegulation() {
  const [cell, setCell] = useState<Cell>('skin')
  const active = new Set(ON[cell])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex gap-2">
        {(['skin', 'muscle', 'neuron'] as Array<Cell>).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCell(c)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm capitalize transition-colors',
              cell === c ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {c} cell
          </button>
        ))}
      </div>

      {/* the genome — same in every cell */}
      <div className="rounded-xl bg-surface-2 p-2">
        <p className="mb-1 px-1 text-[10px] uppercase tracking-wide text-muted">the same DNA in every cell</p>
        <div className="flex h-3 overflow-hidden rounded-full">
          {GENES.map((g, i) => (
            <div key={g.id} className={cn('h-full flex-1', i % 2 ? 'bg-slate-600' : 'bg-slate-500')} />
          ))}
        </div>
      </div>

      {/* gene switches */}
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {GENES.map((g) => {
          const on = active.has(g.id)
          return (
            <div
              key={g.id}
              className={cn(
                'rounded-lg border px-2.5 py-2 text-center text-xs transition-colors',
                on ? 'border-success/50 bg-success/10 text-ink' : 'border-border bg-surface-2 text-muted opacity-60',
              )}
            >
              <p className="font-semibold">{g.name}</p>
              <p className={cn('mt-0.5 text-[10px] font-bold', on ? 'text-success' : 'text-muted')}>
                {on ? 'ON' : 'off'}
              </p>
            </div>
          )
        })}
      </div>

      <p className="mt-3 rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted">{BLURB[cell]}</p>
    </div>
  )
}

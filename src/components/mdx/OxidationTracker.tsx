import { useState } from 'react'
import { cn } from '#/lib/cn'

// Oxidation numbers are a bookkeeping tool: a charge each atom WOULD have if all
// bonds were ionic. They let you track which atoms are oxidised (number goes up)
// or reduced (number goes down). Pick a compound to see them assigned.
type Compound = { key: string; label: string; atoms: Array<{ el: string; ox: number; n: number }>; charge: number }

const COMPOUNDS: Array<Compound> = [
  { key: 'h2o', label: 'H₂O', charge: 0, atoms: [{ el: 'H', ox: 1, n: 2 }, { el: 'O', ox: -2, n: 1 }] },
  { key: 'co2', label: 'CO₂', charge: 0, atoms: [{ el: 'C', ox: 4, n: 1 }, { el: 'O', ox: -2, n: 2 }] },
  { key: 'nh3', label: 'NH₃', charge: 0, atoms: [{ el: 'N', ox: -3, n: 1 }, { el: 'H', ox: 1, n: 3 }] },
  { key: 'h2so4', label: 'H₂SO₄', charge: 0, atoms: [{ el: 'H', ox: 1, n: 2 }, { el: 'S', ox: 6, n: 1 }, { el: 'O', ox: -2, n: 4 }] },
  { key: 'kmno4', label: 'KMnO₄', charge: 0, atoms: [{ el: 'K', ox: 1, n: 1 }, { el: 'Mn', ox: 7, n: 1 }, { el: 'O', ox: -2, n: 4 }] },
]

export function OxidationTracker() {
  const [key, setKey] = useState('h2so4')
  const c = COMPOUNDS.find((x) => x.key === key) ?? COMPOUNDS[0]
  const sum = c.atoms.reduce((s, a) => s + a.ox * a.n, 0)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {COMPOUNDS.map((x) => (
          <button
            key={x.key}
            type="button"
            onClick={() => setKey(x.key)}
            className={cn('rounded-full border px-3 py-1 font-mono text-sm transition-colors', key === x.key ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}
          >
            {x.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-3 py-2">
        {c.atoms.map((a) => (
          <div key={a.el} className="flex flex-col items-center rounded-lg bg-surface-2 px-4 py-2">
            <span className={cn('text-lg font-bold', a.ox > 0 ? 'text-[#E74C3C]' : a.ox < 0 ? 'text-[#5DADE2]' : 'text-ink')}>
              {a.ox > 0 ? '+' : ''}{a.ox}
            </span>
            <span className="text-sm text-ink">{a.el}</span>
            <span className="text-[10px] text-muted">×{a.n}</span>
          </div>
        ))}
      </div>

      <p className="mt-1 text-center text-sm text-muted">
        Sum of (oxidation number × count) ={' '}
        <span className="font-mono text-ink">{sum >= 0 ? '+' : ''}{sum}</span> = the overall charge ({c.charge}). They always add up.
      </p>

      <div className="mt-2 rounded-lg bg-surface-2 p-2.5 text-xs text-muted">
        Quick rules: free elements = 0 · O is usually −2 · H is usually +1 · group 1 = +1, group 2 = +2 · the total equals the species' charge.
      </div>
    </div>
  )
}

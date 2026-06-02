import { useState } from 'react'
import { cn } from '#/lib/cn'
import { prettyFormula } from '#/lib/chem'

// Stoichiometry: the coefficients in a balanced equation are a recipe of MOLE
// RATIOS. Fix the amount of one substance and every other amount follows. Slide
// the input and watch the whole reaction scale.
type Rxn = {
  key: string
  label: string
  species: Array<{ f: string; coeff: number; side: 'r' | 'p' }>
}

const RXNS: Array<Rxn> = [
  {
    key: 'ammonia',
    label: 'N₂ + 3H₂ → 2NH₃',
    species: [
      { f: 'N2', coeff: 1, side: 'r' },
      { f: 'H2', coeff: 3, side: 'r' },
      { f: 'NH3', coeff: 2, side: 'p' },
    ],
  },
  {
    key: 'combustion',
    label: 'CH₄ + 2O₂ → CO₂ + 2H₂O',
    species: [
      { f: 'CH4', coeff: 1, side: 'r' },
      { f: 'O2', coeff: 2, side: 'r' },
      { f: 'CO2', coeff: 1, side: 'p' },
      { f: 'H2O', coeff: 2, side: 'p' },
    ],
  },
]

export function StoichRatio() {
  const [key, setKey] = useState('ammonia')
  const [base, setBase] = useState(1) // moles of the first species
  const rxn = RXNS.find((r) => r.key === key) ?? RXNS[0]
  const baseCoeff = rxn.species[0].coeff
  const maxMol = Math.max(...rxn.species.map((s) => (s.coeff / baseCoeff) * 5))

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {RXNS.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => {
              setKey(r.key)
              setBase(1)
            }}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              key === r.key ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {rxn.species.map((s, i) => {
          const mol = (s.coeff / baseCoeff) * base
          return (
            <div key={i} className="flex items-center gap-2">
              <span className="w-16 shrink-0 font-mono text-sm text-ink">{prettyFormula(s.f)}</span>
              <div className="h-5 flex-1 overflow-hidden rounded bg-surface-2">
                <div
                  className="h-full rounded"
                  style={{
                    width: `${(mol / maxMol) * 100}%`,
                    background: s.side === 'r' ? '#5DADE2' : '#2ECC71',
                  }}
                />
              </div>
              <span className="w-20 shrink-0 text-right font-mono text-sm text-muted">{mol.toFixed(2)} mol</span>
            </div>
          )
        })}
      </div>

      <p className="my-3 text-center text-xs text-muted">
        <span className="text-[#5DADE2]">■ reactants</span> &nbsp; <span className="text-[#2ECC71]">■ products</span> — all scale by the mole ratios in the equation.
      </p>

      <label className="flex flex-col gap-1 text-sm">
        <span className="flex items-center justify-between text-muted">
          <span>Moles of {prettyFormula(rxn.species[0].f)}</span>
          <span className="font-mono text-ink">{base.toFixed(1)} mol</span>
        </span>
        <input
          type="range"
          min={0.5}
          max={5}
          step={0.5}
          value={base}
          onChange={(e) => setBase(Number(e.target.value))}
          className="accent-accent"
        />
      </label>
    </div>
  )
}

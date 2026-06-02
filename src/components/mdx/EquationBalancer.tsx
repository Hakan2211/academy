import { useMemo, useState } from 'react'
import { cn } from '#/lib/cn'
import { parseFormula, prettyFormula } from '#/lib/chem'

// Balancing an equation enforces conservation of mass: every atom on the left
// must reappear on the right. You can't change the formulas — only the
// coefficients (how many of each molecule). Adjust them until every element
// tallies on both sides.
type Eq = { key: string; reactants: Array<string>; products: Array<string> }

const EQS: Array<Eq> = [
  { key: 'water', reactants: ['H2', 'O2'], products: ['H2O'] },
  { key: 'methane', reactants: ['CH4', 'O2'], products: ['CO2', 'H2O'] },
  { key: 'ammonia', reactants: ['N2', 'H2'], products: ['NH3'] },
  { key: 'rust', reactants: ['Fe', 'O2'], products: ['Fe2O3'] },
]
const LABEL: Record<string, string> = {
  water: 'Hydrogen + Oxygen', methane: 'Methane combustion', ammonia: 'Ammonia synthesis', rust: 'Iron + Oxygen',
}

function tally(species: Array<string>, coeffs: Array<number>) {
  const out: Record<string, number> = {}
  species.forEach((f, i) => {
    for (const { el, count } of parseFormula(f)) out[el] = (out[el] ?? 0) + count * coeffs[i]
  })
  return out
}

export function EquationBalancer() {
  const [key, setKey] = useState('water')
  const eq = EQS.find((e) => e.key === key) ?? EQS[0]
  const all = [...eq.reactants, ...eq.products]
  const [coeffs, setCoeffs] = useState<Array<number>>(() => all.map(() => 1))

  const reset = (e: Eq) => {
    setKey(e.key)
    setCoeffs([...e.reactants, ...e.products].map(() => 1))
  }
  const setC = (i: number, d: number) =>
    setCoeffs((c) => c.map((v, j) => (j === i ? Math.max(1, Math.min(9, v + d)) : v)))

  const left = tally(eq.reactants, coeffs.slice(0, eq.reactants.length))
  const right = tally(eq.products, coeffs.slice(eq.reactants.length))
  const elems = Array.from(new Set([...Object.keys(left), ...Object.keys(right)]))
  const balanced = useMemo(
    () => elems.every((el) => (left[el] ?? 0) === (right[el] ?? 0)),
    [elems, left, right],
  )

  const Species = ({ f, i }: { f: string; i: number }) => (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex flex-col">
        <button type="button" onClick={() => setC(i, 1)} className="text-[10px] leading-none text-muted hover:text-accent">▲</button>
        <button type="button" onClick={() => setC(i, -1)} className="text-[10px] leading-none text-muted hover:text-accent">▼</button>
      </span>
      <span className="font-mono text-lg">
        <span className="font-bold text-accent">{coeffs[i]}</span>
        {prettyFormula(f)}
      </span>
    </span>
  )

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {EQS.map((e) => (
          <button
            key={e.key}
            type="button"
            onClick={() => reset(e)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              key === e.key ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {LABEL[e.key]}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 py-2">
        {eq.reactants.map((f, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-muted">+</span>}
            <Species f={f} i={i} />
          </span>
        ))}
        <span className="px-1 text-xl text-accent">→</span>
        {eq.products.map((f, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-muted">+</span>}
            <Species f={f} i={eq.reactants.length + i} />
          </span>
        ))}
      </div>

      {/* per-element tally */}
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {elems.map((el) => {
          const ok = (left[el] ?? 0) === (right[el] ?? 0)
          return (
            <span
              key={el}
              className={cn(
                'rounded-md px-2 py-1 font-mono text-xs',
                ok ? 'bg-[#2ECC71]/15 text-[#2ECC71]' : 'bg-[#E74C3C]/15 text-[#E74C3C]',
              )}
            >
              {el}: {left[el] ?? 0} {ok ? '=' : '≠'} {right[el] ?? 0}
            </span>
          )
        })}
      </div>

      <p className={cn('mt-3 text-center text-sm font-semibold', balanced ? 'text-[#2ECC71]' : 'text-muted')}>
        {balanced ? '✓ Balanced — every atom is conserved!' : 'Not balanced yet — adjust the coefficients.'}
      </p>
    </div>
  )
}

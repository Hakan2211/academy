import { useState } from 'react'
import { cn } from '#/lib/cn'
import { parseFormula, prettyFormula, molarMass, ATOMIC_MASS, ELEMENT_COLOR } from '#/lib/chem'

// Molar mass = add up the atomic mass of every atom in the formula. It's the
// bridge between grams (what you weigh) and moles (what you count). The same
// breakdown also gives the percent composition by mass.
const FORMULAS = ['H2O', 'CO2', 'NaCl', 'CaCO3', 'C6H12O6', 'H2SO4']

export function MolarMass() {
  const [f, setF] = useState('CaCO3')
  const parts = parseFormula(f)
  const mm = molarMass(f)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {FORMULAS.map((x) => (
          <button
            key={x}
            type="button"
            onClick={() => setF(x)}
            className={cn(
              'rounded-full border px-3 py-1 font-mono text-sm transition-colors',
              f === x ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {prettyFormula(x)}
          </button>
        ))}
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted">
            <th className="py-1 text-left font-normal">Element</th>
            <th className="text-right font-normal">Atoms</th>
            <th className="text-right font-normal">Atomic mass</th>
            <th className="text-right font-normal">Subtotal</th>
            <th className="text-right font-normal">% mass</th>
          </tr>
        </thead>
        <tbody>
          {parts.map(({ el, count }) => {
            const sub = (ATOMIC_MASS[el] ?? 0) * count
            return (
              <tr key={el} className="border-t border-border">
                <td className="py-1.5">
                  <span className="mr-1.5 inline-block h-3 w-3 rounded-full align-middle" style={{ background: ELEMENT_COLOR[el] ?? '#888' }} />
                  {el}
                </td>
                <td className="text-right">{count}</td>
                <td className="text-right font-mono">{(ATOMIC_MASS[el] ?? 0).toFixed(2)}</td>
                <td className="text-right font-mono">{sub.toFixed(2)}</td>
                <td className="text-right font-mono text-accent">{((sub / mm) * 100).toFixed(1)}%</td>
              </tr>
            )
          })}
          <tr className="border-t-2 border-border font-semibold text-ink">
            <td className="py-1.5">Molar mass</td>
            <td colSpan={2}></td>
            <td className="text-right font-mono">{mm.toFixed(2)}</td>
            <td className="text-right font-mono">g/mol</td>
          </tr>
        </tbody>
      </table>

      {/* percent-composition bar */}
      <div className="mt-3 flex h-5 overflow-hidden rounded-full">
        {parts.map(({ el, count }) => {
          const pct = ((ATOMIC_MASS[el] ?? 0) * count) / mm
          return (
            <div
              key={el}
              title={`${el} ${(pct * 100).toFixed(1)}%`}
              style={{ width: `${pct * 100}%`, background: ELEMENT_COLOR[el] ?? '#888' }}
            />
          )
        })}
      </div>
    </div>
  )
}

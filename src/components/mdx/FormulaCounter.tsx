import { useState } from 'react'
import { cn } from '#/lib/cn'
import { parseFormula, prettyFormula, ELEMENT_COLOR } from '#/lib/chem'

// A chemical formula is a recipe: subscripts and parentheses tell you exactly
// how many atoms of each element are present. Pick a formula and count them.
const FORMULAS = ['H2O', 'CO2', 'NaCl', 'Ca(OH)2', 'C6H12O6', '(NH4)2SO4']

const DESCRIPTIONS: Record<string, string> = {
  H2O: 'Water — 2 hydrogen, 1 oxygen.',
  CO2: 'Carbon dioxide — 1 carbon, 2 oxygen.',
  NaCl: 'Sodium chloride — a 1 : 1 ratio of sodium to chlorine ions.',
  'Ca(OH)2': 'The (OH) group is multiplied by 2 — so 1 Ca, 2 O, 2 H.',
  C6H12O6: 'Glucose — 6 carbon, 12 hydrogen, 6 oxygen.',
  '(NH4)2SO4': 'Ammonium sulfate — the (NH4) group ×2 gives 2 N and 8 H, plus 1 S and 4 O.',
}

export function FormulaCounter() {
  const [f, setF] = useState('Ca(OH)2')
  const counts = parseFormula(f)
  const total = counts.reduce((s, c) => s + c.count, 0)

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

      <p className="mb-3 text-center font-mono text-2xl font-bold text-ink">{prettyFormula(f)}</p>

      <div className="flex flex-wrap items-end justify-center gap-4">
        {counts.map(({ el, count }) => (
          <div key={el} className="flex flex-col items-center gap-1">
            <div className="flex flex-wrap justify-center gap-1" style={{ maxWidth: 90 }}>
              {Array.from({ length: count }).map((_, i) => (
                <span
                  key={i}
                  className="inline-block h-4 w-4 rounded-full"
                  style={{ background: ELEMENT_COLOR[el] ?? '#888' }}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-ink">{el}</span>
            <span className="text-xs text-muted">×{count}</span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-center text-sm text-muted">
        {DESCRIPTIONS[f]} <span className="text-ink">Total atoms: {total}.</span>
      </p>
    </div>
  )
}

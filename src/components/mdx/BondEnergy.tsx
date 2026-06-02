import { useState } from 'react'
import { cn } from '#/lib/cn'

// Every reaction breaks bonds (costs energy, IN) and forms new ones (releases
// energy, OUT). The net of the two is the reaction's enthalpy change, ΔH.
// If forming releases more than breaking costs, the reaction is exothermic.
type Rxn = { key: string; label: string; broken: number; formed: number; note: string }

const RXNS: Array<Rxn> = [
  { key: 'methane', label: 'CH₄ + 2O₂ → CO₂ + 2H₂O', broken: 2644, formed: 3466, note: 'Burning methane forms much stronger bonds than it breaks — strongly exothermic, releasing heat.' },
  { key: 'hcl', label: 'H₂ + Cl₂ → 2HCl', broken: 678, formed: 862, note: 'Forming the H–Cl bonds releases more than breaking H–H and Cl–Cl costs — exothermic.' },
  { key: 'decomp', label: '2H₂O → 2H₂ + O₂', broken: 1852, formed: 1368, note: 'Splitting water breaks strong O–H bonds and forms weaker ones — it costs energy (endothermic).' },
]

export function BondEnergy() {
  const [key, setKey] = useState('methane')
  const r = RXNS.find((x) => x.key === key) ?? RXNS[0]
  const dH = r.broken - r.formed // +ve = endothermic, -ve = exothermic
  const exo = dH < 0
  const max = Math.max(r.broken, r.formed)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {RXNS.map((x) => (
          <button
            key={x.key}
            type="button"
            onClick={() => setKey(x.key)}
            className={cn('rounded-full border px-3 py-1 text-xs transition-colors', key === x.key ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}
          >
            {x.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-28 shrink-0 text-sm text-muted">Bonds broken (in)</span>
          <div className="h-6 flex-1 overflow-hidden rounded bg-surface-2">
            <div className="h-full rounded bg-[#E74C3C]" style={{ width: `${(r.broken / max) * 100}%` }} />
          </div>
          <span className="w-20 shrink-0 text-right font-mono text-sm text-ink">+{r.broken}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-28 shrink-0 text-sm text-muted">Bonds formed (out)</span>
          <div className="h-6 flex-1 overflow-hidden rounded bg-surface-2">
            <div className="h-full rounded bg-[#2ECC71]" style={{ width: `${(r.formed / max) * 100}%` }} />
          </div>
          <span className="w-20 shrink-0 text-right font-mono text-sm text-ink">−{r.formed}</span>
        </div>
      </div>

      <p className="mt-3 text-center text-sm">
        ΔH = broken − formed ={' '}
        <span className={cn('font-mono font-semibold', exo ? 'text-[#2ECC71]' : 'text-[#E84393]')}>
          {dH > 0 ? '+' : ''}{dH} kJ/mol
        </span>{' '}
        <span className="text-muted">({exo ? 'exothermic' : 'endothermic'})</span>
      </p>
      <p className="mt-1 min-h-[2.5rem] text-center text-sm text-muted">{r.note}</p>
    </div>
  )
}

import { useState } from 'react'
import { prettyFormula } from '#/lib/chem'

// A reaction stops the moment one reactant runs out — the limiting reactant.
// Whatever is left of the other is excess. Set the amounts of each reactant and
// see which one limits the yield. Equation: 2H₂ + O₂ → 2H₂O.
export function LimitingReactant() {
  const [h2, setH2] = useState(4)
  const [o2, setO2] = useState(3)

  // extent of reaction limited by the scarcer reactant (ratio 2 H2 : 1 O2)
  const extent = Math.min(h2 / 2, o2 / 1)
  const usedH2 = extent * 2
  const usedO2 = extent * 1
  const product = extent * 2
  const leftH2 = h2 - usedH2
  const leftO2 = o2 - usedO2
  const limiting = h2 / 2 < o2 ? 'H₂' : o2 < h2 / 2 ? 'O₂' : 'both (perfect ratio)'

  const Bar = ({ label, total, used, color }: { label: string; total: number; used: number; color: string }) => (
    <div className="flex items-center gap-2">
      <span className="w-12 shrink-0 font-mono text-sm text-ink">{label}</span>
      <div className="flex h-6 flex-1 overflow-hidden rounded bg-surface-2">
        <div className="h-full" style={{ width: `${(used / 8) * 100}%`, background: color }} />
        <div className="h-full opacity-30" style={{ width: `${((total - used) / 8) * 100}%`, background: color }} />
      </div>
    </div>
  )

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-center font-mono text-ink">2H₂ + O₂ → 2H₂O</p>

      <div className="space-y-2">
        <Bar label={prettyFormula('H2')} total={h2} used={usedH2} color="#5DADE2" />
        <Bar label={prettyFormula('O2')} total={o2} used={usedO2} color="#E74C3C" />
        <Bar label={prettyFormula('H2O')} total={product} used={product} color="#2ECC71" />
      </div>
      <p className="mt-1 text-center text-xs text-muted">solid = reacted · faded = left over (excess)</p>

      <div className="mt-3 rounded-lg bg-surface-2 p-3 text-sm">
        <p>
          Limiting reactant: <span className="font-semibold text-accent">{limiting}</span> — it runs out first and caps the yield.
        </p>
        <p className="mt-1 text-muted">
          Produces <span className="font-mono text-ink">{product.toFixed(1)} mol H₂O</span>. Left over:{' '}
          <span className="font-mono text-ink">{leftH2.toFixed(1)} mol H₂</span>,{' '}
          <span className="font-mono text-ink">{leftO2.toFixed(1)} mol O₂</span>.
        </p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="flex items-center justify-between text-muted">
            <span>H₂</span>
            <span className="font-mono text-ink">{h2.toFixed(1)} mol</span>
          </span>
          <input type="range" min={0} max={8} step={0.5} value={h2} onChange={(e) => setH2(Number(e.target.value))} className="accent-accent" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="flex items-center justify-between text-muted">
            <span>O₂</span>
            <span className="font-mono text-ink">{o2.toFixed(1)} mol</span>
          </span>
          <input type="range" min={0} max={8} step={0.5} value={o2} onChange={(e) => setO2(Number(e.target.value))} className="accent-accent" />
        </label>
      </div>
    </div>
  )
}

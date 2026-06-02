import { useState } from 'react'
import { cn } from '#/lib/cn'
import { molarMass, prettyFormula } from '#/lib/chem'

// The mole is chemistry's "dozen": a fixed count (Avogadro's number,
// 6.022×10²³) of particles. Its genius is that one mole of a substance weighs
// its molar mass in grams — so we can COUNT atoms by WEIGHING them.
const SUBS = [
  { f: 'C', name: 'Carbon' },
  { f: 'H2O', name: 'Water' },
  { f: 'NaCl', name: 'Salt' },
  { f: 'C6H12O6', name: 'Glucose' },
]

export function MoleConcept() {
  const [fi, setFi] = useState(1)
  const [moles, setMoles] = useState(1)
  const sub = SUBS[fi]
  const mm = molarMass(sub.f)
  const mass = mm * moles
  const particles = (6.022 * moles).toFixed(2)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {SUBS.map((s, i) => (
          <button
            key={s.f}
            type="button"
            onClick={() => setFi(i)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              fi === i ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-surface-2 p-3">
          <div className="text-2xl font-bold text-accent">{moles.toFixed(1)}</div>
          <div className="text-xs text-muted">moles of {prettyFormula(sub.f)}</div>
        </div>
        <div className="rounded-lg bg-surface-2 p-3">
          <div className="text-2xl font-bold text-ink">{mass.toFixed(1)}</div>
          <div className="text-xs text-muted">grams (mass)</div>
        </div>
        <div className="rounded-lg bg-surface-2 p-3">
          <div className="text-2xl font-bold text-ink">{particles}</div>
          <div className="text-xs text-muted">×10²³ particles</div>
        </div>
      </div>

      <p className="my-3 text-center text-sm text-muted">
        One mole of {sub.name.toLowerCase()} weighs its molar mass,{' '}
        <span className="font-mono text-ink">{mm.toFixed(2)} g</span>, and always contains{' '}
        <span className="text-ink">6.022×10²³</span> particles.
      </p>

      <label className="flex flex-col gap-1 text-sm">
        <span className="flex items-center justify-between text-muted">
          <span>Amount</span>
          <span className="font-mono text-ink">{moles.toFixed(1)} mol</span>
        </span>
        <input
          type="range"
          min={0.5}
          max={5}
          step={0.5}
          value={moles}
          onChange={(e) => setMoles(Number(e.target.value))}
          className="accent-accent"
        />
      </label>
    </div>
  )
}

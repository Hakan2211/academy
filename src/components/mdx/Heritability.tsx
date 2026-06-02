import { useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'

// Heritability: what fraction of the *variation* in a trait across a population
// traces to genetic differences vs environmental ones. Two demos in one: a
// slider that splits the variance pie, and the twin-study logic that estimates
// it (identical twins share ~100% of genes, fraternal ~50%, so the gap in how
// alike they are points to genes). The big caveat: heritability describes
// populations, never a single person.
type Trait = { id: string; label: string; h: number; note: string }

const TRAITS: Array<Trait> = [
  { id: 'height', label: 'Height', h: 80, note: 'Strongly heritable — but nutrition still shifts whole populations upward.' },
  { id: 'iq', label: 'IQ (adults)', h: 65, note: 'Substantially heritable in adults, yet schooling and enrichment matter enormously.' },
  { id: 'personality', label: 'Personality', h: 45, note: 'Roughly half genetic — the rest is non-shared experience, not parenting style.' },
  { id: 'religion', label: 'Religious affiliation', h: 5, note: 'Almost entirely environmental — you inherit your family’s faith, not a gene for it.' },
]

// Twin-study heuristic (Falconer): h^2 ~= 2 * (r_identical - r_fraternal).
// We pick plausible concordances that recover roughly each trait's h.
function concordances(h: number): { mz: number; dz: number } {
  // r_mz - r_dz = h/2 ; anchor r_mz near a high but <1 value.
  const half = h / 200 // h is a percentage
  const mz = Math.min(0.95, 0.5 + half)
  const dz = Math.max(0.05, mz - half)
  return { mz, dz }
}

export function Heritability() {
  const [traitId, setTraitId] = useState<string>('height')
  const trait = TRAITS.find((t) => t.id === traitId)!
  const [h, setH] = useState(trait.h)

  const pick = (id: string) => {
    setTraitId(id)
    setH(TRAITS.find((t) => t.id === id)!.h)
  }

  const env = 100 - h
  const { mz, dz } = concordances(h)
  const barW = (frac: number) => `${(frac * 100).toFixed(0)}%`

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {TRAITS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => pick(t.id)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              traitId === t.id ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* variance split bar */}
      <div className="mb-1 flex items-center justify-between text-xs text-muted">
        <span style={{ color: '#FF6B9D' }}>genes</span>
        <span>population variation in {trait.label.toLowerCase()}</span>
        <span style={{ color: '#00D2D3' }}>environment</span>
      </div>
      <div className="flex h-7 overflow-hidden rounded-full ring-1 ring-border">
        <div className="flex h-full items-center justify-end pr-2 text-[11px] font-medium text-white transition-all" style={{ width: `${h}%`, background: '#FF6B9D' }}>
          {h >= 12 ? `${h.toFixed(0)}%` : ''}
        </div>
        <div className="flex h-full flex-1 items-center pl-2 text-[11px] font-medium text-white transition-all" style={{ background: '#00D2D3' }}>
          {env >= 12 ? `${env.toFixed(0)}%` : ''}
        </div>
      </div>

      <div className="mt-3">
        <SceneSlider
          label="Heritability (h²) you assume"
          value={h}
          min={0}
          max={95}
          step={5}
          unit="%"
          onChange={setH}
        />
      </div>

      {/* twin-study logic */}
      <div className="mt-3 rounded-xl border border-border bg-surface-2 p-3">
        <p className="text-xs font-semibold text-ink">How twins reveal this</p>
        <p className="mb-2 text-xs text-muted">
          Identical twins share ~100% of genes; fraternal ~50%. If genes drive the trait, identical twins should be far more alike.
        </p>
        <div className="space-y-2">
          <div>
            <div className="mb-0.5 flex justify-between text-[11px] text-muted">
              <span>Identical (MZ) similarity</span>
              <span className="font-mono text-ink">{mz.toFixed(2)}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-surface">
              <div className="h-full transition-all" style={{ width: barW(mz), background: '#FF6B9D' }} />
            </div>
          </div>
          <div>
            <div className="mb-0.5 flex justify-between text-[11px] text-muted">
              <span>Fraternal (DZ) similarity</span>
              <span className="font-mono text-ink">{dz.toFixed(2)}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-surface">
              <div className="h-full transition-all" style={{ width: barW(dz), background: '#A29BFE' }} />
            </div>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-muted">
          The gap between the two bars is the genetic signal: roughly{' '}
          <span className="font-mono text-ink">h² ≈ 2 × ({mz.toFixed(2)} − {dz.toFixed(2)}) = {Math.round(Math.min(95, Math.max(0, 2 * (mz - dz) * 100)))}%</span>.
        </p>
      </div>

      <p className="mt-2 text-sm text-muted">{trait.note}</p>

      <div className="mt-2 rounded-lg bg-surface-2 px-3 py-2 text-xs text-muted">
        <span className="font-semibold text-ink">The trap to avoid:</span> heritability is about <em>differences across a group</em>, not any one person. "60% heritable" does <span className="text-ink">not</span> mean 60% of your height came from genes — it means 60% of why people <em>differ</em> traces to their genes, in this population, in this environment.
      </div>
    </div>
  )
}

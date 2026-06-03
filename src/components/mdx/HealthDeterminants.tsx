import { useState } from 'react'
import { cn } from '#/lib/cn'

// What actually decides how healthy a population is? Surprisingly little is the
// doctor's office. Toggle "modifiable only" to see how much of your health is
// shaped by things that can change. (Shares are rough public-health estimates,
// e.g. County Health Rankings — illustrative, not precise.)
// Owner: what-is-health (W1). Reused in healthy-living (W15).

type Factor = {
  key: string
  label: string
  share: number // percent of health outcomes
  modifiable: boolean
  color: string
  note: string
}

const FACTORS: Array<Factor> = [
  { key: 'behavior', label: 'Daily behaviour', share: 36, modifiable: true, color: '#2ECC71', note: 'Eating, movement, sleep, smoking, alcohol — the biggest lever you hold.' },
  { key: 'social', label: 'Social & economic', share: 24, modifiable: true, color: '#9BDE3C', note: 'Income, education, work, community — changeable, but often by society more than one person.' },
  { key: 'environment', label: 'Physical environment', share: 9, modifiable: true, color: '#1ABC9C', note: 'Air, water, housing, safety, access to green space.' },
  { key: 'care', label: 'Medical care', share: 11, modifiable: true, color: '#0984E3', note: 'Access and quality matter — but treat far less of the picture than people assume.' },
  { key: 'genes', label: 'Genes & biology', share: 20, modifiable: false, color: '#9B59B6', note: "The hand you're dealt. Real, but it sets odds — it rarely decides everything." },
]

export function HealthDeterminants() {
  const [modOnly, setModOnly] = useState(false)
  const [sel, setSel] = useState<string | null>('behavior')

  const shown = modOnly ? FACTORS.filter((f) => f.modifiable) : FACTORS
  const total = shown.reduce((s, f) => s + f.share, 0)
  const selected = FACTORS.find((f) => f.key === sel)
  const modifiableShare = FACTORS.filter((f) => f.modifiable).reduce((s, f) => s + f.share, 0)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted">What shapes our health?</p>
        <button
          type="button"
          onClick={() => setModOnly((m) => !m)}
          className={cn(
            'rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors',
            modOnly ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
          )}
        >
          {modOnly ? 'Showing changeable factors' : 'Show changeable only'}
        </button>
      </div>

      {/* stacked bar */}
      <div className="flex h-9 w-full overflow-hidden rounded-xl border border-border">
        {shown.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setSel(f.key)}
            title={f.label}
            className="h-full transition-all"
            style={{
              width: `${(f.share / total) * 100}%`,
              background: f.color,
              opacity: sel && sel !== f.key ? 0.45 : 1,
            }}
          />
        ))}
      </div>

      {/* legend */}
      <div className="mt-3 flex flex-wrap gap-2">
        {shown.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setSel(f.key)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs transition-colors',
              sel === f.key ? 'border-accent text-ink' : 'border-border text-muted hover:text-ink',
            )}
          >
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: f.color }} />
            {f.label} · {Math.round((f.share / total) * 100)}%
            {!f.modifiable && <span className="text-[10px] text-muted">(fixed)</span>}
          </button>
        ))}
      </div>

      {selected && (
        <div className="mt-3 rounded-xl border border-border bg-surface-2 p-3 text-sm">
          <div className="font-semibold" style={{ color: selected.color }}>
            {selected.label} · {selected.share}% {selected.modifiable ? '· changeable' : '· fixed'}
          </div>
          <p className="mt-1 text-muted">{selected.note}</p>
        </div>
      )}

      <p className="mt-3 text-xs text-muted">
        Roughly <span className="font-semibold text-success">{modifiableShare}%</span> of what drives
        health outcomes is potentially changeable — and your daily habits are the single biggest slice.
        That's the hopeful headline of this whole island: a lot is in reach.
      </p>
    </div>
  )
}

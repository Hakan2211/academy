import { useState } from 'react'

// Congruent shapes are identical (same size and shape); similar shapes are
// scaled copies (same shape, same angles, proportional sides). Toggle to compare.
// Used in congruence-and-similarity.
export function CongruenceSimilarity() {
  const [mode, setMode] = useState<'cong' | 'sim'>('sim')
  const k = mode === 'cong' ? 1 : 1.6
  const base: Array<[number, number]> = [[0, 50], [60, 50], [0, 0]]
  const sh2 = base.map(([x, y]) => [x * k, y * k] as [number, number])

  const poly = (pts: Array<[number, number]>, ox: number, oy: number) =>
    pts.map(([x, y]) => `${ox + x},${oy + y}`).join(' ')

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex justify-center gap-2">
        <button onClick={() => setMode('cong')} className={`rounded-lg border px-3 py-1 text-xs transition ${mode === 'cong' ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>Congruent</button>
        <button onClick={() => setMode('sim')} className={`rounded-lg border px-3 py-1 text-xs transition ${mode === 'sim' ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>Similar</button>
      </div>

      <svg viewBox="0 0 280 130" className="mx-auto w-full max-w-sm">
        <polygon points={poly(base, 20, 70)} fill="var(--color-accent)" fillOpacity="0.2" stroke="var(--color-accent)" strokeWidth="2" />
        <polygon points={poly(sh2, 150, 70 - 50 * (k - 1))} fill="var(--color-accent-2)" fillOpacity="0.2" stroke="var(--color-accent-2)" strokeWidth="2" />
      </svg>

      <p className="mt-2 text-center text-sm">
        {mode === 'cong' ? (
          <><span className="font-semibold text-accent">Congruent</span><span className="text-muted"> — identical: same angles AND same side lengths (a copy you could place exactly on top).</span></>
        ) : (
          <><span className="font-semibold text-accent">Similar</span><span className="text-muted"> — same shape, scaled by ×{k}: equal angles, sides in the same ratio.</span></>
        )}
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        Both have identical angles. Congruent shapes also share side lengths; similar shapes' sides are all in one fixed ratio (the scale factor).
      </p>
    </div>
  )
}

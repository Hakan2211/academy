import { useState } from 'react'

// Perimeter (distance around) versus area (space inside) — two different
// measures of the same shape. Resize a rectangle or right triangle and watch
// both. Used in perimeter-and-area.
export function AreaPerimeter() {
  const [shape, setShape] = useState<'rect' | 'tri'>('rect')
  const [w, setW] = useState(6)
  const [h, setH] = useState(4)
  const U = 22
  const ox = 30
  const oy = 20

  const area = shape === 'rect' ? w * h : (w * h) / 2
  const hyp = Math.sqrt(w * w + h * h)
  const perim = shape === 'rect' ? 2 * (w + h) : w + h + hyp

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex justify-center gap-2">
        <button onClick={() => setShape('rect')} className={`rounded-lg border px-3 py-1 text-xs transition ${shape === 'rect' ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>Rectangle</button>
        <button onClick={() => setShape('tri')} className={`rounded-lg border px-3 py-1 text-xs transition ${shape === 'tri' ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>Right triangle</button>
      </div>

      <svg viewBox="0 0 260 140" className="mx-auto w-full max-w-sm">
        {shape === 'rect' ? (
          <rect x={ox} y={oy} width={w * U} height={h * U} fill="var(--color-accent)" fillOpacity="0.18" stroke="var(--color-accent)" strokeWidth="2" />
        ) : (
          <polygon points={`${ox},${oy + h * U} ${ox + w * U},${oy + h * U} ${ox},${oy}`} fill="var(--color-accent)" fillOpacity="0.18" stroke="var(--color-accent)" strokeWidth="2" />
        )}
        <text x={ox + (w * U) / 2} y={oy + h * U + 16} textAnchor="middle" fontSize="10" fill="var(--color-muted)">{w}</text>
        <text x={ox - 8} y={oy + (h * U) / 2} textAnchor="end" fontSize="10" fill="var(--color-muted)">{h}</text>
      </svg>

      <div className="space-y-2 px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">{shape === 'rect' ? 'width' : 'base'}</span>
          <input type="range" min={2} max={9} value={w} onChange={(e) => setW(Number(e.target.value))} className="w-1/2 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{w}</span>
        </label>
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">height</span>
          <input type="range" min={2} max={5} value={h} onChange={(e) => setH(Number(e.target.value))} className="w-1/2 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{h}</span>
        </label>
      </div>

      <p className="mt-2 text-center text-sm">
        <span className="text-muted">Area = </span>
        <span className="font-mono text-accent">{shape === 'rect' ? `${w}×${h}` : `½×${w}×${h}`} = {+area.toFixed(1)}</span>
        <span className="text-muted"> sq units · Perimeter = </span>
        <span className="font-mono text-accent-2">{+perim.toFixed(1)}</span>
        <span className="text-muted"> units</span>
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        Area fills the inside (squared units); perimeter is the distance around the edge.
      </p>
    </div>
  )
}

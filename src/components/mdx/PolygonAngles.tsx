import { useState } from 'react'

// Interior and exterior angles of a regular polygon. Slide the number of sides
// and watch the angle sum (n−2)×180 and each angle update. Used in polygons
// (and quadrilaterals at n = 4).
export function PolygonAngles() {
  const [n, setN] = useState(5)
  const interiorSum = (n - 2) * 180
  const eachInterior = interiorSum / n
  const eachExterior = 360 / n

  const cx = 130
  const cy = 110
  const R = 80
  const pts = Array.from({ length: n }, (_, i) => {
    const ang = -Math.PI / 2 + (i * 2 * Math.PI) / n
    return `${cx + R * Math.cos(ang)},${cy + R * Math.sin(ang)}`
  }).join(' ')

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 260 200" className="mx-auto w-full max-w-sm">
        <polygon points={pts} fill="var(--color-accent)" fillOpacity="0.15" stroke="var(--color-accent)" strokeWidth="2" />
      </svg>

      <div className="px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">number of sides n</span>
          <input type="range" min={3} max={10} value={n} onChange={(e) => setN(Number(e.target.value))} className="w-1/2 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{n}</span>
        </label>
      </div>

      <div className="mt-2 grid grid-cols-1 gap-1 text-center text-sm">
        <span className="text-muted">interior angle sum = (n − 2) × 180 = <span className="font-mono text-accent">{interiorSum}°</span></span>
        <span className="text-muted">each interior angle = <span className="font-mono text-ink">{(+eachInterior.toFixed(1))}°</span> · each exterior = <span className="font-mono text-ink">{(+eachExterior.toFixed(1))}°</span></span>
      </div>
      <p className="mt-1 text-center text-xs text-muted">
        Split the polygon into n − 2 triangles, each 180°. The exterior angles always total 360° — one full turn.
      </p>
    </div>
  )
}

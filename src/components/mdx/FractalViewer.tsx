import { useState } from 'react'

// A fractal: a shape made of smaller copies of itself, forever. The Sierpinski
// triangle is built by removing the middle of each triangle, endlessly. Zoom in
// and it looks the same at every scale — infinite detail from a simple rule.
// Used in fractals and the deep-dive.
type Pt = [number, number]
const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]

function sierpinski(p1: Pt, p2: Pt, p3: Pt, depth: number, out: Array<[Pt, Pt, Pt]>) {
  if (depth === 0) {
    out.push([p1, p2, p3])
    return
  }
  const a = mid(p1, p2)
  const b = mid(p2, p3)
  const c = mid(p3, p1)
  sierpinski(p1, a, c, depth - 1, out)
  sierpinski(a, p2, b, depth - 1, out)
  sierpinski(c, b, p3, depth - 1, out)
}

export function FractalViewer() {
  const [depth, setDepth] = useState(4)
  const tris: Array<[Pt, Pt, Pt]> = []
  sierpinski([130, 10], [10, 205], [250, 205], depth, tris)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 260 215" className="mx-auto w-full max-w-sm">
        {tris.map((t, i) => (
          <polygon key={i} points={`${t[0][0]},${t[0][1]} ${t[1][0]},${t[1][1]} ${t[2][0]},${t[2][1]}`} fill="var(--color-accent)" fillOpacity="0.8" />
        ))}
      </svg>

      <div className="px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">iterations</span>
          <input type="range" min={0} max={6} value={depth} onChange={(e) => setDepth(Number(e.target.value))} className="w-2/3 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{depth}</span>
        </label>
      </div>

      <p className="mt-2 text-center text-sm">
        <span className="font-mono text-accent">{Math.pow(3, depth).toLocaleString('en-US')}</span> triangles · the same pattern at every scale
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        A simple rule, repeated forever, makes infinite detail. Its "dimension" is log 3 / log 2 ≈ 1.585 — between a line and a plane. Coastlines, ferns, lungs and clouds are fractal-like.
      </p>
    </div>
  )
}

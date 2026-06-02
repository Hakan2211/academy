import { useState } from 'react'

// Two kinds of symmetry: reflection (mirror lines) and rotation (how many times
// it maps onto itself in a full turn). Pick a shape and see both. Used in
// symmetry-and-shape.
const cx = 130
const cy = 105
const R = 75

function regular(n: number, rot = -90) {
  return Array.from({ length: n }, (_, i) => {
    const ang = ((rot + (i * 360) / n) * Math.PI) / 180
    return [cx + R * Math.cos(ang), cy + R * Math.sin(ang)] as [number, number]
  })
}

const SHAPES = [
  { key: 'tri', label: 'Equilateral △', lines: 3, order: 3, pts: regular(3) },
  { key: 'sq', label: 'Square', lines: 4, order: 4, pts: regular(4, -45) },
  { key: 'rect', label: 'Rectangle', lines: 2, order: 2, pts: [[cx - 90, cy - 50], [cx + 90, cy - 50], [cx + 90, cy + 50], [cx - 90, cy + 50]] as Array<[number, number]> },
  { key: 'pent', label: 'Pentagon', lines: 5, order: 5, pts: regular(5) },
]

// mirror lines as pairs of endpoints, per shape
function mirrorLines(shape: (typeof SHAPES)[number]): Array<[number, number, number, number]> {
  const lines: Array<[number, number, number, number]> = []
  if (shape.key === 'rect') {
    lines.push([cx - 110, cy, cx + 110, cy])
    lines.push([cx, cy - 70, cx, cy + 70])
    return lines
  }
  const n = shape.lines
  for (let i = 0; i < n; i++) {
    const ang = ((-90 + (i * 180) / n + (shape.key === 'sq' ? -45 : 0)) * Math.PI) / 180
    lines.push([cx - 95 * Math.cos(ang), cy - 95 * Math.sin(ang), cx + 95 * Math.cos(ang), cy + 95 * Math.sin(ang)])
  }
  return lines
}

export function SymmetryExplorer() {
  const [s, setS] = useState(1)
  const shape = SHAPES[s]
  const lines = mirrorLines(shape)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap justify-center gap-2">
        {SHAPES.map((sh, i) => (
          <button key={sh.key} onClick={() => setS(i)} className={`rounded-lg border px-2.5 py-1 text-xs transition ${i === s ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>
            {sh.label}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 260 210" className="mx-auto w-full max-w-sm">
        {lines.map((l, i) => (
          <line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke="var(--color-accent-2)" strokeWidth="1.3" strokeDasharray="5 4" />
        ))}
        <polygon points={shape.pts.map((p) => `${p[0]},${p[1]}`).join(' ')} fill="var(--color-accent)" fillOpacity="0.15" stroke="var(--color-accent)" strokeWidth="2" />
        <circle cx={cx} cy={cy} r="2.5" fill="var(--color-ink)" />
      </svg>

      <p className="mt-2 text-center text-sm">
        <span className="font-mono text-accent-2">{shape.lines}</span> <span className="text-muted">lines of symmetry · rotational order </span><span className="font-mono text-accent">{shape.order}</span>
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        Reflection symmetry = mirror lines (dashed). Rotational order = how many times it looks identical in one full turn.
      </p>
    </div>
  )
}

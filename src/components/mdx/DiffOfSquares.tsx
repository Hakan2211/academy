import { useState } from 'react'

// a² − b² = (a + b)(a − b), seen geometrically: cut a b×b square from the corner
// of an a×a square, and the leftover L-shape rearranges into an (a+b) by (a−b)
// rectangle. Used in difference-of-two-squares.
export function DiffOfSquares() {
  const [a, setA] = useState(5)
  const [b, setB] = useState(3)
  const bb = Math.min(b, a - 1)
  const unit = 30
  const A = a * unit
  const B = bb * unit

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex justify-center">
        <svg viewBox={`0 0 ${A + 20} ${A + 20}`} className="max-w-[200px]" style={{ width: A + 20 }}>
          {/* full square */}
          <rect x={10} y={10} width={A} height={A} fill="var(--color-accent)" fillOpacity="0.18" stroke="var(--color-accent)" />
          {/* removed b×b corner */}
          <rect x={10 + A - B} y={10 + A - B} width={B} height={B} fill="var(--color-surface)" stroke="var(--color-accent-2)" strokeDasharray="3 3" />
          <text x={10 + A - B / 2} y={10 + A - B / 2 + 4} textAnchor="middle" fontSize="11" fill="var(--color-accent-2)">b²</text>
          <text x={10 + (A - B) / 2} y={10 + A / 2} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--color-accent)">a² − b²</text>
          <text x={10 + A / 2} y={6} textAnchor="middle" fontSize="10" fill="var(--color-muted)">a = {a}</text>
        </svg>
      </div>

      <div className="mt-2 space-y-2 px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">a</span>
          <input type="range" min={2} max={6} value={a} onChange={(e) => { const v = Number(e.target.value); setA(v); if (b >= v) setB(v - 1) }} className="w-2/3 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{a}</span>
        </label>
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">b</span>
          <input type="range" min={1} max={a - 1} value={bb} onChange={(e) => setB(Number(e.target.value))} className="w-2/3 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{bb}</span>
        </label>
      </div>

      <p className="mt-2 text-center font-mono text-sm">
        {a * a} − {bb * bb} = ({a} + {bb})({a} − {bb}) = {a + bb} × {a - bb} = <span className="font-bold text-success">{a * a - bb * bb}</span>
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        The L-shaped leftover rearranges into an (a + b) by (a − b) rectangle — so a² − b² = (a + b)(a − b).
      </p>
    </div>
  )
}

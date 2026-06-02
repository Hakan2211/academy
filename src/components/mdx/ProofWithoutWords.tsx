import { useState } from 'react'

// A proof without words: the sum of the first n odd numbers is always n². Each
// odd number is an L-shaped layer (a "gnomon") wrapping the square one size
// larger. The picture IS the proof. Used in what-is-a-proof.
const PALETTE = ['#4F8CFF', '#00D2D3', '#FFB020', '#2ECC71', '#E84393', '#9B59B6', '#E67E22']

export function ProofWithoutWords() {
  const [n, setN] = useState(4)
  const U = Math.min(34, 200 / n)
  const odds = Array.from({ length: n }, (_, k) => 2 * k + 1).join(' + ')

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex justify-center">
        <svg viewBox={`0 0 ${n * U + 4} ${n * U + 4}`} style={{ width: n * U + 4 }}>
          {Array.from({ length: n * n }, (_, i) => {
            const r = Math.floor(i / n)
            const c = i % n
            const layer = Math.max(r, c) // which gnomon
            return <rect key={i} x={2 + c * U} y={2 + r * U} width={U - 1.5} height={U - 1.5} rx="2" fill={PALETTE[layer % PALETTE.length]} fillOpacity="0.8" />
          })}
        </svg>
      </div>

      <div className="mt-3 px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">n</span>
          <input type="range" min={1} max={7} value={n} onChange={(e) => setN(Number(e.target.value))} className="w-2/3 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{n}</span>
        </label>
      </div>

      <p className="mt-2 text-center font-mono text-sm">
        {odds} = <span className="font-bold text-accent">{n}² = {n * n}</span>
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        Each odd number is an L-shaped layer wrapping the previous square. Stack them and you always get a perfect square — a proof you can <em>see</em>, true for every n.
      </p>
    </div>
  )
}

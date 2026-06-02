import { useState } from 'react'

// Square numbers, made literal: n² is the number of dots in an n × n square, and
// √ runs the picture backwards — given the dots, find the side. Reused in
// powers-and-square-roots.
export function SquareDots() {
  const [n, setN] = useState(5)
  const sq = n * n

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex justify-center">
        <div className="grid gap-[4px]" style={{ gridTemplateColumns: `repeat(${n}, 14px)` }}>
          {Array.from({ length: sq }, (_, i) => (
            <span key={i} className="h-3.5 w-3.5 rounded-sm bg-accent" />
          ))}
        </div>
      </div>

      <div className="mt-4 px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">side n</span>
          <input type="range" min={1} max={12} value={n} onChange={(e) => setN(Number(e.target.value))} className="w-2/3 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{n}</span>
        </label>
      </div>

      <p className="mt-2 text-center text-sm">
        <span className="font-mono text-ink">{n}² = {n} × {n} = {sq}</span>
        <span className="text-muted"> &nbsp;and&nbsp; </span>
        <span className="font-mono text-success">√{sq} = {n}</span>
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        Squaring builds the square; the square root recovers its side. They undo each other.
      </p>
    </div>
  )
}

import { useState } from 'react'

// Figurate numbers — sequences you can literally draw as shapes. Triangular
// numbers stack rows 1, 2, 3 …; square numbers fill an n×n grid. The picture is
// the formula. Used in special-number-patterns.
export function FigurateNumbers() {
  const [shape, setShape] = useState<'tri' | 'sq'>('tri')
  const [n, setN] = useState(5)
  const U = 16
  const tri = (n * (n + 1)) / 2

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex justify-center gap-2">
        <button onClick={() => setShape('tri')} className={`rounded-lg border px-3 py-1 text-xs transition ${shape === 'tri' ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>Triangular</button>
        <button onClick={() => setShape('sq')} className={`rounded-lg border px-3 py-1 text-xs transition ${shape === 'sq' ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>Square</button>
      </div>

      <div className="flex h-[150px] items-center justify-center">
        <svg viewBox={`0 0 ${n * U + 8} ${n * U + 8}`} style={{ width: n * U + 8, maxHeight: 150 }}>
          {shape === 'tri'
            ? Array.from({ length: n }, (_, r) =>
                Array.from({ length: r + 1 }, (_, c) => {
                  const startX = ((n - (r + 1)) / 2) * U
                  return <circle key={`${r}-${c}`} cx={4 + startX + c * U + U / 2} cy={4 + r * U + U / 2} r={U / 2 - 2} fill="var(--color-accent)" />
                }),
              )
            : Array.from({ length: n * n }, (_, i) => {
                const r = Math.floor(i / n)
                const c = i % n
                return <circle key={i} cx={4 + c * U + U / 2} cy={4 + r * U + U / 2} r={U / 2 - 2} fill="var(--color-accent)" />
              })}
        </svg>
      </div>

      <div className="px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">n</span>
          <input type="range" min={1} max={8} value={n} onChange={(e) => setN(Number(e.target.value))} className="w-2/3 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{n}</span>
        </label>
      </div>

      <p className="mt-2 text-center font-mono text-sm">
        {shape === 'tri' ? (
          <>T<sub>{n}</sub> = 1 + 2 + … + {n} = n(n+1)/2 = <span className="font-bold text-success">{tri}</span></>
        ) : (
          <>S<sub>{n}</sub> = n² = <span className="font-bold text-success">{n * n}</span></>
        )}
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        {shape === 'tri' ? 'Two triangles fit into an n×(n+1) rectangle — hence the ÷2.' : 'Cube numbers (n³) are the 3-D version: n layers of n².'}
      </p>
    </div>
  )
}

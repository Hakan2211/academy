import { useState } from 'react'

// A sequence and its term-to-term rule. Toggle between adding a constant
// (arithmetic) and multiplying by a constant (geometric), and watch the terms —
// and the gaps between them — respond. Used in number-sequences and arithmetic.
export function SequenceExplorer() {
  const [mode, setMode] = useState<'add' | 'mul'>('add')
  const [a, setA] = useState(2)
  const [d, setD] = useState(3)
  const [r, setR] = useState(2)

  const terms: Array<number> = [a]
  for (let i = 1; i < 6; i++) terms.push(mode === 'add' ? terms[i - 1] + d : terms[i - 1] * r)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex justify-center gap-2">
        <button onClick={() => setMode('add')} className={`rounded-lg border px-3 py-1 text-xs transition ${mode === 'add' ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>Add d (arithmetic)</button>
        <button onClick={() => setMode('mul')} className={`rounded-lg border px-3 py-1 text-xs transition ${mode === 'mul' ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>Multiply r (geometric)</button>
      </div>

      <div className="flex flex-wrap items-end justify-center gap-1 font-mono">
        {terms.map((t, i) => (
          <div key={i} className="flex items-center">
            <span className="rounded-lg bg-surface-2 px-2.5 py-1.5 text-ink">{t}</span>
            {i < terms.length - 1 && (
              <span className="px-1 text-xs text-accent">{mode === 'add' ? (d >= 0 ? `+${d}` : d) : `×${r}`}</span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 space-y-2 px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">first term a</span>
          <input type="range" min={1} max={6} value={a} onChange={(e) => setA(Number(e.target.value))} className="w-1/2 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{a}</span>
        </label>
        {mode === 'add' ? (
          <label className="flex items-center justify-between gap-3 text-sm">
            <span className="text-muted">common difference d</span>
            <input type="range" min={-5} max={5} value={d} onChange={(e) => setD(Number(e.target.value))} className="w-1/2 accent-accent" />
            <span className="w-8 text-right font-mono text-ink">{d}</span>
          </label>
        ) : (
          <label className="flex items-center justify-between gap-3 text-sm">
            <span className="text-muted">common ratio r</span>
            <input type="range" min={2} max={4} value={r} onChange={(e) => setR(Number(e.target.value))} className="w-1/2 accent-accent" />
            <span className="w-8 text-right font-mono text-ink">{r}</span>
          </label>
        )}
      </div>

      <p className="mt-2 text-center text-xs text-muted">
        {mode === 'add' ? 'A constant difference between terms means arithmetic — equal steps.' : 'A constant ratio between terms means geometric — equal multipliers.'}
      </p>
    </div>
  )
}

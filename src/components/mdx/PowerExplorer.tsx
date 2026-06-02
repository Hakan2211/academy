import { useState } from 'react'
import { toSuperscript } from '#/lib/math'

// A ladder of powers of one base. Step the exponent and watch each rung multiply
// (going up) or divide (going down) by the base — which forces b⁰ = 1 and makes
// negative powers into reciprocals. Covers index-notation, zero/negative, and
// fractional indices.
const BASES = [2, 3, 5, 10]

function fmt(b: number, e: number): string {
  if (e >= 0) return Math.pow(b, e).toLocaleString('en-US')
  const denom = Math.pow(b, -e)
  return `1/${denom.toLocaleString('en-US')}`
}

export function PowerExplorer() {
  const [b, setB] = useState(2)
  const [e, setE] = useState(3)
  const rungs = [4, 3, 2, 1, 0, -1, -2]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex justify-center gap-2">
        {BASES.map((base) => (
          <button key={base} onClick={() => setB(base)} className={`h-8 w-10 rounded-lg border font-mono text-sm transition ${base === b ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>
            {base}
          </button>
        ))}
      </div>

      <div className="mx-auto max-w-xs space-y-1">
        {rungs.map((r) => (
          <div key={r} className={`flex items-center justify-between rounded-lg px-3 py-1.5 font-mono text-sm ${r === e ? 'bg-accent/15 ring-1 ring-accent/40' : ''}`}>
            <span className={r === e ? 'text-accent' : 'text-muted'}>{b}{toSuperscript(r)}</span>
            <span className={`${r === 0 ? 'font-bold text-success' : r === e ? 'text-ink' : 'text-muted'}`}>= {fmt(b, r)}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">exponent</span>
          <input type="range" min={-2} max={4} value={e} onChange={(e2) => setE(Number(e2.target.value))} className="w-2/3 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{e}</span>
        </label>
      </div>

      <p className="mt-2 text-center text-xs text-muted">
        Each step down divides by {b}. That's why {b}⁰ = 1, and why {b}⁻ⁿ means 1 ÷ {b}ⁿ.
      </p>
    </div>
  )
}

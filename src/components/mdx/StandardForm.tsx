import { useState } from 'react'
import { toSuperscript } from '#/lib/math'

// Standard form (scientific notation): a × 10ⁿ, with 1 ≤ a < 10. The exponent
// counts how far the decimal point moves. Used in standard-form.
export function StandardForm() {
  const [mant, setMant] = useState(6)
  const [exp, setExp] = useState(8)
  const value = mant * Math.pow(10, exp)
  const ordinary = value.toLocaleString('en-US', {
    maximumFractionDigits: Math.max(0, -exp + 1),
    minimumFractionDigits: 0,
    useGrouping: true,
  })

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="rounded-xl bg-surface-2 py-5 text-center">
        <div className="font-mono text-3xl font-bold text-accent">
          {mant.toFixed(1)} × 10{toSuperscript(exp)}
        </div>
        <div className="mt-2 text-sm text-muted">ordinary form</div>
        <div className="font-mono text-xl text-ink">{ordinary}</div>
      </div>

      <div className="mt-3 space-y-2 px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">number part (1 ≤ a &lt; 10)</span>
          <input type="range" min={1} max={9.9} step={0.1} value={mant} onChange={(e) => setMant(Number(e.target.value))} className="w-1/2 accent-accent" />
          <span className="w-10 text-right font-mono text-ink">{mant.toFixed(1)}</span>
        </label>
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">power of ten</span>
          <input type="range" min={-9} max={12} step={1} value={exp} onChange={(e) => setExp(Number(e.target.value))} className="w-1/2 accent-accent" />
          <span className="w-10 text-right font-mono text-ink">{exp}</span>
        </label>
      </div>

      <p className="mt-2 text-center text-xs text-muted">
        The power {exp >= 0 ? `moves the decimal point ${exp} places right (big number)` : `moves it ${-exp} places left (tiny number)`}. Standard form keeps huge and minute numbers readable.
      </p>
    </div>
  )
}

import { useState } from 'react'

// An equation is a balance. 2x + 3 = 11 holds only for the value of x that keeps
// the beam level. Slide x and watch the heavier side dip — the solution is where
// it settles flat. Used in the-idea-of-an-equation and the deep-dive.
export function BalanceScale() {
  const a = 2
  const b = 3
  const c = 11
  const [x, setX] = useState(1)
  const lhs = a * x + b
  const rhs = c
  const tilt = Math.max(-15, Math.min(15, (lhs - rhs) * 2.2))
  const balanced = lhs === rhs

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-1 text-center font-mono text-lg text-ink">
        {a}x + {b} = {c}
      </div>
      <svg viewBox="0 0 360 180" className="mx-auto w-full max-w-sm">
        {/* stand */}
        <line x1="180" y1="60" x2="180" y2="150" stroke="var(--color-muted)" strokeWidth="3" />
        <polygon points="160,150 200,150 180,120" fill="var(--color-muted)" />
        {/* beam group rotates about pivot (180,60) */}
        <g transform={`rotate(${tilt} 180 60)`}>
          <line x1="50" y1="60" x2="310" y2="60" stroke="var(--color-ink)" strokeWidth="4" strokeLinecap="round" />
          {/* left pan */}
          <line x1="80" y1="60" x2="80" y2="88" stroke="var(--color-border)" strokeWidth="1.5" />
          <rect x="44" y="88" width="72" height="34" rx="6" fill="var(--color-accent)" fillOpacity="0.18" stroke="var(--color-accent)" />
          <text x="80" y="103" textAnchor="middle" fontSize="11" fill="var(--color-accent)">{a}x + {b}</text>
          <text x="80" y="116" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--color-ink)">= {lhs}</text>
          {/* right pan */}
          <line x1="280" y1="60" x2="280" y2="88" stroke="var(--color-border)" strokeWidth="1.5" />
          <rect x="244" y="88" width="72" height="34" rx="6" fill="var(--color-accent-2)" fillOpacity="0.18" stroke="var(--color-accent-2)" />
          <text x="280" y="109" textAnchor="middle" fontSize="14" fontWeight="700" fill="var(--color-ink)">{rhs}</text>
        </g>
      </svg>

      <div className="px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">x =</span>
          <input type="range" min={0} max={8} value={x} onChange={(e) => setX(Number(e.target.value))} className="w-2/3 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{x}</span>
        </label>
      </div>

      <p className="mt-2 text-center text-sm">
        {balanced ? (
          <span className="font-semibold text-success">Balanced! x = {x} is the solution.</span>
        ) : (
          <span className="text-muted">{lhs > rhs ? 'Left side too heavy' : 'Right side too heavy'} — keep adjusting x.</span>
        )}
      </p>
    </div>
  )
}

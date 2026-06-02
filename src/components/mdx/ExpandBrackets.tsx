import { useState } from 'react'

// The area model of the distributive law: a(b + c). One rectangle, height a,
// split into widths b and c, has area ab + ac. Multiplying out a bracket is
// just adding up the pieces. Used in expanding-brackets and factorising.
export function ExpandBrackets() {
  const [a, setA] = useState(3)
  const [b, setB] = useState(4)
  const [c, setC] = useState(2)
  const unit = 26
  const hb = b * unit
  const hc = c * unit
  const H = a * unit

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex justify-center">
        <svg viewBox={`0 0 ${hb + hc + 60} ${H + 50}`} className="max-w-full" style={{ width: hb + hc + 60 }}>
          {/* height bracket */}
          <text x={14} y={H / 2 + 26} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--color-accent)">{a}</text>
          {/* two regions */}
          <rect x={30} y={20} width={hb} height={H} fill="var(--color-accent)" fillOpacity="0.2" stroke="var(--color-accent)" />
          <rect x={30 + hb} y={20} width={hc} height={H} fill="var(--color-accent-2)" fillOpacity="0.2" stroke="var(--color-accent-2)" />
          <text x={30 + hb / 2} y={20 + H / 2 + 4} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--color-accent)">{a * b}</text>
          <text x={30 + hb + hc / 2} y={20 + H / 2 + 4} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--color-accent-2)">{a * c}</text>
          {/* width labels */}
          <text x={30 + hb / 2} y={14} textAnchor="middle" fontSize="11" fill="var(--color-muted)">{b}</text>
          <text x={30 + hb + hc / 2} y={14} textAnchor="middle" fontSize="11" fill="var(--color-muted)">{c}</text>
        </svg>
      </div>

      <div className="mt-2 space-y-2 px-1">
        {[['a (outside)', a, setA, 'var(--color-accent)'], ['b', b, setB, ''], ['c', c, setC, '']].map(([lab, val, set]) => (
          <label key={lab as string} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-muted">{lab as string}</span>
            <input type="range" min={1} max={6} value={val as number} onChange={(e) => (set as (n: number) => void)(Number(e.target.value))} className="w-2/3 accent-accent" />
            <span className="w-6 text-right font-mono text-ink">{val as number}</span>
          </label>
        ))}
      </div>

      <p className="mt-2 text-center font-mono text-sm">
        {a}({b} + {c}) = {a}×{b} + {a}×{c} = {a * b} + {a * c} = <span className="font-bold text-success">{a * (b + c)}</span>
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        With a letter inside it's the same: {a}(x + {c}) = {a}x + {a * c}. Multiply the outside by <em>each</em> term inside.
      </p>
    </div>
  )
}

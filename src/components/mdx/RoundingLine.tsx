import { useState } from 'react'

// Rounding visualiser. Slide a value and see it sit between the two nearest
// "round" numbers, with the midpoint marked. Whichever side it lands on is the
// rounded answer — and landing exactly on the midpoint is the "round half up"
// rule. Choose what you're rounding to.
const MODES = [
  { key: 'ten', label: 'Nearest 10', unit: 10 },
  { key: 'one', label: 'Nearest whole', unit: 1 },
  { key: 'tenth', label: 'Nearest 0.1', unit: 0.1 },
]

export function RoundingLine() {
  const [mode, setMode] = useState(0)
  const [value, setValue] = useState(34)
  const unit = MODES[mode].unit

  const lower = Math.floor(value / unit) * unit
  const upper = lower + unit
  const mid = (lower + upper) / 2
  const rounded = value >= mid ? upper : lower

  const W = 560
  const PAD = 50
  const x = (v: number) => PAD + ((v - lower) / unit) * (W - 2 * PAD)
  const fmt = (n: number) => +n.toFixed(2)

  // sensible slider bounds & step for each mode
  const sMin = mode === 0 ? 0 : mode === 1 ? 0 : 0
  const sMax = mode === 0 ? 100 : mode === 1 ? 20 : 5
  const sStep = mode === 0 ? 1 : mode === 1 ? 0.1 : 0.01

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex justify-center gap-2">
        {MODES.map((m, i) => (
          <button
            key={m.key}
            onClick={() => setMode(i)}
            className={`rounded-lg border px-2.5 py-1 text-xs transition ${
              i === mode ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} 110`} className="w-full">
        <line x1={x(lower)} y1={60} x2={x(upper)} y2={60} stroke="var(--color-muted)" strokeWidth="2" />
        {/* midpoint */}
        <line x1={x(mid)} y1={48} x2={x(mid)} y2={72} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="3 3" />
        <text x={x(mid)} y={90} textAnchor="middle" fontSize="9" fill="var(--color-muted)">midpoint {fmt(mid)}</text>

        {/* endpoints */}
        {[lower, upper].map((v) => (
          <g key={v}>
            <circle cx={x(v)} cy={60} r={rounded === v ? 7 : 5} fill={rounded === v ? 'var(--color-success)' : 'var(--color-border)'} />
            <text x={x(v)} y={38} textAnchor="middle" fontSize="13" fontWeight="700" fill={rounded === v ? 'var(--color-success)' : 'var(--color-muted)'}>{fmt(v)}</text>
          </g>
        ))}

        {/* the value */}
        <line x1={x(value)} y1={56} x2={x(value)} y2={64} stroke="var(--color-accent)" strokeWidth="2" />
        <polygon points={`${x(value)},52 ${x(value) - 5},44 ${x(value) + 5},44`} fill="var(--color-accent)" />
        <text x={x(value)} y={106} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--color-accent)">{fmt(value)}</text>
      </svg>

      <div className="px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">Value</span>
          <input type="range" min={sMin} max={sMax} step={sStep} value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-2/3 accent-accent" />
          <span className="w-14 text-right font-mono text-ink">{fmt(value)}</span>
        </label>
      </div>

      <p className="mt-2 text-center text-sm">
        <span className="font-mono text-ink">{fmt(value)}</span>
        <span className="text-muted"> rounds to </span>
        <span className="font-mono font-semibold text-success">{fmt(rounded)}</span>
        <span className="text-muted"> ({MODES[mode].label.toLowerCase()}).</span>
      </p>
    </div>
  )
}

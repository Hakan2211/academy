import { useState } from 'react'

// Inequalities as regions of the number line. The circle is open (<, >) or
// filled (≤, ≥); the shaded ray shows every value that works — not one answer
// but infinitely many. Used in inequalities.
const OPS = ['>', '≥', '<', '≤'] as const

export function InequalityLine() {
  const [op, setOp] = useState<(typeof OPS)[number]>('>')
  const [a, setA] = useState(2)
  const min = -6
  const max = 6
  const W = 540
  const PAD = 28
  const x = (v: number) => PAD + ((v - min) / (max - min)) * (W - 2 * PAD)
  const filled = op === '≥' || op === '≤'
  const right = op === '>' || op === '≥'

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex justify-center gap-2">
        {OPS.map((o) => (
          <button key={o} onClick={() => setOp(o)} className={`h-9 w-10 rounded-lg border font-mono text-lg transition ${o === op ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>{o}</button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} 80`} className="w-full">
        <line x1={PAD} y1={45} x2={W - PAD} y2={45} stroke="var(--color-muted)" strokeWidth="2" />
        {/* shaded ray */}
        <line x1={x(a)} y1={45} x2={right ? W - PAD : PAD} y2={45} stroke="var(--color-accent)" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
        <polygon points={right ? `${W - PAD},45 ${W - PAD - 10},39 ${W - PAD - 10},51` : `${PAD},45 ${PAD + 10},39 ${PAD + 10},51`} fill="var(--color-accent)" />
        {/* ticks */}
        {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((t) => (
          <g key={t}>
            <line x1={x(t)} y1={41} x2={x(t)} y2={49} stroke="var(--color-border)" />
            <text x={x(t)} y={66} textAnchor="middle" fontSize="10" fill="var(--color-muted)">{t}</text>
          </g>
        ))}
        {/* boundary circle */}
        <circle cx={x(a)} cy={45} r="7" fill={filled ? 'var(--color-accent)' : 'var(--color-surface)'} stroke="var(--color-accent)" strokeWidth="2.5" />
      </svg>

      <div className="px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">boundary</span>
          <input type="range" min={min + 1} max={max - 1} value={a} onChange={(e) => setA(Number(e.target.value))} className="w-2/3 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{a}</span>
        </label>
      </div>

      <p className="mt-2 text-center text-sm">
        <span className="font-mono text-lg text-ink">x {op} {a}</span>
        <span className="ml-2 text-muted">
          — {filled ? `${a} is included (filled circle)` : `${a} is excluded (open circle)`}; the ray is the whole solution set.
        </span>
      </p>
    </div>
  )
}

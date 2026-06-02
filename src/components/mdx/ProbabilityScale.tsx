import { useState } from 'react'
import { simplifyFrac } from '#/lib/math'

// The probability scale from 0 (impossible) to 1 (certain). Slide an event and
// see where it sits and what we'd call it. Used in the-probability-scale.
export function ProbabilityScale() {
  const [p, setP] = useState(0.5)
  const word = p === 0 ? 'impossible' : p < 0.5 ? 'unlikely' : p === 0.5 ? 'even chance' : p < 1 ? 'likely' : 'certain'
  const frac = simplifyFrac({ n: Math.round(p * 20), d: 20 })

  const W = 540
  const PAD = 24
  const x = (v: number) => PAD + v * (W - 2 * PAD)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox={`0 0 ${W} 70`} className="w-full">
        <defs>
          <linearGradient id="probgrad" x1="0" x2="1">
            <stop offset="0" stopColor="var(--color-accent-2)" />
            <stop offset="1" stopColor="var(--color-accent)" />
          </linearGradient>
        </defs>
        <rect x={PAD} y={30} width={W - 2 * PAD} height={10} rx={5} fill="url(#probgrad)" opacity="0.5" />
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <g key={t}>
            <line x1={x(t)} y1={26} x2={x(t)} y2={44} stroke="var(--color-muted)" strokeWidth="1" />
            <text x={x(t)} y={58} textAnchor="middle" fontSize="10" fill="var(--color-muted)">{t}</text>
          </g>
        ))}
        <circle cx={x(p)} cy={35} r="8" fill="var(--color-accent)" stroke="#fff" strokeWidth="2" />
      </svg>

      <div className="px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">probability</span>
          <input type="range" min={0} max={1} step={0.05} value={p} onChange={(e) => setP(Number(e.target.value))} className="w-2/3 accent-accent" />
          <span className="w-12 text-right font-mono text-ink">{p.toFixed(2)}</span>
        </label>
      </div>

      <p className="mt-2 text-center text-sm">
        <span className="font-semibold text-accent capitalize">{word}</span>
        <span className="text-muted"> — P = {p.toFixed(2)} = {(p * 100).toFixed(0)}% = {frac.n}/{frac.d}</span>
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        Every probability lives between 0 (can't happen) and 1 (sure to happen). Nothing is ever below 0 or above 1.
      </p>
    </div>
  )
}

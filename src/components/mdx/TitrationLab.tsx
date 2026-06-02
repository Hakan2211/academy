import { useState } from 'react'

// Titration finds an unknown concentration by adding a measured base to an acid
// until exactly neutralised. The pH barely moves at first, then leaps through
// neutral at the equivalence point — where an indicator flips colour.
const EQUIV = 25 // mL of base needed to neutralise

function phAt(v: number): number {
  // smooth strong-acid / strong-base curve, steep at the equivalence point
  return 1 + 12 / (1 + Math.exp(-(v - EQUIV) * 0.7))
}

const G = { x0: 44, x1: 286, y0: 14, y1: 120 }

export function TitrationLab() {
  const [v, setV] = useState(10)
  const ph = phAt(v)
  const pink = ph >= 8.2 // phenolphthalein turns pink in base

  const toX = (vol: number) => G.x0 + (vol / 50) * (G.x1 - G.x0)
  const toY = (p: number) => G.y1 - (p / 14) * (G.y1 - G.y0)
  const pts: Array<string> = []
  for (let i = 0; i <= 50; i += 1) pts.push(`${toX(i).toFixed(1)},${toY(phAt(i)).toFixed(1)}`)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="flex gap-3">
        <svg viewBox="0 0 70 150" className="w-16 shrink-0">
          {/* burette + flask */}
          <rect x={30} y={4} width={8} height={50} fill="#5DADE2" opacity={0.4} stroke="var(--color-muted)" strokeWidth={1} />
          <circle cx={34} cy={62} r={2} fill="#5DADE2" />
          <path d="M 18 90 L 50 90 L 44 140 L 24 140 Z" fill={pink ? '#FF6BAA' : '#ECEFF4'} opacity={pink ? 0.8 : 0.35} stroke="var(--color-muted)" strokeWidth={1.5} />
        </svg>

        <svg viewBox="0 0 300 134" className="w-full">
          <line x1={G.x0} y1={G.y0} x2={G.x0} y2={G.y1} stroke="var(--color-border)" strokeWidth={1.5} />
          <line x1={G.x0} y1={G.y1} x2={G.x1} y2={G.y1} stroke="var(--color-border)" strokeWidth={1.5} />
          <text x={8} y={66} className="fill-muted text-[9px]" transform="rotate(-90 12 66)">pH</text>
          <text x={G.x1} y={131} textAnchor="end" className="fill-muted text-[9px]">base added (mL)</text>
          {/* neutral line + equivalence marker */}
          <line x1={G.x0} y1={toY(7)} x2={G.x1} y2={toY(7)} stroke="var(--color-border)" strokeWidth={0.75} strokeDasharray="2 3" />
          <line x1={toX(EQUIV)} y1={G.y0} x2={toX(EQUIV)} y2={G.y1} stroke="#2ECC71" strokeWidth={0.75} strokeDasharray="2 3" />
          <text x={toX(EQUIV)} y={12} textAnchor="middle" className="fill-[#2ECC71] text-[8px]">equivalence</text>
          <polyline points={pts.join(' ')} fill="none" stroke="#9B59B6" strokeWidth={2.5} />
          <circle cx={toX(v)} cy={toY(ph)} r={6} fill="#F1C40F" stroke="#fff" strokeWidth={1.5} />
        </svg>
      </div>

      <p className="my-2 text-center text-sm text-muted">
        Added <span className="font-mono text-ink">{v.toFixed(0)} mL</span> → pH{' '}
        <span className="font-mono text-ink">{ph.toFixed(1)}</span>.{' '}
        {Math.abs(v - EQUIV) < 2
          ? 'At the equivalence point the pH leaps — the indicator flips colour here.'
          : v < EQUIV
            ? 'Still acidic — the base is being neutralised by excess acid.'
            : 'Now basic — all the acid is used up and extra base remains.'}
      </p>

      <label className="flex flex-col gap-1 text-sm">
        <span className="flex items-center justify-between text-muted">
          <span>Base added</span>
          <span className="font-mono text-ink">{v.toFixed(0)} mL</span>
        </span>
        <input type="range" min={0} max={50} step={1} value={v} onChange={(e) => setV(Number(e.target.value))} className="accent-accent" />
      </label>
    </div>
  )
}

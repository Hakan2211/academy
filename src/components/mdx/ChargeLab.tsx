import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { cn } from '#/lib/cn'

const POS = '#e17055'
const NEG = '#0984e3'
const Y = 120

// Two charges, one rule. Like charges (both +) shove each other apart; opposite
// charges (+ and −) pull together. And the force isn't fixed: slide them closer
// and it grows fast — Coulomb's law says it scales with 1 / distance². The
// arrows show which way each charge is pushed and how hard.
export function ChargeLab() {
  const [rightPositive, setRightPositive] = useState(false)
  const [d, setD] = useState(150)

  const xL = 90
  const xR = xL + d
  const repel = rightPositive // both positive → repel
  const rel = Math.pow(110 / d, 2) // relative force, 1 at d = 110
  const len = Math.max(10, Math.min(78, rel * 42))

  // arrow from charge center outward (repel) or inward (attract)
  const arrow = (cx: number, side: 'L' | 'R') => {
    const outward = side === 'L' ? -1 : 1
    const dir = repel ? outward : -outward
    const x0 = cx + dir * 24
    const x1 = x0 + dir * len
    return (
      <g stroke="var(--color-ink)" strokeWidth="3" fill="none">
        <line x1={x0} y1={Y} x2={x1} y2={Y} />
        <path d={`M ${x1 - dir * 9} ${Y - 6} L ${x1} ${Y} L ${x1 - dir * 9} ${Y + 6}`} />
      </g>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        <span className="self-center text-sm text-muted">Right charge:</span>
        {([['positive (+)', true], ['negative (−)', false]] as Array<[string, boolean]>).map(
          ([label, val]) => (
            <button
              key={label}
              type="button"
              onClick={() => setRightPositive(val)}
              className={cn(
                'rounded-full border px-3 py-1 text-sm transition-colors',
                rightPositive === val
                  ? 'border-accent bg-accent/15 text-accent'
                  : 'border-border text-muted hover:text-ink',
              )}
            >
              {label}
            </button>
          ),
        )}
      </div>

      <svg viewBox="0 0 360 200" className="w-full">
        {arrow(xL, 'L')}
        {arrow(xR, 'R')}

        {/* left charge: always positive */}
        <circle cx={xL} cy={Y} r="22" fill={POS} />
        <text x={xL} y={Y + 7} fill="#fff" fontSize="24" fontWeight="700" textAnchor="middle">+</text>

        {/* right charge */}
        <circle cx={xR} cy={Y} r="22" fill={rightPositive ? POS : NEG} />
        <text x={xR} y={Y + 7} fill="#fff" fontSize="24" fontWeight="700" textAnchor="middle">
          {rightPositive ? '+' : '−'}
        </text>

        <text x="180" y="40" fill="var(--color-ink)" fontSize="15" fontWeight="600" textAnchor="middle">
          {repel ? 'Like charges repel' : 'Opposite charges attract'}
        </text>
        <text x="180" y="60" fill="var(--color-muted)" fontSize="12" textAnchor="middle">
          relative force ≈ {rel.toFixed(2)} × (∝ 1 / distance²)
        </text>
      </svg>

      <div className="px-4 pb-4">
        <SceneSlider label="Distance apart" value={d} min={70} max={210} step={5} unit="px" onChange={setD} />
        <p className="mt-2 text-center text-xs text-muted">
          Halve the distance and the force quadruples. That steep 1/d² falloff is Coulomb's law.
        </p>
      </div>
    </div>
  )
}

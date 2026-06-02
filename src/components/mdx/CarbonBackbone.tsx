import { useState } from 'react'
import { cn } from '#/lib/cn'

// Why carbon is the backbone of life. Carbon forms exactly FOUR bonds, so it can
// build chains, rings, and branches of endless variety — the scaffolding every
// biological molecule is built on. Toggle the shapes.
type Shape = 'methane' | 'chain' | 'ring' | 'branched'

const INFO: Record<Shape, string> = {
  methane: 'The simplest: one carbon bonded to four hydrogens. Carbon always makes exactly four bonds.',
  chain: 'Carbons bond to each other in long chains — the backbone of fats and sugars.',
  ring: 'Chains can close into rings, like the glucose ring at the heart of carbohydrates.',
  branched: 'Chains branch and join, giving carbon almost unlimited ways to build complex molecules.',
}

// each carbon as [x,y]; bonds drawn between them; H's fill remaining bonds
const LAYOUTS: Record<Shape, { carbons: Array<[number, number]>; bonds: Array<[number, number]> }> = {
  methane: { carbons: [[180, 70]], bonds: [] },
  chain: { carbons: [[80, 70], [130, 55], [180, 70], [230, 55], [280, 70]], bonds: [[0, 1], [1, 2], [2, 3], [3, 4]] },
  ring: { carbons: [[180, 35], [222, 55], [222, 95], [180, 115], [138, 95], [138, 55]], bonds: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]] },
  branched: { carbons: [[90, 75], [140, 60], [190, 75], [190, 30], [240, 60], [290, 75]], bonds: [[0, 1], [1, 2], [2, 3], [2, 4], [4, 5]] },
}

export function CarbonBackbone() {
  const [shape, setShape] = useState<Shape>('chain')
  const { carbons, bonds } = LAYOUTS[shape]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {(Object.keys(INFO) as Array<Shape>).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setShape(s)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm capitalize transition-colors',
              shape === s ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 360 150" className="w-full">
        {/* bonds between carbons */}
        {bonds.map(([a, b], i) => (
          <line key={i} x1={carbons[a][0]} y1={carbons[a][1]} x2={carbons[b][0]} y2={carbons[b][1]} stroke="#94a3b8" strokeWidth={3} />
        ))}
        {/* hydrogens on methane */}
        {shape === 'methane' &&
          [[140, 40], [220, 40], [140, 100], [220, 100]].map(([x, y], i) => (
            <g key={i}>
              <line x1={180} y1={70} x2={x} y2={y} stroke="#94a3b8" strokeWidth={2} />
              <circle cx={x} cy={y} r={9} fill="#e2e8f0" />
              <text x={x} y={y + 3} textAnchor="middle" className="fill-[#334155] text-[9px] font-bold">H</text>
            </g>
          ))}
        {/* carbons */}
        {carbons.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={13} fill="#1f2937" stroke="#4FD1C5" strokeWidth={2.5} />
            <text x={x} y={y + 4} textAnchor="middle" className="fill-white text-[11px] font-bold">C</text>
          </g>
        ))}
      </svg>

      <p className="mt-2 rounded-lg bg-surface-2 px-3 py-2 text-center text-sm text-muted">{INFO[shape]}</p>
    </div>
  )
}

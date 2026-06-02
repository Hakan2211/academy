import { useState } from 'react'
import { cn } from '#/lib/cn'

// Isomers share a molecular formula but differ in how the atoms are connected —
// and that different structure gives different properties. Toggle between
// isomers of the same formula.
type Iso = { name: string; bp: string; nodes: Array<{ x: number; y: number }>; bonds: Array<[number, number]> }
type Set = { formula: string; isomers: Array<Iso> }

const SETS: Record<string, Set> = {
  c4: {
    formula: 'C₄H₁₀',
    isomers: [
      {
        name: 'n-butane (straight chain)',
        bp: 'boils at −1 °C',
        nodes: [{ x: 60, y: 70 }, { x: 120, y: 70 }, { x: 180, y: 70 }, { x: 240, y: 70 }],
        bonds: [[0, 1], [1, 2], [2, 3]],
      },
      {
        name: 'isobutane (branched)',
        bp: 'boils at −12 °C',
        nodes: [{ x: 90, y: 70 }, { x: 150, y: 70 }, { x: 210, y: 70 }, { x: 150, y: 25 }],
        bonds: [[0, 1], [1, 2], [1, 3]],
      },
    ],
  },
  c5: {
    formula: 'C₅H₁₂',
    isomers: [
      {
        name: 'n-pentane (straight)',
        bp: 'boils at 36 °C',
        nodes: [{ x: 40, y: 70 }, { x: 95, y: 70 }, { x: 150, y: 70 }, { x: 205, y: 70 }, { x: 260, y: 70 }],
        bonds: [[0, 1], [1, 2], [2, 3], [3, 4]],
      },
      {
        name: 'neopentane (highly branched)',
        bp: 'boils at 9 °C',
        nodes: [{ x: 150, y: 70 }, { x: 95, y: 70 }, { x: 205, y: 70 }, { x: 150, y: 25 }, { x: 150, y: 110 }],
        bonds: [[0, 1], [0, 2], [0, 3], [0, 4]],
      },
    ],
  },
}

export function IsomerViewer() {
  const [setKey, setSetKey] = useState('c4')
  const [idx, setIdx] = useState(0)
  const set = SETS[setKey]
  const iso = set.isomers[idx]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {Object.entries(SETS).map(([k, s]) => (
          <button
            key={k}
            type="button"
            onClick={() => {
              setSetKey(k)
              setIdx(0)
            }}
            className={cn('rounded-full border px-3 py-1 font-mono text-sm transition-colors', setKey === k ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}
          >
            {s.formula}
          </button>
        ))}
        <span className="ml-auto text-sm text-muted">same formula, different shape →</span>
      </div>

      <svg viewBox="0 0 300 130" className="w-full">
        {iso.bonds.map(([a, b], i) => (
          <line key={i} x1={iso.nodes[a].x} y1={iso.nodes[a].y} x2={iso.nodes[b].x} y2={iso.nodes[b].y} stroke="var(--color-ink)" strokeWidth={2.5} />
        ))}
        {iso.nodes.map((node, i) => (
          <g key={i}>
            <circle cx={node.x} cy={node.y} r={14} fill="#34404F" />
            <text x={node.x} y={node.y + 4} textAnchor="middle" className="fill-white text-[10px] font-bold">C</text>
          </g>
        ))}
      </svg>

      <p className="text-center text-sm">
        <span className="font-semibold text-ink">{iso.name}</span>{' '}
        <span className="text-muted">— {iso.bp}</span>
      </p>

      <div className="mt-2 flex justify-center gap-2">
        {set.isomers.map((_s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIdx(i)}
            className={cn('rounded-full border px-3 py-1 text-xs transition-colors', idx === i ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}
          >
            Isomer {i + 1}
          </button>
        ))}
      </div>
      <p className="mt-2 text-center text-xs text-muted">Both have the formula {set.formula}, yet their different shapes give different boiling points.</p>
    </div>
  )
}

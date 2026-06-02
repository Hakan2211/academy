import { useState } from 'react'
import { cn } from '#/lib/cn'

// Lewis structures map every valence electron: lines are shared (bonding)
// pairs, dots are lone pairs. They reveal how each atom reaches an octet and
// set up the molecule's 3D shape.
type Atom = { sym: string; x: number; y: number; color: string; lone: Array<number> }
type Bond = { a: number; b: number; order: 1 | 2 | 3 }
type Mol = { key: string; label: string; formula: string; atoms: Array<Atom>; bonds: Array<Bond>; note: string }

const R = '#E74C3C'
const W = '#ECEFF4'
const B = '#5DADE2'
const G = '#7F8C8D'

const MOLS: Array<Mol> = [
  {
    key: 'h2o', label: 'Water', formula: 'H₂O', note: 'Oxygen shares one pair with each H and keeps 2 lone pairs — eight electrons in all.',
    atoms: [
      { sym: 'O', x: 130, y: 80, color: R, lone: [-90, 0] },
      { sym: 'H', x: 75, y: 80, color: W, lone: [] },
      { sym: 'H', x: 185, y: 80, color: W, lone: [] },
    ],
    bonds: [{ a: 0, b: 1, order: 1 }, { a: 0, b: 2, order: 1 }],
  },
  {
    key: 'co2', label: 'Carbon dioxide', formula: 'CO₂', note: 'Carbon forms a double bond to each oxygen. Each O carries 2 lone pairs.',
    atoms: [
      { sym: 'C', x: 130, y: 80, color: G, lone: [] },
      { sym: 'O', x: 60, y: 80, color: R, lone: [90, -90] },
      { sym: 'O', x: 200, y: 80, color: R, lone: [90, -90] },
    ],
    bonds: [{ a: 0, b: 1, order: 2 }, { a: 0, b: 2, order: 2 }],
  },
  {
    key: 'nh3', label: 'Ammonia', formula: 'NH₃', note: 'Nitrogen bonds to 3 hydrogens and keeps 1 lone pair on top — that pair pushes the shape into a pyramid.',
    atoms: [
      { sym: 'N', x: 130, y: 85, color: B, lone: [-90] },
      { sym: 'H', x: 70, y: 120, color: W, lone: [] },
      { sym: 'H', x: 130, y: 130, color: W, lone: [] },
      { sym: 'H', x: 190, y: 120, color: W, lone: [] },
    ],
    bonds: [{ a: 0, b: 1, order: 1 }, { a: 0, b: 2, order: 1 }, { a: 0, b: 3, order: 1 }],
  },
  {
    key: 'ch4', label: 'Methane', formula: 'CH₄', note: 'Carbon shares all 4 valence electrons — 4 single bonds, no lone pairs. A perfect octet.',
    atoms: [
      { sym: 'C', x: 130, y: 80, color: G, lone: [] },
      { sym: 'H', x: 130, y: 28, color: W, lone: [] },
      { sym: 'H', x: 130, y: 132, color: W, lone: [] },
      { sym: 'H', x: 66, y: 80, color: W, lone: [] },
      { sym: 'H', x: 194, y: 80, color: W, lone: [] },
    ],
    bonds: [{ a: 0, b: 1, order: 1 }, { a: 0, b: 2, order: 1 }, { a: 0, b: 3, order: 1 }, { a: 0, b: 4, order: 1 }],
  },
  {
    key: 'n2', label: 'Nitrogen', formula: 'N₂', note: 'A triple bond (3 shared pairs) plus one lone pair on each N. Very strong, very stable.',
    atoms: [
      { sym: 'N', x: 95, y: 80, color: B, lone: [180] },
      { sym: 'N', x: 195, y: 80, color: B, lone: [0] },
    ],
    bonds: [{ a: 0, b: 1, order: 3 }],
  },
]

function bondLines(a: Atom, b: Atom, order: number) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy)
  const px = -dy / len
  const py = dx / len
  const offs = order === 1 ? [0] : order === 2 ? [-3.5, 3.5] : [-5, 0, 5]
  // shorten ends so lines don't poke into the atom labels
  const t = 20
  const ax = a.x + (dx / len) * t
  const ay = a.y + (dy / len) * t
  const bx = b.x - (dx / len) * t
  const by = b.y - (dy / len) * t
  return offs.map((o) => ({ x1: ax + px * o, y1: ay + py * o, x2: bx + px * o, y2: by + py * o }))
}

export function LewisBuilder() {
  const [key, setKey] = useState('h2o')
  const m = MOLS.find((x) => x.key === key) ?? MOLS[0]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {MOLS.map((x) => (
          <button
            key={x.key}
            type="button"
            onClick={() => setKey(x.key)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              key === x.key ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {x.formula}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 260 160" className="mx-auto w-full max-w-[360px]">
        {m.bonds.map((bd, i) =>
          bondLines(m.atoms[bd.a], m.atoms[bd.b], bd.order).map((l, j) => (
            <line key={`${i}-${j}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="var(--color-ink)" strokeWidth={2} />
          )),
        )}
        {m.atoms.map((at, i) => (
          <g key={i}>
            {at.lone.map((ang, j) => {
              const rad = (ang * Math.PI) / 180
              const cx = at.x + 24 * Math.cos(rad)
              const cy = at.y + 24 * Math.sin(rad)
              const px = -Math.sin(rad) * 5
              const py = Math.cos(rad) * 5
              return (
                <g key={j}>
                  <circle cx={cx + px} cy={cy + py} r={2.4} fill="#F1C40F" />
                  <circle cx={cx - px} cy={cy - py} r={2.4} fill="#F1C40F" />
                </g>
              )
            })}
            <circle cx={at.x} cy={at.y} r={16} fill={at.color} />
            <text x={at.x} y={at.y + 4} textAnchor="middle" className="fill-[#10141f] text-[12px] font-bold">{at.sym}</text>
          </g>
        ))}
      </svg>

      <p className="mt-2 min-h-[2.5rem] text-center text-sm text-muted">{m.note}</p>
    </div>
  )
}

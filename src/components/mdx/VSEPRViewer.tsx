import { useState } from 'react'
import { cn } from '#/lib/cn'

// VSEPR: electron pairs around a central atom repel and spread as far apart as
// possible — that geometry is the molecule's shape. Lone pairs push harder than
// bonds, squeezing the angles.
type Shape = {
  key: string
  name: string
  example: string
  angle: string
  // bond directions in degrees (0 = right, measured clockwise from +x in SVG)
  bonds: Array<number>
  lone: Array<number>
  note: string
}

const SHAPES: Array<Shape> = [
  {
    key: 'linear', name: 'Linear', example: 'CO₂', angle: '180°',
    bonds: [0, 180], lone: [],
    note: 'Two bonding regions push to opposite sides — a straight line.',
  },
  {
    key: 'trigonal', name: 'Trigonal planar', example: 'BF₃', angle: '120°',
    bonds: [-90, 30, 150], lone: [],
    note: 'Three bonding regions spread evenly in a flat triangle.',
  },
  {
    key: 'tetrahedral', name: 'Tetrahedral', example: 'CH₄', angle: '109.5°',
    bonds: [-90, 30, 150, 270], lone: [],
    note: 'Four bonds point to the corners of a tetrahedron — the classic 109.5° of carbon.',
  },
  {
    key: 'pyramidal', name: 'Trigonal pyramidal', example: 'NH₃', angle: '107°',
    bonds: [30, 150, 270], lone: [-90],
    note: 'Four pairs, but one is a lone pair. It pushes the three bonds down into a pyramid and squeezes the angle to ~107°.',
  },
  {
    key: 'bent', name: 'Bent', example: 'H₂O', angle: '104.5°',
    bonds: [60, 120], lone: [-60, -120],
    note: 'Two bonds and two lone pairs. The lone pairs crowd the bonds together, bending the molecule to ~104.5°.',
  },
]

export function VSEPRViewer() {
  const [key, setKey] = useState('tetrahedral')
  const s = SHAPES.find((x) => x.key === key) ?? SHAPES[0]
  const cx = 130
  const cy = 95
  const L = 60

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {SHAPES.map((x) => (
          <button
            key={x.key}
            type="button"
            onClick={() => setKey(x.key)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              key === x.key ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {x.name}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 260 180" className="mx-auto w-full max-w-[320px]">
        {/* lone pair clouds */}
        {s.lone.map((deg, i) => {
          const a = (deg * Math.PI) / 180
          return (
            <ellipse
              key={`l${i}`}
              cx={cx + 38 * Math.cos(a)}
              cy={cy + 38 * Math.sin(a)}
              rx={18}
              ry={12}
              fill="#F1C40F"
              opacity={0.25}
              transform={`rotate(${deg + 90} ${cx + 38 * Math.cos(a)} ${cy + 38 * Math.sin(a)})`}
            />
          )
        })}

        {/* bonds + outer atoms */}
        {s.bonds.map((deg, i) => {
          const a = (deg * Math.PI) / 180
          const ex = cx + L * Math.cos(a)
          const ey = cy + L * Math.sin(a)
          return (
            <g key={i}>
              <line x1={cx} y1={cy} x2={ex} y2={ey} stroke="var(--color-ink)" strokeWidth={2.5} />
              <circle cx={ex} cy={ey} r={13} fill="#4DABF7" />
            </g>
          )
        })}

        {/* central atom */}
        <circle cx={cx} cy={cy} r={17} fill="#E74C3C" />
        <text x={cx} y={cy + 4} textAnchor="middle" className="fill-white text-[11px] font-bold">A</text>
      </svg>

      <p className="text-center text-sm">
        <span className="font-semibold text-ink">{s.name}</span>{' '}
        <span className="text-muted">— e.g. {s.example}, bond angle {s.angle}</span>
      </p>
      <p className="mt-1 min-h-[2.5rem] text-center text-sm text-muted">{s.note}</p>
    </div>
  )
}

import { useState } from 'react'
import { cn } from '#/lib/cn'

// Physical change: the SAME molecules, just rearranged (melt, boil, dissolve) —
// reversible, no new substance. Chemical change: bonds break and re-form into
// NEW substances (burn, rust, cook). Pick an example, slide before → after.
type Example = {
  key: string
  label: string
  kind: 'physical' | 'chemical'
  before: string
  after: string
  explain: string
}

const EXAMPLES: Array<Example> = [
  {
    key: 'melt',
    label: 'Ice melting',
    kind: 'physical',
    before: 'Water molecules locked in a rigid lattice (solid ice).',
    after: 'The same water molecules, now loose and flowing (liquid).',
    explain: 'No new substance — the molecules are identical, only their arrangement changed. Re-freeze it and you get the ice back.',
  },
  {
    key: 'boil',
    label: 'Water boiling',
    kind: 'physical',
    before: 'Liquid water molecules close together.',
    after: 'The same molecules fly apart as vapour.',
    explain: 'Still just H₂O. Boiling spreads the molecules out; it does not change what they are. Cool the steam and it condenses back to water.',
  },
  {
    key: 'dissolve',
    label: 'Sugar dissolving',
    kind: 'physical',
    before: 'Sugar crystals sitting in water.',
    after: 'Sugar molecules spread evenly through the water.',
    explain: 'The sugar molecules are unchanged — just separated and mixed in. Evaporate the water and the sugar returns.',
  },
  {
    key: 'burn',
    label: 'Burning methane',
    kind: 'chemical',
    before: 'Methane (CH₄) and oxygen (O₂) molecules.',
    after: 'New molecules: carbon dioxide (CO₂) and water (H₂O).',
    explain: 'Bonds break and re-form into completely different substances, releasing energy. You cannot un-burn it — this is a chemical change.',
  },
  {
    key: 'rust',
    label: 'Iron rusting',
    kind: 'chemical',
    before: 'Iron atoms and oxygen molecules.',
    after: 'A new compound: iron oxide (rust).',
    explain: 'Iron reacts with oxygen to form a new substance with new properties. The shiny metal becomes flaky orange rust — irreversible.',
  },
]

function Dot({ x, y, c, r = 6 }: { x: number; y: number; c: string; r?: number }) {
  return <circle cx={x} cy={y} r={r} fill={c} />
}

// Each example draws a small before/after molecular scene, blended by t (0..1).
function Scene({ ex, t }: { ex: Example; t: number }) {
  const lerp = (a: number, b: number) => a + (b - a) * t
  const W = 320
  const H = 130
  const nodes: Array<{ x: number; y: number; c: string; r?: number }> = []

  if (ex.kind === 'physical') {
    // same molecules, spread out as t increases
    const cols = 6
    const rows = 3
    for (let r = 0; r < rows; r++) {
      for (let cI = 0; cI < cols; cI++) {
        const i = r * cols + cI
        const baseX = 60 + cI * 26
        const baseY = 35 + r * 26
        const sx = 30 + cI * 45 + (i % 2) * 8
        const sy = 25 + ((i * 37) % 80)
        const x = lerp(baseX, sx)
        const y = lerp(baseY, sy)
        // little water molecule (red O + 2 white H) for melt/boil, blue dot for dissolve
        if (ex.key === 'dissolve') {
          nodes.push({ x, y, c: i < 8 ? '#E056A0' : '#3498DB', r: 6 })
        } else {
          nodes.push({ x, y, c: '#3498DB', r: 6 })
        }
      }
    }
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <rect x={1} y={1} width={W - 2} height={H - 2} rx={12} fill="var(--color-surface-2)" stroke="var(--color-border)" />
      {ex.kind === 'physical' ? (
        nodes.map((n, i) => <Dot key={i} x={n.x} y={n.y} c={n.c} r={n.r} />)
      ) : (
        // chemical: reactant molecules (left, fade out) morph into products (right, fade in)
        <>
          <g opacity={1 - t}>
            {[0, 1, 2].map((i) => (
              <g key={i} transform={`translate(${50 + i * 34} ${50 + (i % 2) * 34})`}>
                <Dot x={0} y={0} c="#7F8C8D" r={9} />
                <Dot x={-9} y={-7} c="#ECF0F1" r={4} />
                <Dot x={9} y={-7} c="#ECF0F1" r={4} />
                <Dot x={-9} y={7} c="#ECF0F1" r={4} />
                <Dot x={9} y={7} c="#ECF0F1" r={4} />
              </g>
            ))}
            {[0, 1, 2].map((i) => (
              <g key={`o${i}`} transform={`translate(${160 + i * 30} ${40 + (i % 2) * 40})`}>
                <Dot x={-4} y={0} c="#E74C3C" r={6} />
                <Dot x={4} y={0} c="#E74C3C" r={6} />
              </g>
            ))}
          </g>
          <g opacity={t}>
            {[0, 1].map((i) => (
              <g key={`co2${i}`} transform={`translate(${70 + i * 60} 45)`}>
                <Dot x={-12} y={0} c="#E74C3C" r={6} />
                <Dot x={0} y={0} c="#2C3E50" r={8} />
                <Dot x={12} y={0} c="#E74C3C" r={6} />
              </g>
            ))}
            {[0, 1].map((i) => (
              <g key={`h2o${i}`} transform={`translate(${90 + i * 60} 92)`}>
                <Dot x={0} y={0} c="#E74C3C" r={7} />
                <Dot x={-7} y={6} c="#ECF0F1" r={4} />
                <Dot x={7} y={6} c="#ECF0F1" r={4} />
              </g>
            ))}
          </g>
        </>
      )}
    </svg>
  )
}

export function ChangeLab() {
  const [key, setKey] = useState(EXAMPLES[0].key)
  const [t, setT] = useState(0)
  const ex = EXAMPLES.find((e) => e.key === key) ?? EXAMPLES[0]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {EXAMPLES.map((e) => (
          <button
            key={e.key}
            type="button"
            onClick={() => {
              setKey(e.key)
              setT(0)
            }}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              key === e.key
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {e.label}
          </button>
        ))}
      </div>

      <div className="mb-2 flex items-center justify-between">
        <span
          className={cn(
            'rounded-full px-3 py-1 text-xs font-semibold',
            ex.kind === 'physical'
              ? 'bg-[#3498DB]/20 text-[#5DADE2]'
              : 'bg-[#E67E22]/20 text-[#E67E22]',
          )}
        >
          {ex.kind === 'physical' ? 'Physical change' : 'Chemical change'}
        </span>
        <span className="text-xs text-muted">{t < 0.5 ? 'Before' : 'After'}</span>
      </div>

      <Scene ex={ex} t={t} />

      <p className="mt-2 min-h-[2rem] text-center text-sm text-muted">
        {t < 0.5 ? ex.before : ex.after}
      </p>

      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={t}
        onChange={(e) => setT(Number(e.target.value))}
        className="mt-1 w-full accent-accent"
        aria-label="Before to after"
      />

      <p className="mt-3 rounded-lg bg-surface-2 p-3 text-sm text-muted">{ex.explain}</p>
    </div>
  )
}

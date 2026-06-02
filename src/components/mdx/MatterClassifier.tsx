import { useState } from 'react'
import { cn } from '#/lib/cn'

// Click a sample and follow it down the classification tree: is it pure or a
// mixture? An element or a compound? The particle box shows WHY — identical
// atoms, bonded molecules, or a jumble of more than one substance.
type Leaf = 'element' | 'compound' | 'homogeneous' | 'heterogeneous'

type Sample = {
  key: string
  label: string
  leaf: Leaf
  note: string
  // particle spec: list of {color, count, bonded?} kinds drawn in the box
  kinds: Array<{ color: string; n: number; pair?: boolean; trio?: boolean }>
  clumped?: boolean
}

const SAMPLES: Array<Sample> = [
  {
    key: 'copper',
    label: 'Copper',
    leaf: 'element',
    note: 'One kind of atom only — copper cannot be broken into anything simpler.',
    kinds: [{ color: '#E08A50', n: 26 }],
  },
  {
    key: 'oxygen',
    label: 'Oxygen gas',
    leaf: 'element',
    note: 'Still an element: every molecule is two oxygen atoms — one kind of atom.',
    kinds: [{ color: '#5DADE2', n: 14, pair: true }],
  },
  {
    key: 'water',
    label: 'Water',
    leaf: 'compound',
    note: 'A compound: two elements chemically bonded in a fixed ratio (H₂O).',
    kinds: [{ color: '#E74C3C', n: 12, trio: true }],
  },
  {
    key: 'salt',
    label: 'Table salt',
    leaf: 'compound',
    note: 'Sodium and chlorine locked together in a fixed 1:1 lattice — a compound.',
    kinds: [{ color: '#9B59B6', n: 13, pair: true }],
  },
  {
    key: 'saltwater',
    label: 'Salt water',
    leaf: 'homogeneous',
    note: 'A mixture, but evenly blended — every drop looks the same. Salt is dissolved in water.',
    kinds: [
      { color: '#3498DB', n: 18, trio: true },
      { color: '#F1C40F', n: 8 },
    ],
  },
  {
    key: 'air',
    label: 'Air',
    leaf: 'homogeneous',
    note: 'Several gases mixed uniformly — mostly nitrogen and oxygen molecules.',
    kinds: [
      { color: '#5DADE2', n: 14, pair: true },
      { color: '#48C9B0', n: 8, pair: true },
    ],
  },
  {
    key: 'sandiron',
    label: 'Sand + iron',
    leaf: 'heterogeneous',
    note: 'You can see the separate parts — the mixture is not uniform. A magnet pulls the iron out.',
    kinds: [
      { color: '#C9A66B', n: 16 },
      { color: '#7F8C8D', n: 12 },
    ],
    clumped: true,
  },
]

const LEAF_LABEL: Record<Leaf, string> = {
  element: 'Element',
  compound: 'Compound',
  homogeneous: 'Homogeneous mixture',
  heterogeneous: 'Heterogeneous mixture',
}

// deterministic pseudo-random so SSR/CSR match and layout is stable
function rnd(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

function Particles({ sample }: { sample: Sample }) {
  const W = 320
  const H = 150
  const dots: Array<{ x: number; y: number; r: number; color: string; pair?: boolean; trio?: boolean }> = []
  let idx = 0
  sample.kinds.forEach((kind, ki) => {
    for (let i = 0; i < kind.n; i++) {
      let x: number
      let y: number
      if (sample.clumped) {
        // each kind clusters on its own side
        const cx = ki === 0 ? 0.28 : 0.72
        x = (cx + (rnd(idx, 1) - 0.5) * 0.34) * W
        y = (0.2 + rnd(idx, 2) * 0.66) * H
      } else {
        x = (0.08 + rnd(idx, 1) * 0.84) * W
        y = (0.16 + rnd(idx, 2) * 0.7) * H
      }
      dots.push({ x, y, r: 6, color: kind.color, pair: kind.pair, trio: kind.trio })
      idx++
    }
  })

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <rect x={1} y={1} width={W - 2} height={H - 2} rx={12} fill="var(--color-surface-2)" stroke="var(--color-border)" />
      {dots.map((d, i) => (
        <g key={i}>
          {d.trio ? (
            <>
              <circle cx={d.x} cy={d.y} r={6.5} fill={d.color} />
              <circle cx={d.x - 6} cy={d.y + 5} r={4} fill="#ECF0F1" />
              <circle cx={d.x + 6} cy={d.y + 5} r={4} fill="#ECF0F1" />
            </>
          ) : d.pair ? (
            <>
              <circle cx={d.x - 3.5} cy={d.y} r={5.5} fill={d.color} />
              <circle cx={d.x + 3.5} cy={d.y} r={5.5} fill={d.color} />
            </>
          ) : (
            <circle cx={d.x} cy={d.y} r={d.r} fill={d.color} />
          )}
        </g>
      ))}
    </svg>
  )
}

export function MatterClassifier() {
  const [key, setKey] = useState(SAMPLES[0].key)
  const sample = SAMPLES.find((s) => s.key === key) ?? SAMPLES[0]
  const pure = sample.leaf === 'element' || sample.leaf === 'compound'

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {SAMPLES.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setKey(s.key)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              key === s.key
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* classification path */}
      <div className="mb-3 flex flex-wrap items-center gap-1.5 text-xs">
        <span className="rounded-md bg-surface-2 px-2 py-1 text-muted">Matter</span>
        <span className="text-muted">→</span>
        <span
          className={cn(
            'rounded-md px-2 py-1',
            pure ? 'bg-accent/20 text-accent' : 'bg-surface-2 text-muted',
          )}
        >
          Pure substance
        </span>
        <span className="text-muted">/</span>
        <span
          className={cn(
            'rounded-md px-2 py-1',
            !pure ? 'bg-accent/20 text-accent' : 'bg-surface-2 text-muted',
          )}
        >
          Mixture
        </span>
        <span className="text-muted">→</span>
        <span className="rounded-md bg-accent/15 px-2 py-1 font-semibold text-accent">
          {LEAF_LABEL[sample.leaf]}
        </span>
      </div>

      <Particles sample={sample} />

      <p className="mt-2 min-h-[2.5rem] text-center text-sm text-muted">{sample.note}</p>
    </div>
  )
}

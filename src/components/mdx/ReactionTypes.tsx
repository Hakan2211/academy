import { useState } from 'react'
import { cn } from '#/lib/cn'

// Most reactions fall into a handful of patterns. Recognising the pattern lets
// you predict the products. Each type rearranges the "building blocks" in a
// characteristic way — slide before → after to see the rearrangement.
type RType = {
  key: string
  name: string
  pattern: string
  example: string
  note: string
}

const TYPES: Array<RType> = [
  { key: 'synthesis', name: 'Synthesis', pattern: 'A + B → AB', example: '2H₂ + O₂ → 2H₂O', note: 'Two or more simple substances combine into one bigger compound.' },
  { key: 'decomposition', name: 'Decomposition', pattern: 'AB → A + B', example: '2H₂O₂ → 2H₂O + O₂', note: 'One compound breaks down into simpler substances — often driven by heat or electricity.' },
  { key: 'single', name: 'Single replacement', pattern: 'A + BC → AC + B', example: 'Zn + CuSO₄ → ZnSO₄ + Cu', note: 'One element kicks another out of its compound — if it is more reactive.' },
  { key: 'double', name: 'Double replacement', pattern: 'AB + CD → AD + CB', example: 'AgNO₃ + NaCl → AgCl + NaNO₃', note: 'Two compounds swap partners — often forming a precipitate, gas, or water.' },
  { key: 'combustion', name: 'Combustion', pattern: 'fuel + O₂ → CO₂ + H₂O', example: 'CH₄ + 2O₂ → CO₂ + 2H₂O', note: 'A fuel reacts rapidly with oxygen, releasing heat and light.' },
]

const C = { A: '#5DADE2', B: '#E74C3C', C: '#2ECC71', D: '#F1C40F' }

function Block({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  return (
    <g>
      <rect x={x - 14} y={y - 14} width={28} height={28} rx={6} fill={color} />
      <text x={x} y={y + 4} textAnchor="middle" className="fill-[#10141f] text-[12px] font-bold">{label}</text>
    </g>
  )
}

export function ReactionTypes() {
  const [key, setKey] = useState('synthesis')
  const [t, setT] = useState(0)
  const r = TYPES.find((x) => x.key === key) ?? TYPES[0]
  const lerp = (a: number, b: number) => a + (b - a) * t

  // before (left) and after (right) block layouts per type
  const render = () => {
    switch (r.key) {
      case 'synthesis':
        return (
          <>
            <Block x={lerp(60, 150)} y={60} label="A" color={C.A} />
            <Block x={lerp(60, 178)} y={lerp(110, 60)} label="B" color={C.B} />
          </>
        )
      case 'decomposition':
        return (
          <>
            <Block x={lerp(150, 60)} y={60} label="A" color={C.A} />
            <Block x={lerp(178, 60)} y={lerp(60, 110)} label="B" color={C.B} />
          </>
        )
      case 'single':
        return (
          <>
            <Block x={lerp(50, 230)} y={60} label="A" color={C.A} />
            <Block x={lerp(160, 50)} y={60} label="B" color={C.B} />
            <Block x={188} y={60} label="C" color={C.C} />
          </>
        )
      case 'double':
        return (
          <>
            <Block x={50} y={lerp(50, 50)} label="A" color={C.A} />
            <Block x={lerp(80, 220)} y={lerp(50, 50)} label="B" color={C.B} />
            <Block x={220} y={lerp(50, 50)} label="C" color={C.C} />
            <Block x={lerp(250, 80)} y={50} label="D" color={C.D} />
          </>
        )
      default: // combustion
        return (
          <>
            <Block x={lerp(50, 150)} y={60} label="🔥" color={C.D} />
            <Block x={lerp(110, 200)} y={lerp(60, 60)} label="O₂" color={C.A} />
          </>
        )
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {TYPES.map((x) => (
          <button
            key={x.key}
            type="button"
            onClick={() => {
              setKey(x.key)
              setT(0)
            }}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              key === x.key ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {x.name}
          </button>
        ))}
      </div>

      <p className="mb-1 text-center font-mono text-lg font-bold text-accent">{r.pattern}</p>
      <svg viewBox="0 0 300 120" className="w-full">
        <line x1={150} y1={100} x2={150} y2={100} stroke="none" />
        {render()}
        <text x={150} y={112} textAnchor="middle" className="fill-muted text-[10px]">{t < 0.5 ? 'reactants' : 'products'}</text>
      </svg>

      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={t}
        onChange={(e) => setT(Number(e.target.value))}
        className="w-full accent-accent"
        aria-label="Before to after"
      />

      <p className="mt-2 text-center font-mono text-sm text-ink">{r.example}</p>
      <p className="mt-1 min-h-[2.5rem] text-center text-sm text-muted">{r.note}</p>
    </div>
  )
}

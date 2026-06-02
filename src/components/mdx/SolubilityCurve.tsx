import { useState } from 'react'
import { cn } from '#/lib/cn'

// A solubility curve shows the maximum that dissolves at each temperature. On
// the curve = saturated; below = unsaturated (more can dissolve); above = it
// can't hold that much, so the excess crystallises out.
type Solute = { key: string; name: string; color: string; sol: (t: number) => number; note: string }

const SOLUTES: Array<Solute> = [
  { key: 'kno3', name: 'KNO₃', color: '#E74C3C', sol: (t) => 13 + 0.024 * t * t, note: 'Most solids dissolve far more in hot water — heat helps break the lattice.' },
  { key: 'nacl', name: 'NaCl', color: '#5DADE2', sol: (t) => 36 + 0.03 * t, note: 'Table salt barely changes with temperature — its curve is nearly flat.' },
  { key: 'co2', name: 'CO₂ (gas)', color: '#2ECC71', sol: () => 0, note: 'Gases dissolve LESS in hot water — which is why warm soda goes flat faster.' },
]
// gas decreases with T (special-cased)
function gasSol(t: number) {
  return 0.34 * Math.exp(-t / 28)
}

const G = { x0: 44, x1: 286, y0: 14, y1: 128 }

export function SolubilityCurve() {
  const [key, setKey] = useState('kno3')
  const [temp, setTemp] = useState(40)
  const s = SOLUTES.find((x) => x.key === key) ?? SOLUTES[0]
  const isGas = key === 'co2'
  const solFn = isGas ? gasSol : s.sol
  const yMax = isGas ? 0.4 : 110

  const toX = (t: number) => G.x0 + (t / 100) * (G.x1 - G.x0)
  const toY = (v: number) => G.y1 - (v / yMax) * (G.y1 - G.y0)
  const pts: Array<string> = []
  for (let i = 0; i <= 100; i += 4) pts.push(`${toX(i).toFixed(1)},${toY(solFn(i)).toFixed(1)}`)
  const val = solFn(temp)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {SOLUTES.map((x) => (
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

      <svg viewBox="0 0 300 146" className="w-full">
        <line x1={G.x0} y1={G.y0} x2={G.x0} y2={G.y1} stroke="var(--color-border)" strokeWidth={1.5} />
        <line x1={G.x0} y1={G.y1} x2={G.x1} y2={G.y1} stroke="var(--color-border)" strokeWidth={1.5} />
        <text x={8} y={70} className="fill-muted text-[9px]" transform="rotate(-90 12 70)">solubility</text>
        <text x={G.x1} y={143} textAnchor="end" className="fill-muted text-[9px]">temperature (°C)</text>
        <polyline points={pts.join(' ')} fill="none" stroke={s.color} strokeWidth={2.5} />
        <line x1={toX(temp)} y1={toY(val)} x2={toX(temp)} y2={G.y1} stroke="#F1C40F" strokeWidth={1} strokeDasharray="3 3" />
        <circle cx={toX(temp)} cy={toY(val)} r={6} fill="#F1C40F" stroke="#fff" strokeWidth={1.5} />
      </svg>

      <p className="my-2 text-center text-sm text-muted">
        At <span className="font-mono text-ink">{temp}°C</span>, about{' '}
        <span className="font-mono text-ink">{isGas ? val.toFixed(2) : val.toFixed(0)} g</span>{' '}
        {isGas ? 'per 100 g' : 'per 100 g water'} can dissolve (the saturation point). {s.note}
      </p>

      <label className="flex flex-col gap-1 text-sm">
        <span className="flex items-center justify-between text-muted">
          <span>Temperature</span>
          <span className="font-mono text-ink">{temp}°C</span>
        </span>
        <input type="range" min={0} max={100} step={1} value={temp} onChange={(e) => setTemp(Number(e.target.value))} className="accent-accent" />
      </label>
    </div>
  )
}

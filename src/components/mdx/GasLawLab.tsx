import { useState } from 'react'
import { cn } from '#/lib/cn'

// The gas laws relate pressure, volume, and temperature when the amount of gas
// is fixed. Each law holds two quantities constant and links the other two.
// Pick a law and drag the variable to trace the relationship.
type Law = 'boyle' | 'charles' | 'gaylussac'

const LAWS: Array<{ key: Law; name: string; statement: string; x: string; y: string }> = [
  { key: 'boyle', name: "Boyle's Law", statement: 'P × V = constant (fixed T) — squeeze the volume and pressure rises.', x: 'Volume (L)', y: 'Pressure (kPa)' },
  { key: 'charles', name: "Charles's Law", statement: 'V ÷ T = constant (fixed P) — heat a gas and it expands.', x: 'Temperature (K)', y: 'Volume (L)' },
  { key: 'gaylussac', name: "Gay-Lussac's Law", statement: 'P ÷ T = constant (fixed V) — heat a sealed container and pressure climbs.', x: 'Temperature (K)', y: 'Pressure (kPa)' },
]

const G = { x0: 46, x1: 290, y0: 16, y1: 132 }

export function GasLawLab() {
  const [law, setLaw] = useState<Law>('boyle')
  const [v, setV] = useState(4) // volume for Boyle
  const [t, setT] = useState(300) // temperature for Charles/Gay-Lussac

  // domain + relationship per law
  let xVal: number
  let xMin: number
  let xMax: number
  let yOf: (x: number) => number
  let yMax: number
  if (law === 'boyle') {
    xVal = v; xMin = 1; xMax = 10; yOf = (x) => 100 / x; yMax = 110
  } else if (law === 'charles') {
    xVal = t; xMin = 100; xMax = 500; yOf = (x) => x / 50; yMax = 11
  } else {
    xVal = t; xMin = 100; xMax = 500; yOf = (x) => x / 5; yMax = 110
  }
  const cur = LAWS.find((l) => l.key === law) ?? LAWS[0]

  const toX = (x: number) => G.x0 + ((x - xMin) / (xMax - xMin)) * (G.x1 - G.x0)
  const toY = (y: number) => G.y1 - (y / yMax) * (G.y1 - G.y0)
  const pts: Array<string> = []
  for (let i = 0; i <= 40; i++) {
    const x = xMin + (i / 40) * (xMax - xMin)
    pts.push(`${toX(x).toFixed(1)},${toY(yOf(x)).toFixed(1)}`)
  }
  const yVal = yOf(xVal)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {LAWS.map((l) => (
          <button
            key={l.key}
            type="button"
            onClick={() => setLaw(l.key)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              law === l.key ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {l.name}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 300 150" className="w-full">
        <line x1={G.x0} y1={G.y0} x2={G.x0} y2={G.y1} stroke="var(--color-border)" strokeWidth={1.5} />
        <line x1={G.x0} y1={G.y1} x2={G.x1} y2={G.y1} stroke="var(--color-border)" strokeWidth={1.5} />
        <text x={6} y={74} className="fill-muted text-[9px]" transform="rotate(-90 10 74)">{cur.y}</text>
        <text x={G.x1} y={147} textAnchor="end" className="fill-muted text-[9px]">{cur.x}</text>
        <polyline points={pts.join(' ')} fill="none" stroke="#3498DB" strokeWidth={2.5} />
        <line x1={toX(xVal)} y1={toY(yVal)} x2={toX(xVal)} y2={G.y1} stroke="#F1C40F" strokeWidth={1} strokeDasharray="3 3" />
        <circle cx={toX(xVal)} cy={toY(yVal)} r={6} fill="#F1C40F" stroke="#fff" strokeWidth={1.5} />
      </svg>

      <p className="my-2 text-center text-sm text-muted">{cur.statement}</p>

      <label className="flex flex-col gap-1 text-sm">
        <span className="flex items-center justify-between text-muted">
          <span>{cur.x}</span>
          <span className="font-mono text-ink">
            {law === 'boyle' ? `${v.toFixed(1)} L → ${yVal.toFixed(1)} kPa` : `${(law === 'charles' ? t : t).toFixed(0)} K → ${yVal.toFixed(1)} ${law === 'charles' ? 'L' : 'kPa'}`}
          </span>
        </span>
        <input
          type="range"
          min={xMin}
          max={xMax}
          step={law === 'boyle' ? 0.5 : 10}
          value={xVal}
          onChange={(e) => (law === 'boyle' ? setV(Number(e.target.value)) : setT(Number(e.target.value)))}
          className="accent-accent"
        />
      </label>
    </div>
  )
}

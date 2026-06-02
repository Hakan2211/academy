import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { cn } from '#/lib/cn'

// Enzymes have a sweet spot. Rate climbs with temperature — until the heat
// denatures the enzyme and it crashes. With pH it's a bell around the optimum.
// Drag the value and trace the curve.
type Mode = 'temperature' | 'ph'

const GRAPH = { x0: 44, x1: 330, y0: 18, y1: 150 }

function rateTemp(t: number): number {
  // rises to optimum ~40°C, then denatures by ~60°C
  if (t <= 40) return Math.pow(t / 40, 1.4) * 100
  if (t >= 60) return 0
  return 100 * (1 - (t - 40) / 20)
}
function ratePh(p: number): number {
  return 100 * Math.exp(-Math.pow((p - 7) / 2.3, 2))
}

export function EnzymeRate() {
  const [mode, setMode] = useState<Mode>('temperature')
  const [val, setVal] = useState(37)

  const isT = mode === 'temperature'
  const min = 0
  const max = isT ? 70 : 14
  const rateFn = isT ? rateTemp : ratePh
  const v = isT ? val : Math.min(14, val)

  const toX = (x: number) => GRAPH.x0 + (x / max) * (GRAPH.x1 - GRAPH.x0)
  const toY = (r: number) => GRAPH.y1 - (r / 100) * (GRAPH.y1 - GRAPH.y0)

  const pts: Array<string> = []
  for (let i = 0; i <= max; i += isT ? 2 : 0.4) {
    pts.push(`${toX(i).toFixed(1)},${toY(rateFn(i)).toFixed(1)}`)
  }
  const rate = rateFn(v)
  const mx = toX(v)
  const my = toY(rate)

  const switchMode = (m: Mode) => {
    setMode(m)
    setVal(m === 'temperature' ? 37 : 7)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex gap-2">
        {(['temperature', 'ph'] as Array<Mode>).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              mode === m ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {m === 'ph' ? 'pH' : 'Temperature'}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 360 172" className="w-full">
        {/* axes */}
        <line x1={GRAPH.x0} y1={GRAPH.y0} x2={GRAPH.x0} y2={GRAPH.y1} stroke="var(--color-border)" strokeWidth={1.5} />
        <line x1={GRAPH.x0} y1={GRAPH.y1} x2={GRAPH.x1} y2={GRAPH.y1} stroke="var(--color-border)" strokeWidth={1.5} />
        <text x={8} y={84} className="fill-muted text-[10px]" transform="rotate(-90 12 84)">rate</text>
        <text x={GRAPH.x1} y={167} textAnchor="end" className="fill-muted text-[10px]">{isT ? 'temperature (°C)' : 'pH'}</text>

        {/* curve */}
        <polyline points={pts.join(' ')} fill="none" stroke="#A3CB38" strokeWidth={2.5} />

        {/* marker */}
        <line x1={mx} y1={my} x2={mx} y2={GRAPH.y1} stroke="#FDCB6E" strokeWidth={1} strokeDasharray="3 3" />
        <circle cx={mx} cy={my} r={6} fill="#FDCB6E" stroke="#fff" strokeWidth={1.5} />
      </svg>

      <p className="my-2 text-center text-sm text-muted">
        {isT
          ? val < 40
            ? 'Below the optimum: more heat means faster collisions and a higher rate.'
            : val <= 45
              ? 'Around the optimum (~40°C) — the enzyme works fastest here.'
              : 'Too hot: the enzyme is denaturing — the rate collapses.'
          : Math.abs(v - 7) < 1.5
            ? 'Near the optimum pH — the enzyme works best.'
            : 'Away from the optimum pH, the shape is disrupted and the rate falls.'}
      </p>

      <SceneSlider
        label={isT ? 'Temperature' : 'pH'}
        value={val}
        min={min}
        max={max}
        step={isT ? 1 : 0.5}
        unit={isT ? '°C' : ''}
        onChange={setVal}
      />
    </div>
  )
}

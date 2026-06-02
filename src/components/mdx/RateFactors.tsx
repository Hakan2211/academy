import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { cn } from '#/lib/cn'

// Four levers speed up a reaction by making successful collisions more frequent:
// temperature, concentration, surface area, and a catalyst. Adjust them and
// watch how fast the reactant is used up.
const G = { x0: 40, x1: 286, y0: 12, y1: 120 }

export function RateFactors() {
  const [temp, setTemp] = useState(25)
  const [conc, setConc] = useState(1)
  const [area, setArea] = useState(1)
  const [cat, setCat] = useState(false)

  // relative rate: temperature roughly doubles rate per 15°C
  const rate = Math.pow(2, (temp - 25) / 15) * conc * area * (cat ? 2.2 : 1)

  const toX = (t: number) => G.x0 + (t / 10) * (G.x1 - G.x0)
  const toY = (a: number) => G.y1 - a * (G.y1 - G.y0)
  const pts: Array<string> = []
  for (let i = 0; i <= 40; i++) {
    const t = (i / 40) * 10
    pts.push(`${toX(t).toFixed(1)},${toY(Math.exp(-rate * t * 0.18)).toFixed(1)}`)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 300 134" className="w-full">
        <line x1={G.x0} y1={G.y0} x2={G.x0} y2={G.y1} stroke="var(--color-border)" strokeWidth={1.5} />
        <line x1={G.x0} y1={G.y1} x2={G.x1} y2={G.y1} stroke="var(--color-border)" strokeWidth={1.5} />
        <text x={6} y={70} className="fill-muted text-[9px]" transform="rotate(-90 10 70)">[reactant]</text>
        <text x={G.x1} y={131} textAnchor="end" className="fill-muted text-[9px]">time →</text>
        <polyline points={pts.join(' ')} fill="none" stroke="#9B59B6" strokeWidth={2.5} />
      </svg>

      <p className="my-2 text-center text-sm">
        Relative rate: <span className="font-mono font-semibold text-accent">{rate.toFixed(1)}×</span>{' '}
        <span className="text-muted">— steeper curve = faster reaction (reactant used up sooner).</span>
      </p>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <SceneSlider label="Temperature" value={temp} min={5} max={75} step={1} unit="°C" onChange={(v) => setTemp(Math.round(v))} />
        <SceneSlider label="Concentration" value={conc} min={0.5} max={3} step={0.1} unit="M" onChange={setConc} />
        <SceneSlider label="Surface area (powder)" value={area} min={1} max={5} step={0.5} unit="×" onChange={setArea} />
        <button
          type="button"
          onClick={() => setCat((c) => !c)}
          className={cn('self-end rounded-lg border px-3 py-2 text-sm font-semibold transition-colors', cat ? 'border-[#2ECC71] bg-[#2ECC71]/15 text-[#2ECC71]' : 'border-border text-muted hover:text-ink')}
        >
          {cat ? '✓ Catalyst added' : 'Add a catalyst'}
        </button>
      </div>
    </div>
  )
}

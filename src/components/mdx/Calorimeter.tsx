import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

// Calorimetry measures the heat of a reaction by tracking the temperature
// change of water around it: q = m·c·ΔT. Drag the mass of water and the
// temperature change to see the energy transferred.
const C_WATER = 4.18 // J per g per °C

export function Calorimeter() {
  const [mass, setMass] = useState(100)
  const [dT, setDT] = useState(8)
  const q = mass * C_WATER * dT // joules
  const kJ = q / 1000
  // thermometer fill (map dT 0..25 to a height)
  const fill = Math.min(1, dT / 25)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-center justify-center gap-6">
        <svg viewBox="0 0 90 130" className="w-24">
          {/* insulated cup of water */}
          <path d="M 18 30 L 72 30 L 66 120 L 24 120 Z" fill="#5DADE2" opacity={0.2} stroke="var(--color-muted)" strokeWidth={2} />
          {/* thermometer */}
          <rect x={44} y={14} width={6} height={84} rx={3} fill="var(--color-surface-2)" stroke="var(--color-muted)" strokeWidth={1} />
          <rect x={44} y={98 - fill * 80} width={6} height={fill * 80} fill="#E74C3C" />
          <circle cx={47} cy={102} r={7} fill="#E74C3C" />
        </svg>
        <div className="text-center">
          <div className="text-3xl font-bold text-accent">{kJ.toFixed(1)}</div>
          <div className="text-xs text-muted">kJ of heat (q)</div>
        </div>
      </div>

      <p className="my-3 text-center text-sm text-muted">
        q = m·c·ΔT = {mass} g × 4.18 × {dT}°C = <span className="font-mono text-ink">{q.toFixed(0)} J</span>.
        Water's high heat capacity (c = 4.18 J/g·°C) lets us read a reaction's energy from a temperature change.
      </p>

      <SceneSlider label="Mass of water" value={mass} min={50} max={300} step={10} unit="g" onChange={(v) => setMass(Math.round(v))} />
      <div className="mt-2">
        <SceneSlider label="Temperature change (ΔT)" value={dT} min={1} max={25} step={1} unit="°C" onChange={(v) => setDT(Math.round(v))} />
      </div>
    </div>
  )
}

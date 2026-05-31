import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

const FORCE = 600 // newtons — the weight stays the same
const GROUND = 210

// Same weight, different contact area. Pressure is force spread over area
// (P = F / A), so shrinking the contact patch sends the pressure — and how far
// the block digs into the soft ground — shooting up. It's why a sharp drawing
// pin pierces with a gentle push, while snowshoes stop you sinking into snow.
export function PressureLab() {
  const [area, setArea] = useState(20) // cm²
  const pressure = FORCE / area // N/cm²

  // visual mapping
  const width = 30 + area * 4 // wider contact patch for bigger area
  const x = 180 - width / 2
  const penetration = Math.min(46, pressure * 0.9) // deeper for higher pressure
  const blockH = 60
  const blockTop = GROUND - penetration - blockH

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 250" className="w-full">
        {/* soft ground */}
        <rect x="20" y={GROUND} width="320" height="58" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="2" />
        {/* indentation the block presses into the ground */}
        <rect x={x} y={GROUND} width={width} height={penetration} fill="var(--color-bg)" opacity="0.6" />

        {/* weight arrows */}
        <g stroke="var(--color-muted)" strokeWidth="2" fill="none">
          <line x1="180" y1={blockTop - 30} x2="180" y2={blockTop - 6} />
          <path d={`M 174 ${blockTop - 12} L 180 ${blockTop - 4} L 186 ${blockTop - 12}`} />
        </g>
        <text x="196" y={blockTop - 16} fill="var(--color-muted)" fontSize="12">
          {FORCE} N
        </text>

        {/* the block */}
        <rect x={x} y={blockTop} width={width} height={blockH} rx="4" fill="var(--color-accent)" opacity="0.9" stroke="var(--color-ink)" strokeWidth="1.5" />

        {/* readouts */}
        <text x="30" y="34" fill="var(--color-muted)" fontSize="13">
          Pressure = Force ÷ Area
        </text>
        <text x="30" y="56" fill="var(--color-ink)" fontSize="15" fontWeight="600">
          {pressure.toFixed(0)} N/cm²
        </text>
      </svg>

      <div className="px-4 pb-4">
        <SceneSlider label="Contact area" value={area} min={4} max={50} step={1} unit="cm²" onChange={setArea} />
        <p className="mt-2 text-center text-xs text-muted">
          The weight never changes. Squeeze it onto a smaller area and the pressure climbs — so it digs in deeper.
        </p>
      </div>
    </div>
  )
}

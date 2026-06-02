import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

// Density = mass ÷ volume. In a column of stacked liquids, an object sinks
// until it reaches a liquid denser than itself, then floats. Slide the object's
// density and watch it find its level.
const LAYERS = [
  { name: 'Oil', density: 0.92, color: '#E8C547', top: 40, bottom: 76 },
  { name: 'Water', density: 1.0, color: '#4AA3DF', top: 76, bottom: 110 },
  { name: 'Honey', density: 1.36, color: '#B9770E', top: 110, bottom: 146 },
]

function targetY(d: number): number {
  if (d < LAYERS[0].density) return 44
  if (d < LAYERS[1].density) return 74
  if (d < LAYERS[2].density) return 108
  return 138
}

export function DensityColumn() {
  const [density, setDensity] = useState(1.1)
  const objRef = useRef<SVGGElement | null>(null)
  const targetRef = useRef(targetY(1.1))

  useEffect(() => {
    targetRef.current = targetY(density)
  }, [density])

  useEffect(() => {
    let raf = 0
    let y = targetRef.current
    const loop = () => {
      y += (targetRef.current - y) * 0.12
      objRef.current?.setAttribute('transform', `translate(150 ${y.toFixed(1)})`)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const resting = LAYERS.find((l) => density < l.density)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 300 160" className="w-full">
        {/* beaker */}
        <rect x={96} y={30} width={108} height={120} rx={6} fill="none" stroke="var(--color-muted)" strokeWidth={2} />
        {LAYERS.map((l) => (
          <g key={l.name}>
            <rect x={98} y={l.top} width={104} height={l.bottom - l.top} fill={l.color} opacity={0.55} />
            <text x={206} y={(l.top + l.bottom) / 2 + 3} className="fill-muted text-[9px]">
              {l.name} {l.density}
            </text>
          </g>
        ))}

        {/* the object */}
        <g ref={objRef} transform="translate(150 80)">
          <circle r={11} fill="var(--color-ink)" opacity={0.9} />
          <circle r={11} fill="none" stroke="#fff" strokeWidth={1.2} opacity={0.5} />
        </g>
      </svg>

      <p className="my-2 text-center text-sm text-muted">
        Object density{' '}
        <span className="font-mono text-ink">{density.toFixed(2)} g/cm³</span> —{' '}
        {resting
          ? `it floats on the ${resting.name.toLowerCase()} (denser than the object).`
          : 'it is denser than every layer, so it sinks to the bottom.'}
      </p>

      <SceneSlider
        label="Object density"
        value={density}
        min={0.5}
        max={1.8}
        step={0.02}
        unit="g/cm³"
        onChange={setDensity}
      />
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

const WATER_TOP = 96
const TANK_BOTTOM = 250
const BW = 84
const BH = 56
const BX = (360 - BW) / 2

// A block dropped in water. Set its density relative to water (1.0 g/cm³) and
// watch where it settles: lighter than water and it floats with just the right
// fraction poking out; denser and it sinks to the bottom. The submerged
// fraction equals the density ratio — that's Archimedes' principle made visible.
export function BuoyancyTank() {
  const [density, setDensity] = useState(0.6)
  const densityRef = useRef(density)
  const blockRef = useRef<SVGGElement>(null)
  const statusRef = useRef<SVGTextElement>(null)
  const subRef = useRef<SVGTextElement>(null)
  const curRef = useRef(WATER_TOP - BH) // current block top, animated

  useEffect(() => {
    densityRef.current = density
  }, [density])

  useEffect(() => {
    let raf = 0
    let last = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      const d = densityRef.current

      let target: number
      let submergedPct: number
      if (d <= 1) {
        const f = d // fraction of height below the surface
        target = WATER_TOP - (1 - f) * BH
        submergedPct = Math.round(f * 100)
      } else {
        target = TANK_BOTTOM - BH
        submergedPct = 100
      }
      // gentle bob only while floating
      const bob = d < 0.98 ? Math.sin(now * 0.004) * 2.5 : 0
      const goal = target + bob

      curRef.current += (goal - curRef.current) * Math.min(1, dt * 0.012)
      blockRef.current?.setAttribute('transform', `translate(0 ${curRef.current.toFixed(1)})`)

      if (statusRef.current) {
        statusRef.current.textContent =
          d < 0.98 ? 'Floats' : d > 1.02 ? 'Sinks' : 'Neutral buoyancy'
      }
      if (subRef.current) subRef.current.textContent = `${submergedPct}% submerged`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 280" className="w-full">
        {/* tank */}
        <rect x="40" y="40" width="280" height="216" rx="6" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="2" />
        {/* water */}
        <rect x="42" y={WATER_TOP} width="276" height={TANK_BOTTOM - WATER_TOP} fill="var(--color-accent-2)" opacity="0.22" />
        <line x1="42" y1={WATER_TOP} x2="318" y2={WATER_TOP} stroke="var(--color-accent-2)" strokeWidth="2" opacity="0.7" />

        {/* the block */}
        <g ref={blockRef} transform={`translate(0 ${WATER_TOP - BH})`}>
          <rect x={BX} y={0} width={BW} height={BH} rx="5" fill="var(--color-accent)" stroke="var(--color-ink)" strokeWidth="1.5" opacity="0.9" />
        </g>

        <text ref={statusRef} x="180" y="30" fill="var(--color-ink)" fontSize="15" fontWeight="600" textAnchor="middle">
          Floats
        </text>
        <text ref={subRef} x="180" y="272" fill="var(--color-muted)" fontSize="12" textAnchor="middle">
          60% submerged
        </text>
      </svg>

      <div className="px-4 pb-4">
        <SceneSlider label="Block density (water = 1.0)" value={density} min={0.2} max={2} step={0.05} unit="g/cm³" onChange={setDensity} />
        <p className="mt-2 text-center text-xs text-muted">
          Less dense than water → floats. Denser → sinks. The fraction underwater equals the density ratio.
        </p>
      </div>
    </div>
  )
}

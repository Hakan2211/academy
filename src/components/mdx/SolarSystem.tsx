import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

const CX = 200
const CY = 140
const SQUASH = 0.6 // vertical perspective

type Planet = { name: string; R: number; r: number; color: string; ring?: boolean }
const PLANETS: Array<Planet> = [
  { name: 'Mercury', R: 30, r: 2.5, color: '#b2bec3' },
  { name: 'Venus', R: 44, r: 4, color: '#fab1a0' },
  { name: 'Earth', R: 60, r: 4.5, color: '#0984e3' },
  { name: 'Mars', R: 76, r: 3.5, color: '#e17055' },
  { name: 'Jupiter', R: 108, r: 10, color: '#fdcb6e' },
  { name: 'Saturn', R: 134, r: 8.5, color: '#ffeaa7', ring: true },
  { name: 'Uranus', R: 156, r: 6, color: '#81ecec' },
  { name: 'Neptune', R: 176, r: 6, color: '#74b9ff' },
]

// Eight planets, one star, and Kepler's rule written in motion: the closer a
// planet orbits, the faster it goes. Mercury races around in 88 days while
// Neptune takes 165 years. Distances here are compressed to fit — but the speeds
// keep their real pecking order.
export function SolarSystem() {
  const [speed, setSpeed] = useState(1)
  const speedRef = useRef(speed)
  const planetRefs = useRef<Array<SVGGElement | null>>([])

  useEffect(() => { speedRef.current = speed }, [speed])

  useEffect(() => {
    const ang = PLANETS.map((_, i) => i * 0.8)
    let raf = 0
    let last = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      for (let i = 0; i < PLANETS.length; i++) {
        // Kepler: angular speed ∝ R^(-1.5)
        const w = 0.00045 * Math.pow(60 / PLANETS[i].R, 1.5) * speedRef.current
        ang[i] += w * dt
        const x = CX + PLANETS[i].R * Math.cos(ang[i])
        const y = CY + PLANETS[i].R * SQUASH * Math.sin(ang[i])
        planetRefs.current[i]?.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)})`)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 400 280" className="w-full">
        {/* orbits */}
        {PLANETS.map((p) => (
          <ellipse key={p.name} cx={CX} cy={CY} rx={p.R} ry={p.R * SQUASH} fill="none" stroke="var(--color-border)" strokeWidth="0.75" opacity="0.6" />
        ))}
        {/* Sun */}
        <circle cx={CX} cy={CY} r="14" fill="#fdcb6e" />
        <circle cx={CX} cy={CY} r="14" fill="none" stroke="#fdcb6e" strokeWidth="6" opacity="0.3" />

        {/* planets */}
        {PLANETS.map((p, i) => (
          <g key={p.name} ref={(g) => { planetRefs.current[i] = g }}>
            {p.ring && <ellipse cx="0" cy="0" rx={p.r + 5} ry={(p.r + 5) * 0.4} fill="none" stroke="#ffeaa7" strokeWidth="1.5" />}
            <circle cx="0" cy="0" r={p.r} fill={p.color} />
          </g>
        ))}

        {/* labels along the right side */}
        {PLANETS.map((p) => (
          <text key={p.name} x={CX + p.R + 2} y={CY + 3} fill="var(--color-muted)" fontSize="7" opacity="0.8">
            {p.name}
          </text>
        ))}
      </svg>

      <div className="px-4 pt-2">
        <SceneSlider label="Simulation speed" value={speed} min={0} max={3} step={0.5} unit="×" onChange={setSpeed} />
        <p className="mt-2 pb-4 text-center text-xs text-muted">
          Inner planets sweep around quickly; outer ones crawl. That speed-versus-distance pattern is Kepler's third law — the same gravity you met in Forces & Motion.
        </p>
      </div>
    </div>
  )
}

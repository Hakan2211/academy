import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

const CX = 200
const CY = 104
const SIGMA = 64

function sag(r: number, D: number) {
  return D / (1 + (r / SIGMA) ** 2)
}
// push a flat-grid point down into the well and pull it inward toward the mass
function displace(x: number, y: number, D: number): [number, number] {
  const r = Math.hypot(x - CX, y - CY)
  const s = sag(r, D)
  const nx = x + (CX - x) * 0.5 * (s / (D + 1))
  const ny = y + s
  return [nx, ny]
}

// Mass doesn't pull on things with a mysterious force — it bends the spacetime
// around it, and everything simply follows the straightest available path through
// that curved geometry. Drop a mass onto the grid and watch space sag; the orbiting
// marble is just rolling along the warp. Crank the mass to the maximum and the well
// becomes bottomless: a black hole, from which not even light escapes.
export function SpacetimeWell() {
  const [mass, setMass] = useState(45)
  const massRef = useRef(mass)
  const marbleRef = useRef<SVGCircleElement>(null)

  useEffect(() => { massRef.current = mass }, [mass])

  useEffect(() => {
    let raf = 0
    let start = 0
    const loop = (now: number) => {
      if (!start) start = now
      const t = now - start
      const D = massRef.current * 0.85
      const th = t * 0.0011
      const [mx, my] = displace(CX + 72 * Math.cos(th), CY + 34 * Math.sin(th), D)
      if (marbleRef.current) {
        marbleRef.current.setAttribute('cx', mx.toFixed(1))
        marbleRef.current.setAttribute('cy', my.toFixed(1))
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const D = mass * 0.85
  // build the warped grid (recomputed only when the mass slider changes)
  const lines: Array<string> = []
  for (let i = -5; i <= 5; i++) {
    const x = CX + i * 32
    let d = ''
    for (let y = 26; y <= 182; y += 8) {
      const [nx, ny] = displace(x, y, D)
      d += `${y === 26 ? 'M' : 'L'}${nx.toFixed(1)},${ny.toFixed(1)} `
    }
    lines.push(d.trim())
  }
  for (let j = -3; j <= 3; j++) {
    const y = CY + j * 26
    let d = ''
    for (let x = 40; x <= 360; x += 10) {
      const [nx, ny] = displace(x, y, D)
      d += `${x === 40 ? 'M' : 'L'}${nx.toFixed(1)},${ny.toFixed(1)} `
    }
    lines.push(d.trim())
  }

  const horizon = mass > 60 ? (mass - 60) * 0.7 : 0
  const [, wellBottom] = displace(CX, CY, D)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 400 268" className="w-full">
        {lines.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="var(--color-accent-2)" strokeWidth="1" opacity="0.5" />
        ))}

        {/* event horizon at extreme mass */}
        {horizon > 0 && (
          <>
            <circle cx={CX} cy={wellBottom} r={horizon + 9} fill="none" stroke="#fdcb6e" strokeWidth="1.5" opacity="0.6" />
            <circle cx={CX} cy={wellBottom} r={horizon} fill="#0b0b16" />
          </>
        )}

        {/* central mass */}
        <circle cx={CX} cy={wellBottom} r={Math.max(7, mass * 0.13)} fill="var(--color-ink)" />
        {/* orbiting marble */}
        <circle ref={marbleRef} cx={CX + 72} cy={CY} r="6" fill="var(--color-accent)" />
      </svg>

      <div className="px-4 pt-2">
        <SceneSlider label="Mass" value={mass} min={0} max={100} step={1} unit="" onChange={setMass} />
        <p className="mt-2 pb-4 text-center text-xs text-muted">
          {horizon > 0
            ? 'The well is now a black hole — its event horizon (gold ring) is the point of no return, even for light.'
            : 'More mass means deeper curvature. The marble isn’t pulled by a force — it just follows the warped grid.'}
        </p>
      </div>
    </div>
  )
}

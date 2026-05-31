import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

const SUNX = 200
const SUNY = 78
const ORX = 46
const ORY = 20
const STARY = 26
const SKYY = 214
const BG = [60, 110, 150, 250, 300, 340] // fixed background stars

// How do you measure the distance to a star you can never visit? Watch it from
// opposite sides of Earth's orbit, six months apart. A nearby star appears to
// shift against the far background — its parallax. The bigger the shift, the
// closer the star. Move the slider: distant stars barely budge.
export function Parallax() {
  const [dist, setDist] = useState(3)
  const distRef = useRef(dist)
  const earthRef = useRef<SVGCircleElement>(null)
  const sightRef = useRef<SVGLineElement>(null)
  const skyStarRef = useRef<SVGCircleElement>(null)

  useEffect(() => { distRef.current = dist }, [dist])

  useEffect(() => {
    let raf = 0
    let last = 0
    let th = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      th += 0.0016 * dt
      const ex = SUNX + ORX * Math.cos(th)
      const ey = SUNY + ORY * Math.sin(th)
      earthRef.current?.setAttribute('cx', ex.toFixed(1))
      earthRef.current?.setAttribute('cy', ey.toFixed(1))
      sightRef.current?.setAttribute('x1', ex.toFixed(1))
      sightRef.current?.setAttribute('y1', ey.toFixed(1))
      const skyX = SUNX + (50 * Math.cos(th)) / distRef.current
      skyStarRef.current?.setAttribute('cx', skyX.toFixed(1))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const p = 1 / dist

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 400 270" className="w-full">
        {/* distant background stars */}
        {BG.map((x) => (
          <circle key={x} cx={x} cy="26" r="1.5" fill="var(--color-muted)" opacity="0.6" />
        ))}
        {/* near star */}
        <circle cx={SUNX} cy={STARY} r="5" fill="#e17055" />
        <text x={SUNX + 10} y={STARY + 4} fill="var(--color-muted)" fontSize="9">near star</text>

        {/* sight line from Earth to the near star */}
        <line ref={sightRef} x1={SUNX + ORX} y1={SUNY} x2={SUNX} y2={STARY} stroke="#e17055" strokeWidth="0.75" strokeDasharray="2 3" opacity="0.7" />

        {/* Earth's orbit + Sun + Earth */}
        <ellipse cx={SUNX} cy={SUNY} rx={ORX} ry={ORY} fill="none" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="3 4" />
        <circle cx={SUNX} cy={SUNY} r="10" fill="#fdcb6e" />
        <circle ref={earthRef} cx={SUNX + ORX} cy={SUNY} r="4.5" fill="#0984e3" />

        {/* the apparent sky */}
        <line x1="40" y1="170" x2="360" y2="170" stroke="var(--color-border)" strokeWidth="1" />
        <text x="44" y="186" fill="var(--color-muted)" fontSize="10">how the near star looks against the background:</text>
        {BG.map((x) => (
          <circle key={`s${x}`} cx={x} cy={SKYY} r="1.5" fill="var(--color-muted)" opacity="0.5" />
        ))}
        <circle ref={skyStarRef} cx={SUNX} cy={SKYY} r="5" fill="#e17055" />
        <text x={SUNX} y={SKYY + 28} fill="var(--color-muted)" fontSize="9" textAnchor="middle">← it shifts back and forth →</text>
      </svg>

      <div className="px-4 pt-2">
        <SceneSlider label="Distance to star" value={dist} min={1} max={10} step={0.5} unit="pc" onChange={setDist} />
        <p className="mt-2 text-center text-sm text-ink">
          parallax ≈ {p.toFixed(2)}″ → distance ≈ {dist.toFixed(1)} pc ({(dist * 3.26).toFixed(1)} light-years)
        </p>
        <p className="mt-1 pb-4 text-center text-xs text-muted">
          A parallax of 1 arcsecond means a distance of 1 parsec — the definition of the unit. Distance is simply 1 ÷ parallax.
        </p>
      </div>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

const xL = 50 // fixed left wall
const yT = 50
const yB = 170
const R = 6
const N = 16
const PV = 60 // Boyle's constant: P × V stays fixed at constant temperature

const pistonX = (v: number) => 90 + ((v - 1) / 5) * 200

// Boyle's Law in a cylinder. Push the piston in and the same particles are
// crammed into less space, so they hammer the walls more often — pressure
// climbs. Halve the volume and the pressure doubles: P × V stays constant
// (as long as the temperature, i.e. the particle speed, doesn't change).
export function GasPistonLab() {
  const [vol, setVol] = useState(4)
  const volRef = useRef(vol)
  const dotRefs = useRef<Array<SVGCircleElement | null>>([])

  useEffect(() => {
    volRef.current = vol
  }, [vol])

  useEffect(() => {
    type P = { x: number; y: number; dx: number; dy: number }
    const parts: Array<P> = []
    const x0 = pistonX(vol)
    for (let i = 0; i < N; i++) {
      const a = Math.random() * Math.PI * 2
      const s = 0.06 + Math.random() * 0.03
      parts.push({
        x: xL + R + Math.random() * (x0 - xL - 2 * R),
        y: yT + R + Math.random() * (yB - yT - 2 * R),
        dx: Math.cos(a) * s,
        dy: Math.sin(a) * s,
      })
    }

    let raf = 0
    let last = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      const right = pistonX(volRef.current) - R
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i]
        p.x += p.dx * dt
        p.y += p.dy * dt
        if (p.x < xL + R) { p.x = xL + R; p.dx = -p.dx }
        else if (p.x > right) { p.x = right; p.dx = -Math.abs(p.dx) }
        if (p.y < yT + R) { p.y = yT + R; p.dy = -p.dy }
        else if (p.y > yB - R) { p.y = yB - R; p.dy = -p.dy }
        const el = dotRefs.current[i]
        if (el) {
          el.setAttribute('cx', p.x.toFixed(1))
          el.setAttribute('cy', p.y.toFixed(1))
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const px = pistonX(vol)
  const pressure = PV / vol
  const barW = (pressure / PV) * 150 // 0..150px

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 380 230" className="w-full">
        {/* cylinder walls */}
        <line x1={xL} y1={yT - 8} x2={xL} y2={yB + 8} stroke="var(--color-border)" strokeWidth="3" />
        <line x1={xL} y1={yT} x2={320} y2={yT} stroke="var(--color-border)" strokeWidth="3" />
        <line x1={xL} y1={yB} x2={320} y2={yB} stroke="var(--color-border)" strokeWidth="3" />
        {/* gas region tint */}
        <rect x={xL} y={yT} width={px - xL} height={yB - yT} fill="var(--color-accent-2)" opacity="0.1" />

        {/* particles */}
        {Array.from({ length: N }).map((_, i) => (
          <circle
            key={i}
            ref={(el) => { dotRefs.current[i] = el }}
            cx={xL + 20}
            cy={(yT + yB) / 2}
            r={R}
            fill="var(--color-accent-2)"
          />
        ))}

        {/* piston */}
        <rect x={px} y={yT - 4} width="14" height={yB - yT + 8} rx="2" fill="var(--color-accent)" />
        <line x1={px + 14} y1={(yT + yB) / 2} x2="340" y2={(yT + yB) / 2} stroke="var(--color-accent)" strokeWidth="6" strokeLinecap="round" />

        {/* pressure gauge */}
        <text x={xL} y="200" fill="var(--color-muted)" fontSize="12">pressure</text>
        <line x1="110" y1="196" x2="260" y2="196" stroke="var(--color-border)" strokeWidth="6" strokeLinecap="round" />
        <rect x="110" y="193" width={barW} height="6" rx="3" fill="#e17055" />
        <text x="270" y="200" fill="var(--color-ink)" fontSize="13" fontWeight="600">
          {pressure.toFixed(0)} kPa
        </text>
        <text x={xL} y="222" fill="var(--color-muted)" fontSize="12">
          P × V = {(pressure * vol).toFixed(0)} (constant)
        </text>
      </svg>

      <div className="px-4 pb-4">
        <SceneSlider label="Volume" value={vol} min={1} max={6} step={0.5} unit="L" onChange={setVol} />
        <p className="mt-2 text-center text-xs text-muted">
          Squeeze the volume down and pressure shoots up — their product stays fixed. That's Boyle's Law.
        </p>
      </div>
    </div>
  )
}

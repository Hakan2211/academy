import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

const X0 = 56
const X1 = 372
const U = 0.4 // ball's speed relative to the source (units of c)
const PXC = 0.16 // px-per-ms representing the speed of light c
const N = 5
const LIGHT = '#fdcb6e'
const BALL = '#e17055'

// Galileo's common sense says velocities add: throw a ball forward from a moving
// train and the ground sees train-speed + throw-speed. That's true for the ball.
// But fire a light pulse and every observer measures the SAME speed c, no matter
// how fast the source moves. Crank the source speed: the ball speeds up, the
// light never does. That stubborn fact is the seed of all of relativity.
export function LightPostulate() {
  const [v, setV] = useState(0.3) // source speed (units of c)
  const vRef = useRef(v)
  const ballRefs = useRef<Array<SVGCircleElement | null>>([])
  const lightRefs = useRef<Array<SVGCircleElement | null>>([])

  useEffect(() => { vRef.current = v }, [v])

  useEffect(() => {
    const bx = Array.from({ length: N }, (_, i) => X0 + (i / N) * (X1 - X0))
    const lx = Array.from({ length: N }, (_, i) => X0 + (i / N) * (X1 - X0))
    let raf = 0
    let last = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      const bs = (vRef.current + U) * PXC
      const ls = 1 * PXC
      for (let i = 0; i < N; i++) {
        bx[i] += bs * dt
        if (bx[i] > X1) bx[i] = X0
        lx[i] += ls * dt
        if (lx[i] > X1) lx[i] = X0
        ballRefs.current[i]?.setAttribute('cx', bx[i].toFixed(1))
        lightRefs.current[i]?.setAttribute('cx', lx[i].toFixed(1))
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 400 210" className="w-full">
        {/* source */}
        <rect x="22" y="74" width="28" height="62" rx="5" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1.5" />
        <text x="36" y="152" fill="var(--color-muted)" fontSize="10" textAnchor="middle">source</text>
        <text x="36" y="164" fill="var(--color-muted)" fontSize="10" textAnchor="middle">→ v</text>

        {/* ball lane */}
        <line x1={X0} y1="78" x2={X1} y2="78" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="2 4" />
        <text x={X0} y="64" fill="var(--color-muted)" fontSize="11">Thrown ball — speeds add</text>
        {Array.from({ length: N }).map((_, i) => (
          <circle key={`b${i}`} ref={(el) => { ballRefs.current[i] = el }} cx={X0} cy="78" r="6" fill={BALL} />
        ))}
        <text x={X1 + 2} y="82" fill={BALL} fontSize="12" fontWeight="700" textAnchor="end">{(v + U).toFixed(2)} c</text>

        {/* light lane */}
        <line x1={X0} y1="158" x2={X1} y2="158" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="2 4" />
        <text x={X0} y="144" fill="var(--color-muted)" fontSize="11">Light pulse — always c</text>
        {Array.from({ length: N }).map((_, i) => (
          <circle key={`l${i}`} ref={(el) => { lightRefs.current[i] = el }} cx={X0} cy="158" r="5" fill={LIGHT} />
        ))}
        <text x={X1 + 2} y="162" fill={LIGHT} fontSize="12" fontWeight="700" textAnchor="end">1.00 c</text>
      </svg>

      <div className="px-4 pt-2">
        <SceneSlider label="Source speed" value={v} min={0} max={0.5} step={0.05} unit="c" onChange={setV} />
        <p className="mt-2 pb-4 text-center text-xs text-muted">
          Speed up the source and the ball's measured speed climbs with it. The light's never budges from c — the one speed every observer agrees on.
        </p>
      </div>
    </div>
  )
}

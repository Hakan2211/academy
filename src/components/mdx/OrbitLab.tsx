import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

// A live two-body gravity sim. Pick the planet's launch speed as a multiple of
// the circular-orbit speed: too slow and it falls in, just right gives a
// circle, faster gives an ellipse, and ~1.41× (√2) is escape velocity.
const CX = 180
const CY = 160
const R0 = 110
const GM = 60000

export function OrbitLab() {
  const [factor, setFactor] = useState(1)
  const planetRef = useRef<SVGCircleElement>(null)
  const trailRef = useRef<SVGPolylineElement>(null)

  useEffect(() => {
    const vCirc = Math.sqrt(GM / R0)
    let x = CX + R0
    let y = CY
    let vx = 0
    let vy = -factor * vCirc
    let trail: Array<string> = []
    let raf = 0

    const reset = () => {
      x = CX + R0
      y = CY
      vx = 0
      vy = -factor * vCirc
      trail = []
    }

    const loop = () => {
      // a few integration substeps per frame for stability
      for (let i = 0; i < 6; i++) {
        const dx = CX - x
        const dy = CY - y
        const r = Math.max(8, Math.hypot(dx, dy))
        const aMag = GM / (r * r)
        const ax = (aMag * dx) / r
        const ay = (aMag * dy) / r
        const dt = 0.02
        vx += ax * dt
        vy += ay * dt
        x += vx * dt
        y += vy * dt
      }

      const dist = Math.hypot(CX - x, CY - y)
      if (!Number.isFinite(x) || !Number.isFinite(y) || dist > 200 || dist < 11) {
        reset()
      }

      trail.push(`${x.toFixed(1)},${y.toFixed(1)}`)
      if (trail.length > 240) trail.shift()
      trailRef.current?.setAttribute('points', trail.join(' '))
      planetRef.current?.setAttribute('cx', String(x))
      planetRef.current?.setAttribute('cy', String(y))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [factor])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="h-80 w-full bg-[#0d1326]">
        <svg viewBox="0 0 360 320" className="h-full w-full">
          {/* star */}
          <circle cx={CX} cy={CY} r="16" fill="#fdcb6e" opacity="0.25" />
          <circle cx={CX} cy={CY} r="9" fill="#fdcb6e" />
          {/* orbit trail */}
          <polyline ref={trailRef} points="" fill="none" stroke="#6c5ce7" strokeWidth="2" />
          {/* planet */}
          <circle ref={planetRef} cx={CX + R0} cy={CY} r="7" fill="#74b9ff" />
        </svg>
      </div>

      <div className="p-4">
        <SceneSlider
          label="Launch speed (× circular)"
          value={factor}
          min={0.5}
          max={1.6}
          step={0.05}
          unit="×"
          onChange={setFactor}
        />
      </div>

      <p className="border-t border-border bg-surface-2 px-4 py-3 text-center text-sm text-muted">
        Too slow → falls in · ~1.0× → circle · between → ellipse · ~1.41× → escapes
      </p>
    </div>
  )
}

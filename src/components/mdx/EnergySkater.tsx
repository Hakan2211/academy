import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

// A ball rolling in a frictionless (or not) parabolic valley. A parabolic bowl
// makes the motion exact simple-harmonic, so kinetic energy (green) and
// potential energy (blue) trade back and forth while their sum stays put. Turn
// up friction and watch the total bleed away into heat (orange) — the same
// component serves Kinetic/Potential, Conservation, and Efficiency lessons.
export function EnergySkater({ friction: frictionInit = 0 }: { friction?: number }) {
  const [friction, setFriction] = useState(frictionInit)

  const ballRef = useRef<SVGCircleElement>(null)
  const keRef = useRef<SVGRectElement>(null)
  const peRef = useRef<SVGRectElement>(null)
  const heatRef = useRef<SVGRectElement>(null)
  const totalRef = useRef<SVGLineElement>(null)

  // Bowl geometry (SVG coords; y grows downward, so the bottom is the largest y)
  const cx = 160
  const halfW = 120
  const bottomY = 185
  const topY = 65
  const ballR = 12
  const baseY = 185 // bar baseline
  const Hbar = 130 // bar height for full energy

  useEffect(() => {
    let raf = 0
    let last = 0
    let start = 0
    let amp = 1 // amplitude as a fraction of the bowl half-width (1 = full)
    const omega = (2 * Math.PI) / 2500 // period ~2.5s

    const loop = (now: number) => {
      if (!last) {
        last = now
        start = now
      }
      const dt = Math.min(50, now - last)
      last = now

      // Friction slowly drains the swing amplitude; energy = amp² (frictionless
      // keeps amp = 1 forever). Relaunch from the top once it nearly stops.
      if (friction > 0) {
        amp *= Math.exp(-friction * 0.00006 * dt)
        if (amp < 0.12) {
          amp = 1
          start = now
        }
      }

      const phase = (now - start) * omega
      const u = amp * Math.cos(phase) // horizontal position in [-1, 1]
      const peFrac = u * u // ∝ height in the parabola
      const mech = amp * amp // KE + PE still available
      const keFrac = mech - peFrac
      const heatFrac = 1 - mech

      const bx = cx + halfW * u
      const by = bottomY - (bottomY - topY) * u * u - ballR
      ballRef.current?.setAttribute('cx', String(bx))
      ballRef.current?.setAttribute('cy', String(by))

      const setBar = (el: SVGRectElement | null, frac: number) => {
        if (!el) return
        const h = Math.max(0, frac) * Hbar
        el.setAttribute('height', String(h))
        el.setAttribute('y', String(baseY - h))
      }
      setBar(keRef.current, keFrac)
      setBar(peRef.current, peFrac)
      setBar(heatRef.current, heatFrac)

      const totalY = baseY - mech * Hbar
      totalRef.current?.setAttribute('y1', String(totalY))
      totalRef.current?.setAttribute('y2', String(totalY))

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [friction])

  // Parabolic bowl path
  let bowl = ''
  for (let i = 0; i <= 40; i++) {
    const u = -1 + (2 * i) / 40
    const x = cx + halfW * u
    const y = bottomY - (bottomY - topY) * u * u
    bowl += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)} `
  }

  const bars: Array<{ x: number; ref: typeof keRef; color: string; label: string }> = [
    { x: 330, ref: keRef, color: '#00b894', label: 'KE' },
    { x: 375, ref: peRef, color: '#74b9ff', label: 'PE' },
    { x: 420, ref: heatRef, color: '#e17055', label: 'Heat' },
  ]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 480 240" className="w-full">
        {/* the bowl */}
        <path d={bowl.trim()} fill="none" stroke="var(--color-border)" strokeWidth="3" />
        {/* the rolling ball */}
        <circle ref={ballRef} cx={cx} cy={topY - ballR} r={ballR} fill="var(--color-accent)" />

        {/* energy bars */}
        <line x1="318" y1={baseY} x2="462" y2={baseY} stroke="var(--color-border)" strokeWidth="2" />
        {bars.map((b) => (
          <g key={b.label}>
            <rect ref={b.ref} x={b.x} y={baseY} width="26" height="0" rx="3" fill={b.color} />
            <text x={b.x + 13} y={baseY + 16} fill={b.color} fontSize="11" textAnchor="middle">
              {b.label}
            </text>
          </g>
        ))}
        {/* total-mechanical-energy marker — drops only as heat appears */}
        <line
          ref={totalRef}
          x1="320"
          y1={baseY - Hbar}
          x2="462"
          y2={baseY - Hbar}
          stroke="var(--color-ink)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        <text x="391" y="48" fill="var(--color-muted)" fontSize="10" textAnchor="middle">
          total
        </text>
      </svg>

      <div className="px-4 pb-4">
        <SceneSlider
          label="Friction"
          value={friction}
          min={0}
          max={10}
          step={1}
          unit=""
          onChange={setFriction}
        />
        <p className="mt-2 text-center text-xs text-muted">
          {friction === 0
            ? 'No friction: KE and PE swap, but their total never changes.'
            : 'Friction bleeds the total away into heat — the swing dies down.'}
        </p>
      </div>
    </div>
  )
}

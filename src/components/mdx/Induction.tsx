import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

const RED = '#e17055'
const BLUE = '#0984e3'
const BASE = 135 // magnet centre when phase = 0
const AMP = 65
const PIVOT_X = 250
const PIVOT_Y = 210

// Move a magnet in and out of a coil and a current appears from nowhere — even
// though nothing is connected to a battery. It's the *changing* magnetic field
// that drives it (Faraday's law). Hold still and the meter reads zero; move
// faster and the deflection grows; reverse the motion and the current flips.
export function Induction() {
  const [speed, setSpeed] = useState(3)
  const speedRef = useRef(speed)
  const magRef = useRef<SVGGElement>(null)
  const needleRef = useRef<SVGLineElement>(null)
  const labelRef = useRef<SVGTextElement>(null)

  useEffect(() => { speedRef.current = speed }, [speed])

  useEffect(() => {
    let raf = 0
    let last = 0
    let phase = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      const omega = 0.0008 * speedRef.current
      phase += omega * dt
      const mx = BASE + AMP * Math.sin(phase)
      const v = AMP * omega * Math.cos(phase)
      const L = 1 / (1 + Math.exp(-(mx - 150) / 18))
      const dPhi = (L * (1 - L)) / 18
      const emf = dPhi * v
      const deg = Math.max(-58, Math.min(58, emf * 24000))

      magRef.current?.setAttribute('transform', `translate(${(mx - BASE).toFixed(1)} 0)`)
      needleRef.current?.setAttribute('transform', `rotate(${deg.toFixed(1)} ${PIVOT_X} ${PIVOT_Y})`)
      if (labelRef.current) {
        labelRef.current.textContent =
          Math.abs(deg) < 4 ? 'no current' : deg > 0 ? 'current ▶' : '◀ current'
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 250" className="w-full">
        {/* coil (turns seen edge-on) */}
        {[150, 167, 184, 201, 218, 235, 252].map((x) => (
          <ellipse key={x} cx={x} cy={110} rx="9" ry="34" fill="none" stroke="#b08968" strokeWidth="3" />
        ))}
        {/* leads down to the meter */}
        <path d="M 150 144 L 150 200 L 214 200" fill="none" stroke="var(--color-border)" strokeWidth="2" />
        <path d="M 252 144 L 286 144 L 286 200 L 286 200" fill="none" stroke="var(--color-border)" strokeWidth="2" />

        {/* the bar magnet, moving in and out */}
        <g ref={magRef}>
          <rect x={BASE - 28} y="96" width="28" height="28" fill={RED} />
          <rect x={BASE} y="96" width="28" height="28" fill={BLUE} />
          <text x={BASE - 14} y="115" fill="#fff" fontSize="13" fontWeight="700" textAnchor="middle">N</text>
          <text x={BASE + 14} y="115" fill="#fff" fontSize="13" fontWeight="700" textAnchor="middle">S</text>
        </g>

        {/* galvanometer */}
        <path d={`M ${PIVOT_X - 46} ${PIVOT_Y} A 46 46 0 0 1 ${PIVOT_X + 46} ${PIVOT_Y}`} fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="2" />
        <line x1={PIVOT_X} y1={PIVOT_Y} x2={PIVOT_X} y2={PIVOT_Y - 44} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="2 3" />
        <text x={PIVOT_X} y={PIVOT_Y - 50} fill="var(--color-muted)" fontSize="10" textAnchor="middle">0</text>
        <line ref={needleRef} x1={PIVOT_X} y1={PIVOT_Y} x2={PIVOT_X} y2={PIVOT_Y - 40} stroke={RED} strokeWidth="2.5" />
        <circle cx={PIVOT_X} cy={PIVOT_Y} r="4" fill="var(--color-ink)" />
        <text ref={labelRef} x={PIVOT_X} y={PIVOT_Y + 24} fill="var(--color-ink)" fontSize="12" fontWeight="600" textAnchor="middle">no current</text>
      </svg>

      <div className="px-4 pb-4">
        <SceneSlider label="How fast you move the magnet" value={speed} min={1} max={5} step={0.5} unit="×" onChange={setSpeed} />
        <p className="mt-2 text-center text-xs text-muted">
          A faster-changing field induces a bigger voltage. The current only flows while the field is changing.
        </p>
      </div>
    </div>
  )
}

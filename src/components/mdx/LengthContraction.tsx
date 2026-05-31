import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

const L0 = 200 // rest length in px
const REF_X = 90 // left edge of both ships
const Y = 96

// Space is no more absolute than time. A fast-moving object is measured as
// SHORTER along its direction of travel — by the same factor γ that slows its
// clock. The ship's own crew notice nothing; it's the observer they fly past who
// sees them squashed. Push toward c and the ship shrinks toward nothing.
export function LengthContraction() {
  const [beta, setBeta] = useState(0.6)
  const betaRef = useRef(beta)
  const shipRef = useRef<SVGGElement>(null)

  useEffect(() => { betaRef.current = beta }, [beta])

  useEffect(() => {
    let raf = 0
    let last = 0
    let x = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      x += betaRef.current * 0.12 * dt
      if (x > 150) x = 0
      shipRef.current?.setAttribute('transform', `translate(${x.toFixed(1)},0)`)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const gamma = 1 / Math.sqrt(1 - beta * beta)
  const L = L0 / gamma // contracted length
  const nose = 22

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 400 180" className="w-full">
        {/* rest-length reference */}
        <line x1={REF_X} y1="44" x2={REF_X + L0} y2="44" stroke="var(--color-muted)" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1={REF_X} y1="38" x2={REF_X} y2="50" stroke="var(--color-muted)" strokeWidth="1.5" />
        <line x1={REF_X + L0} y1="38" x2={REF_X + L0} y2="50" stroke="var(--color-muted)" strokeWidth="1.5" />
        <text x={REF_X + L0 / 2} y="32" fill="var(--color-muted)" fontSize="11" textAnchor="middle">rest length L₀</text>

        {/* contracted ship (drifting) */}
        <g ref={shipRef}>
          <rect x={REF_X} y={Y - 18} width={L - nose} height="36" rx="6" fill="var(--color-accent-2)" opacity="0.85" />
          <path d={`M ${REF_X + L - nose} ${Y - 18} L ${REF_X + L} ${Y} L ${REF_X + L - nose} ${Y + 18} Z`} fill="var(--color-accent-2)" />
          <circle cx={REF_X + 26} cy={Y} r="7" fill="var(--color-surface)" opacity="0.7" />
        </g>

        <text x={REF_X} y="150" fill="var(--color-muted)" fontSize="11">
          measured length = L₀ / γ
        </text>
        <text x={REF_X + L0} y="150" fill="var(--color-ink)" fontSize="12" fontWeight="700" textAnchor="end">
          {(100 / gamma).toFixed(0)}% of L₀
        </text>
      </svg>

      <div className="px-4 pt-2">
        <SceneSlider label="Ship speed" value={beta} min={0} max={0.95} step={0.05} unit="c" onChange={setBeta} />
        <p className="mt-2 pb-4 text-center text-xs text-muted">
          γ = {gamma.toFixed(2)}. Only the direction of motion contracts — height is untouched. At low speed there's no visible change; near c the ship collapses toward a sliver.
        </p>
      </div>
    </div>
  )
}

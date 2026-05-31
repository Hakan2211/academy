import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

const X0 = 44
const X1 = 316
const Y = 104
const N = 12

// Current is charge on the move. Each dot is charge drifting through the wire;
// turn up the amps and they sweep past any point faster — because current is
// exactly the amount of charge flowing past per second. The arrow marks the
// conventional current direction; the ammeter reads how much.
export function CurrentFlow() {
  const [amps, setAmps] = useState(2)
  const ampsRef = useRef(amps)
  const dotRefs = useRef<Array<SVGCircleElement | null>>([])

  useEffect(() => {
    ampsRef.current = amps
  }, [amps])

  useEffect(() => {
    const xs = Array.from({ length: N }, (_, i) => X0 + (i / N) * (X1 - X0))
    let raf = 0
    let last = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      const speed = 0.012 * ampsRef.current
      for (let i = 0; i < N; i++) {
        xs[i] += speed * dt
        if (xs[i] > X1) xs[i] -= X1 - X0
        dotRefs.current[i]?.setAttribute('cx', xs[i].toFixed(1))
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 180" className="w-full">
        {/* current direction arrow */}
        <g stroke="var(--color-muted)" strokeWidth="2" fill="none">
          <line x1="150" y1="56" x2="210" y2="56" />
          <path d="M 202 50 L 210 56 L 202 62" />
        </g>
        <text x="180" y="44" fill="var(--color-muted)" fontSize="13" textAnchor="middle">current I</text>

        {/* wire */}
        <line x1={X0 - 4} y1={Y} x2={X1 + 4} y2={Y} stroke="#b08968" strokeWidth="16" strokeLinecap="round" opacity="0.45" />
        <line x1={X0 - 4} y1={Y} x2={X1 + 4} y2={Y} stroke="var(--color-border)" strokeWidth="16" strokeLinecap="round" fill="none" opacity="0.15" />

        {/* drifting charges */}
        {Array.from({ length: N }).map((_, i) => (
          <circle
            key={i}
            ref={(el) => { dotRefs.current[i] = el }}
            cx={X0}
            cy={Y}
            r="5.5"
            fill="var(--color-accent-2)"
          />
        ))}

        {/* ammeter */}
        <circle cx="180" cy={Y} r="0" />
        <text x="180" y="150" fill="var(--color-ink)" fontSize="14" fontWeight="600" textAnchor="middle">
          {amps.toFixed(1)} A
        </text>
      </svg>

      <div className="px-4 pb-4">
        <SceneSlider label="Current" value={amps} min={0.5} max={5} step={0.5} unit="A" onChange={setAmps} />
        <p className="mt-2 text-center text-xs text-muted">
          More amps = more charge flowing past each second. One amp is about 6 × 10¹⁸ charges per second.
        </p>
      </div>
    </div>
  )
}

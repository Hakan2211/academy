import { useEffect, useRef } from 'react'

// An object moving in a circle at steady speed. Its velocity (teal) always
// points along the path (tangent); the force keeping it turning (red) always
// points toward the center. That inward force is "centripetal".
export function CircularMotion() {
  const groupRef = useRef<SVGGElement>(null)
  const cx = 250
  const cy = 120
  const R = 80

  useEffect(() => {
    let raf = 0
    let t0 = 0
    const period = 3600
    const loop = (now: number) => {
      if (!t0) t0 = now
      const tau = ((now - t0) % period) / period
      groupRef.current?.setAttribute('transform', `rotate(${tau * 360} ${cx} ${cy})`)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 500 240" className="w-full">
        {/* orbit path */}
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--color-border)" strokeWidth="2" strokeDasharray="3 5" />
        {/* center */}
        <circle cx={cx} cy={cy} r="4" fill="var(--color-muted)" />

        {/* rotating object with its two arrows (ball drawn at the right point) */}
        <g ref={groupRef}>
          {/* centripetal force: from ball toward center */}
          <line x1={cx + R} y1={cy} x2={cx + 16} y2={cy} stroke="#e17055" strokeWidth="4" />
          <polygon points={`${cx + 16},${cy} ${cx + 26},${cy - 6} ${cx + 26},${cy + 6}`} fill="#e17055" />
          {/* velocity: tangent (upward at this point) */}
          <line x1={cx + R} y1={cy} x2={cx + R} y2={cy - 60} stroke="#00cec9" strokeWidth="4" />
          <polygon points={`${cx + R},${cy - 60} ${cx + R - 6},${cy - 50} ${cx + R + 6},${cy - 50}`} fill="#00cec9" />
          {/* the object */}
          <circle cx={cx + R} cy={cy} r="11" fill="#fdcb6e" />
        </g>

        {/* legend (static) */}
        <g>
          <circle cx="300" cy="210" r="6" fill="#00cec9" />
          <text x="312" y="214" fill="var(--color-muted)" fontSize="12">velocity (tangent)</text>
          <circle cx="120" cy="210" r="6" fill="#e17055" />
          <text x="132" y="214" fill="var(--color-muted)" fontSize="12">force (toward center)</text>
        </g>
      </svg>
    </div>
  )
}

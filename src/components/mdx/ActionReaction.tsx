import { useEffect, useRef } from 'react'

// Two objects in contact push each other apart with equal, opposite forces
// (Newton's third law). The force arrows are the SAME length; the blocks recoil
// in opposite directions.
export function ActionReaction() {
  const groupA = useRef<SVGGElement>(null)
  const groupB = useRef<SVGGElement>(null)

  useEffect(() => {
    let raf = 0
    let t0 = 0
    const period = 4200
    const loop = (now: number) => {
      if (!t0) t0 = now
      const tau = ((now - t0) % period) / period
      // hold together, then push apart, then hold apart
      let d: number
      if (tau < 0.2) d = 0
      else if (tau < 0.6) d = ((tau - 0.2) / 0.4) * 110
      else d = 110
      groupA.current?.setAttribute('transform', `translate(${-d},0)`)
      groupB.current?.setAttribute('transform', `translate(${d},0)`)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 500 200" className="w-full">
        {/* Block A (left) */}
        <g ref={groupA}>
          <rect x="205" y="80" width="50" height="50" rx="6" fill="#74b9ff" />
          <text x="230" y="111" fill="#0d1326" fontSize="16" textAnchor="middle" fontWeight="700">A</text>
          {/* force on A, pointing left */}
          <line x1="205" y1="105" x2="145" y2="105" stroke="#e17055" strokeWidth="5" />
          <polygon points="145,105 155,99 155,111" fill="#e17055" />
          <text x="175" y="90" fill="#e17055" fontSize="12" textAnchor="middle">force on A</text>
        </g>

        {/* Block B (right) */}
        <g ref={groupB}>
          <rect x="245" y="80" width="50" height="50" rx="6" fill="#00b894" />
          <text x="270" y="111" fill="#0d1326" fontSize="16" textAnchor="middle" fontWeight="700">B</text>
          {/* force on B, pointing right — same length as on A */}
          <line x1="295" y1="105" x2="355" y2="105" stroke="#e17055" strokeWidth="5" />
          <polygon points="355,105 345,99 345,111" fill="#e17055" />
          <text x="325" y="90" fill="#e17055" fontSize="12" textAnchor="middle">force on B</text>
        </g>

        <text x="250" y="170" fill="var(--color-ink)" fontSize="14" textAnchor="middle" fontWeight="600">
          Equal in size, opposite in direction
        </text>
        <text x="250" y="190" fill="var(--color-muted)" fontSize="12" textAnchor="middle">
          …and the two forces act on different objects
        </text>
      </svg>
    </div>
  )
}

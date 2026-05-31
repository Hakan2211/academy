import { useEffect, useRef } from 'react'

// Two objects moving at the SAME speed (4 m/s) in OPPOSITE directions. Speed is
// just the magnitude; velocity carries the sign/direction too — so these have
// equal speed but different velocity (+4 vs −4 m/s).
export function SpeedCompare() {
  const rightRef = useRef<SVGCircleElement>(null)
  const leftRef = useRef<SVGCircleElement>(null)
  const Lx = 60
  const Rx = 440

  useEffect(() => {
    let raf = 0
    let t0 = 0
    const period = 3200
    const loop = (now: number) => {
      if (!t0) t0 = now
      const tau = ((now - t0) % period) / period
      rightRef.current?.setAttribute('cx', String(Lx + tau * (Rx - Lx)))
      leftRef.current?.setAttribute('cx', String(Rx - tau * (Rx - Lx)))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 500 220" className="w-full">
        {/* top: moving right (+4 m/s) */}
        <line x1={Lx} y1="70" x2={Rx} y2="70" stroke="var(--color-border)" strokeWidth="3" />
        <polygon points={`${Rx + 4},70 ${Rx - 8},64 ${Rx - 8},76`} fill="var(--color-border)" />
        <circle ref={rightRef} cx={Lx} cy="70" r="10" fill="#00b894" />
        <text x={Lx} y="44" fill="#00b894" fontSize="13">
          velocity = +4 m/s →
        </text>

        {/* bottom: moving left (−4 m/s) */}
        <line x1={Lx} y1="160" x2={Rx} y2="160" stroke="var(--color-border)" strokeWidth="3" />
        <polygon points={`${Lx - 4},160 ${Lx + 8},154 ${Lx + 8},166`} fill="var(--color-border)" />
        <circle ref={leftRef} cx={Rx} cy="160" r="10" fill="#74b9ff" />
        <text x={Lx} y="190" fill="#74b9ff" fontSize="13">
          ← velocity = −4 m/s
        </text>

        {/* center note */}
        <text
          x="250"
          y="118"
          fill="var(--color-ink)"
          fontSize="14"
          fontWeight="600"
          textAnchor="middle"
        >
          Same speed (4 m/s), opposite velocity
        </text>
      </svg>
    </div>
  )
}

import { useEffect, useRef } from 'react'

// A light ball and a heavy ball, released together, fall at the SAME rate (no
// air resistance) and land at the same instant — mass doesn't change g.
export function FreeFall() {
  const lightRef = useRef<SVGCircleElement>(null)
  const heavyRef = useRef<SVGCircleElement>(null)
  const yTop = 50
  const yGround = 210

  useEffect(() => {
    let raf = 0
    let t0 = 0
    const period = 3000
    const loop = (now: number) => {
      if (!t0) t0 = now
      const tau = ((now - t0) % period) / period
      // accelerate (y ~ t²) for the first 70%, then hold on the ground
      const fall = tau < 0.7 ? (tau / 0.7) * (tau / 0.7) : 1
      const cy = yTop + fall * (yGround - yTop)
      lightRef.current?.setAttribute('cy', String(cy))
      heavyRef.current?.setAttribute('cy', String(cy))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 400 250" className="w-full">
        {/* ground */}
        <line x1="30" y1={yGround + 16} x2="370" y2={yGround + 16} stroke="var(--color-border)" strokeWidth="3" />

        {/* light ball */}
        <circle ref={lightRef} cx="140" cy={yTop} r="11" fill="#74b9ff" />
        <text x="140" y="244" fill="#74b9ff" fontSize="12" textAnchor="middle">light</text>

        {/* heavy ball */}
        <circle ref={heavyRef} cx="270" cy={yTop} r="22" fill="#00b894" />
        <text x="270" y="244" fill="#00b894" fontSize="12" textAnchor="middle">heavy</text>

        <text x="200" y="30" fill="var(--color-muted)" fontSize="13" textAnchor="middle">
          same acceleration g — they land together
        </text>
      </svg>
    </div>
  )
}

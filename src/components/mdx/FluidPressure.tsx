import { useEffect, useRef } from 'react'

const SURFACE = 60
const RIGHT = 180
const GROUND = 256
const G = 0.0004 // px / ms²
const HOLES = [110, 165, 215] // y of each hole — deeper down the wall
const K = 16 // droplets per stream

// A tank with three holes punched down one wall. The deeper the hole, the
// greater the weight of water pressing on it — so the jet bursts out faster and
// arcs farther. Pressure in a fluid grows with depth, and this is the proof you
// can watch. (The middle jet flies farthest: deep enough for speed, high enough
// for hang-time — the classic result.)
export function FluidPressure() {
  const dotRefs = useRef<Array<SVGCircleElement | null>>([])

  useEffect(() => {
    const streams = HOLES.map((y) => {
      const fall = GROUND - y
      const T = Math.sqrt((2 * fall) / G)
      const vx = 0.012 * Math.sqrt(y - SURFACE)
      return { y, T, vx }
    })
    const ts = new Array(HOLES.length * K)
    for (let h = 0; h < HOLES.length; h++) {
      for (let j = 0; j < K; j++) ts[h * K + j] = (j / K) * streams[h].T
    }

    let raf = 0
    let last = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      for (let h = 0; h < HOLES.length; h++) {
        const s = streams[h]
        for (let j = 0; j < K; j++) {
          const idx = h * K + j
          let t = ts[idx] + dt
          if (t > s.T) t -= s.T
          ts[idx] = t
          const x = RIGHT + s.vx * t
          const y = s.y + 0.5 * G * t * t
          const el = dotRefs.current[idx]
          if (el) {
            el.setAttribute('cx', x.toFixed(1))
            el.setAttribute('cy', y.toFixed(1))
          }
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 280" className="w-full">
        {/* ground */}
        <line x1="40" y1={GROUND + 2} x2="350" y2={GROUND + 2} stroke="var(--color-border)" strokeWidth="2" />
        {/* tank body (open right wall where the holes are) */}
        <rect x="70" y={SURFACE} width={RIGHT - 70} height={GROUND - SURFACE} fill="var(--color-accent-2)" opacity="0.18" />
        <line x1="70" y1="40" x2="70" y2={GROUND} stroke="var(--color-border)" strokeWidth="2" />
        <line x1="70" y1={GROUND} x2={RIGHT} y2={GROUND} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={RIGHT} y1="40" x2={RIGHT} y2={GROUND} stroke="var(--color-border)" strokeWidth="2" />
        <line x1="70" y1={SURFACE} x2={RIGHT} y2={SURFACE} stroke="var(--color-accent-2)" strokeWidth="2" opacity="0.7" />
        <text x="124" y="52" fill="var(--color-muted)" fontSize="11" textAnchor="middle">surface</text>

        {/* pressure arrows: longer = more pressure, deeper down */}
        {HOLES.map((y, i) => (
          <g key={i}>
            <line x1={RIGHT - 14 - i * 12} y1={y} x2={RIGHT} y2={y} stroke="var(--color-ink)" strokeWidth="1.5" opacity="0.5" />
            <circle cx={RIGHT} cy={y} r="2.5" fill="var(--color-ink)" opacity="0.6" />
          </g>
        ))}

        {/* water jets */}
        {Array.from({ length: HOLES.length * K }).map((_, i) => (
          <circle
            key={i}
            ref={(el) => { dotRefs.current[i] = el }}
            cx={RIGHT}
            cy={SURFACE}
            r="2.6"
            fill="var(--color-accent-2)"
          />
        ))}
      </svg>

      <p className="px-4 pb-4 pt-1 text-center text-sm text-muted">
        Deeper holes feel more water pressing down, so they jet out harder. Pressure rises with depth.
      </p>
    </div>
  )
}

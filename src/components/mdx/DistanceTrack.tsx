import { useEffect, useRef } from 'react'

// Animated track: an object walks +8 m, then back 3 m. The colored arrows make
// the distinction concrete — distance is the whole path (11 m), displacement is
// the net change in position (+5 m).
export function DistanceTrack() {
  const ballRef = useRef<SVGCircleElement>(null)
  const Lx = 50
  const Rx = 450
  const trackY = 150
  const pxPerM = (Rx - Lx) / 10
  const xAt = (m: number) => Lx + m * pxPerM

  useEffect(() => {
    let raf = 0
    let t0 = 0
    const period = 5200
    const loop = (now: number) => {
      if (!t0) t0 = now
      const tau = ((now - t0) % period) / period
      let m: number
      if (tau < 0.35) m = (tau / 0.35) * 8
      else if (tau < 0.45) m = 8
      else if (tau < 0.78) m = 8 - ((tau - 0.45) / 0.33) * 3
      else m = 5
      ballRef.current?.setAttribute('cx', String(xAt(m)))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const ticks = [0, 2, 4, 6, 8, 10]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 500 230" className="w-full">
        <text x="50" y="24" fill="var(--color-muted)" fontSize="13">
          distance traveled = 8 m + 3 m = 11 m
        </text>

        {/* back leg (−3 m) */}
        <line x1={xAt(8)} y1="60" x2={xAt(5)} y2="60" stroke="#e17055" strokeWidth="3" />
        <polygon
          points={`${xAt(5)},60 ${xAt(5) + 9},55 ${xAt(5) + 9},65`}
          fill="#e17055"
        />
        <text
          x={(xAt(8) + xAt(5)) / 2}
          y="50"
          fill="#e17055"
          fontSize="13"
          textAnchor="middle"
        >
          −3 m
        </text>

        {/* forward leg (+8 m) */}
        <line x1={xAt(0)} y1="100" x2={xAt(8)} y2="100" stroke="#00b894" strokeWidth="3" />
        <polygon
          points={`${xAt(8)},100 ${xAt(8) - 9},95 ${xAt(8) - 9},105`}
          fill="#00b894"
        />
        <text
          x={(xAt(0) + xAt(8)) / 2}
          y="90"
          fill="#00b894"
          fontSize="13"
          textAnchor="middle"
        >
          +8 m
        </text>

        {/* the track */}
        <line
          x1={Lx}
          y1={trackY}
          x2={Rx}
          y2={trackY}
          stroke="var(--color-border)"
          strokeWidth="3"
        />
        {ticks.map((i) => (
          <g key={i}>
            <line
              x1={xAt(i)}
              y1={trackY - 5}
              x2={xAt(i)}
              y2={trackY + 5}
              stroke="var(--color-border)"
              strokeWidth="2"
            />
            <text
              x={xAt(i)}
              y={trackY + 22}
              fill="var(--color-muted)"
              fontSize="11"
              textAnchor="middle"
            >
              {i} m
            </text>
          </g>
        ))}

        {/* the moving object */}
        <circle ref={ballRef} cx={xAt(0)} cy={trackY} r="9" fill="#fdcb6e" />

        {/* net displacement (+5 m) */}
        <line x1={xAt(0)} y1="200" x2={xAt(5)} y2="200" stroke="#74b9ff" strokeWidth="3" />
        <polygon
          points={`${xAt(5)},200 ${xAt(5) - 9},195 ${xAt(5) - 9},205`}
          fill="#74b9ff"
        />
        <text
          x={(xAt(0) + xAt(5)) / 2}
          y="220"
          fill="#74b9ff"
          fontSize="13"
          textAnchor="middle"
        >
          displacement = +5 m
        </text>
      </svg>
    </div>
  )
}

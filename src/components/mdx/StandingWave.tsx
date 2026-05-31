import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

const X0 = 30
const X1 = 450
const L = X1 - X0
const MID = 100
const AMP = 30 // each wave; the standing pattern reaches 2·AMP

const ORDINAL = ['', 'fundamental', '2nd harmonic', '3rd harmonic', '4th harmonic', '5th harmonic']

// Two identical waves running in opposite directions add to a wave that doesn't
// travel — it stands. Some points (nodes) never move; others (antinodes) swing
// hardest. Pin both ends and only whole numbers of half-wavelengths fit, which
// is exactly why a string plays a fundamental note plus its harmonics.
export function StandingWave() {
  const [n, setN] = useState(2)
  const nRef = useRef(n)
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => { nRef.current = n }, [n])

  useEffect(() => {
    let raf = 0
    let start = 0
    const w = 2 * Math.PI * 0.7
    const loop = (now: number) => {
      if (!start) start = now
      const t = (now - start) / 1000
      const k = (nRef.current * Math.PI) / L
      const env = Math.cos(w * t)
      let d = ''
      for (let x = X0; x <= X1; x += 3) {
        const y = MID - 2 * AMP * Math.sin(k * (x - X0)) * env
        d += `${x === X0 ? 'M' : 'L'}${x},${y.toFixed(1)} `
      }
      pathRef.current?.setAttribute('d', d.trim())
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const nodes = Array.from({ length: n + 1 }, (_, i) => X0 + (L * i) / n)
  let upper = ''
  let lower = ''
  for (let x = X0; x <= X1; x += 4) {
    const e = 2 * AMP * Math.abs(Math.sin((n * Math.PI * (x - X0)) / L))
    upper += `${x === X0 ? 'M' : 'L'}${x},${(MID - e).toFixed(1)} `
    lower += `${x === X0 ? 'M' : 'L'}${x},${(MID + e).toFixed(1)} `
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 480 200" className="w-full">
        <line x1={X0} y1={MID} x2={X1} y2={MID} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="2 4" />
        {/* envelope the string sweeps between */}
        <path d={upper.trim()} fill="none" stroke="var(--color-muted)" strokeWidth="1" opacity="0.4" />
        <path d={lower.trim()} fill="none" stroke="var(--color-muted)" strokeWidth="1" opacity="0.4" />
        {/* the live standing wave */}
        <path ref={pathRef} d="" fill="none" stroke="var(--color-accent-2)" strokeWidth="3" strokeLinecap="round" />
        {/* nodes — points that never move */}
        {nodes.map((x, i) => (
          <circle key={i} cx={x} cy={MID} r="4" fill="var(--color-accent)" />
        ))}
      </svg>

      <div className="px-4 pt-2">
        <SceneSlider label="Harmonic (n)" value={n} min={1} max={5} step={1} unit="" onChange={setN} />
        <p className="mt-2 pb-4 text-center text-sm text-muted">
          n = {n} ({ORDINAL[n]}): {n + 1} nodes (dots) and {n} antinode{n > 1 ? 's' : ''}. Both ends are pinned.
        </p>
      </div>
    </div>
  )
}

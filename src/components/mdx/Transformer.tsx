import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

const NP = 500 // primary turns (fixed)
const VP = 230 // primary voltage (fixed)
const RING = 448 // core centre-line perimeter

function posAt(s: number) {
  let d = s * RING
  if (d < 120) return { x: 130 + d, y: 68 }
  d -= 120
  if (d < 104) return { x: 250, y: 68 + d }
  d -= 104
  if (d < 120) return { x: 250 - d, y: 172 }
  d -= 120
  return { x: 130, y: 172 - d }
}

function coilLoops(n: number, cx: number) {
  const count = Math.max(2, Math.min(12, n))
  const spacing = Math.min(13, 78 / (count - 1))
  const start = 120 - ((count - 1) * spacing) / 2
  return Array.from({ length: count }, (_, i) => (
    <ellipse key={i} cx={cx} cy={start + i * spacing} rx="18" ry="4.5" fill="none" stroke="#b08968" strokeWidth="2.5" />
  ))
}

// Two coils sharing one iron core. AC in the primary makes the core's magnetic
// field rise and fall, and that changing field induces a voltage in the
// secondary. The catch: output voltage scales with the *ratio of turns*. More
// turns on the secondary steps the voltage up; fewer steps it down. This is what
// makes the electricity grid possible.
export function Transformer() {
  const [ns, setNs] = useState(1000) // secondary turns
  const dotRefs = useRef<Array<SVGCircleElement | null>>([])

  useEffect(() => {
    const ss = Array.from({ length: 10 }, (_, i) => i / 10)
    let raf = 0
    let last = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      for (let i = 0; i < ss.length; i++) {
        ss[i] = (ss[i] + 0.00018 * dt) % 1
        const { x, y } = posAt(ss[i])
        const el = dotRefs.current[i]
        if (el) {
          el.setAttribute('cx', x.toFixed(1))
          el.setAttribute('cy', y.toFixed(1))
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const ratio = ns / NP
  const vs = VP * ratio
  const stepLabel = ratio > 1.02 ? 'step-up' : ratio < 0.98 ? 'step-down' : 'isolating (1:1)'

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 380 230" className="w-full">
        {/* iron core with a window */}
        <path
          d="M 110 50 H 270 V 190 H 110 Z M 150 86 H 230 V 154 H 150 Z"
          fill="var(--color-muted)"
          opacity="0.3"
          fillRule="evenodd"
        />

        {/* circulating flux */}
        {Array.from({ length: 10 }).map((_, i) => (
          <circle key={i} ref={(el) => { dotRefs.current[i] = el }} cx="130" cy="68" r="3" fill="var(--color-accent-2)" />
        ))}

        {/* coils */}
        {coilLoops(6, 130)}
        {coilLoops(Math.round(6 * ratio), 250)}

        {/* primary side */}
        <text x="90" y="40" fill="var(--color-muted)" fontSize="12" textAnchor="middle">primary</text>
        <text x="90" y="206" fill="var(--color-ink)" fontSize="13" fontWeight="600" textAnchor="middle">{VP} V</text>
        <text x="90" y="222" fill="var(--color-muted)" fontSize="11" textAnchor="middle">{NP} turns</text>

        {/* secondary side */}
        <text x="290" y="40" fill="var(--color-muted)" fontSize="12" textAnchor="middle">secondary</text>
        <text x="290" y="206" fill="#d63031" fontSize="13" fontWeight="600" textAnchor="middle">{Math.round(vs)} V</text>
        <text x="290" y="222" fill="var(--color-muted)" fontSize="11" textAnchor="middle">{ns} turns</text>

        <text x="190" y="22" fill="var(--color-ink)" fontSize="13" fontWeight="600" textAnchor="middle">{stepLabel}</text>
      </svg>

      <div className="px-4 pb-4">
        <SceneSlider label="Secondary turns" value={ns} min={100} max={1500} step={100} unit="" onChange={setNs} />
        <p className="mt-2 text-center text-xs text-muted">
          Vout / Vin = Nout / Nin. Transformers only work on AC — it's the *changing* field that links the coils.
        </p>
      </div>
    </div>
  )
}

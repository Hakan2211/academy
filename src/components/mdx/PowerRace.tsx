import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

const WORK = 600 // J — both hoists lift the same load the same height

// Two hoists raise identical loads to the same height: the same work either
// way. The faster one delivers more power, because power is work per unit time.
// Drag the fast hoist's time and watch its power (and its pace) change.
export function PowerRace() {
  const [tFast, setTFast] = useState(1.5) // seconds
  const tSlow = 3

  const fastRef = useRef<SVGRectElement>(null)
  const slowRef = useRef<SVGRectElement>(null)

  const bottomY = 188
  const topY = 52
  const lift = bottomY - topY

  useEffect(() => {
    let raf = 0
    let start = 0
    const cycle = Math.max(tFast, tSlow) * 1000 + 800

    const place = (el: SVGRectElement | null, p: number) => {
      el?.setAttribute('y', String(bottomY - p * lift))
    }

    const loop = (now: number) => {
      if (!start) start = now
      const phase = (now - start) % cycle
      place(fastRef.current, Math.min(1, phase / (tFast * 1000)))
      place(slowRef.current, Math.min(1, phase / (tSlow * 1000)))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [tFast])

  const pFast = Math.round(WORK / tFast)
  const pSlow = Math.round(WORK / tSlow)

  const lanes: Array<{
    x: number
    ref: typeof fastRef
    color: string
    name: string
    t: number
    p: number
  }> = [
    { x: 140, ref: fastRef, color: '#00b894', name: 'Fast hoist', t: tFast, p: pFast },
    { x: 340, ref: slowRef, color: '#74b9ff', name: 'Slow hoist', t: tSlow, p: pSlow },
  ]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 480 262" className="w-full">
        {/* target height line */}
        <line x1="40" y1={topY} x2="440" y2={topY} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4 4" />
        <text x="44" y={topY - 6} fill="var(--color-muted)" fontSize="11">
          same height
        </text>
        {/* ground */}
        <line x1="40" y1={bottomY + 22} x2="440" y2={bottomY + 22} stroke="var(--color-border)" strokeWidth="3" />

        {lanes.map((l) => (
          <g key={l.name}>
            {/* guide rail */}
            <line x1={l.x} y1={topY} x2={l.x} y2={bottomY + 22} stroke="var(--color-border)" strokeWidth="1" />
            {/* the rising load */}
            <rect ref={l.ref} x={l.x - 26} y={bottomY} width="52" height="26" rx="4" fill={l.color} />
            <text x={l.x} y={bottomY + 40} fill={l.color} fontSize="13" textAnchor="middle" fontWeight="600">
              {l.name}
            </text>
            <text x={l.x} y={bottomY + 56} fill="var(--color-muted)" fontSize="12" textAnchor="middle">
              {WORK} J in {l.t} s → {l.p} W
            </text>
          </g>
        ))}
      </svg>

      <div className="px-4 pb-4">
        <SceneSlider
          label="Fast hoist time"
          value={tFast}
          min={1}
          max={4}
          step={0.5}
          unit="s"
          onChange={setTFast}
        />
        <p className="mt-2 text-center text-xs text-muted">
          Same job, less time = more power. P = work ÷ time.
        </p>
      </div>
    </div>
  )
}

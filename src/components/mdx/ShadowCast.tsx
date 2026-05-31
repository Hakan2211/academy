import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

const WALL = 420
const CX = 235
const CY = 120
const R = 36

// Light travels in straight lines, so an opaque object carves a sharp shadow
// out of the rays that stream past it. Slide the lamp up and down and watch the
// shadow swing the opposite way and change size — pure straight-line geometry.
export function ShadowCast() {
  const [sy, setSy] = useState(120) // lamp height

  const sx = 46
  const t = (WALL - sx) / (CX - sx)
  const yTopWall = sy + t * (CY - R - sy)
  const yBotWall = sy + t * (CY + R - sy)

  // a few light rays that clear the object and reach the wall
  const lit = [30, 70, 170, 210].map((yWall) => ({ x1: sx, y1: sy, x2: WALL, y2: yWall }))

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 460 240" className="w-full">
        {/* light rays reaching the wall */}
        {lit.map((r, i) => (
          <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="#fdcb6e" strokeWidth="1" opacity="0.5" />
        ))}

        {/* shadow cone behind the object */}
        <polygon
          points={`${CX},${CY - R} ${WALL},${yTopWall} ${WALL},${yBotWall} ${CX},${CY + R}`}
          fill="var(--color-ink)"
          opacity="0.18"
        />

        {/* wall / screen */}
        <line x1={WALL} y1="16" x2={WALL} y2="224" stroke="var(--color-border)" strokeWidth="3" />
        <rect x={WALL} y={yTopWall} width="8" height={yBotWall - yTopWall} fill="var(--color-ink)" />
        <text x={WALL - 6} y="232" fill="var(--color-muted)" fontSize="11" textAnchor="end">screen</text>

        {/* the object */}
        <circle cx={CX} cy={CY} r={R} fill="var(--color-accent)" />

        {/* the lamp */}
        <circle cx={sx} cy={sy} r="10" fill="#fdcb6e" />
        <circle cx={sx} cy={sy} r="18" fill="none" stroke="#fdcb6e" strokeWidth="1" opacity="0.5" />
        <text x={sx} y={sy - 24} fill="#fdcb6e" fontSize="11" textAnchor="middle">lamp</text>
      </svg>

      <div className="px-4 pt-2">
        <SceneSlider label="Lamp height" value={sy} min={50} max={190} step={1} unit="" onChange={setSy} />
        <p className="mt-2 pb-4 text-center text-xs text-muted">
          Rays travel dead straight — the object blocks a cone of them, leaving a shadow on the screen.
        </p>
      </div>
    </div>
  )
}

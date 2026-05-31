import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

const PX = 210
const PY = 165
const L = 145

// The law of reflection: a ray bounces off a mirror at the same angle it
// arrived, both measured from the normal. Drag the angle and the two stay
// locked in step — the symmetry behind every mirror image.
export function MirrorReflect() {
  const [angle, setAngle] = useState(40) // degrees from the normal
  const a = (angle * Math.PI) / 180
  const sin = Math.sin(a)
  const cos = Math.cos(a)

  const incident = { x: PX - L * sin, y: PY - L * cos }
  const reflected = { x: PX + L * sin, y: PY - L * cos }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 420 220" className="w-full">
        {/* mirror surface + hatching */}
        <line x1="20" y1={PY} x2="400" y2={PY} stroke="var(--color-ink)" strokeWidth="3" />
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={i} x1={30 + i * 18} y1={PY} x2={22 + i * 18} y2={PY + 12} stroke="var(--color-border)" strokeWidth="1.5" />
        ))}

        {/* normal */}
        <line x1={PX} y1={PY} x2={PX} y2={PY - L - 8} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4 4" />
        <text x={PX + 6} y={PY - L} fill="var(--color-muted)" fontSize="11">normal</text>

        {/* incident ray */}
        <line x1={incident.x} y1={incident.y} x2={PX} y2={PY} stroke="#fdcb6e" strokeWidth="3" />
        <polygon
          points={`${PX},${PY} ${PX - 7 * sin - 6 * cos},${PY - 7 * cos + 6 * sin} ${PX - 14 * sin},${PY - 14 * cos}`}
          fill="#fdcb6e"
        />
        {/* reflected ray */}
        <line x1={PX} y1={PY} x2={reflected.x} y2={reflected.y} stroke="var(--color-accent-2)" strokeWidth="3" />
        <polygon
          points={`${reflected.x},${reflected.y} ${reflected.x - 7 * sin + 6 * cos},${reflected.y + 7 * cos + 6 * sin} ${reflected.x - 14 * sin},${reflected.y + 14 * cos}`}
          fill="var(--color-accent-2)"
        />

        <text x={PX - 40} y={PY - 18} fill="#fdcb6e" fontSize="13" textAnchor="middle">θᵢ</text>
        <text x={PX + 40} y={PY - 18} fill="var(--color-accent-2)" fontSize="13" textAnchor="middle">θᵣ</text>
      </svg>

      <div className="px-4 pt-2">
        <SceneSlider label="Angle of incidence" value={angle} min={10} max={80} step={1} unit="°" onChange={setAngle} />
        <p className="mt-2 pb-4 text-center text-sm text-muted">
          Angle of incidence = angle of reflection = {angle}° (measured from the normal).
        </p>
      </div>
    </div>
  )
}

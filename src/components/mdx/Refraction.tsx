import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

const PX = 210 // incidence point x
const PY = 140 // boundary y
const THETA1 = (45 * Math.PI) / 180 // fixed angle of incidence
const RAY = 132
const LAMBDA1 = 24 // incident wavelength in px

// Why a wave bends when it changes speed. Crossing into a slower medium it turns
// toward the normal and its wavelength shrinks (frequency is unchanged, so
// v = fλ forces λ down with v). Drag the speed ratio n = v₁/v₂ and watch the
// refracted ray swing and the wavefronts bunch up.
export function Refraction() {
  const [n, setN] = useState(1.5)
  const theta2 = Math.asin(Math.min(1, Math.sin(THETA1) / n))
  const lambda2 = LAMBDA1 / n

  // wavefront ticks perpendicular to a ray, spaced by wavelength
  const ticks = (
    dir: [number, number],
    perp: [number, number],
    lambda: number,
    sign: number,
  ) => {
    const out: Array<{ x1: number; y1: number; x2: number; y2: number }> = []
    const count = Math.floor(RAY / lambda)
    for (let i = 1; i <= count; i++) {
      const s = i * lambda
      const cx = PX + sign * s * dir[0]
      const cy = PY + sign * s * dir[1]
      out.push({
        x1: cx - 9 * perp[0],
        y1: cy - 9 * perp[1],
        x2: cx + 9 * perp[0],
        y2: cy + 9 * perp[1],
      })
    }
    return out
  }

  const inDir: [number, number] = [Math.sin(THETA1), Math.cos(THETA1)]
  const inPerp: [number, number] = [Math.cos(THETA1), -Math.sin(THETA1)]
  const refDir: [number, number] = [Math.sin(theta2), Math.cos(theta2)]
  const refPerp: [number, number] = [Math.cos(theta2), -Math.sin(theta2)]

  const inStart = { x: PX - RAY * inDir[0], y: PY - RAY * inDir[1] }
  const refEnd = { x: PX + RAY * refDir[0], y: PY + RAY * refDir[1] }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 420 280" className="w-full">
        {/* media */}
        <rect x="0" y="0" width="420" height={PY} fill="#0e1830" />
        <rect x="0" y={PY} width="420" height={280 - PY} fill="#14233f" />
        <line x1="0" y1={PY} x2="420" y2={PY} stroke="var(--color-border)" strokeWidth="2" />
        <text x="12" y="22" fill="var(--color-muted)" fontSize="12">fast medium (e.g. air)</text>
        <text x="12" y={PY + 22} fill="var(--color-muted)" fontSize="12">slow medium (e.g. glass)</text>

        {/* normal */}
        <line x1={PX} y1="20" x2={PX} y2="260" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4 4" />

        {/* incident + refracted rays */}
        <line x1={inStart.x} y1={inStart.y} x2={PX} y2={PY} stroke="var(--color-accent-2)" strokeWidth="3" />
        <line x1={PX} y1={PY} x2={refEnd.x} y2={refEnd.y} stroke="var(--color-accent)" strokeWidth="3" />

        {/* wavefronts */}
        {ticks(inDir, inPerp, LAMBDA1, -1).map((t, i) => (
          <line key={`i${i}`} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="var(--color-accent-2)" strokeWidth="1.5" opacity="0.7" />
        ))}
        {ticks(refDir, refPerp, lambda2, 1).map((t, i) => (
          <line key={`r${i}`} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="var(--color-accent)" strokeWidth="1.5" opacity="0.7" />
        ))}

        <text x={PX + 8} y="34" fill="var(--color-accent-2)" fontSize="13">θ₁</text>
        <text x={PX + 8} y={PY + 40} fill="var(--color-accent)" fontSize="13">θ₂</text>
      </svg>

      <div className="px-4 pt-2">
        <SceneSlider label="Speed ratio n = v₁ / v₂" value={n} min={1} max={2.5} step={0.1} unit="" onChange={setN} />
        <p className="mt-2 pb-4 text-center text-sm text-muted">
          θ₂ = {((theta2 * 180) / Math.PI).toFixed(0)}° &lt; θ₁ = 45° — bent toward the normal, wavelength shrunk to 1/{n.toFixed(1)}.
        </p>
      </div>
    </div>
  )
}

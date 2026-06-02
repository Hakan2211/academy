import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

// A bare sphere is just a flat disc — what makes it look round and solid is
// SHADING. For each point on the surface we know its NORMAL (the direction it
// faces). Diffuse brightness is the normal dotted with the direction to the light:
// faces aimed at the light are bright, faces turned away fall into shadow. A tight
// SPECULAR highlight where the surface reflects the light straight at us adds the
// glossy sheen. Move the light and watch flat numbers become a 3D form.

const SIZE = 260
const C = SIZE / 2
const R = 96
// A grid of little surface patches across the sphere's disc.
const STEP = 7

export function ShadingLab() {
  const [angle, setAngle] = useState(35) // light azimuth, degrees
  const [shine, setShine] = useState(0.6) // specular strength

  const la = (angle * Math.PI) / 180
  // Light direction (points TOWARD the light). Slightly toward the viewer (+z).
  const lx = Math.cos(la)
  const ly = -Math.sin(la)
  const lz = 0.55
  const ll = Math.hypot(lx, ly, lz)
  const Lx = lx / ll
  const Ly = ly / ll
  const Lz = lz / ll

  type Patch = { x: number; y: number; b: number; s: number }
  const patches: Array<Patch> = []
  for (let py = -R; py <= R; py += STEP) {
    for (let px = -R; px <= R; px += STEP) {
      const d2 = px * px + py * py
      if (d2 > R * R) continue
      // Surface normal of a sphere at this screen point.
      const nx = px / R
      const ny = py / R
      const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny))
      // Diffuse term: N . L, clamped.
      const diff = Math.max(0, nx * Lx + ny * Ly + nz * Lz)
      // Specular: reflect light about normal, compare to view dir (0,0,1).
      const dot = nx * Lx + ny * Ly + nz * Lz
      const rz = 2 * dot * nz - Lz
      const spec = shine * Math.pow(Math.max(0, rz), 24)
      patches.push({ x: C + px, y: C + py, b: 0.12 + 0.88 * diff, s: Math.min(1, spec) })
    }
  }

  // Light marker position around the sphere.
  const markX = C + (R + 24) * Math.cos(la)
  const markY = C - (R + 24) * Math.sin(la)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto block w-full max-w-[300px]">
        <rect x="0" y="0" width={SIZE} height={SIZE} rx="12" fill="var(--color-surface-2)" />
        {/* faint full disc so the silhouette reads even in deep shadow */}
        <circle cx={C} cy={C} r={R} fill="#0a0f1f" />
        {patches.map((p, i) => (
          <rect
            key={i}
            x={p.x - STEP / 2}
            y={p.y - STEP / 2}
            width={STEP + 0.6}
            height={STEP + 0.6}
            fill="var(--color-accent)"
            opacity={Math.min(1, p.b + p.s)}
          />
        ))}
        {/* specular sparkle layer */}
        {patches.filter((p) => p.s > 0.15).map((p, i) => (
          <rect key={`s${i}`} x={p.x - STEP / 2} y={p.y - STEP / 2} width={STEP + 0.6} height={STEP + 0.6} fill="#ffffff" opacity={p.s} />
        ))}
        {/* light source marker */}
        <line x1={markX} y1={markY} x2={C} y2={C} stroke="var(--color-warn)" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
        <circle cx={markX} cy={markY} r="6" fill="var(--color-warn)" />
      </svg>

      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        <SceneSlider label="Light angle" value={angle} min={0} max={360} step={1} unit="°" onChange={(v) => setAngle(Math.round(v))} />
        <SceneSlider label="Glossiness" value={shine} min={0} max={1} step={0.05} unit="" onChange={setShine} />
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        Each patch's brightness = its <span className="text-ink">surface normal</span> · the direction to the{' '}
        <span className="text-warn">light</span>. Faces aimed at the light glow; faces turned away darken — and a
        bright <span className="text-ink">specular</span> spot adds gloss. That single dot-product is what makes flat pixels look solid.
      </p>
    </div>
  )
}

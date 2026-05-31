import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

const CX = 200
const CY = 150
const COLS = 5
const ROWS = 4
const SP = 30 // comoving spacing at a = 1

function hex(c: string) {
  return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]
}
function mix(t: number) {
  const a = hex('#74b9ff')
  const b = hex('#e17055')
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)})`
}

// Space itself is stretching, carrying the galaxies apart — they're not flying
// THROUGH space so much as being carried BY it. Pull the slider to expand the
// universe: every galaxy rushes away from every other, and the farther one is,
// the faster it recedes (Hubble's law). Its light stretches too, reddening —
// the cosmic redshift. There's no centre; expansion looks the same from anywhere.
export function HubbleExpansion() {
  const [a, setA] = useState(1.4) // scale factor

  // comoving galaxy offsets from the central galaxy
  const gal: Array<{ ox: number; oy: number; dist: number }> = []
  let maxDist = 1
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const ox = (c - (COLS - 1) / 2) * SP
      const oy = (r - (ROWS - 1) / 2) * SP
      const dist = Math.hypot(ox, oy)
      maxDist = Math.max(maxDist, dist)
      gal.push({ ox, oy, dist })
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 400 300" className="w-full">
        {gal.map((g, i) => {
          const x = CX + g.ox * a
          const y = CY + g.oy * a
          const isCenter = g.dist < 1
          const t = g.dist / maxDist
          // recession arrow ∝ comoving distance (Hubble: v ∝ d)
          const ux = g.dist > 0 ? g.ox / g.dist : 0
          const uy = g.dist > 0 ? g.oy / g.dist : 0
          const len = 0.16 * g.dist * a
          return (
            <g key={i}>
              {!isCenter && len > 4 && (
                <line x1={x} y1={y} x2={x + ux * len} y2={y + uy * len} stroke={mix(t)} strokeWidth="1.5" opacity="0.7" markerEnd="url(#hb)" />
              )}
              <circle cx={x} cy={y} r={isCenter ? 5 : 4} fill={isCenter ? '#fdcb6e' : mix(t)} />
              {isCenter && <circle cx={x} cy={y} r="9" fill="none" stroke="#fdcb6e" strokeWidth="1.5" />}
            </g>
          )
        })}
        <defs>
          <marker id="hb" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--color-muted)" />
          </marker>
        </defs>
        <text x={CX} y="290" fill="var(--color-muted)" fontSize="9" textAnchor="middle">
          arrows = recession speed · blue (near) → red (far, more redshifted)
        </text>
      </svg>

      <div className="px-4 pt-2">
        <SceneSlider label="Expansion (scale factor)" value={a} min={1} max={2.6} step={0.1} unit="×" onChange={setA} />
        <p className="mt-2 pb-4 text-center text-xs text-muted">
          Pick any galaxy as “home” and the picture is the same: everything recedes, farther = faster. That's the signature of expanding space, the discovery that led to the Big Bang.
        </p>
      </div>
    </div>
  )
}

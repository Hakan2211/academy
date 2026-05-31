// White light is a mix of every colour. A prism bends each colour by a slightly
// different amount (violet most, red least), fanning the white beam out into a
// spectrum. This is dispersion — the same effect that paints a rainbow.
const COLORS = [
  { c: '#ff5252', y: 112 },
  { c: '#ff9800', y: 123 },
  { c: '#ffd600', y: 134 },
  { c: '#4caf50', y: 145 },
  { c: '#2196f3', y: 156 },
  { c: '#3f51b5', y: 167 },
  { c: '#9c27b0', y: 178 },
]

const APEX = { x: 230, y: 50 }
const BL = { x: 175, y: 170 }
const BR = { x: 285, y: 170 }
const E = { x: 197, y: 122 } // entry point on the left face
const X = { x: 266, y: 128 } // exit point on the right face

export function PrismDispersion() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 460 220" className="w-full">
        {/* incoming white light */}
        <line x1="24" y1={E.y} x2={E.x} y2={E.y} stroke="#f5f5f5" strokeWidth="3" />
        <text x="28" y={E.y - 10} fill="var(--color-muted)" fontSize="12">white light</text>

        {/* inside the prism */}
        <line x1={E.x} y1={E.y} x2={X.x} y2={X.y} stroke="#f5f5f5" strokeWidth="2.5" />

        {/* the prism */}
        <polygon
          points={`${APEX.x},${APEX.y} ${BR.x},${BR.y} ${BL.x},${BL.y}`}
          fill="var(--color-accent-2)"
          opacity="0.12"
          stroke="var(--color-accent-2)"
          strokeWidth="1.5"
        />

        {/* dispersed spectrum */}
        {COLORS.map((r) => (
          <line key={r.c} x1={X.x} y1={X.y} x2="436" y2={r.y} stroke={r.c} strokeWidth="2.5" />
        ))}
        <text x="404" y="104" fill="var(--color-muted)" fontSize="12">spectrum</text>
      </svg>
      <p className="px-4 pb-4 text-center text-xs text-muted">
        Each colour has its own wavelength and bends by its own amount — violet most, red least.
      </p>
    </div>
  )
}

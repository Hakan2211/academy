import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

const OX = 46 // origin x (px)
const OY = 205 // origin y (px)
const PXX = 36 // px per x-unit
const PXY = 17 // px per y-unit
const XMAX = 6.6
const TRUE_K = 1.5

// data from y = TRUE_K·x plus a little fixed measurement scatter
const NOISE = [0.4, -0.5, 0.3, -0.3, 0.6, -0.4]
const DATA = NOISE.map((n, i) => {
  const x = i + 1
  return { x, y: TRUE_K * x + n }
})

const px = (x: number) => OX + x * PXX
const py = (y: number) => OY - y * PXY

// A straight line through the origin is the fingerprint of a *proportional* law:
// double the cause, double the effect. Drag the line's slope until it threads the
// data. The slope you find — rise over run — *is* the constant of the law (here, a
// spring's stiffness). Reading a graph is reading a relationship.
export function ProportionGraph() {
  const [k, setK] = useState(1.0)
  const fit = Math.abs(k - TRUE_K) < 0.12
  const lineEnd = { x: px(XMAX), y: py(k * XMAX) }

  // rise/run triangle at x = 4
  const tri = { x0: px(2), x1: px(4), yAt2: py(k * 2), yAt4: py(k * 4) }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 320 240" className="w-full">
        {/* grid */}
        {[1, 2, 3, 4, 5, 6].map((x) => (
          <line key={`gx${x}`} x1={px(x)} y1={py(0)} x2={px(x)} y2={py(10)} stroke="var(--color-border)" strokeWidth="0.5" opacity="0.4" />
        ))}
        {[2, 4, 6, 8, 10].map((y) => (
          <line key={`gy${y}`} x1={px(0)} y1={py(y)} x2={px(XMAX)} y2={py(y)} stroke="var(--color-border)" strokeWidth="0.5" opacity="0.4" />
        ))}

        {/* axes */}
        <line x1={px(0)} y1={py(0)} x2={px(XMAX)} y2={py(0)} stroke="var(--color-muted)" strokeWidth="1.5" />
        <line x1={px(0)} y1={py(0)} x2={px(0)} y2={py(10.5)} stroke="var(--color-muted)" strokeWidth="1.5" />
        <text x={px(XMAX) - 4} y={py(0) + 18} textAnchor="end" fontSize="9" fill="var(--color-muted)">stretching force (N)</text>
        <text x={px(0) - 6} y={py(10) - 4} textAnchor="start" fontSize="9" fill="var(--color-muted)" transform={`rotate(-90 ${px(0) - 6} ${py(10) - 4})`}>extension (cm)</text>

        {/* rise/run triangle */}
        <line x1={tri.x0} y1={tri.yAt2} x2={tri.x1} y2={tri.yAt2} stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
        <line x1={tri.x1} y1={tri.yAt2} x2={tri.x1} y2={tri.yAt4} stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
        <text x={(tri.x0 + tri.x1) / 2} y={tri.yAt2 + 12} textAnchor="middle" fontSize="8" fill="var(--color-accent)">run</text>
        <text x={tri.x1 + 4} y={(tri.yAt2 + tri.yAt4) / 2} fontSize="8" fill="var(--color-accent)">rise</text>

        {/* fitted line through origin */}
        <line x1={px(0)} y1={py(0)} x2={lineEnd.x} y2={lineEnd.y} stroke={fit ? 'var(--color-success)' : 'var(--color-accent)'} strokeWidth="2.5" />

        {/* data points */}
        {DATA.map((d, i) => (
          <circle key={i} cx={px(d.x)} cy={py(d.y)} r="4" fill="#e84393" stroke="#fff" strokeWidth="0.6" />
        ))}
      </svg>

      <div className="px-4 pt-1">
        <SceneSlider label="Line slope  k = extension ÷ force" value={k} min={0.4} max={2.6} step={0.1} unit="cm/N" onChange={setK} />
        <p className="mt-2 pb-4 text-center text-sm text-muted">
          {fit ? (
            <span className="font-semibold text-success">Good fit! The data obey extension = {k.toFixed(1)} × force — a proportional law.</span>
          ) : (
            <>Slope k = {k.toFixed(1)} cm/N. Adjust it until the line threads the points.</>
          )}
        </p>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { cn } from '#/lib/cn'
import { clamp } from '#/lib/health'

// The Yerkes-Dodson inverted-U: arousal/pressure on the x-axis, performance on
// the y-axis. A slider lets the learner move a marker along the curve and see
// the zone label change: under-aroused → sweet spot → overwhelmed.

const W = 280
const H = 160
const PAD = { top: 18, right: 20, bottom: 30, left: 36 }
const innerW = W - PAD.left - PAD.right
const innerH = H - PAD.top - PAD.bottom

// Inverted-U: performance = 4x(1-x) normalised to innerH (peak at x=0.5)
function perfAt(x01: number): number {
  const y01 = 4 * x01 * (1 - x01) * 0.94 + 0.03 // slight floor so curve doesn't touch axis
  return clamp(y01, 0, 1) * innerH
}

function buildPath(): string {
  const steps = 60
  const pts = Array.from({ length: steps + 1 }, (_, i) => {
    const x01 = i / steps
    const cx = PAD.left + x01 * innerW
    const cy = PAD.top + innerH - perfAt(x01)
    return `${i === 0 ? 'M' : 'L'}${cx.toFixed(1)},${cy.toFixed(1)}`
  })
  return pts.join(' ')
}

const CURVE_PATH = buildPath()

type Zone = { label: string; detail: string; color: string }
function zoneFor(x01: number): Zone {
  if (x01 < 0.3)
    return { label: 'Under-aroused', detail: 'Too little pressure → boredom, disengagement, flat performance.', color: '#3498DB' }
  if (x01 > 0.7)
    return { label: 'Overwhelmed', detail: 'Too much pressure → anxiety, tunnel vision, performance collapses.', color: '#E74C3C' }
  return { label: 'Sweet spot', detail: 'Optimal arousal → focused, energised, performing at your best.', color: '#27AE60' }
}

export function StressCurve() {
  const [arousal, setArousal] = useState(50) // 0–100

  const x01  = arousal / 100
  const cx   = PAD.left + x01 * innerW
  const perf = perfAt(x01)
  const cy   = PAD.top + innerH - perf
  const zone = zoneFor(x01)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Zone badge */}
      <div
        className="mb-3 rounded-xl px-3 py-2 text-center text-xs font-semibold transition-all duration-300"
        style={{ backgroundColor: zone.color + '18', color: zone.color, border: `1px solid ${zone.color}44` }}
      >
        {zone.label}
      </div>

      {/* SVG curve */}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label="Yerkes-Dodson inverted-U curve">
        {/* Axes */}
        <line
          x1={PAD.left} y1={PAD.top + innerH}
          x2={PAD.left + innerW} y2={PAD.top + innerH}
          stroke="var(--color-border)" strokeWidth={1.5}
        />
        <line
          x1={PAD.left} y1={PAD.top}
          x2={PAD.left} y2={PAD.top + innerH}
          stroke="var(--color-border)" strokeWidth={1.5}
        />

        {/* Axis labels */}
        <text x={PAD.left + innerW / 2} y={H - 4} textAnchor="middle" fontSize={9} fill="var(--color-muted)">
          Pressure / Arousal →
        </text>
        <text
          x={10} y={PAD.top + innerH / 2}
          textAnchor="middle" fontSize={9} fill="var(--color-muted)"
          transform={`rotate(-90, 10, ${PAD.top + innerH / 2})`}
        >
          Performance
        </text>

        {/* Zone fill regions */}
        <rect
          x={PAD.left} y={PAD.top}
          width={innerW * 0.3} height={innerH}
          fill="#3498DB" opacity={0.06}
        />
        <rect
          x={PAD.left + innerW * 0.3} y={PAD.top}
          width={innerW * 0.4} height={innerH}
          fill="#27AE60" opacity={0.07}
        />
        <rect
          x={PAD.left + innerW * 0.7} y={PAD.top}
          width={innerW * 0.3} height={innerH}
          fill="#E74C3C" opacity={0.06}
        />

        {/* Inverted-U curve */}
        <path d={CURVE_PATH} fill="none" stroke="var(--color-accent)" strokeWidth={2.5} strokeLinecap="round" />

        {/* Zone separator lines */}
        {[0.3, 0.7].map((frac) => (
          <line
            key={frac}
            x1={PAD.left + frac * innerW} y1={PAD.top}
            x2={PAD.left + frac * innerW} y2={PAD.top + innerH}
            stroke="var(--color-border)" strokeWidth={1} strokeDasharray="3 3"
          />
        ))}

        {/* Marker dot */}
        <circle
          cx={cx} cy={cy} r={6}
          fill={zone.color} stroke="white" strokeWidth={2}
          style={{ transition: 'cx 0.15s, cy 0.15s' }}
        />
        {/* Vertical drop line */}
        <line
          x1={cx} y1={cy}
          x2={cx} y2={PAD.top + innerH}
          stroke={zone.color} strokeWidth={1} strokeDasharray="3 3" opacity={0.6}
        />
      </svg>

      {/* Slider */}
      <div className="mt-1 px-1">
        <input
          type="range"
          min={0}
          max={100}
          value={arousal}
          onChange={(e) => setArousal(Number(e.target.value))}
          className="w-full accent-accent"
          aria-label="Arousal level"
        />
        <div className="flex justify-between text-[10px] text-muted">
          <span>Low pressure</span>
          <span>High pressure</span>
        </div>
      </div>

      {/* Detail */}
      <p className="mt-3 rounded-xl border border-border bg-surface-2 px-3 py-2 text-xs text-muted">
        {zone.detail}
      </p>

      {/* Zone legend */}
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {(['Under-aroused', 'Sweet spot', 'Overwhelmed'] as const).map((z, i) => {
          const colors = ['#3498DB', '#27AE60', '#E74C3C']
          const active = zone.label === z
          return (
            <div
              key={z}
              className={cn(
                'rounded-lg px-2 py-1.5 text-center text-[10px] font-medium transition-all',
                active ? 'border' : 'opacity-50',
              )}
              style={active ? { backgroundColor: colors[i] + '18', color: colors[i], borderColor: colors[i] + '44' } : {}}
            >
              {z}
            </div>
          )
        })}
      </div>
    </div>
  )
}

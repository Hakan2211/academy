import { useState } from 'react'
import { cn } from '#/lib/cn'

// Blood glucose response over ~3 hours after two different snack types.
// Simple (sugary drink/sweets): sharp spike then crash below baseline.
// Complex (whole-grain + fibre/protein): gentle rise, slow fall, stays near baseline.
// Educational — qualitative, not clinical.

type SnackType = 'simple' | 'complex'

// SVG canvas
const W = 340
const H = 200
const PAD_L = 48
const PAD_R = 12
const PAD_T = 18
const PAD_B = 36
const PLOT_W = W - PAD_L - PAD_R
const PLOT_H = H - PAD_T - PAD_B

// Glucose "baseline" fasting level = ~90 mg/dL
// We'll scale: 60 mg/dL → 180 mg/dL on the y-axis
const Y_MIN = 60
const Y_MAX = 180

// x = hours (0–3), y = mg/dL
type Point = { t: number; g: number }

const SIMPLE_CURVE: Array<Point> = [
  { t: 0,    g: 90  },
  { t: 0.25, g: 100 },
  { t: 0.5,  g: 140 },
  { t: 0.75, g: 165 },
  { t: 1.0,  g: 158 },
  { t: 1.25, g: 130 },
  { t: 1.5,  g: 95  },
  { t: 1.75, g: 72  }, // crash below baseline
  { t: 2.0,  g: 68  },
  { t: 2.25, g: 70  },
  { t: 2.5,  g: 76  },
  { t: 2.75, g: 82  },
  { t: 3.0,  g: 86  },
]

const COMPLEX_CURVE: Array<Point> = [
  { t: 0,    g: 90  },
  { t: 0.25, g: 92  },
  { t: 0.5,  g: 100 },
  { t: 0.75, g: 112 },
  { t: 1.0,  g: 118 },
  { t: 1.25, g: 116 },
  { t: 1.5,  g: 110 },
  { t: 1.75, g: 104 },
  { t: 2.0,  g: 99  },
  { t: 2.25, g: 95  },
  { t: 2.5,  g: 92  },
  { t: 2.75, g: 91  },
  { t: 3.0,  g: 90  },
]

function toSvg(t: number, g: number): { x: number; y: number } {
  const x = PAD_L + (t / 3) * PLOT_W
  const y = PAD_T + PLOT_H - ((g - Y_MIN) / (Y_MAX - Y_MIN)) * PLOT_H
  return { x, y }
}

// Catmull-Rom–ish smoothing with cubic bezier approximation
function smoothPath(pts: Array<Point>): string {
  if (pts.length < 2) return ''
  const svgPts = pts.map(({ t, g }) => toSvg(t, g))
  let d = `M ${svgPts[0].x} ${svgPts[0].y}`
  for (let i = 1; i < svgPts.length; i++) {
    const prev = svgPts[i - 1]
    const curr = svgPts[i]
    const cpX = (prev.x + curr.x) / 2
    d += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`
  }
  return d
}

// Baseline y-coordinate (90 mg/dL)
const { y: baselineY } = toSvg(0, 90)
const { y: crashY } = toSvg(0, 72)

const SNACK_OPTIONS = [
  {
    id: 'simple' as SnackType,
    label: 'Sugary drink / sweets',
    desc: 'Simple carbs, no fibre or protein',
    color: '#E67E22',
  },
  {
    id: 'complex' as SnackType,
    label: 'Whole-grain meal + protein',
    desc: 'Complex carbs with fibre and protein',
    color: 'var(--color-accent)',
  },
]

export function BloodSugarCurve() {
  const [snack, setSnack] = useState<SnackType>('simple')

  const curve = snack === 'simple' ? SIMPLE_CURVE : COMPLEX_CURVE
  const pathD = smoothPath(curve)
  const color = SNACK_OPTIONS.find((o) => o.id === snack)?.color ?? '#E67E22'

  // Spike point for simple
  const spike = toSvg(0.75, 165)
  // Crash point for simple
  const crash = toSvg(2.0, 68)
  // Peak for complex
  const peak = toSvg(1.0, 118)

  // Hour ticks
  const ticks = [0, 0.5, 1, 1.5, 2, 2.5, 3]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">
        Choose a snack type to see how it affects blood glucose over 3 hours.
      </p>

      {/* Toggle buttons */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        {SNACK_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setSnack(opt.id)}
            className={cn(
              'flex-1 rounded-xl border px-3 py-2 text-left text-sm transition-colors',
              snack === opt.id
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            <div className="font-semibold">{opt.label}</div>
            <div className="text-xs opacity-80">{opt.desc}</div>
          </button>
        ))}
      </div>

      {/* SVG Chart */}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Baseline reference */}
        <line
          x1={PAD_L}
          y1={baselineY}
          x2={W - PAD_R}
          y2={baselineY}
          stroke="var(--color-success)"
          strokeWidth="1.5"
          strokeDasharray="5 3"
          opacity="0.7"
        />
        <text x={PAD_L + 2} y={baselineY - 4} fontSize="9" fill="var(--color-success)">
          fasting baseline ~90 mg/dL
        </text>

        {/* Crash zone for simple */}
        {snack === 'simple' && (
          <rect
            x={toSvg(1.5, 0).x}
            y={PAD_T + PLOT_H - ((90 - Y_MIN) / (Y_MAX - Y_MIN)) * PLOT_H}
            width={toSvg(2.5, 0).x - toSvg(1.5, 0).x}
            height={((90 - Y_MIN) / (Y_MAX - Y_MIN)) * PLOT_H - ((72 - Y_MIN) / (Y_MAX - Y_MIN)) * PLOT_H + 2}
            fill="var(--color-warn)"
            opacity="0.1"
          />
        )}

        {/* Y-axis */}
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + PLOT_H} stroke="var(--color-border)" strokeWidth="1.5" />
        {/* X-axis */}
        <line
          x1={PAD_L}
          y1={PAD_T + PLOT_H}
          x2={W - PAD_R}
          y2={PAD_T + PLOT_H}
          stroke="var(--color-border)"
          strokeWidth="1.5"
        />

        {/* Y-axis ticks */}
        {[60, 90, 120, 150, 180].map((g) => {
          const { y } = toSvg(0, g)
          return (
            <g key={g}>
              <line x1={PAD_L - 4} y1={y} x2={PAD_L} y2={y} stroke="var(--color-border)" strokeWidth="1" />
              <text x={PAD_L - 6} y={y + 4} textAnchor="end" fontSize="9" fill="var(--color-muted)">
                {g}
              </text>
            </g>
          )
        })}
        <text
          x={12}
          y={PAD_T + PLOT_H / 2}
          textAnchor="middle"
          fontSize="9"
          fill="var(--color-muted)"
          transform={`rotate(-90, 12, ${PAD_T + PLOT_H / 2})`}
        >
          Blood glucose (mg/dL)
        </text>

        {/* X-axis ticks */}
        {ticks.map((t) => {
          const { x } = toSvg(t, 0)
          return (
            <g key={t}>
              <line x1={x} y1={PAD_T + PLOT_H} x2={x} y2={PAD_T + PLOT_H + 4} stroke="var(--color-border)" strokeWidth="1" />
              <text x={x} y={PAD_T + PLOT_H + 14} textAnchor="middle" fontSize="9" fill="var(--color-muted)">
                {t === 0 ? '0' : `${t}h`}
              </text>
            </g>
          )
        })}
        <text x={PAD_L + PLOT_W / 2} y={H - 2} textAnchor="middle" fontSize="9" fill="var(--color-muted)">
          Time after eating →
        </text>

        {/* The curve */}
        <path d={pathD} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Starting dot */}
        <circle cx={toSvg(0, 90).x} cy={toSvg(0, 90).y} r="4" fill={color} />

        {/* Annotation for simple */}
        {snack === 'simple' && (
          <>
            <circle cx={spike.x} cy={spike.y} r="5" fill="#E67E22" />
            <text x={spike.x + 7} y={spike.y - 2} fontSize="9" fill="#E67E22" fontWeight="600">spike</text>
            <circle cx={crash.x} cy={crash.y} r="5" fill="var(--color-warn)" />
            <text x={crash.x + 7} y={crash.y + 4} fontSize="9" fill="var(--color-warn)" fontWeight="600">crash</text>
            {/* Horizontal guide at crash level */}
            <line
              x1={PAD_L}
              y1={crashY}
              x2={W - PAD_R}
              y2={crashY}
              stroke="var(--color-warn)"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.5"
            />
          </>
        )}

        {/* Annotation for complex */}
        {snack === 'complex' && (
          <>
            <circle cx={peak.x} cy={peak.y} r="5" fill="var(--color-accent)" />
            <text x={peak.x + 7} y={peak.y - 2} fontSize="9" fill="var(--color-accent)" fontWeight="600">gentle peak</text>
          </>
        )}
      </svg>

      {/* Explanation card */}
      <div className="mt-3 rounded-xl border border-border bg-surface-2 p-3 text-sm">
        {snack === 'simple' ? (
          <>
            <p className="font-semibold text-ink">
              Simple carbs → <span style={{ color: '#E67E22' }}>rapid spike</span>, then{' '}
              <span className="text-warn">crash below baseline</span>
            </p>
            <p className="mt-1 text-muted">
              Sugary foods flood the bloodstream quickly. Insulin surges to clear the glucose —
              sometimes overshooting, leaving you tired, hungry, and craving more sugar within
              1–2 hours. This is the energy "roller-coaster."
            </p>
          </>
        ) : (
          <>
            <p className="font-semibold text-ink">
              Complex carbs → <span className="text-accent">gradual rise</span>, steady decline
            </p>
            <p className="mt-1 text-muted">
              Fibre slows digestion; protein blunts the glucose response. Blood sugar rises gently,
              stays within a healthy range, and returns to baseline gradually — keeping you
              full and energised for longer.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

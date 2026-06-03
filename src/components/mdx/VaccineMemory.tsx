import { useState } from 'react'
import { cn } from '#/lib/cn'

// Antibody level over two exposures.
// 1st exposure = slow small response; memory forms; 2nd = fast large response.
// A vaccine counts as a safe "first exposure".

const W = 540
const H = 200
const PAD_L = 44
const PAD_R = 12
const PAD_T = 16
const PAD_B = 30
const CHART_W = W - PAD_L - PAD_R
const CHART_H = H - PAD_T - PAD_B

// X axis = weeks (0..20)
const WEEKS = 20

function weekToX(w: number) {
  return PAD_L + (w / WEEKS) * CHART_W
}
function levelToY(v: number) {
  // v 0..1
  return PAD_T + (1 - v) * CHART_H
}

function bell(x: number, centre: number, width: number, peak: number) {
  return peak * Math.exp(-0.5 * ((x - centre) / width) ** 2)
}
function sigmoid(x: number, c: number, k: number) {
  return 1 / (1 + Math.exp(-k * (x - c)))
}

// Antibody curve as a function of which exposures have been triggered
// exposure1At = week of first exposure (or null)
// exposure2At = week of second exposure (or null)
function antibodyLevel(
  week: number,
  exp1: number | null,
  exp2: number | null,
): number {
  let level = 0.03 // baseline

  if (exp1 !== null) {
    const t = week - exp1
    if (t >= 0) {
      // slow ramp, modest peak around t=3, then decay
      level += bell(t, 3.5, 1.4, 0.38) + 0.05 * sigmoid(t, 2, 1.5) * (1 - sigmoid(t, 12, 0.5))
    }
  }

  if (exp2 !== null) {
    const t = week - exp2
    if (t >= 0) {
      // fast ramp (memory), much higher peak, slower decay
      level += bell(t, 1.2, 0.8, 0.95) + 0.18 * sigmoid(t, 1, 2.5) * (1 - sigmoid(t, 10, 0.4))
    }
  }

  return Math.max(0, Math.min(1, level))
}

function buildPath(exp1: number | null, exp2: number | null, steps = 200): string {
  const pts = Array.from({ length: steps + 1 }, (_, i) => {
    const w = (i / steps) * WEEKS
    const v = antibodyLevel(w, exp1, exp2)
    return `${weekToX(w).toFixed(1)},${levelToY(v).toFixed(1)}`
  })
  return 'M' + pts.join(' L')
}

const ANTIBODY_COLOUR = '#9B59B6'
const MARKER_COLOUR = '#1ABC9C'

export function VaccineMemory() {
  // null = not yet triggered
  const [exp1, setExp1] = useState<number | null>(null)
  const [exp2, setExp2] = useState<number | null>(null)

  // Enforce sequential exposures: exp2 at least 4 weeks after exp1
  const exp1Week = 2
  const exp2Week = exp1 !== null ? exp1 + 5 : null

  function triggerExp1() {
    if (exp1 !== null) return
    setExp1(exp1Week)
  }
  function triggerExp2() {
    if (exp1 === null || exp2 !== null || exp2Week === null) return
    setExp2(exp2Week)
  }

  const curvePath = buildPath(exp1, exp2)
  const curveArea = curvePath + ` L${weekToX(WEEKS)},${levelToY(0)} L${weekToX(0)},${levelToY(0)} Z`

  // Protection threshold line at ~0.3
  const PROTECTION = 0.28
  const protY = levelToY(PROTECTION)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-1 text-sm font-semibold text-ink">Antibody Response & Immune Memory</p>
      <p className="mb-3 text-xs text-muted">
        Trigger each exposure and watch how your antibody level responds — the second time is much faster and stronger.
      </p>

      {/* Buttons */}
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={triggerExp1}
          disabled={exp1 !== null}
          className={cn(
            'flex-1 rounded-xl border px-3 py-2 text-xs transition-colors',
            exp1 !== null
              ? 'border-accent bg-accent/15 font-semibold text-accent cursor-default'
              : 'border-border text-muted hover:text-ink',
          )}
        >
          {exp1 !== null ? '✓ 1st Exposure (done)' : '1st Exposure / Vaccine'}
        </button>
        <button
          type="button"
          onClick={triggerExp2}
          disabled={exp1 === null || exp2 !== null}
          className={cn(
            'flex-1 rounded-xl border px-3 py-2 text-xs transition-colors',
            exp2 !== null
              ? 'border-accent bg-accent/15 font-semibold text-accent cursor-default'
              : exp1 !== null
                ? 'border-border text-ink hover:border-accent'
                : 'border-border text-muted cursor-not-allowed opacity-40',
          )}
        >
          {exp2 !== null ? '✓ 2nd Exposure (done)' : '2nd Exposure'}
        </button>
      </div>

      {/* Chart */}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Grid */}
        {[0.25, 0.5, 0.75, 1].map((v) => (
          <line
            key={v}
            x1={PAD_L} y1={levelToY(v)} x2={W - PAD_R} y2={levelToY(v)}
            stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="3 3"
          />
        ))}

        {/* Protection threshold */}
        <line
          x1={PAD_L} y1={protY} x2={W - PAD_R} y2={protY}
          stroke="#E74C3C" strokeWidth="1.2" strokeDasharray="6 3"
        />
        <text x={W - PAD_R - 2} y={protY - 4} fontSize="8" fill="#E74C3C" textAnchor="end" fontWeight="600">
          protection threshold
        </text>

        {/* X axis ticks */}
        {[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20].map((w) => (
          <g key={w}>
            <line x1={weekToX(w)} y1={PAD_T} x2={weekToX(w)} y2={PAD_T + CHART_H}
              stroke="var(--color-border)" strokeWidth="0.4" />
            <text x={weekToX(w)} y={H - 6} textAnchor="middle" fontSize="9" fill="var(--color-muted)">
              wk {w}
            </text>
          </g>
        ))}

        {/* Y label */}
        <text
          x={9}
          y={PAD_T + CHART_H / 2}
          fontSize="8"
          fill="var(--color-muted)"
          textAnchor="middle"
          transform={`rotate(-90 9 ${PAD_T + CHART_H / 2})`}
        >
          Antibody level
        </text>

        {/* Area + line */}
        <path d={curveArea} fill={ANTIBODY_COLOUR} fillOpacity="0.12" />
        <path d={curvePath} fill="none" stroke={ANTIBODY_COLOUR} strokeWidth="2.5" strokeLinecap="round" />

        {/* Exposure markers */}
        {exp1 !== null && (
          <g>
            <line x1={weekToX(exp1Week)} y1={PAD_T} x2={weekToX(exp1Week)} y2={PAD_T + CHART_H}
              stroke={MARKER_COLOUR} strokeWidth="1.5" strokeDasharray="4 2" />
            <text x={weekToX(exp1Week) + 3} y={PAD_T + 10} fontSize="8" fill={MARKER_COLOUR} fontWeight="600">
              1st exposure
            </text>
          </g>
        )}
        {exp2 !== null && exp2Week !== null && (
          <g>
            <line x1={weekToX(exp2Week)} y1={PAD_T} x2={weekToX(exp2Week)} y2={PAD_T + CHART_H}
              stroke={MARKER_COLOUR} strokeWidth="1.5" strokeDasharray="4 2" />
            <text x={weekToX(exp2Week) + 3} y={PAD_T + 10} fontSize="8" fill={MARKER_COLOUR} fontWeight="600">
              2nd exposure
            </text>
          </g>
        )}
      </svg>

      {/* Legend */}
      <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-5 rounded-sm" style={{ background: ANTIBODY_COLOUR }} />
          Antibody level
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-5 rounded-sm" style={{ background: MARKER_COLOUR }} />
          Exposure event
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-5 rounded-sm border border-dashed" style={{ borderColor: '#E74C3C' }} />
          Protection threshold
        </span>
      </div>

      {/* Commentary */}
      <div className="mt-3 rounded-xl border border-border bg-surface-2 px-3 py-2 text-xs text-muted">
        {exp2 !== null
          ? "The 2nd exposure triggers a much faster and larger antibody surge — staying above the protection threshold. Memory B and T cells produced after the first encounter recognise the pathogen immediately. A vaccine gives you this memory without the disease."
          : exp1 !== null
            ? "The first response is slow: it takes days for B cells to learn and multiply. Antibodies eventually rise — but you may feel ill before they peak. Crucially, memory cells now exist."
            : "Trigger the first exposure to see how your immune system responds from scratch."}
      </div>
    </div>
  )
}

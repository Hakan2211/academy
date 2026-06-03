import { useState } from 'react'
import { cn } from '#/lib/cn'

// "The dose makes the poison" — Paracelsus. A dose slider shows how ANY substance
// moves through effect zones: none → therapeutic/desired → side effects → toxic/dangerous.
// An optional tolerance toggle shifts the curve right, showing you need more for the same effect.

type Zone = {
  label: string
  color: string
  range: [number, number]  // 0–100 dose units
  desc: string
}

const ZONES: Zone[] = [
  { label: 'No effect',     color: '#636e72', range: [0,  20], desc: 'Below the threshold — not enough to produce a noticeable effect.' },
  { label: 'Desired effect', color: '#00b894', range: [20, 45], desc: 'The therapeutic or pleasurable range — the reason the substance is used.' },
  { label: 'Side effects',  color: '#f39c12', range: [45, 70], desc: 'Benefits diminish; unwanted effects (nausea, dizziness, anxiety) begin to appear.' },
  { label: 'Toxic',         color: '#e17055', range: [70, 88], desc: 'Organ stress, serious harm; medical attention may be needed.' },
  { label: 'Dangerous',     color: '#d63031', range: [88,100], desc: 'Life-threatening — this is true of virtually every substance, including water, oxygen, or paracetamol.' },
]

function zoneFor(dose: number, shift: number): Zone {
  const d = Math.max(0, dose - shift)
  return ZONES.find(z => d >= z.range[0] && d < z.range[1]) ?? ZONES[ZONES.length - 1]
}

// Map dose (0–100) to a curve y value (0–1 then back to 0)
function responseY(dose: number): number {
  // rises from 0 → peak at ~40 → falls and goes negative (toxic territory shown as red)
  const x = dose / 100
  if (x < 0.2)  return x / 0.2 * 0.6
  if (x < 0.45) return 0.6 + ((x - 0.2) / 0.25) * 0.4
  if (x < 0.7)  return 1 - ((x - 0.45) / 0.25) * 0.85
  return Math.max(-0.3, 0.15 - ((x - 0.7) / 0.3) * 0.45)
}

const W = 280
const H = 100
const PAD = { l: 32, r: 10, t: 10, b: 22 }
const CHART_W = W - PAD.l - PAD.r
const CHART_H = H - PAD.t - PAD.b

function doseToX(dose: number) { return PAD.l + (dose / 100) * CHART_W }
function yToSvg(y: number) { return PAD.t + CHART_H * (1 - (y + 0.3) / 1.3) }

const CURVE_POINTS = Array.from({ length: 101 }, (_, i) => i)

export function DoseResponse() {
  const [dose, setDose] = useState(35)
  const [tolerance, setTolerance] = useState(false)

  const shift = tolerance ? 20 : 0
  const zone = zoneFor(dose, shift)
  const curveY = responseY(Math.max(0, dose - shift))

  const normalPoints = CURVE_POINTS
    .map(d => `${doseToX(d).toFixed(1)},${yToSvg(responseY(d)).toFixed(1)}`)
    .join(' ')
  const shiftedPoints = CURVE_POINTS
    .map(d => `${doseToX(d).toFixed(1)},${yToSvg(responseY(Math.max(0, d - shift))).toFixed(1)}`)
    .join(' ')

  const markerX = doseToX(dose)
  const markerY = yToSvg(curveY)
  const zeroY = yToSvg(0)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4 space-y-4">
      <div>
        <p className="text-sm font-semibold text-ink">Dose–Response Curve</p>
        <p className="text-xs text-muted mt-0.5">
          "The dose makes the poison" — Paracelsus, c. 1538. Every substance has a dose–response
          curve. Drag the slider to explore the effect zones.
        </p>
      </div>

      {/* SVG chart */}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* zone colour bands */}
        {ZONES.map(z => (
          <rect
            key={z.label}
            x={doseToX(z.range[0])}
            y={PAD.t}
            width={doseToX(z.range[1]) - doseToX(z.range[0])}
            height={CHART_H}
            fill={z.color}
            opacity={0.08}
          />
        ))}

        {/* zero line */}
        <line x1={PAD.l} y1={zeroY} x2={W - PAD.r} y2={zeroY}
          stroke="var(--color-border)" strokeWidth={0.8} strokeDasharray="3 3" />

        {/* axes */}
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b + 4}
          stroke="var(--color-border)" strokeWidth={1} />
        <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b}
          stroke="var(--color-border)" strokeWidth={1} />
        <text x={PAD.l - 2} y={H - PAD.b + 2} textAnchor="end" fontSize={7} className="fill-muted">0</text>
        <text x={(W - PAD.r + PAD.l) / 2} y={H - 3} textAnchor="middle" fontSize={7} className="fill-muted">Dose →</text>
        <text x={6} y={(H - PAD.b + PAD.t) / 2} textAnchor="middle" fontSize={7} className="fill-muted"
          transform={`rotate(-90, 6, ${(H - PAD.b + PAD.t) / 2})`}>Effect</text>

        {/* normal curve (ghost when tolerance on) */}
        {tolerance && (
          <polyline points={normalPoints} fill="none"
            stroke="var(--color-border)" strokeWidth={1.5} strokeDasharray="4 3" />
        )}

        {/* active curve */}
        <polyline points={shiftedPoints} fill="none"
          stroke={zone.color} strokeWidth={2.5} />

        {/* dose marker */}
        <line x1={markerX} y1={PAD.t} x2={markerX} y2={H - PAD.b}
          stroke={zone.color} strokeWidth={1} strokeDasharray="2 2" />
        <circle cx={markerX} cy={markerY} r={5}
          fill="var(--color-surface)" stroke={zone.color} strokeWidth={2} />

        {/* zone labels on x axis */}
        {ZONES.map(z => (
          <text key={z.label}
            x={doseToX((z.range[0] + z.range[1]) / 2)}
            y={H - PAD.b + 9}
            textAnchor="middle" fontSize={5.5}
            style={{ fill: z.color }}>
            {z.label.split(' ')[0]}
          </text>
        ))}
      </svg>

      {/* Dose slider */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted">
          <span>Dose</span>
          <span className="font-semibold" style={{ color: zone.color }}>{dose} units</span>
        </div>
        <input type="range" min={0} max={100} value={dose}
          onChange={e => setDose(Number(e.target.value))}
          className="w-full accent-accent" />
      </div>

      {/* Zone info */}
      <div className="rounded-xl border p-3 text-sm transition-colors"
        style={{ borderColor: zone.color + '66', backgroundColor: zone.color + '11' }}>
        <p className="font-semibold text-sm" style={{ color: zone.color }}>{zone.label}</p>
        <p className="mt-0.5 text-xs text-muted">{zone.desc}</p>
      </div>

      {/* Tolerance toggle */}
      <div className="flex items-center gap-3">
        <button type="button"
          onClick={() => setTolerance(t => !t)}
          className={cn(
            'rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors',
            tolerance
              ? 'border-accent bg-accent/15 text-accent'
              : 'border-border text-muted hover:text-ink',
          )}>
          Tolerance: {tolerance ? 'ON' : 'OFF'}
        </button>
        <p className="text-xs text-muted flex-1">
          {tolerance
            ? 'Curve shifted right — need a higher dose for the same effect. Toxic range comes sooner.'
            : 'Toggle to see what tolerance does to the curve.'}
        </p>
      </div>

      <p className="text-xs text-muted border-t border-border pt-2">
        This pattern applies to medicines, caffeine, alcohol, and — crucially — even essentials
        like water or oxygen. There is no such thing as a "safe" substance; only a safe dose.
      </p>
    </div>
  )
}

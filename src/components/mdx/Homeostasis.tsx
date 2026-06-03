import { useState, useEffect, useRef } from 'react'
import { cn } from '#/lib/cn'
import { clamp, round } from '#/lib/health'

// Demonstrates negative feedback homeostasis for two regulated variables:
// body temperature and blood glucose. Push the value off its set point, then
// watch negative feedback correct it. Shows sensor → control centre → effector.

type Variable = {
  id: string
  label: string
  unit: string
  setPoint: number
  displayLo: number
  displayHi: number
  disturbanceHigh: number
  disturbanceLow: number
  highLabel: string
  lowLabel: string
  sensor: string
  centre: string
  effectorHigh: string
  effectorLow: string
}

const VARIABLES: Array<Variable> = [
  {
    id: 'temperature',
    label: 'Body Temperature',
    unit: '°C',
    setPoint: 37.0,
    displayLo: 35.0,
    displayHi: 39.5,
    disturbanceHigh: 39.0,
    disturbanceLow: 35.5,
    highLabel: 'Too hot (fever)',
    lowLabel: 'Too cold (exposure)',
    sensor: 'Thermoreceptors in skin & brain',
    centre: 'Hypothalamus (the brain\'s thermostat)',
    effectorHigh: 'Sweat glands activate · Skin vessels dilate to release heat',
    effectorLow: 'Shivering begins · Skin vessels constrict · Goosebumps raised',
  },
  {
    id: 'bloodsugar',
    label: 'Blood Glucose',
    unit: 'mmol/L',
    setPoint: 5.0,
    displayLo: 2.5,
    displayHi: 12.0,
    disturbanceHigh: 9.5,
    disturbanceLow: 3.0,
    highLabel: 'Too high (after a meal)',
    lowLabel: 'Too low (fasting/exercise)',
    sensor: 'Beta & alpha cells in the pancreas',
    centre: 'Pancreas (releases insulin or glucagon)',
    effectorHigh: 'Insulin released → cells absorb glucose → liver stores excess',
    effectorLow: 'Glucagon released → liver converts glycogen back to glucose',
  },
]

function Bar({
  value,
  lo,
  hi,
  setPoint,
  color,
}: {
  value: number
  lo: number
  hi: number
  setPoint: number
  color: string
}) {
  const pct = ((value - lo) / (hi - lo)) * 100
  const spPct = ((setPoint - lo) / (hi - lo)) * 100
  return (
    <div className="relative h-6 w-full rounded-full bg-surface-2" style={{ border: '1px solid var(--color-border)' }}>
      <div
        className="absolute top-0 h-full w-0.5"
        style={{ left: `${spPct}%`, backgroundColor: '#27AE60', opacity: 0.9 }}
      />
      <div
        className="absolute top-0 h-full rounded-full transition-all duration-500"
        style={{ width: `${clamp(pct, 0, 100)}%`, backgroundColor: color, opacity: 0.65 }}
      />
      <div
        className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow transition-all duration-500"
        style={{ left: `${clamp(pct, 2, 98)}%`, backgroundColor: color }}
      />
    </div>
  )
}

export function Homeostasis() {
  const [varId, setVarId] = useState<string>('bloodsugar')
  const [value, setValue] = useState<number>(5.0)
  const [correcting, setCorrecting] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const v = VARIABLES.find((x) => x.id === varId) ?? VARIABLES[0]

  useEffect(() => {
    setValue(v.setPoint)
    setCorrecting(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [varId, v.setPoint])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  function disturb(high: boolean) {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setCorrecting(false)
    setValue(high ? v.disturbanceHigh : v.disturbanceLow)
  }

  function respond() {
    if (correcting) return
    setCorrecting(true)
    let current = value
    const target = v.setPoint
    intervalRef.current = setInterval(() => {
      current = current + (target - current) * 0.35
      const rounded = round(current, 1)
      setValue(rounded)
      if (Math.abs(current - target) < 0.05) {
        setValue(target)
        setCorrecting(false)
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    }, 500)
  }

  const deviation = round(value - v.setPoint, 1)
  const isHigh = value > v.setPoint + 0.09
  const isLow = value < v.setPoint - 0.09
  const atSetPoint = !isHigh && !isLow
  const barColor = atSetPoint ? '#27AE60' : isHigh ? '#E74C3C' : '#3498DB'

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Variable toggle */}
      <div className="mb-4 grid grid-cols-2 gap-2">
        {VARIABLES.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setVarId(x.id)}
            className={cn(
              'rounded-xl border px-3 py-2 text-sm transition-colors',
              varId === x.id
                ? 'border-accent bg-accent/15 font-semibold text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {x.label}
          </button>
        ))}
      </div>

      {/* Current value */}
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm text-muted">Current value</span>
        <span className="text-2xl font-bold transition-colors duration-300" style={{ color: barColor }}>
          {value.toFixed(1)} {v.unit}
        </span>
      </div>

      <Bar value={value} lo={v.displayLo} hi={v.displayHi} setPoint={v.setPoint} color={barColor} />
      <div className="mt-1 flex justify-between text-xs text-muted">
        <span>{v.displayLo} {v.unit}</span>
        <span style={{ color: '#27AE60' }}>● set point {v.setPoint} {v.unit}</span>
        <span>{v.displayHi} {v.unit}</span>
      </div>

      {/* Status badge */}
      <div
        className="mt-3 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-300"
        style={{ backgroundColor: barColor + '18', color: barColor, border: `1px solid ${barColor}44` }}
      >
        {atSetPoint
          ? '✓ At set point — homeostasis maintained'
          : isHigh
            ? `↑ Above set point by ${deviation} ${v.unit} — negative feedback activated`
            : `↓ Below set point by ${Math.abs(deviation)} ${v.unit} — negative feedback activated`}
      </div>

      {/* Disturbance buttons */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => disturb(true)}
          className="rounded-xl border border-border px-2 py-1.5 text-xs text-muted transition-colors hover:border-[#E74C3C] hover:text-[#E74C3C]"
        >
          ↑ Push high
          <span className="block opacity-70">{v.highLabel}</span>
        </button>
        <button
          type="button"
          onClick={() => disturb(false)}
          className="rounded-xl border border-border px-2 py-1.5 text-xs text-muted transition-colors hover:border-[#3498DB] hover:text-[#3498DB]"
        >
          ↓ Push low
          <span className="block opacity-70">{v.lowLabel}</span>
        </button>
      </div>

      {!atSetPoint && (
        <button
          type="button"
          onClick={respond}
          disabled={correcting}
          className={cn(
            'mt-2 w-full rounded-xl border px-3 py-2 text-sm font-semibold transition-colors',
            correcting
              ? 'border-border text-muted'
              : 'border-accent bg-accent/15 text-accent hover:bg-accent/25',
          )}
        >
          {correcting ? 'Body responding…' : 'Let the body respond →'}
        </button>
      )}

      {/* Feedback loop panel */}
      <div className="mt-4 rounded-xl border border-border bg-surface-2 p-3 text-xs">
        <p className="mb-2 font-semibold text-ink">Negative feedback loop</p>
        <div className="space-y-1 text-muted">
          <p><span className="font-medium text-ink">Sensor:</span> {v.sensor}</p>
          <p><span className="font-medium text-ink">Control centre:</span> {v.centre}</p>
          <p><span className="font-medium text-ink">If too high:</span> {v.effectorHigh}</p>
          <p><span className="font-medium text-ink">If too low:</span> {v.effectorLow}</p>
        </div>
      </div>
    </div>
  )
}

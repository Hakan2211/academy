import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { cn } from '#/lib/cn'

// The generalization gradient. A dog (or person) was conditioned to a 1000 Hz
// tone (the CS). Now we test a NEW tone of a different pitch: the closer the new
// tone is to the original, the stronger the conditioned response — a smooth bell-
// shaped falloff with distance. Toggle DISCRIMINATION on: after training that
// only the exact CS pays off, the gradient sharpens dramatically.

const CS_HZ = 1000
const MIN_HZ = 400
const MAX_HZ = 1600

// curve geometry
const GX0 = 40
const GX1 = 420
const GY_TOP = 24
const GY_BASE = 150
const GH = GY_BASE - GY_TOP

const hzToX = (hz: number) => GX0 + ((hz - MIN_HZ) / (MAX_HZ - MIN_HZ)) * (GX1 - GX0)

// response strength as a gaussian of pitch-distance; sigma narrows with discrimination
function response(hz: number, sigma: number): number {
  const z = (hz - CS_HZ) / sigma
  return Math.exp(-0.5 * z * z)
}

export function ConditioningProcesses() {
  const [testHz, setTestHz] = useState(1000)
  const [discriminate, setDiscriminate] = useState(false)
  const sigma = discriminate ? 90 : 260

  const resp = response(testHz, sigma)

  // build the gradient path
  let curve = ''
  for (let i = 0; i <= 80; i++) {
    const hz = MIN_HZ + (i / 80) * (MAX_HZ - MIN_HZ)
    const x = hzToX(hz)
    const y = GY_BASE - GH * response(hz, sigma)
    curve += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)} `
  }

  const testX = hzToX(testHz)
  const testY = GY_BASE - GH * resp

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        <button
          type="button"
          onClick={() => setDiscriminate(false)}
          className={cn(
            'rounded-full border px-3 py-1 text-sm transition-colors',
            !discriminate ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
          )}
        >
          Generalization
        </button>
        <button
          type="button"
          onClick={() => setDiscriminate(true)}
          className={cn(
            'rounded-full border px-3 py-1 text-sm transition-colors',
            discriminate ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
          )}
        >
          After discrimination training
        </button>
      </div>

      <svg viewBox="0 0 460 176" className="w-full">
        {/* axes */}
        <line x1={GX0} y1={GY_TOP} x2={GX0} y2={GY_BASE} stroke="var(--color-border)" strokeWidth="1.5" />
        <line x1={GX0} y1={GY_BASE} x2={GX1 + 6} y2={GY_BASE} stroke="var(--color-border)" strokeWidth="1.5" />
        <text x={GX0 - 5} y={GY_TOP + 4} fill="var(--color-muted)" fontSize="8" textAnchor="end">strong</text>
        <text x={GX0 - 5} y={GY_BASE} fill="var(--color-muted)" fontSize="8" textAnchor="end">none</text>

        {/* CS marker line */}
        <line x1={hzToX(CS_HZ)} y1={GY_TOP - 4} x2={hzToX(CS_HZ)} y2={GY_BASE} stroke="var(--color-success)" strokeWidth="1" strokeDasharray="3 3" />
        <text x={hzToX(CS_HZ)} y={GY_TOP - 8} fill="var(--color-success)" fontSize="9" textAnchor="middle" fontWeight="600">CS · {CS_HZ} Hz</text>

        {/* the gradient */}
        <path d={curve.trim()} fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinejoin="round" />

        {/* test marker */}
        <line x1={testX} y1={testY} x2={testX} y2={GY_BASE} stroke="var(--color-ink)" strokeWidth="1" opacity="0.4" />
        <circle cx={testX} cy={testY} r="5" fill="var(--color-ink)" stroke="var(--color-surface)" strokeWidth="1.5" />

        {/* x labels */}
        <text x={GX0} y={GY_BASE + 14} fill="var(--color-muted)" fontSize="8" textAnchor="start">{MIN_HZ} Hz</text>
        <text x={GX1} y={GY_BASE + 14} fill="var(--color-muted)" fontSize="8" textAnchor="end">{MAX_HZ} Hz</text>
        <text x={(GX0 + GX1) / 2} y={GY_BASE + 14} fill="var(--color-muted)" fontSize="9" textAnchor="middle">test tone pitch</text>
      </svg>

      <div className="px-4 pt-1">
        <SceneSlider label="Test tone" value={testHz} min={MIN_HZ} max={MAX_HZ} step={20} unit="Hz" onChange={setTestHz} />
      </div>

      <p className="px-4 pb-4 pt-3 text-sm leading-snug text-muted">
        The {testHz} Hz tone is{' '}
        <span className="font-semibold text-ink">{Math.abs(testHz - CS_HZ)} Hz {testHz === CS_HZ ? 'on' : 'away from'}</span> the original CS, so it pulls a{' '}
        <span className="font-semibold text-accent">{Math.round(resp * 100)}%</span> conditioned response.{' '}
        {discriminate
          ? 'After discrimination training — where only the exact CS was reinforced — the gradient is steep: nearby tones barely respond.'
          : 'Without discrimination training, the response generalizes broadly to similar pitches.'}
      </p>
    </div>
  )
}

import { useState } from 'react'
import { cn } from '#/lib/cn'

// A spectrum of awareness from coma -> deep sleep -> drowsy -> alert ->
// focused/flow. Click a band on the dial to read what that level feels like and
// how aware/responsive a person is. Consciousness is not on/off but a sliding
// scale of how much of the world (and of ourselves) we register.
type Level = {
  key: string
  label: string
  color: string
  blurb: string
}

// Ordered low-arousal -> high-arousal. The arc sweeps left (dim) to right (bright).
const LEVELS: ReadonlyArray<Level> = [
  {
    key: 'coma',
    label: 'Coma',
    color: '#2D3436',
    blurb:
      'No awareness and no purposeful response, even to pain. The lights are off — a state caused by injury or illness, very different from sleep.',
  },
  {
    key: 'deep-sleep',
    label: 'Deep sleep',
    color: '#4834D4',
    blurb:
      'Awareness of the outside world drops to almost nothing, yet the brain stays busy. A loud-enough alarm can still pull you back, so the gate is not fully shut.',
  },
  {
    key: 'drowsy',
    label: 'Drowsy',
    color: '#6C5CE7',
    blurb:
      'The fuzzy edge between waking and sleep. Attention slips, thoughts drift, and the world feels muffled — like trying to read with heavy eyelids.',
  },
  {
    key: 'alert',
    label: 'Alert',
    color: '#0984E3',
    blurb:
      'Ordinary waking awareness. You take in your surroundings, hold a conversation, and notice your own thoughts. Most of your day lives here.',
  },
  {
    key: 'focused',
    label: 'Focused / flow',
    color: '#00D2D3',
    blurb:
      'Attention narrows to a sharp beam — you are absorbed, time seems to vanish, and distractions fall away. The peak of controlled, effortful awareness.',
  },
]

const W = 360
const H = 200
const CX = W / 2
const CY = 168
const R = 130

// Polar point on the dial. t in [0,1] maps to the half-circle from 180deg (left)
// to 0deg (right); angle measured up from the baseline.
function arcPoint(t: number, radius: number): { x: number; y: number } {
  const a = Math.PI * (1 - t)
  return { x: CX + Math.cos(a) * radius, y: CY - Math.sin(a) * radius }
}

export function ConsciousnessLevels() {
  const [i, setI] = useState(3) // default to "alert"
  const sel = LEVELS[i]
  const n = LEVELS.length

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Spectrum band: a thick arc segmented by level. */}
        {LEVELS.map((lvl, k) => {
          const t0 = k / n
          const t1 = (k + 1) / n
          const outer0 = arcPoint(t0, R)
          const outer1 = arcPoint(t1, R)
          const inner1 = arcPoint(t1, R - 26)
          const inner0 = arcPoint(t0, R - 26)
          const active = k === i
          return (
            <path
              key={lvl.key}
              d={`M${outer0.x.toFixed(1)} ${outer0.y.toFixed(1)} A${R} ${R} 0 0 1 ${outer1.x.toFixed(1)} ${outer1.y.toFixed(1)} L${inner1.x.toFixed(1)} ${inner1.y.toFixed(1)} A${R - 26} ${R - 26} 0 0 0 ${inner0.x.toFixed(1)} ${inner0.y.toFixed(1)} Z`}
              fill={lvl.color}
              opacity={active ? 1 : 0.45}
              stroke="var(--color-surface)"
              strokeWidth={2}
              style={{ cursor: 'pointer' }}
              onClick={() => setI(k)}
            />
          )
        })}

        {/* Needle pointing at the centre of the selected band. */}
        {(() => {
          const t = (i + 0.5) / n
          const tip = arcPoint(t, R - 4)
          return (
            <g>
              <line
                x1={CX}
                y1={CY}
                x2={tip.x.toFixed(1)}
                y2={tip.y.toFixed(1)}
                stroke="var(--color-ink)"
                strokeWidth={3}
                strokeLinecap="round"
              />
              <circle cx={CX} cy={CY} r={6} fill="var(--color-ink)" />
            </g>
          )
        })()}

        <text x={arcPoint(0.02, R + 12).x} y={CY + 6} textAnchor="start" fontSize="10" fill="var(--color-muted)">
          dim
        </text>
        <text x={arcPoint(0.98, R + 12).x} y={CY + 6} textAnchor="end" fontSize="10" fill="var(--color-muted)">
          bright
        </text>
      </svg>

      <div className="mt-1 flex flex-wrap justify-center gap-2">
        {LEVELS.map((lvl, k) => (
          <button
            key={lvl.key}
            type="button"
            onClick={() => setI(k)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              k === i
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {lvl.label}
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-xl bg-surface-2 p-3">
        <p className="text-sm font-semibold" style={{ color: sel.color }}>
          {sel.label}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{sel.blurb}</p>
      </div>
    </div>
  )
}

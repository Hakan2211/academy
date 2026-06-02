import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'

// The vicious maintenance loop that keeps anxiety alive: a TRIGGER spikes
// ANXIETY, which drives AVOIDANCE or a safety behaviour, which brings instant
// RELIEF — and that relief REINFORCES the fear, so it grows. Avoidance feels
// like the cure but is the fuel. Step around the loop and watch the fear climb.
const NODES = [
  {
    name: 'Trigger',
    icon: 'Zap',
    body: 'A feared situation appears — a crowded room, a spider, an intrusive thought. The alarm is tripped.',
  },
  {
    name: 'Anxiety',
    icon: 'HeartPulse',
    body: 'Fear surges: pounding heart, racing thoughts, the urge to escape. The body braces as if in real danger.',
  },
  {
    name: 'Avoidance',
    icon: 'DoorOpen',
    body: 'To make the fear stop, the person flees or uses a "safety behaviour" — leaving, checking, seeking reassurance.',
  },
  {
    name: 'Relief',
    icon: 'CheckCircle',
    body: 'The anxiety drops fast. It feels like the avoidance saved the day — a powerful, immediate reward.',
  },
  {
    name: 'Reinforced',
    icon: 'TrendingUp',
    body: 'But the brain never learns the situation was safe. So next time the fear is even stronger — and the loop tightens.',
  },
] as const

const CX = 180
const CY = 110
const R = 78

export function AnxietyCycle() {
  const [step, setStep] = useState(0)

  const pos = NODES.map((_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / NODES.length
    return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) }
  })

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 360 220" className="w-full">
        {/* connecting arrows around the loop */}
        {pos.map((p, i) => {
          const n = pos[(i + 1) % pos.length]
          const dx = n.x - p.x
          const dy = n.y - p.y
          const len = Math.hypot(dx, dy)
          const ux = dx / len
          const uy = dy / len
          const x1 = p.x + ux * 22
          const y1 = p.y + uy * 22
          const x2 = n.x - ux * 22
          const y2 = n.y - uy * 22
          const active = i < step
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={active ? 'var(--color-accent)' : 'var(--color-border)'}
              strokeWidth={active ? 2.5 : 1.5}
              markerEnd={active ? 'url(#ac-arrow-on)' : 'url(#ac-arrow-off)'}
            />
          )
        })}

        <defs>
          <marker id="ac-arrow-on" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--color-accent)" />
          </marker>
          <marker id="ac-arrow-off" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--color-border)" />
          </marker>
        </defs>

        {pos.map((p, i) => {
          const on = i === step
          return (
            <g key={i} onClick={() => setStep(i)} style={{ cursor: 'pointer' }}>
              <circle
                cx={p.x}
                cy={p.y}
                r={on ? 20 : 17}
                fill={on ? 'var(--color-accent)' : 'var(--color-surface-2)'}
                stroke={on ? 'var(--color-accent)' : 'var(--color-border)'}
                strokeWidth="2"
              />
              <text
                x={p.x}
                y={p.y + 32}
                textAnchor="middle"
                fontSize="9"
                fontWeight="600"
                fill={on ? 'var(--color-accent)' : 'var(--color-muted)'}
              >
                {NODES[i].name}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="mt-1 min-h-[70px] rounded-xl bg-surface-2 p-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <Icon name={NODES[step].icon} size={16} />
          </span>
          <span className="text-sm font-semibold text-ink">
            {step + 1}. {NODES[step].name}
          </span>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{NODES[step].body}</p>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((v) => Math.max(0, v - 1))}
          disabled={step === 0}
          className="rounded-full border border-border px-4 py-1.5 text-sm text-muted enabled:hover:text-ink disabled:opacity-40"
        >
          Back
        </button>
        <span className="text-xs text-muted">{step + 1} of {NODES.length}</span>
        <button
          type="button"
          onClick={() => setStep((v) => (v + 1) % NODES.length)}
          className="rounded-full border border-accent bg-accent/15 px-4 py-1.5 text-sm text-accent"
        >
          {step === NODES.length - 1 ? 'Round again →' : 'Next'}
        </button>
      </div>

      <p className="mt-2 text-center text-xs text-muted">
        The trap: avoidance brings real relief, so it’s rewarded — but the fear never gets a chance to fade. Therapy breaks the loop by facing the trigger and letting the alarm prove itself false.
      </p>
    </div>
  )
}

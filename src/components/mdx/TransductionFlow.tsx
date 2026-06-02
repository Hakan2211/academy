import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// The journey every perception makes: a thing out in the world (distal
// stimulus) casts a pattern of energy onto a sense organ (proximal stimulus),
// receptor cells turn that energy into nerve impulses (transduction), and the
// brain builds an experience. Pick a sense; the same four-step arc holds.
type Sense = 'vision' | 'hearing' | 'smell'

const STAGES = [
  {
    key: 'distal',
    label: 'Distal stimulus',
    icon: 'Mountain',
    color: '#00CEC9',
    blurb: 'The actual object out in the world — at a distance from you.',
  },
  {
    key: 'proximal',
    label: 'Proximal stimulus',
    icon: 'ScanEye',
    color: '#4F8CFF',
    blurb: 'The pattern of energy that physically reaches your sense organ.',
  },
  {
    key: 'transduction',
    label: 'Transduction',
    icon: 'Zap',
    color: '#FDCB6E',
    blurb: 'Receptor cells convert that energy into electrical nerve signals.',
  },
  {
    key: 'percept',
    label: 'Perception',
    icon: 'Brain',
    color: '#FF6B9D',
    blurb: 'The brain interprets the signals into a conscious experience.',
  },
] as const

const SENSES: Record<Sense, { name: string; icon: string; steps: [string, string, string, string] }> = {
  vision: {
    name: 'Seeing a tree',
    icon: 'TreePine',
    steps: [
      'A tree standing across the field.',
      'Light bouncing off the tree forms an image on your retina.',
      'Rods and cones fire, turning light into neural impulses.',
      'Your brain assembles the signals into "a tree".',
    ],
  },
  hearing: {
    name: 'Hearing a bell',
    icon: 'Bell',
    steps: [
      'A bell ringing in the next room.',
      'Pressure waves in the air vibrate your eardrum.',
      'Hair cells in the cochlea convert vibration into impulses.',
      'Your brain interprets the signals as "a bell".',
    ],
  },
  smell: {
    name: 'Smelling coffee',
    icon: 'Coffee',
    steps: [
      'A fresh pot of coffee on the counter.',
      'Odour molecules drift up and land in your nose.',
      'Olfactory receptors bind them and fire impulses.',
      'Your brain recognises the pattern as "coffee".',
    ],
  },
}

export function TransductionFlow() {
  const [sense, setSense] = useState<Sense>('vision')
  const [step, setStep] = useState(0)
  const detail = SENSES[sense]

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="mb-3 flex flex-wrap gap-2">
        {(Object.keys(SENSES) as Array<Sense>).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setSense(s)
              setStep(0)
            }}
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors',
              sense === s ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            <Icon name={SENSES[s].icon} size={14} />
            {SENSES[s].name}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 360 90" className="w-full">
        {STAGES.map((st, i) => {
          const cx = 45 + i * 90
          const active = i <= step
          const here = i === step
          return (
            <g key={st.key}>
              {i < STAGES.length - 1 && (
                <line
                  x1={cx + 22}
                  y1={34}
                  x2={cx + 68}
                  y2={34}
                  stroke={i < step ? st.color : 'var(--color-border)'}
                  strokeWidth="2.5"
                  markerEnd="url(#tf-arrow)"
                />
              )}
              <circle
                cx={cx}
                cy={34}
                r={here ? 19 : 16}
                fill={active ? `${st.color}22` : 'var(--color-surface-2)'}
                stroke={active ? st.color : 'var(--color-border)'}
                strokeWidth={here ? 3 : 2}
              />
              <text x={cx} y={78} textAnchor="middle" fontSize="9" fill={here ? 'var(--color-ink)' : 'var(--color-muted)'}>
                {st.label}
              </text>
            </g>
          )
        })}
        <defs>
          <marker id="tf-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 Z" fill="var(--color-muted)" />
          </marker>
        </defs>
      </svg>

      {/* Icons overlaid as real Icon components for crispness */}
      <div className="-mt-[58px] mb-3 grid grid-cols-4 px-1">
        {STAGES.map((st, i) => (
          <div key={st.key} className="flex justify-center" style={{ color: i <= step ? st.color : 'var(--color-muted)' }}>
            <Icon name={st.icon} size={18} />
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-surface-2 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: STAGES[step].color }}>
          Step {step + 1}: {STAGES[step].label}
        </p>
        <p className="mt-1 text-sm text-ink">{detail.steps[step]}</p>
        <p className="mt-1 text-xs text-muted">{STAGES[step].blurb}</p>
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
        <span className="text-xs text-muted">{step + 1} of {STAGES.length}</span>
        <button
          type="button"
          onClick={() => setStep((v) => Math.min(STAGES.length - 1, v + 1))}
          disabled={step === STAGES.length - 1}
          className="rounded-full border border-accent bg-accent/15 px-4 py-1.5 text-sm text-accent disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  )
}

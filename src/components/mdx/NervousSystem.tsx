import { useState } from 'react'
import { cn } from '#/lib/cn'

// The basic pathway of a nervous response: a stimulus is detected by a receptor,
// the message travels to the central nervous system to be coordinated, and an
// effector carries out the response. Click each stage.
const STEPS = [
  { id: 'stimulus', label: 'Stimulus', color: '#FDCB6E', fn: 'A change in the environment — like a bright light, a loud sound, or a hot surface.' },
  { id: 'receptor', label: 'Receptor', color: '#E67E22', fn: 'A cell or organ that detects the stimulus — eyes detect light, the skin detects touch and heat.' },
  { id: 'sensory', label: 'Sensory neuron', color: '#FD79A8', fn: 'Carries the message as an electrical impulse from the receptor to the central nervous system.' },
  { id: 'cns', label: 'CNS (coordinator)', color: '#0984E3', fn: 'The brain and spinal cord process the information and decide on a response.' },
  { id: 'motor', label: 'Motor neuron', color: '#A29BFE', fn: 'Carries the instruction from the CNS out to the effector.' },
  { id: 'effector', label: 'Effector', color: '#2ECC71', fn: 'A muscle or gland that carries out the response — a muscle contracts, a gland releases a substance.' },
  { id: 'response', label: 'Response', color: '#4FD1C5', fn: 'The action taken — pulling your hand away, blinking, turning your head.' },
]

export function NervousSystem() {
  const [sel, setSel] = useState('cns')
  const step = STEPS.find((s) => s.id === sel)!

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-wrap items-center justify-center gap-1">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <button
              type="button"
              onClick={() => setSel(s.id)}
              className={cn('rounded-lg border px-2 py-1.5 text-xs font-semibold transition-colors', sel === s.id ? 'text-white' : 'border-border text-muted hover:text-ink')}
              style={{ borderColor: s.color, background: sel === s.id ? s.color : undefined }}
            >
              {s.label}
            </button>
            {i < STEPS.length - 1 && <span className="px-0.5 text-muted">→</span>}
          </div>
        ))}
      </div>

      <p className="mt-3 rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted">
        <span className="font-semibold" style={{ color: step.color }}>{step.label}: </span>{step.fn}
      </p>
      <p className="mt-2 text-center text-xs text-muted">
        The <span className="text-ink">CNS</span> (central nervous system) = brain + spinal cord. The neurons connecting it to the body make up the peripheral nervous system.
      </p>
    </div>
  )
}

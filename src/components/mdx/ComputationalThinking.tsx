import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Computational thinking = the way a computer scientist breaks a problem down
// so a machine (or a person) can solve it. Four pillars, applied to an everyday
// problem you pick. Step through them to see the same thinking every time.

type Pillar = { key: string; name: string; icon: string; desc: string }

const PILLARS: Array<Pillar> = [
  { key: 'decompose', name: 'Decomposition', icon: 'PackageOpen', desc: 'Break a big, scary problem into small, solvable pieces.' },
  { key: 'pattern', name: 'Pattern Recognition', icon: 'Repeat', desc: 'Spot the parts that repeat or look like things you have solved before.' },
  { key: 'abstract', name: 'Abstraction', icon: 'Layers', desc: 'Ignore the irrelevant detail and keep only what matters.' },
  { key: 'algorithm', name: 'Algorithm', icon: 'ListOrdered', desc: 'Write the exact step-by-step recipe that solves it every time.' },
]

const PROBLEMS: Array<{ label: string; steps: [string, string, string, string] }> = [
  {
    label: 'Find a friend in a class photo',
    steps: [
      'Split the photo into rows of faces instead of scanning all at once.',
      'You always look for the same features — hair, glasses, height.',
      'Forget the background and clothes; only the face matters.',
      'Scan row by row, compare each face to your memory, stop when it matches.',
    ],
  },
  {
    label: 'Make breakfast for the family',
    steps: [
      'Separate it into tasks: toast, eggs, drinks, table.',
      'Every breakfast follows the same heat → cook → serve rhythm.',
      'You do not care what brand the pan is — just that it heats.',
      'Boil eggs (10 min) while toasting bread, pour drinks, then plate up.',
    ],
  },
  {
    label: 'Plan the fastest route to school',
    steps: [
      'Break the trip into legs between junctions.',
      'Rush hour always jams the same two roads.',
      'Treat the map as just dots (places) and lines (roads) with times.',
      'Try each route, add the leg times, pick the smallest total.',
    ],
  },
]

export function ComputationalThinking() {
  const [prob, setProb] = useState(0)
  const [step, setStep] = useState(0)
  const p = PILLARS[step]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-wrap gap-2">
        {PROBLEMS.map((pr, i) => (
          <button
            key={pr.label}
            type="button"
            onClick={() => { setProb(i); setStep(0) }}
            className={cn(
              'rounded-full border px-3 py-1 text-xs transition-colors',
              prob === i ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {pr.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        {PILLARS.map((pl, i) => (
          <button
            key={pl.key}
            type="button"
            onClick={() => setStep(i)}
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-xl border-2 transition-all',
              step === i ? 'border-accent bg-accent/15 text-accent scale-105' : 'border-border text-muted',
            )}
            title={pl.name}
          >
            <Icon name={pl.icon} size={18} />
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-border bg-surface-2 p-4 text-center">
        <div className="text-xs font-mono uppercase tracking-wide text-accent">Pillar {step + 1} of 4</div>
        <div className="mt-1 text-lg font-bold text-ink">{p.name}</div>
        <p className="mt-1 text-sm text-muted">{p.desc}</p>
        <div className="mt-3 rounded-lg border border-accent/30 bg-accent/5 p-3 text-sm text-ink">
          <span className="text-muted">Applied here: </span>
          {PROBLEMS[prob].steps[step]}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted disabled:opacity-40 hover:text-ink"
        >
          ← Back
        </button>
        <div className="flex gap-1.5">
          {PILLARS.map((_, i) => (
            <span key={i} className={cn('h-1.5 w-1.5 rounded-full', i === step ? 'bg-accent' : 'bg-border')} />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(3, s + 1))}
          disabled={step === 3}
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted disabled:opacity-40 hover:text-ink"
        >
          Next →
        </button>
      </div>
    </div>
  )
}

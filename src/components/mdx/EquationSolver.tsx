import { useState } from 'react'

// Solving linear equations, one balanced move at a time. Each step shows the
// equation AND the operation applied to both sides. Used in solving-linear and
// equations-with-brackets-and-fractions.
const PRESETS = [
  {
    label: '2x + 3 = 11',
    steps: [
      { eq: '2x + 3 = 11', note: 'Start.' },
      { eq: '2x = 8', note: 'Subtract 3 from both sides.' },
      { eq: 'x = 4', note: 'Divide both sides by 2.' },
    ],
  },
  {
    label: '3(x − 2) = 12',
    steps: [
      { eq: '3(x − 2) = 12', note: 'Start.' },
      { eq: '3x − 6 = 12', note: 'Expand the bracket.' },
      { eq: '3x = 18', note: 'Add 6 to both sides.' },
      { eq: 'x = 6', note: 'Divide both sides by 3.' },
    ],
  },
  {
    label: '5x − 4 = 2x + 8',
    steps: [
      { eq: '5x − 4 = 2x + 8', note: 'Variable on both sides.' },
      { eq: '3x − 4 = 8', note: 'Subtract 2x from both sides.' },
      { eq: '3x = 12', note: 'Add 4 to both sides.' },
      { eq: 'x = 4', note: 'Divide both sides by 3.' },
    ],
  },
]

export function EquationSolver() {
  const [p, setP] = useState(0)
  const [step, setStep] = useState(0)
  const preset = PRESETS[p]
  const done = step === preset.steps.length - 1

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap justify-center gap-2">
        {PRESETS.map((pr, i) => (
          <button key={i} onClick={() => { setP(i); setStep(0) }} className={`rounded-lg border px-2.5 py-1 font-mono text-xs transition ${i === p ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>
            {pr.label}
          </button>
        ))}
      </div>

      <div className="flex min-h-[88px] flex-col items-center justify-center rounded-xl bg-surface-2 py-4">
        <div className={`font-mono text-3xl font-bold ${done ? 'text-success' : 'text-ink'}`}>{preset.steps[step].eq}</div>
        <div className="mt-2 text-sm text-muted">{preset.steps[step].note}</div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition enabled:hover:border-accent disabled:opacity-40">← Back</button>
        <div className="flex gap-1.5">
          {preset.steps.map((_, i) => (<span key={i} className={`h-1.5 w-5 rounded-full ${i <= step ? 'bg-accent' : 'bg-border'}`} />))}
        </div>
        <button onClick={() => setStep((s) => Math.min(preset.steps.length - 1, s + 1))} disabled={done} className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition enabled:hover:border-accent disabled:opacity-40">Next →</button>
      </div>
      <p className="mt-2 text-center text-xs text-muted">Whatever you do to one side, do to the other — the balance never breaks.</p>
    </div>
  )
}

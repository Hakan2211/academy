import { useState } from 'react'

// Rearranging a formula = solving an equation with letters. Do the same inverse
// operation to BOTH sides until the wanted variable stands alone. Step through
// it. Used in rearranging-formulae (and echoed in the Equations world).
const PRESETS = [
  {
    label: 'make a the subject of v = u + at',
    steps: [
      { eq: 'v = u + a t', note: 'Goal: get a on its own.' },
      { eq: 'v − u = a t', note: 'Subtract u from both sides.' },
      { eq: '(v − u) ÷ t = a', note: 'Divide both sides by t.' },
      { eq: 'a = (v − u) / t', note: 'Done — a is the subject.' },
    ],
  },
  {
    label: 'make h the subject of A = ½ b h',
    steps: [
      { eq: 'A = ½ b h', note: 'Goal: isolate h.' },
      { eq: '2A = b h', note: 'Multiply both sides by 2.' },
      { eq: '2A ÷ b = h', note: 'Divide both sides by b.' },
      { eq: 'h = 2A / b', note: 'Done — h is the subject.' },
    ],
  },
]

export function RearrangeFormula() {
  const [p, setP] = useState(0)
  const [step, setStep] = useState(0)
  const preset = PRESETS[p]
  const done = step === preset.steps.length - 1

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap justify-center gap-2">
        {PRESETS.map((pr, i) => (
          <button key={i} onClick={() => { setP(i); setStep(0) }} className={`rounded-lg border px-2.5 py-1 text-xs transition ${i === p ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>
            {pr.label.replace('make ', '').replace(' the subject of', ':')}
          </button>
        ))}
      </div>

      <div className="flex min-h-[88px] flex-col items-center justify-center rounded-xl bg-surface-2 py-4">
        <div className={`font-mono text-2xl font-bold ${done ? 'text-success' : 'text-ink'}`}>{preset.steps[step].eq}</div>
        <div className="mt-1 text-sm text-muted">{preset.steps[step].note}</div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition enabled:hover:border-accent disabled:opacity-40">← Back</button>
        <div className="flex gap-1.5">
          {preset.steps.map((_, i) => (<span key={i} className={`h-1.5 w-5 rounded-full ${i <= step ? 'bg-accent' : 'bg-border'}`} />))}
        </div>
        <button onClick={() => setStep((s) => Math.min(preset.steps.length - 1, s + 1))} disabled={done} className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition enabled:hover:border-accent disabled:opacity-40">Next →</button>
      </div>
    </div>
  )
}

import { useState } from 'react'

// Order-of-operations (BODMAS / PEMDAS) stepper. Pick an expression and walk
// through it one operation at a time, in the correct order, watching it collapse
// to a single number. The note explains *why* each step goes first.
const EXAMPLES = [
  {
    label: '2 + 3 × 4',
    steps: [
      { expr: '2 + 3 × 4', note: 'Multiplication is done before addition.' },
      { expr: '2 + 12', note: '3 × 4 = 12.' },
      { expr: '14', note: 'Finally add: 2 + 12 = 14.' },
    ],
  },
  {
    label: '(2 + 3) × 4',
    steps: [
      { expr: '(2 + 3) × 4', note: 'Brackets first — they override everything.' },
      { expr: '5 × 4', note: '2 + 3 = 5.' },
      { expr: '20', note: 'Then multiply: 5 × 4 = 20.' },
    ],
  },
  {
    label: '2 + 3 × 4²',
    steps: [
      { expr: '2 + 3 × 4²', note: 'Orders (powers) come before × and +.' },
      { expr: '2 + 3 × 16', note: '4² = 16.' },
      { expr: '2 + 48', note: '3 × 16 = 48.' },
      { expr: '50', note: 'Add last: 2 + 48 = 50.' },
    ],
  },
  {
    label: '20 − 6 ÷ 2',
    steps: [
      { expr: '20 − 6 ÷ 2', note: 'Division before subtraction.' },
      { expr: '20 − 3', note: '6 ÷ 2 = 3.' },
      { expr: '17', note: 'Subtract: 20 − 3 = 17.' },
    ],
  },
]

export function OperationOrder() {
  const [ex, setEx] = useState(0)
  const [step, setStep] = useState(0)
  const example = EXAMPLES[ex]
  const done = step === example.steps.length - 1

  const pick = (i: number) => {
    setEx(i)
    setStep(0)
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap justify-center gap-2">
        {EXAMPLES.map((e, i) => (
          <button
            key={e.label}
            onClick={() => pick(i)}
            className={`rounded-lg border px-2.5 py-1 font-mono text-xs transition ${
              i === ex
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:border-accent'
            }`}
          >
            {e.label}
          </button>
        ))}
      </div>

      <div className="flex min-h-[90px] flex-col items-center justify-center rounded-xl bg-surface-2 py-5">
        <div className={`font-mono text-3xl font-bold ${done ? 'text-success' : 'text-ink'}`}>
          {example.steps[step].expr}
        </div>
        <div className="mt-2 px-4 text-center text-sm text-muted">{example.steps[step].note}</div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition enabled:hover:border-accent disabled:opacity-40"
        >
          ← Back
        </button>
        <div className="flex gap-1.5">
          {example.steps.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-5 rounded-full ${i <= step ? 'bg-accent' : 'bg-border'}`}
            />
          ))}
        </div>
        <button
          onClick={() => setStep((s) => Math.min(example.steps.length - 1, s + 1))}
          disabled={done}
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition enabled:hover:border-accent disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  )
}

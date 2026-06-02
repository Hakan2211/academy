import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// An illustrative (NOT executable) tour of the HALTING PROBLEM. First, programs
// whose fate is obvious — some clearly stop, some clearly loop forever. Then the
// self-referential proof sketch: assume a machine H decides halting for ANY
// program; build a saboteur that asks H about ITSELF and does the opposite.
// Whatever H answers, it's wrong — so H cannot exist. Some problems are
// provably UNDECIDABLE: no algorithm can ever solve them.

type Prog = { name: string; code: string; halts: boolean }
const PROGS: Array<Prog> = [
  { name: 'countTo10', code: 'for i in 1..10:\n  print(i)', halts: true },
  { name: 'addNumbers', code: 'return a + b', halts: true },
  { name: 'spinForever', code: 'while true:\n  pass', halts: false },
  { name: 'waitForEven', code: 'n = 3\nwhile n is odd:\n  n = n + 2', halts: false },
]

const STEPS = [
  {
    title: '1 · Suppose a halt-detector exists',
    body: 'Imagine a perfect program H(P) that, given any program P, always answers correctly: "halts" or "loops forever" — without ever running P.',
  },
  {
    title: '2 · Build a saboteur from it',
    body: 'Make a new program TROUBLE that runs H on itself. If H says TROUBLE halts, then TROUBLE loops forever. If H says it loops, TROUBLE halts. It does the opposite of H’s verdict.',
  },
  {
    title: '3 · Ask H about TROUBLE',
    body: 'Now run H(TROUBLE). Whatever it answers, TROUBLE was built to do the reverse — so H is wrong about TROUBLE. A "perfect" detector cannot be wrong.',
  },
  {
    title: '4 · Contradiction → H cannot exist',
    body: 'The only assumption was that H exists. It leads to a contradiction, so it is false. No program can decide halting for all programs. The halting problem is UNDECIDABLE.',
  },
]

export function HaltingProblem() {
  const [step, setStep] = useState(0)
  const last = STEPS.length - 1
  const s = STEPS[step]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      {/* part 1: obvious cases */}
      <div className="grid gap-2 sm:grid-cols-2">
        {PROGS.map((p) => (
          <div key={p.name} className="rounded-xl border border-border bg-surface-2 p-2.5">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-mono text-xs text-ink">{p.name}()</span>
              <span className={cn('flex items-center gap-1 text-xs font-semibold', p.halts ? 'text-success' : 'text-warn')}>
                <Icon name={p.halts ? 'CheckCircle' : 'RefreshCw'} size={12} />
                {p.halts ? 'halts' : 'loops forever'}
              </span>
            </div>
            <pre className="whitespace-pre-wrap font-mono text-[11px] leading-tight text-muted">{p.code}</pre>
          </div>
        ))}
      </div>
      <p className="mt-2 text-center text-xs text-muted">
        For these, the answer is obvious. The question: could ONE program decide this for <span className="italic">every</span> program?
      </p>

      {/* part 2: the paradox */}
      <div className="mt-4 rounded-xl border border-accent/40 bg-accent/5 p-3">
        <div className="flex items-center justify-center gap-3">
          {STEPS.map((_, i) => (
            <span key={i} className="flex items-center gap-3">
              <span
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors',
                  i === step ? 'border-accent bg-accent text-[#0a0f1f]' : i < step ? 'border-accent/60 text-accent' : 'border-border text-muted',
                )}
              >
                {i + 1}
              </span>
              {i < last && <span className={cn('h-0.5 w-5', i < step ? 'bg-accent/60' : 'bg-border')} />}
            </span>
          ))}
        </div>

        <div className="mt-3 min-h-[120px] text-center">
          <div className="font-semibold text-ink">{s.title}</div>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted">{s.body}</p>

          {step >= 2 && (
            <div className="mx-auto mt-3 flex max-w-sm items-center justify-center gap-2 text-xs">
              <span className="rounded-lg border border-border bg-surface px-2 py-1 font-mono text-ink">H(TROUBLE)</span>
              <Icon name="ArrowRight" size={14} className="text-muted" />
              <span className="rounded-lg border border-warn/60 bg-surface px-2 py-1 text-warn">says "halts"</span>
              <span className="text-muted">but it</span>
              <span className="rounded-lg border border-warn/60 bg-surface px-2 py-1 text-warn">loops</span>
            </div>
          )}
          {step === last && (
            <div className="mx-auto mt-2 inline-flex items-center gap-1.5 rounded-full border border-warn px-3 py-1 text-xs font-semibold text-warn">
              <Icon name="Ban" size={13} /> UNDECIDABLE — no such algorithm can exist
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex justify-center gap-2">
        <button
          type="button"
          onClick={() => setStep((v) => Math.max(0, v - 1))}
          disabled={step === 0}
          className={cn(
            'rounded-full border px-4 py-1.5 text-sm transition-colors',
            step === 0 ? 'cursor-not-allowed border-border text-muted/50' : 'border-border text-muted hover:text-ink',
          )}
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setStep((v) => Math.min(last, v + 1))}
          disabled={step === last}
          className={cn(
            'rounded-full border px-4 py-1.5 text-sm transition-colors',
            step === last ? 'cursor-not-allowed border-border text-muted/50' : 'border-accent bg-accent/15 text-accent',
          )}
        >
          Next step
        </button>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { cn } from '#/lib/cn'

// Boolean logic deals in just two values — TRUE and FALSE — combined with three
// core operations: AND (both), OR (either), NOT (the opposite). These are the
// rules of reasoning, and (as the next lessons show) the rules of every circuit.
// Toggle the inputs and switch the operation to feel each one.

type Op = 'AND' | 'OR' | 'XOR' | 'NOT'

const DESC: Record<Op, string> = {
  AND: 'TRUE only when BOTH inputs are TRUE.',
  OR: 'TRUE when AT LEAST ONE input is TRUE.',
  XOR: 'TRUE when the inputs DIFFER (exactly one is TRUE).',
  NOT: 'Flips a single input: TRUE becomes FALSE.',
}

function evalOp(op: Op, a: boolean, b: boolean): boolean {
  switch (op) {
    case 'AND': return a && b
    case 'OR': return a || b
    case 'XOR': return a !== b
    case 'NOT': return !a
  }
}

function Pill({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-14 w-24 flex-col items-center justify-center rounded-xl border-2 font-mono font-bold transition-colors',
        on ? 'border-success bg-success/15 text-success' : 'border-border bg-surface-2 text-muted',
      )}
    >
      <span className="text-[10px] font-normal text-muted">{label}</span>
      <span>{on ? 'TRUE' : 'FALSE'}</span>
    </button>
  )
}

export function BooleanLogicLab() {
  const [a, setA] = useState(true)
  const [b, setB] = useState(false)
  const [op, setOp] = useState<Op>('AND')
  const out = evalOp(op, a, b)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-wrap justify-center gap-2">
        {(['AND', 'OR', 'XOR', 'NOT'] as Array<Op>).map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => setOp(o)}
            className={cn(
              'rounded-full border px-4 py-1 font-mono text-sm transition-colors',
              op === o ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {o}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <div className="flex flex-col gap-2">
          <Pill on={a} label="input A" onClick={() => setA(!a)} />
          {op !== 'NOT' && <Pill on={b} label="input B" onClick={() => setB(!b)} />}
        </div>
        <div className="text-2xl text-muted">→</div>
        <div className="flex flex-col items-center gap-1">
          <span className="font-mono text-xs text-accent">{op}</span>
          <div
            className={cn(
              'flex h-20 w-28 items-center justify-center rounded-xl border-2 font-mono text-xl font-bold',
              out ? 'border-accent bg-accent/15 text-accent' : 'border-border bg-surface-2 text-muted',
            )}
          >
            {out ? 'TRUE' : 'FALSE'}
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-muted">{DESC[op]}</p>
    </div>
  )
}

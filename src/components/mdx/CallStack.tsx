import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Functions let you name a block of work and call it by that name. When a
// function calls another, the computer keeps track with a CALL STACK: each call
// PUSHES a frame (its parameters and where to return); each return POPS that
// frame (handing back a value). The newest call is always on top — that is why
// the stack knows exactly "where we are." Step through main → greet → format.

type Frame = { fn: string; args: string; ret?: string }

// A scripted trace of: main() calls greet("Ada"), which calls format("Ada").
type Event =
  | { kind: 'push'; frame: Frame; note: string }
  | { kind: 'return'; value: string; note: string }

const EVENTS: Array<Event> = [
  { kind: 'push', frame: { fn: 'main', args: '' }, note: 'The program starts: main() is pushed onto the stack.' },
  { kind: 'push', frame: { fn: 'greet', args: 'name = "Ada"' }, note: 'main calls greet("Ada") — a new frame is pushed on top.' },
  { kind: 'push', frame: { fn: 'format', args: 'text = "Ada"' }, note: 'greet calls format("Ada"). format is now the top frame.' },
  { kind: 'return', value: '"Hello, Ada!"', note: 'format returns its string and is popped. Control goes back to greet.' },
  { kind: 'return', value: '"Hello, Ada!"', note: 'greet returns the greeting and is popped. Back in main.' },
  { kind: 'return', value: '0', note: 'main returns 0 and is popped. The stack is empty — the program ends.' },
]

// Replay the events up to (and including) index `at` to derive the live stack.
function stackAt(at: number): { stack: Array<Frame>; lastReturn: string | null } {
  const stack: Array<Frame> = []
  let lastReturn: string | null = null
  for (let i = 0; i <= at && i < EVENTS.length; i++) {
    const e = EVENTS[i]
    if (e.kind === 'push') {
      stack.push({ ...e.frame })
      lastReturn = null
    } else {
      const popped = stack.pop()
      if (popped) popped.ret = e.value
      lastReturn = e.value
    }
  }
  return { stack, lastReturn }
}

export function CallStack() {
  const [step, setStep] = useState(0) // index into EVENTS; -1 conceptually = empty
  const at = step - 1
  const { stack } = at >= 0 ? stackAt(at) : { stack: [] as Array<Frame> }
  const current = step > 0 ? EVENTS[at] : null
  const done = step >= EVENTS.length

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_1.1fr]">
        {/* The stack, top frame drawn first (top of stack on top visually) */}
        <div className="flex flex-col">
          <div className="mb-1 flex items-center justify-center gap-1 text-xs uppercase tracking-wide text-muted">
            <Icon name="Layers" size={13} /> Call stack
          </div>
          <div className="flex flex-1 flex-col-reverse gap-1.5 rounded-xl border border-border bg-surface-2 p-2">
            {stack.length === 0 ? (
              <div className="flex h-20 items-center justify-center text-xs text-muted">stack empty</div>
            ) : (
              stack.map((f, i) => {
                const isTop = i === stack.length - 1
                return (
                  <div
                    key={i}
                    className={cn(
                      'rounded-lg border px-3 py-2 font-mono text-sm transition-all',
                      isTop ? 'border-accent bg-accent/15 text-accent' : 'border-border bg-surface text-muted',
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{f.fn}()</span>
                      {isTop && <span className="text-[10px] uppercase">top</span>}
                    </div>
                    {f.args && <div className="text-[11px] opacity-80">{f.args}</div>}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* What just happened */}
        <div className="rounded-xl border border-border bg-surface-2 p-3">
          <div className="text-xs uppercase tracking-wide text-muted">Step {Math.min(step, EVENTS.length)} of {EVENTS.length}</div>
          {current ? (
            <>
              <div
                className={cn(
                  'mt-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold',
                  current.kind === 'push' ? 'border-accent text-accent' : 'border-success text-success',
                )}
              >
                <Icon name={current.kind === 'push' ? 'ArrowDownToLine' : 'ArrowUpFromLine'} size={13} />
                {current.kind === 'push' ? 'PUSH frame' : 'RETURN & POP'}
              </div>
              {current.kind === 'return' && (
                <div className="mt-2 font-mono text-sm text-success">returns {current.value}</div>
              )}
              <p className="mt-2 text-sm text-ink/90">{current.note}</p>
            </>
          ) : (
            <p className="mt-2 text-sm text-muted">Press Step to start. main() will be called first.</p>
          )}
        </div>
      </div>

      <div className="mt-3 flex justify-center gap-2">
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(EVENTS.length, s + 1))}
          disabled={done}
          className={cn(
            'rounded-full border px-4 py-1.5 text-sm transition-colors',
            done ? 'cursor-not-allowed border-border text-muted/50' : 'border-accent bg-accent/15 text-accent',
          )}
        >
          Step
        </button>
        <button
          type="button"
          onClick={() => setStep(0)}
          className="rounded-full border border-border px-4 py-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          Reset
        </button>
      </div>
    </div>
  )
}

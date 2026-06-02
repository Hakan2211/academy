import { useEffect, useRef, useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// The bridge from "text" to "behavior": a tiny pseudocode program executed one
// line at a time. Each line is a single, mechanical instruction; a live panel
// shows the variables as they change. This is what a computer really does with
// your code — march down the lines, doing exactly one small thing at each.

type State = { total: number; n: number; line: number; output: Array<number> }

// Language-neutral pseudocode: sum the numbers 1..5, printing each running total.
const PROGRAM = [
  'total ← 0',
  'for n ← 1 to 5',
  '    total ← total + n',
  '    print total',
  'end for',
] as const

// Pure step function: given a machine state, return the next one.
function step(s: State): State {
  switch (s.line) {
    case 0:
      return { ...s, total: 0, line: 1 }
    case 1:
      // start / continue the loop
      return s.n < 5 ? { ...s, n: s.n + 1, line: 2 } : { ...s, line: 4 }
    case 2:
      return { ...s, total: s.total + s.n, line: 3 }
    case 3:
      return { ...s, output: [...s.output, s.total], line: 1 }
    default:
      return s // line 4: end — halted
  }
}

const START: State = { total: 0, n: 0, line: 0, output: [] }

export function CodeStepper() {
  const [s, setS] = useState<State>(START)
  const [running, setRunning] = useState(false)
  const done = s.line === 4

  const sRef = useRef(s)
  sRef.current = s
  const lastRef = useRef(0)
  useEffect(() => {
    if (!running) return
    let raf = 0
    lastRef.current = 0
    const loop = (now: number) => {
      if (!lastRef.current) lastRef.current = now
      if (now - lastRef.current >= 700) {
        lastRef.current = now
        if (sRef.current.line === 4) {
          setRunning(false)
          return
        }
        setS((cur) => step(cur))
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [running])

  function reset() {
    setRunning(false)
    setS(START)
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid gap-3 sm:grid-cols-[1.4fr_1fr]">
        {/* Program with the current line highlighted */}
        <div className="rounded-xl border border-border bg-surface-2 p-3 font-mono text-sm">
          {PROGRAM.map((code, i) => {
            const active = i === s.line && !done
            return (
              <div
                key={i}
                className={cn(
                  'flex items-center gap-2 rounded px-2 py-1 transition-colors',
                  active ? 'bg-accent/15 text-accent' : 'text-muted',
                )}
              >
                <span className="w-4 text-right text-[10px] text-muted/70">{i + 1}</span>
                <span className={active ? 'font-semibold' : ''} style={{ whiteSpace: 'pre' }}>{code}</span>
              </div>
            )
          })}
        </div>

        {/* Live variable + output panel */}
        <div className="rounded-xl border border-border bg-surface-2 p-3">
          <div className="mb-2 text-center text-xs uppercase tracking-wide text-muted">Variables</div>
          <div className="grid grid-cols-2 gap-2 font-mono text-sm">
            <Slot label="total" value={s.total} accent />
            <Slot label="n" value={s.n} />
          </div>
          <div className="mt-3 text-center text-xs uppercase tracking-wide text-muted">Output</div>
          <div className="mt-1 flex min-h-7 flex-wrap justify-center gap-1">
            {s.output.length === 0 ? (
              <span className="text-xs text-muted">—</span>
            ) : (
              s.output.map((v, i) => (
                <span key={i} className="rounded border border-success/40 bg-success/10 px-1.5 py-0.5 font-mono text-xs text-success">
                  {v}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        {done
          ? 'Halted. The loop ran five times, summing 1+2+3+4+5 = 15.'
          : 'The highlighted line is the one about to run. Watch the variables change as you step.'}
      </p>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => setS((cur) => step(cur))}
          disabled={done}
          className={cn(
            'rounded-full border px-4 py-1.5 text-sm transition-colors',
            done ? 'cursor-not-allowed border-border text-muted/50' : 'border-border text-muted hover:text-ink',
          )}
        >
          Step
        </button>
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          disabled={done}
          className={cn(
            'flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm transition-colors',
            done ? 'cursor-not-allowed border-border text-muted/50' : running ? 'border-warn text-warn' : 'border-accent bg-accent/15 text-accent',
          )}
        >
          <Icon name={running ? 'Pause' : 'Play'} size={14} />
          {running ? 'Pause' : 'Run'}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-border px-4 py-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          Reset
        </button>
      </div>
    </div>
  )
}

function Slot({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-surface px-2 py-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] uppercase text-muted">{label}</span>
        <span className={cn('text-base font-bold', accent ? 'text-accent' : 'text-ink')}>{value}</span>
      </div>
    </div>
  )
}

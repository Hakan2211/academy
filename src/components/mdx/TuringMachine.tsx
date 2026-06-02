import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

// A TURING MACHINE: an infinite TAPE of cells, a read/write HEAD, a current
// STATE, and a tiny table of rules. Each step it reads the symbol under the
// head, then the rule (state + symbol) tells it what to write, which way to
// move, and which state to enter. This absurdly simple device can compute
// anything any computer can. This program ADDS 1 to a binary number: move to
// the least-significant bit, then carry leftward (1→0 and keep carrying, 0→1
// and stop). Blank cells are shown as '_'.

type Sym = '0' | '1' | '_'
type StateId = 'seek' | 'carry' | 'halt'
type Move = -1 | 0 | 1 // left, stay (final write), right
type Rule = { write: Sym; move: Move; next: StateId }

// rules[state][symbol]
const RULES: Record<StateId, Partial<Record<Sym, Rule>>> = {
  // walk right to the blank past the last bit
  seek: {
    '0': { write: '0', move: 1, next: 'seek' },
    '1': { write: '1', move: 1, next: 'seek' },
    '_': { write: '_', move: -1, next: 'carry' },
  },
  // add 1 from the right: flip 1->0 and keep carrying; 0->1 and halt;
  // a blank means we ran off the left, so write the new leading 1 and halt.
  carry: {
    '1': { write: '0', move: -1, next: 'carry' },
    '0': { write: '1', move: 0, next: 'halt' },
    '_': { write: '1', move: 0, next: 'halt' },
  },
  halt: {},
}

const START_TAPE: Array<Sym> = ['_', '1', '0', '1', '1', '_'] // 1011 = 11
const START_HEAD = 1
const STATE_COPY: Record<StateId, string> = {
  seek: 'SEEK — scan right to find the end of the number.',
  carry: 'CARRY — add 1 from the right: flip 1→0 and carry, or 0→1 and stop.',
  halt: 'HALT — the program is finished.',
}

function value(tape: Array<Sym>): number {
  const bits = tape.filter((c) => c !== '_').join('')
  return bits ? parseInt(bits, 2) : 0
}

export function TuringMachine() {
  const [tape, setTape] = useState<Array<Sym>>(START_TAPE)
  const [head, setHead] = useState(START_HEAD)
  const [state, setState] = useState<StateId>('seek')
  const [steps, setSteps] = useState(0)
  const [running, setRunning] = useState(false)
  const startVal = useRef(value(START_TAPE)).current

  const done = state === 'halt'

  function step() {
    if (done) return
    const sym = tape[head] ?? '_'
    const rule = RULES[state][sym]
    if (!rule) {
      setState('halt')
      setRunning(false)
      return
    }
    const nextTape = tape.slice()
    nextTape[head] = rule.write
    let nextHead = head + rule.move
    // grow the (conceptually infinite) tape if we step off either end
    if (nextHead < 0) {
      nextTape.unshift('_')
      nextHead = 0
    } else if (nextHead >= nextTape.length) {
      nextTape.push('_')
    }
    setTape(nextTape)
    setHead(nextHead)
    setState(rule.next)
    setSteps((s) => s + 1)
    if (rule.next === 'halt') setRunning(false)
  }

  // rAF auto-run, advancing one rule roughly every 650ms.
  const lastRef = useRef(0)
  useEffect(() => {
    if (!running) return
    let raf = 0
    lastRef.current = 0
    const loop = (now: number) => {
      if (!lastRef.current) lastRef.current = now
      if (now - lastRef.current >= 650) {
        lastRef.current = now
        step()
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [running, tape, head, state])

  function reset() {
    setRunning(false)
    setTape(START_TAPE)
    setHead(START_HEAD)
    setState('seek')
    setSteps(0)
  }

  const stateColor: Record<StateId, string> = {
    seek: '#4F8CFF',
    carry: '#FFC83D',
    halt: '#2ECC71',
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      {/* the head marker, hovering over the active cell */}
      <div className="flex justify-center gap-1">
        {tape.map((_, i) => (
          <span key={i} className="flex h-4 w-9 items-center justify-center text-accent">
            {i === head ? '▼' : ''}
          </span>
        ))}
      </div>
      <div className="flex justify-center gap-1 font-mono">
        {tape.map((s, i) => (
          <span
            key={i}
            className={cn(
              'flex h-10 w-9 items-center justify-center rounded-lg border-2 text-base font-bold transition-colors',
              i === head ? 'border-accent bg-accent/15 text-accent' : 'border-border bg-surface-2 text-ink',
              s === '_' ? 'text-muted' : '',
            )}
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm">
        <span className="rounded-lg border px-3 py-1 font-semibold" style={{ borderColor: stateColor[state], color: stateColor[state] }}>
          {state.toUpperCase()}
        </span>
        <span className="text-muted">step <span className="font-mono text-ink">{steps}</span></span>
        <span className="text-muted">
          value <span className="font-mono text-ink">{value(tape)}</span>
          {done && <span className="text-success"> ({startVal} + 1)</span>}
        </span>
      </div>

      <p className="mt-2 text-center text-xs text-muted">{STATE_COPY[state]}</p>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={step}
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
            'rounded-full border px-4 py-1.5 text-sm transition-colors',
            done ? 'cursor-not-allowed border-border text-muted/50' : running ? 'border-warn text-warn' : 'border-accent bg-accent/15 text-accent',
          )}
        >
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

      <div className="mt-3 grid gap-1 text-xs sm:grid-cols-2">
        {(['seek', 'carry'] as Array<StateId>).map((st) => (
          <div key={st} className="rounded-lg border border-border bg-surface-2 p-2">
            <div className="mb-1 font-semibold" style={{ color: stateColor[st] }}>{st.toUpperCase()}</div>
            {Object.entries(RULES[st]).map(([read, r]) => (
              <div key={read} className={cn('font-mono text-muted', state === st && tape[head] === read ? 'text-ink' : '')}>
                read {read} → write {r!.write}, move {r!.move === 1 ? 'R' : r!.move === -1 ? 'L' : '·'}, {r!.next}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

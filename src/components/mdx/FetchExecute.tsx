import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

// The heartbeat of every computer: the fetch–decode–execute cycle. A tiny CPU
// (program counter, instruction register, accumulator and ALU) runs a small
// hard-coded program stored in memory. Each tick it FETCHES the instruction the
// PC points to, DECODES it, EXECUTES it on the accumulator, then advances the
// PC. Step through it, or hit Run and watch the clock drive it round and round.

type Op = 'LOAD' | 'ADD' | 'SUB' | 'STORE' | 'HALT'
type Cell = { op: Op; arg: number; text: string }

// Program: load 6, add 3, subtract 2, store the result, then halt. acc -> 7.
const PROGRAM: Array<Cell> = [
  { op: 'LOAD', arg: 6, text: 'LOAD 6' },
  { op: 'ADD', arg: 3, text: 'ADD 3' },
  { op: 'SUB', arg: 2, text: 'SUB 2' },
  { op: 'STORE', arg: 9, text: 'STORE 9' },
  { op: 'HALT', arg: 0, text: 'HALT' },
]

type Phase = 'fetch' | 'decode' | 'execute' | 'done'
const PHASES: Array<Phase> = ['fetch', 'decode', 'execute']

const PHASE_COPY: Record<Phase, string> = {
  fetch: 'FETCH — copy the instruction at the PC’s address into the instruction register.',
  decode: 'DECODE — the control unit works out which operation this is.',
  execute: 'EXECUTE — perform it: the ALU updates the accumulator, then the PC advances.',
  done: 'HALT — the program is finished. Press Reset to run it again.',
}

export function FetchExecute() {
  const [pc, setPc] = useState(0)
  const [acc, setAcc] = useState(0)
  const [stored, setStored] = useState<number | null>(null)
  const [phaseIdx, setPhaseIdx] = useState(0) // 0 fetch, 1 decode, 2 execute
  const [done, setDone] = useState(false)
  const [running, setRunning] = useState(false)

  const ir = PROGRAM[pc] ?? null
  const phase: Phase = done ? 'done' : PHASES[phaseIdx]
  // The IR is empty during fetch (still being read); filled from decode onward.
  const irShown = phaseIdx >= 1 || done ? ir : null

  function advance() {
    if (done) return
    if (phaseIdx < 2) {
      setPhaseIdx(phaseIdx + 1)
      return
    }
    // execute phase: apply the current instruction's effect, then move PC
    const cur = PROGRAM[pc]
    if (!cur || cur.op === 'HALT') {
      setDone(true)
      setRunning(false)
      return
    }
    if (cur.op === 'LOAD') setAcc(cur.arg)
    else if (cur.op === 'ADD') setAcc((a) => a + cur.arg)
    else if (cur.op === 'SUB') setAcc((a) => a - cur.arg)
    else if (cur.op === 'STORE') setStored(acc)
    const next = pc + 1
    if (next >= PROGRAM.length) {
      setDone(true)
      setRunning(false)
    } else {
      setPc(next)
      setPhaseIdx(0)
    }
  }

  // rAF-driven auto-run: advance one phase roughly every 850ms.
  const lastRef = useRef(0)
  useEffect(() => {
    if (!running) return
    let raf = 0
    lastRef.current = 0
    const loop = (now: number) => {
      if (!lastRef.current) lastRef.current = now
      if (now - lastRef.current >= 850) {
        lastRef.current = now
        advance()
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [running, pc, phaseIdx, acc, done])

  function reset() {
    setRunning(false)
    setPc(0)
    setAcc(0)
    setStored(null)
    setPhaseIdx(0)
    setDone(false)
  }

  const phaseColor: Record<Phase, string> = {
    fetch: '#4F8CFF',
    decode: '#FFC83D',
    execute: '#2ECC71',
    done: 'var(--color-muted)',
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_1.1fr]">
        {/* MEMORY column */}
        <div>
          <div className="mb-1 text-center text-xs uppercase tracking-wide text-muted">Memory</div>
          <div className="space-y-1 font-mono text-sm">
            {PROGRAM.map((cell, i) => {
              const isPc = i === pc && !done
              const fetching = isPc && phase === 'fetch'
              return (
                <div
                  key={i}
                  className={cn(
                    'flex items-center gap-2 rounded-lg border px-2 py-1.5 transition-colors',
                    fetching ? 'border-accent bg-accent/15' : isPc ? 'border-accent/60 bg-surface-2' : 'border-border bg-surface-2',
                  )}
                >
                  <span className="w-5 text-right text-xs text-muted">{i}</span>
                  <span className={cn('flex-1', isPc ? 'text-ink' : 'text-muted')}>{cell.text}</span>
                  {isPc && <span className="text-[10px] uppercase text-accent">PC</span>}
                </div>
              )
            })}
            <div className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-surface-2 px-2 py-1.5">
              <span className="w-5 text-right text-xs text-muted">9</span>
              <span className="flex-1 text-muted">data</span>
              <span className={cn('text-xs', stored !== null ? 'text-success' : 'text-muted')}>{stored ?? '—'}</span>
            </div>
          </div>
        </div>

        {/* CPU registers */}
        <div className="rounded-xl border border-border bg-surface-2 p-3">
          <div className="mb-2 text-center text-xs uppercase tracking-wide text-muted">CPU</div>
          <div className="grid grid-cols-2 gap-2 font-mono text-sm">
            <Reg label="PC" value={pc} hint="next address" />
            <Reg label="IR" value={irShown ? irShown.text : '—'} hint="current instr." />
            <Reg label="ACC" value={acc} hint="accumulator" accent />
            <Reg label="ALU" value={phase === 'execute' && ir && ir.op !== 'HALT' ? aluText(ir) : 'idle'} hint="arith/logic" />
          </div>

          <div
            className="mt-3 rounded-lg border px-3 py-2 text-center text-xs font-semibold"
            style={{ borderColor: phaseColor[phase], color: phaseColor[phase] }}
          >
            {phase === 'done' ? 'HALTED' : phase.toUpperCase()}
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-muted">{PHASE_COPY[phase]}</p>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={advance}
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
    </div>
  )
}

function aluText(ir: Cell): string {
  if (ir.op === 'ADD') return `+ ${ir.arg}`
  if (ir.op === 'SUB') return `− ${ir.arg}`
  if (ir.op === 'LOAD') return `set ${ir.arg}`
  if (ir.op === 'STORE') return 'write'
  return 'idle'
}

function Reg({ label, value, hint, accent }: { label: string; value: number | string; hint: string; accent?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-surface px-2 py-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] uppercase text-muted">{label}</span>
        <span className={cn('text-sm font-bold', accent ? 'text-accent' : 'text-ink')}>{value}</span>
      </div>
      <div className="text-[9px] text-muted">{hint}</div>
    </div>
  )
}

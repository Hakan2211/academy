import { useState } from 'react'
import { cn } from '#/lib/cn'

// The simplest model of computation: a DETERMINISTIC FINITE AUTOMATON (DFA).
// It has a fixed set of states and reads an input string one symbol at a time,
// jumping between states according to a transition rule. Its only "memory" is
// which state it is in — a finite, bounded amount. This DFA accepts binary
// strings with an EVEN number of 1s: state EVEN is accepting, ODD is not.

type StateId = 'EVEN' | 'ODD'

// transition[state][symbol] -> next state
const TRANSITION: Record<StateId, Record<'0' | '1', StateId>> = {
  EVEN: { '0': 'EVEN', '1': 'ODD' },
  ODD: { '0': 'ODD', '1': 'EVEN' },
}
const START: StateId = 'EVEN'
const ACCEPTING: StateId = 'EVEN'

const PRESETS = ['1011', '110', '0101', '1']

export function StateMachine() {
  const [input, setInput] = useState('1011')
  const [pos, setPos] = useState(0) // how many symbols consumed
  const [state, setState] = useState<StateId>(START)

  const symbols = input.split('')
  const finished = pos >= symbols.length
  const accepts = state === ACCEPTING

  function reset(next = input) {
    setInput(next)
    setPos(0)
    setState(START)
  }

  function step() {
    if (finished) return
    const sym = symbols[pos] as '0' | '1'
    setState(TRANSITION[state][sym])
    setPos(pos + 1)
  }

  // Geometry for the two-state diagram.
  const cx = { EVEN: 110, ODD: 250 }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs uppercase tracking-wide text-muted">input</span>
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => reset(p)}
            className={cn(
              'rounded-full border px-3 py-1 font-mono text-sm transition-colors',
              input === p ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {p}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 360 150" className="mt-3 w-full">
        {/* start arrow */}
        <line x1="40" y1="70" x2="78" y2="70" stroke="var(--color-muted)" strokeWidth="2" markerEnd="url(#sm-arrow)" />
        <text x="40" y="60" fontSize="9" fill="var(--color-muted)">start</text>

        {/* transition: EVEN --1--> ODD (top) */}
        <path d="M138,55 Q180,18 222,55" fill="none" stroke="var(--color-accent-2)" strokeWidth="2" markerEnd="url(#sm-arrow2)" />
        <text x="180" y="22" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--color-accent-2)">1</text>
        {/* transition: ODD --1--> EVEN (bottom) */}
        <path d="M222,85 Q180,122 138,85" fill="none" stroke="var(--color-accent-2)" strokeWidth="2" markerEnd="url(#sm-arrow2)" />
        <text x="180" y="120" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--color-accent-2)">1</text>

        {/* self-loops on 0 */}
        <path d="M96,42 Q70,8 124,30" fill="none" stroke="var(--color-muted)" strokeWidth="2" markerEnd="url(#sm-arrow)" />
        <text x="86" y="14" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--color-muted)">0</text>
        <path d="M236,42 Q210,8 264,30" fill="none" stroke="var(--color-muted)" strokeWidth="2" markerEnd="url(#sm-arrow)" />
        <text x="226" y="14" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--color-muted)">0</text>

        {(['EVEN', 'ODD'] as Array<StateId>).map((s) => {
          const active = state === s
          const acc = s === ACCEPTING
          return (
            <g key={s}>
              {/* double ring marks an accepting state */}
              {acc && <circle cx={cx[s]} cy={70} r="30" fill="none" stroke={active ? 'var(--color-accent)' : 'var(--color-border)'} strokeWidth="1.5" />}
              <circle
                cx={cx[s]}
                cy={70}
                r="25"
                fill={active ? 'var(--color-accent)' : 'var(--color-surface-2)'}
                stroke={active ? 'var(--color-accent)' : 'var(--color-border)'}
                strokeWidth="2"
              />
              <text x={cx[s]} y={68} textAnchor="middle" fontSize="11" fontWeight="700" fill={active ? '#0a0f1f' : 'var(--color-ink)'}>{s}</text>
              <text x={cx[s]} y={80} textAnchor="middle" fontSize="8" fill={active ? '#0a0f1f' : 'var(--color-muted)'}>{acc ? 'accept' : 'reject'}</text>
            </g>
          )
        })}

        <defs>
          <marker id="sm-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--color-muted)" />
          </marker>
          <marker id="sm-arrow2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--color-accent-2)" />
          </marker>
        </defs>
      </svg>

      {/* the input tape, with a cursor under the next symbol */}
      <div className="mt-2 flex justify-center gap-1 font-mono">
        {symbols.map((s, i) => (
          <span
            key={i}
            className={cn(
              'flex h-9 w-9 flex-col items-center justify-center rounded-lg border text-sm font-bold',
              i < pos ? 'border-border bg-surface-2 text-muted' : i === pos ? 'border-accent bg-accent/15 text-accent' : 'border-border bg-surface-2 text-ink',
            )}
          >
            {s}
            <span className="h-1 text-[8px] leading-none">{i === pos && !finished ? '▲' : ''}</span>
          </span>
        ))}
      </div>

      <p className="mt-2 text-center text-sm text-muted">
        {finished ? (
          <span className={accepts ? 'font-semibold text-success' : 'font-semibold text-warn'}>
            {accepts ? 'ACCEPTED' : 'REJECTED'} — ended in {state} ({symbols.filter((c) => c === '1').length} ones).
          </span>
        ) : (
          <>State <span className="font-mono font-semibold text-ink">{state}</span>. Reading symbol {pos + 1} of {symbols.length}.</>
        )}
      </p>

      <div className="mt-3 flex justify-center gap-2">
        <button
          type="button"
          onClick={step}
          disabled={finished}
          className={cn(
            'rounded-full border px-4 py-1.5 text-sm transition-colors',
            finished ? 'cursor-not-allowed border-border text-muted/50' : 'border-accent bg-accent/15 text-accent',
          )}
        >
          Step
        </button>
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full border border-border px-4 py-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          Reset
        </button>
      </div>
    </div>
  )
}

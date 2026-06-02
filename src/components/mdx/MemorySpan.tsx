import { useEffect, useRef, useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'
import { rng } from '#/lib/psych'

// An interactive digit-span test. A sequence of digits flashes one at a time;
// then the keypad unlocks and you tap them back in order. Succeed and the next
// sequence is one digit longer; fail and it shrinks. People top out around the
// famous 7 +/- 2 — the capacity limit of short-term memory. The sequence is
// generated from a deterministic seed (rng) so the first run is identical on
// every machine; the flash timing uses setTimeout and is fully cleaned up.
type Phase = 'idle' | 'showing' | 'recall' | 'correct' | 'wrong'

const FLASH_MS = 750
const GAP_MS = 220

// Deterministic digit sequence of a given length, from a per-length seed.
function makeSequence(len: number): Array<number> {
  const next = rng(1000 + len * 31)
  return Array.from({ length: len }, () => Math.floor(next() * 10))
}

export function MemorySpan() {
  const [len, setLen] = useState(4)
  const [phase, setPhase] = useState<Phase>('idle')
  const [seq, setSeq] = useState<Array<number>>([])
  const [shownIdx, setShownIdx] = useState(-1) // which digit is lit during 'showing'
  const [entered, setEntered] = useState<Array<number>>([])
  const [best, setBest] = useState(0)
  const timers = useRef<Array<number>>([])

  const clearTimers = () => {
    for (const t of timers.current) window.clearTimeout(t)
    timers.current = []
  }

  useEffect(() => () => clearTimers(), [])

  const start = (length: number) => {
    clearTimers()
    const s = makeSequence(length)
    setSeq(s)
    setEntered([])
    setShownIdx(-1)
    setPhase('showing')

    // Schedule each digit's flash, then unlock recall.
    let t = 0
    for (let i = 0; i < s.length; i++) {
      timers.current.push(window.setTimeout(() => setShownIdx(i), t))
      t += FLASH_MS
      timers.current.push(window.setTimeout(() => setShownIdx(-1), t))
      t += GAP_MS
    }
    timers.current.push(window.setTimeout(() => setPhase('recall'), t))
  }

  const tap = (d: number) => {
    if (phase !== 'recall') return
    const next = [...entered, d]
    setEntered(next)
    const i = next.length - 1
    if (next[i] !== seq[i]) {
      setPhase('wrong')
      setLen((v) => Math.max(3, v - 1))
      return
    }
    if (next.length === seq.length) {
      setPhase('correct')
      setBest((b) => Math.max(b, seq.length))
      setLen((v) => Math.min(10, v + 1))
    }
  }

  const showing = phase === 'showing'
  const recall = phase === 'recall'
  const done = phase === 'correct' || phase === 'wrong'

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-ink">Digit span</p>
        <p className="text-xs text-muted">
          Length <span className="font-mono text-ink">{len}</span>
          {best > 0 && (
            <>
              {' · '}best <span className="font-mono text-accent">{best}</span>
            </>
          )}
        </p>
      </div>

      {/* The flashing strip */}
      <div className="mt-3 flex min-h-[64px] flex-wrap items-center justify-center gap-2 rounded-xl bg-surface-2 p-3">
        {phase === 'idle' ? (
          <span className="text-sm text-muted">Press Start, watch the digits, then tap them back in order.</span>
        ) : showing ? (
          seq.map((d, i) => (
            <span
              key={i}
              className={cn(
                'flex h-12 w-10 items-center justify-center rounded-lg font-mono text-2xl font-bold transition-all',
                i === shownIdx ? 'bg-accent text-[#0a0f1f]' : 'border border-border text-muted/30',
              )}
            >
              {i === shownIdx ? d : ''}
            </span>
          ))
        ) : (
          seq.map((d, i) => {
            const guess = entered[i]
            const filled = guess !== undefined
            const isWrong = done && filled && guess !== d
            return (
              <span
                key={i}
                className={cn(
                  'flex h-12 w-10 items-center justify-center rounded-lg border font-mono text-2xl font-bold',
                  isWrong
                    ? 'border-warn bg-warn/15 text-warn'
                    : filled
                      ? 'border-success bg-success/15 text-success'
                      : 'border-border text-muted/30',
                )}
              >
                {filled ? guess : '·'}
              </span>
            )
          })
        )}
      </div>

      {/* Keypad */}
      <div className="mx-auto mt-3 grid max-w-[260px] grid-cols-5 gap-2">
        {Array.from({ length: 10 }).map((_, d) => (
          <button
            key={d}
            type="button"
            onClick={() => tap(d)}
            disabled={!recall}
            className={cn(
              'rounded-lg border py-2 font-mono text-lg transition-colors',
              recall ? 'border-border text-ink hover:border-accent hover:text-accent' : 'border-border/50 text-muted/40',
            )}
          >
            {d}
          </button>
        ))}
      </div>

      {done && (
        <div
          className={cn(
            'mt-3 flex items-center gap-2 rounded-xl border p-3 text-sm',
            phase === 'correct' ? 'border-success/40 bg-success/10 text-ink' : 'border-warn/40 bg-warn/10 text-ink',
          )}
        >
          <Icon name={phase === 'correct' ? 'CircleCheck' : 'Info'} size={16} className={phase === 'correct' ? 'text-success' : 'text-warn'} />
          {phase === 'correct'
            ? `Nice — all ${seq.length} recalled. Try one more.`
            : 'Slipped at one. That edge is your short-term capacity at work.'}
        </div>
      )}

      <div className="mt-3 flex items-center justify-center">
        <button
          type="button"
          onClick={() => start(len)}
          disabled={showing}
          className={cn(
            'rounded-full border px-5 py-1.5 text-sm transition-colors',
            showing ? 'cursor-not-allowed border-border text-muted/50' : 'border-accent bg-accent/15 text-accent',
          )}
        >
          {phase === 'idle' ? 'Start' : showing ? 'Watch…' : 'Next sequence'}
        </button>
      </div>

      <p className="mt-3 text-center text-xs leading-relaxed text-muted">
        Most people reliably hold about <span className="font-medium text-ink">7 ± 2</span> items in short-term memory. Push past your
        span and the digits start to slip — you have hit the ceiling George Miller called the{' '}
        <span className="text-ink">magical number seven</span>.
      </p>
    </div>
  )
}

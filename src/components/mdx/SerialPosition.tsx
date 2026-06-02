import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

// The serial-position effect. A list of words flashes one at a time; then you
// type back as many as you can. Across many people, recall plots a U: the FIRST
// few words are remembered well (the PRIMACY effect — they got rehearsed into
// long-term memory) and the LAST few are remembered well (the RECENCY effect —
// still sitting in short-term memory), while the middle sags. We overlay the
// canonical U-curve so a single run already tells the story, and mark which of
// your guesses landed. The word list is fixed (deterministic) so the demo is
// stable on server and client.
const WORDS = ['river', 'candle', 'pencil', 'forest', 'window', 'silver', 'planet', 'guitar', 'bridge', 'meadow', 'anchor', 'lantern']
const FLASH_MS = 700
const GAP_MS = 180

type Phase = 'idle' | 'showing' | 'recall' | 'scored'

const W = 360
const H = 170
const PAD_L = 30
const PAD_R = 12
const PAD_T = 14
const PAD_B = 26
const PLOT_W = W - PAD_L - PAD_R
const PLOT_H = H - PAD_T - PAD_B

// Canonical recall-probability per position (U-shaped), for n positions.
function canonical(i: number, n: number): number {
  const u = i / (n - 1) // 0..1
  const primacy = Math.exp(-u * 5)
  const recency = Math.exp(-(1 - u) * 4)
  return Math.min(0.98, 0.18 + 0.82 * Math.max(primacy, recency))
}

export function SerialPosition() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [shownIdx, setShownIdx] = useState(-1)
  const [input, setInput] = useState('')
  const [recalled, setRecalled] = useState<Set<number>>(new Set())
  const timers = useRef<Array<number>>([])

  const clearTimers = () => {
    for (const t of timers.current) window.clearTimeout(t)
    timers.current = []
  }
  useEffect(() => () => clearTimers(), [])

  const start = () => {
    clearTimers()
    setRecalled(new Set())
    setInput('')
    setShownIdx(-1)
    setPhase('showing')
    let t = 0
    for (let i = 0; i < WORDS.length; i++) {
      timers.current.push(window.setTimeout(() => setShownIdx(i), t))
      t += FLASH_MS
      timers.current.push(window.setTimeout(() => setShownIdx(-1), t))
      t += GAP_MS
    }
    timers.current.push(window.setTimeout(() => setPhase('recall'), t))
  }

  const score = () => {
    const typed = input
      .toLowerCase()
      .split(/[\s,]+/)
      .map((w) => w.trim())
      .filter(Boolean)
    const hits = new Set<number>()
    for (const w of typed) {
      const idx = WORDS.indexOf(w)
      if (idx >= 0) hits.add(idx)
    }
    setRecalled(hits)
    setPhase('scored')
  }

  const xOf = (i: number) => PAD_L + (i / (WORDS.length - 1)) * PLOT_W
  const yOf = (p: number) => PAD_T + (1 - p) * PLOT_H

  const curvePath = Array.from({ length: WORDS.length }, (_, i) => `${i ? 'L' : 'M'}${xOf(i).toFixed(1)} ${yOf(canonical(i, WORDS.length)).toFixed(1)}`).join(' ')

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      {/* word stage */}
      <div className="flex min-h-[56px] items-center justify-center rounded-xl bg-surface-2 p-3">
        {phase === 'idle' && <span className="text-sm text-muted">A list of words will flash. Then type back every one you can recall.</span>}
        {phase === 'showing' && (
          <span className="font-mono text-2xl font-bold text-accent">{shownIdx >= 0 ? WORDS[shownIdx] : '•'}</span>
        )}
        {(phase === 'recall' || phase === 'scored') && (
          <div className="w-full">
            <input
              type="text"
              value={input}
              disabled={phase === 'scored'}
              onChange={(e) => setInput(e.target.value)}
              placeholder="type the words, separated by spaces…"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent disabled:opacity-60"
            />
          </div>
        )}
      </div>

      {/* the curve, shown after scoring */}
      {phase === 'scored' && (
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full">
          <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={H - PAD_B} stroke="var(--color-border)" strokeWidth="1.5" />
          <line x1={PAD_L} y1={H - PAD_B} x2={W - PAD_R} y2={H - PAD_B} stroke="var(--color-border)" strokeWidth="1.5" />
          <text x={(PAD_L + W - PAD_R) / 2} y={H - 4} textAnchor="middle" fontSize="9" fill="var(--color-muted)">
            Position in list →
          </text>
          <text x={11} y={H / 2} textAnchor="middle" fontSize="9" fill="var(--color-muted)" transform={`rotate(-90 11 ${H / 2})`}>
            Recall %
          </text>
          {/* canonical U curve */}
          <path d={curvePath} fill="none" stroke="var(--color-accent-2)" strokeWidth="2" strokeDasharray="4 3" />
          {/* primacy / recency shading labels */}
          <text x={xOf(0) + 6} y={PAD_T + 8} fontSize="8.5" fill="#2ECC71">
            primacy
          </text>
          <text x={xOf(WORDS.length - 1) - 6} y={PAD_T + 8} textAnchor="end" fontSize="8.5" fill="#F39C12">
            recency
          </text>
          {/* your hits */}
          {WORDS.map((_, i) => {
            const hit = recalled.has(i)
            return (
              <circle
                key={i}
                cx={xOf(i)}
                cy={yOf(hit ? canonical(i, WORDS.length) : 0)}
                r={hit ? 5 : 3}
                fill={hit ? 'var(--color-accent)' : 'var(--color-border)'}
                stroke={hit ? 'var(--color-ink)' : 'none'}
                strokeWidth={1}
              />
            )
          })}
        </svg>
      )}

      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="text-sm text-muted">
          {phase === 'scored'
            ? `You recalled ${recalled.size} of ${WORDS.length}.`
            : phase === 'showing'
              ? 'Watch closely…'
              : `${WORDS.length} words`}
        </p>
        {phase === 'recall' ? (
          <button type="button" onClick={score} className="rounded-full border border-accent bg-accent/15 px-4 py-1.5 text-sm text-accent">
            Check recall
          </button>
        ) : (
          <button
            type="button"
            onClick={start}
            disabled={phase === 'showing'}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm transition-colors',
              phase === 'showing' ? 'cursor-not-allowed border-border text-muted/50' : 'border-accent bg-accent/15 text-accent',
            )}
          >
            {phase === 'idle' ? 'Start' : 'Run again'}
          </button>
        )}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted">
        Recall traces a <span className="font-medium text-ink">U</span>. The opening words win the{' '}
        <span style={{ color: '#2ECC71' }}>primacy effect</span> — extra rehearsal pushed them into long-term memory. The closing words win
        the <span style={{ color: '#F39C12' }}>recency effect</span> — they are still warm in short-term memory. The middle, rehearsed
        least and already displaced, sags. Two memory stores, one curve.
      </p>
    </div>
  )
}

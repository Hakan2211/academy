import { useEffect, useRef, useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// The Deese-Roediger-McDermott (DRM) illusion of memory. A list of related
// words flashes — bed, rest, awake, tired, dream… — every one a strong
// associate of a word that is NEVER shown: SLEEP, the "lure". At test, people
// confidently "remember" seeing the lure. Here you study a themed list, then a
// recognition test mixes a few real list words, the lure, and unrelated
// distractors; tap the ones you think you saw. Most people fall for the lure —
// proof that memory is reconstructed, not replayed. Lists are fixed
// (deterministic) so behaviour is stable.
const STUDY = ['bed', 'rest', 'awake', 'tired', 'dream', 'snooze', 'blanket', 'doze', 'slumber', 'nap']
const LURE = 'sleep' // strongly implied, never shown
const TEST: Array<{ word: string; kind: 'old' | 'lure' | 'new' }> = [
  { word: 'tired', kind: 'old' },
  { word: 'chair', kind: 'new' },
  { word: 'dream', kind: 'old' },
  { word: 'sleep', kind: 'lure' },
  { word: 'doze', kind: 'old' },
  { word: 'river', kind: 'new' },
  { word: 'blanket', kind: 'old' },
  { word: 'mountain', kind: 'new' },
]

const FLASH_MS = 650
const GAP_MS = 160

type Phase = 'idle' | 'studying' | 'test' | 'result'

export function FalseMemory() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [shownIdx, setShownIdx] = useState(-1)
  const [picked, setPicked] = useState<Set<number>>(new Set())
  const timers = useRef<Array<number>>([])

  const clearTimers = () => {
    for (const t of timers.current) window.clearTimeout(t)
    timers.current = []
  }
  useEffect(() => () => clearTimers(), [])

  const start = () => {
    clearTimers()
    setPicked(new Set())
    setShownIdx(-1)
    setPhase('studying')
    let t = 0
    for (let i = 0; i < STUDY.length; i++) {
      timers.current.push(window.setTimeout(() => setShownIdx(i), t))
      t += FLASH_MS
      timers.current.push(window.setTimeout(() => setShownIdx(-1), t))
      t += GAP_MS
    }
    timers.current.push(window.setTimeout(() => setPhase('test'), t))
  }

  const toggle = (i: number) => {
    if (phase !== 'test') return
    setPicked((p) => {
      const n = new Set(p)
      if (n.has(i)) n.delete(i)
      else n.add(i)
      return n
    })
  }

  const lureIdx = TEST.findIndex((t) => t.kind === 'lure')
  const fellForLure = picked.has(lureIdx)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      {/* study stage */}
      <div className="flex min-h-[60px] items-center justify-center rounded-xl bg-surface-2 p-3">
        {phase === 'idle' && <span className="text-sm text-muted">Study the words as they flash. Then we’ll test what you remember.</span>}
        {phase === 'studying' && <span className="font-mono text-2xl font-bold text-accent">{shownIdx >= 0 ? STUDY[shownIdx] : '•'}</span>}
        {(phase === 'test' || phase === 'result') && (
          <span className="text-sm text-muted">
            {phase === 'test' ? 'Tap every word you remember seeing in the list.' : 'Results below — green is right, red was a trap.'}
          </span>
        )}
      </div>

      {/* recognition test */}
      {(phase === 'test' || phase === 'result') && (
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TEST.map((t, i) => {
            const on = picked.has(i)
            let style = on ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink'
            if (phase === 'result') {
              if (t.kind === 'lure') style = on ? 'border-warn bg-warn/15 text-warn' : 'border-border text-muted'
              else if (t.kind === 'old') style = on ? 'border-success bg-success/15 text-success' : 'border-border text-muted line-through'
              else style = on ? 'border-warn bg-warn/15 text-warn' : 'border-border text-muted'
            }
            return (
              <button
                key={t.word}
                type="button"
                onClick={() => toggle(i)}
                disabled={phase === 'result'}
                className={cn('rounded-lg border px-2 py-2 text-sm font-medium transition-colors', style)}
              >
                {t.word}
              </button>
            )
          })}
        </div>
      )}

      {phase === 'result' && (
        <div
          className={cn(
            'mt-3 flex items-start gap-2 rounded-xl border p-3 text-sm',
            fellForLure ? 'border-warn/40 bg-warn/10' : 'border-success/40 bg-success/10',
          )}
        >
          <Icon name={fellForLure ? 'Sparkles' : 'CircleCheck'} size={16} className={cn('mt-0.5 shrink-0', fellForLure ? 'text-warn' : 'text-success')} />
          <p className="text-ink">
            {fellForLure ? (
              <>
                You "remembered" <span className="font-semibold text-warn">{LURE}</span> — but it was{' '}
                <span className="font-semibold">never shown</span>. Every studied word pointed at it, so your mind manufactured the
                memory. Most people do exactly this.
              </>
            ) : (
              <>
                You resisted the lure <span className="font-semibold">{LURE}</span> this time — impressive. But it was the gist of the
                whole list, and most people confidently recall seeing it. The pull is real.
              </>
            )}
          </p>
        </div>
      )}

      <div className="mt-3 flex items-center justify-end gap-2">
        {phase === 'test' && (
          <button type="button" onClick={() => setPhase('result')} className="rounded-full border border-accent bg-accent/15 px-4 py-1.5 text-sm text-accent">
            See results
          </button>
        )}
        {(phase === 'idle' || phase === 'result') && (
          <button type="button" onClick={start} className="rounded-full border border-accent bg-accent/15 px-4 py-1.5 text-sm text-accent">
            {phase === 'idle' ? 'Start' : 'Try again'}
          </button>
        )}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted">
        Memory does not record — it <span className="font-medium text-ink">reconstructs</span>. Because every studied word was an
        associate of <span className="text-ink">{LURE}</span>, your brain stored the theme and later rebuilt the lure as if it had been
        seen. The same gap is how leading questions and suggestions plant <span className="text-ink">false memories</span> in real life.
      </p>
    </div>
  )
}

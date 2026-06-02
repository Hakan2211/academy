import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Wason's 2-4-6 task — the cleanest demonstration of confirmation bias ever
// devised. You're told 2,4,6 obeys a hidden rule. You propose triples and learn
// only "fits" or "doesn't fit". Almost everyone guesses the rule is "even
// numbers going up by 2" and then only tests triples that ALREADY fit that
// guess (8,10,12; 20,22,24) — all of which say "fits", falsely confirming it.
// The real rule is simply "any three increasing numbers". The only way to find
// it is to try to BREAK your own hypothesis (e.g. 1,2,3 or 5,4,3). The widget
// tracks how many of your tests were confirming vs disconfirming and reveals
// the rule on demand.
// Used in reasoning.

type Trial = { triple: [number, number, number]; fits: boolean }

// The hidden rule: strictly increasing.
function obeys(a: number, b: number, c: number): boolean {
  return a < b && b < c
}

// A test "tries to break" the popular +2 hypothesis if it ISN'T an even +2 run.
function isDisconfirming(a: number, b: number, c: number): boolean {
  const plus2Even = b - a === 2 && c - b === 2
  return !plus2Even
}

export function ConfirmationBias() {
  const [vals, setVals] = useState<[string, string, string]>(['', '', ''])
  const [trials, setTrials] = useState<Array<Trial>>([])
  const [revealed, setRevealed] = useState(false)
  const [error, setError] = useState('')

  function submit() {
    const nums = vals.map((v) => Number(v))
    if (vals.some((v) => v.trim() === '') || nums.some((n) => !Number.isFinite(n))) {
      setError('Enter three numbers.')
      return
    }
    setError('')
    const [a, b, c] = nums as [number, number, number]
    setTrials((t) => [{ triple: [a, b, c], fits: obeys(a, b, c) }, ...t])
  }

  const tested = trials.length
  const disconfirming = trials.filter((t) => isDisconfirming(...t.triple)).length

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="text-sm leading-relaxed text-muted">
        The sequence <span className="font-mono font-bold text-accent">2, 4, 6</span> obeys a rule I'm thinking
        of. Propose your own triples to discover it — I'll only tell you whether each one{' '}
        <span className="text-ink">fits</span> or not.
      </p>

      <div className="mt-3 flex items-end gap-2">
        {[0, 1, 2].map((i) => (
          <input
            key={i}
            type="number"
            inputMode="numeric"
            value={vals[i]}
            placeholder={['?', '?', '?'][i]}
            onChange={(e) =>
              setVals((v) => {
                const next = [...v] as [string, string, string]
                next[i] = e.target.value
                return next
              })
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit()
            }}
            className="w-16 rounded-lg border border-border bg-surface-2 px-2 py-1.5 text-center font-mono text-ink focus:border-accent focus:outline-none"
          />
        ))}
        <button
          type="button"
          onClick={submit}
          className="rounded-full border border-accent bg-accent/15 px-4 py-1.5 text-sm font-semibold text-accent"
        >
          Test it
        </button>
      </div>
      {error && <p className="mt-1 text-xs" style={{ color: '#E67E22' }}>{error}</p>}

      {trials.length > 0 && (
        <div className="mt-3 max-h-40 space-y-1.5 overflow-y-auto">
          {trials.map((t, i) => (
            <div
              key={i}
              className={cn(
                'flex items-center justify-between rounded-lg border px-3 py-1.5 text-sm',
                t.fits ? 'border-success/40 bg-success/10' : 'border-border bg-surface-2',
              )}
            >
              <span className="font-mono text-ink">{t.triple.join(', ')}</span>
              <span className={cn('flex items-center gap-1 text-xs font-semibold', t.fits ? 'text-success' : 'text-muted')}>
                {t.fits ? <Icon name="Check" size={14} /> : <Icon name="X" size={14} />}
                {t.fits ? 'fits' : "doesn't fit"}
              </span>
            </div>
          ))}
        </div>
      )}

      {tested > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2 text-center">
          <div className="rounded-xl bg-surface-2 p-2">
            <p className="text-xs text-muted">Triples tested</p>
            <p className="font-mono text-lg font-bold text-ink">{tested}</p>
          </div>
          <div className="rounded-xl bg-surface-2 p-2">
            <p className="text-xs text-muted">That broke the "+2" pattern</p>
            <p className={cn('font-mono text-lg font-bold', disconfirming === 0 ? 'text-accent-2' : 'text-success')}>
              {disconfirming}
            </p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setRevealed((r) => !r)}
        className="mt-3 flex items-center gap-1 text-sm text-accent hover:underline"
      >
        <Icon name={revealed ? 'EyeOff' : 'Eye'} size={14} />
        {revealed ? 'Hide the rule' : 'Reveal the rule'}
      </button>

      {revealed && (
        <div className="mt-2 rounded-xl bg-surface-2 p-3 text-sm leading-snug text-muted">
          The rule is simply <span className="font-semibold text-ink">"any three numbers in increasing order"</span> —
          so <span className="font-mono">1, 2, 3</span> and <span className="font-mono">5, 99, 100</span> both fit.
          {disconfirming === 0 && tested > 0 && (
            <> Every triple you tried already matched the obvious "+2" guess, so each "fits" only{' '}
              <span className="text-accent">confirmed</span> it. </>
          )}
          {' '}Most people lock onto "even numbers, +2" and only test cases that <span className="text-ink">confirm</span>{' '}
          it. The single most useful move — trying a triple you expect to <span style={{ color: '#E67E22' }}>fail</span>{' '}
          (like <span className="font-mono">3, 2, 1</span>) — is the one we instinctively avoid. That's{' '}
          <span className="text-accent">confirmation bias</span>: we seek evidence for our hunch instead of evidence
          against it.
        </div>
      )}
    </div>
  )
}

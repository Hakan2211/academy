import { useState } from 'react'
import { cn } from '#/lib/cn'

// Popper's falsifiability criterion as a sorting game. The user judges each claim
// as FALSIFIABLE (there's a possible observation that could refute it) or
// UNFALSIFIABLE (nothing could ever count against it). Reveals explanation.

type Claim = {
  id: string
  text: string
  answer: 'falsifiable' | 'unfalsifiable'
  explanation: string
}

const CLAIMS: Array<Claim> = [
  {
    id: 'swans',
    text: '"All swans are white."',
    answer: 'falsifiable',
    explanation:
      'Famously falsifiable — and famously falsified. A single black swan (found in Australia in 1697) refutes the claim. Because there is a possible observation that would disprove it, it passes Popper\'s test.',
  },
  {
    id: 'medicine',
    text: '"This medicine cures everything — but only if you truly believe in it."',
    answer: 'unfalsifiable',
    explanation:
      'Any failure can be explained away: the patient did not truly believe. The claim can absorb any negative result without being threatened. That is Popper\'s warning sign: a theory that explains everything actually predicts nothing.',
  },
  {
    id: 'universe',
    text: '"The universe is expanding — distant galaxies are moving away from us."',
    answer: 'falsifiable',
    explanation:
      'This is a precise, testable prediction. Hubble confirmed it in 1929 by measuring galactic redshift. If measurements had shown galaxies stable or contracting, the claim would have been refuted.',
  },
  {
    id: 'reason',
    text: '"Everything happens for a reason."',
    answer: 'unfalsifiable',
    explanation:
      'What event would count as evidence that this is false? Any outcome — however tragic or random it appears — can be incorporated ("we just don\'t know the reason yet"). A claim that nothing could ever count against is not scientific in Popper\'s sense.',
  },
  {
    id: 'gravity',
    text: '"Heavier objects fall faster than lighter ones."',
    answer: 'falsifiable',
    explanation:
      'Galileo\'s famous experiment at the Tower of Pisa (or its equivalent) refuted Aristotle\'s claim. Dropping two balls of different masses and timing them is exactly the kind of observation Popper has in mind.',
  },
  {
    id: 'guardian',
    text: '"An invisible, undetectable guardian angel protects you — but only in ways indistinguishable from chance."',
    answer: 'unfalsifiable',
    explanation:
      'The built-in escape clause ("indistinguishable from chance") means no observation can distinguish this from a world with no guardian at all. The claim is empirically idle — which doesn\'t make it false, but does make it non-scientific.',
  },
]

type Verdict = 'falsifiable' | 'unfalsifiable'

export function Falsifiability() {
  const [answers, setAnswers] = useState<Record<string, Verdict>>({})
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  function judge(id: string, verdict: Verdict) {
    setAnswers((prev) => ({ ...prev, [id]: verdict }))
    setRevealed((prev) => ({ ...prev, [id]: true }))
  }

  const total = CLAIMS.length
  const correct = CLAIMS.filter((c) => answers[c.id] === c.answer).length
  const done = Object.keys(revealed).length

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-1 text-sm font-semibold text-ink">
        Popper&rsquo;s Sorting Test
      </p>
      <p className="mb-4 text-sm text-muted">
        For each claim, decide: is there a possible observation that could refute it? If yes, it is
        <span className="font-semibold text-accent"> falsifiable</span> (scientific). If nothing could ever count
        against it, it is <span className="font-semibold text-accent-2"> unfalsifiable</span> (not scientific in
        Popper&rsquo;s sense).
      </p>

      <div className="space-y-3">
        {CLAIMS.map((claim) => {
          const chosen = answers[claim.id]
          const isRevealed = revealed[claim.id]
          const isCorrect = chosen === claim.answer

          return (
            <div
              key={claim.id}
              className={cn(
                'rounded-xl border p-3 transition-colors',
                isRevealed && isCorrect
                  ? 'border-success bg-success/10'
                  : isRevealed && !isCorrect
                    ? 'border-warn bg-warn/10'
                    : 'border-border bg-surface-2',
              )}
            >
              <p className="mb-2 text-sm text-ink">{claim.text}</p>

              {!isRevealed ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => judge(claim.id, 'falsifiable')}
                    className="rounded-lg border border-accent px-3 py-1 text-xs text-accent transition-colors hover:bg-accent/15"
                  >
                    Falsifiable
                  </button>
                  <button
                    type="button"
                    onClick={() => judge(claim.id, 'unfalsifiable')}
                    className="rounded-lg border border-accent-2 px-3 py-1 text-xs text-accent-2 transition-colors hover:bg-accent/15"
                  >
                    Unfalsifiable
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 font-semibold',
                        claim.answer === 'falsifiable'
                          ? 'bg-accent/15 text-accent'
                          : 'bg-accent-2/15 text-accent-2',
                      )}
                    >
                      {claim.answer === 'falsifiable' ? 'Falsifiable' : 'Unfalsifiable'}
                    </span>
                    <span className={cn('font-semibold', isCorrect ? 'text-success' : 'text-warn')}>
                      {isCorrect ? 'Correct' : 'Not quite'}
                    </span>
                  </div>
                  <p className="text-xs text-muted">{claim.explanation}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {done > 0 && (
        <div className="mt-4 rounded-xl border border-border bg-surface-2 px-3 py-2 text-center text-sm text-muted">
          {done < total
            ? `${done} of ${total} judged — keep going`
            : correct === total
              ? `Perfect — ${correct}/${total}. Popper's key insight: a claim that nothing could ever count against isn't science, it's metaphysics.`
              : `${correct}/${total} correct. The tricky part is the built-in escape clause — when a claim can absorb any result, it predicts nothing.`}
        </div>
      )}
    </div>
  )
}

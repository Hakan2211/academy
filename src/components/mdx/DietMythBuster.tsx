import { useState } from 'react'
import { cn } from '#/lib/cn'

type Claim = {
  id: string
  claim: string
  verdict: 'myth' | 'nuanced'
  verdictLabel: string
  explanation: string
}

const CLAIMS: Array<Claim> = [
  {
    id: 'carbs',
    claim: 'Carbs make you fat.',
    verdict: 'myth',
    verdictLabel: 'Myth',
    explanation:
      'No single macronutrient causes fat gain. Excess calories — from any source — lead to weight gain. Whole-grain carbohydrates are linked to lower obesity rates, not higher ones. Very-low-carb diets can work for some people, but it\'s the calorie deficit that drives weight loss, not carb removal itself.',
  },
  {
    id: 'detox',
    claim: 'Detox teas cleanse your body.',
    verdict: 'myth',
    verdictLabel: 'Myth',
    explanation:
      'The body has a dedicated detoxification system: the liver and kidneys work continuously to filter and excrete waste products. No tea, juice cleanse, or supplement accelerates this process in a healthy person. Many "detox" products contain laxatives or diuretics — they cause water loss, not toxin removal.',
  },
  {
    id: 'late-eating',
    claim: 'Eating after 8 pm causes weight gain.',
    verdict: 'nuanced',
    verdictLabel: 'Mostly myth',
    explanation:
      'Calories don\'t know what time it is. What matters for weight is total daily energy intake, not the clock. The real pattern: late-night eating often means extra calories on top of a full day\'s food, and tends to be high-calorie snacks. If your total intake stays the same, the timing does not cause fat gain.',
  },
  {
    id: 'breakfast',
    claim: 'You must eat breakfast to lose weight.',
    verdict: 'nuanced',
    verdictLabel: 'Mostly myth',
    explanation:
      'Randomised trials show breakfast has no universal weight-loss benefit. Some people do better eating early; others aren\'t hungry until mid-morning. Skipping breakfast doesn\'t slow metabolism. What works is a pattern you can sustain — whether that includes breakfast or not.',
  },
  {
    id: 'superfoods',
    claim: '"Superfoods" burn fat.',
    verdict: 'myth',
    verdictLabel: 'Myth',
    explanation:
      'The word "superfood" is a marketing term with no scientific definition. Blueberries, acai, and green tea contain useful micronutrients, but no food meaningfully increases metabolic rate or "burns" stored fat on its own. Diet quality comes from overall patterns — not any single food, however colourful.',
  },
]

type GuessState = 'myth' | 'fact' | null

export function DietMythBuster() {
  const [guesses, setGuesses] = useState<Record<string, GuessState>>({})
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  const handleGuess = (id: string, guess: GuessState) => {
    if (revealed[id]) return
    setGuesses((prev) => ({ ...prev, [id]: guess }))
    setRevealed((prev) => ({ ...prev, [id]: true }))
  }

  const isCorrectGuess = (claim: Claim, guess: GuessState) => {
    if (claim.verdict === 'myth') return guess === 'myth'
    if (claim.verdict === 'nuanced') return guess === 'myth' // nuanced = effectively myth
    return guess === 'fact'
  }

  const doneCount = Object.keys(revealed).length

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-muted">
          For each claim, guess <span className="font-semibold text-warn">Myth</span> or{' '}
          <span className="font-semibold text-success">Fact</span>, then see the evidence.
        </p>
        <span className="text-xs text-muted">{doneCount}/{CLAIMS.length} done</span>
      </div>

      <div className="space-y-3">
        {CLAIMS.map((c) => {
          const isRevealed = revealed[c.id] ?? false
          const guess = guesses[c.id] ?? null
          const correct = guess !== null ? isCorrectGuess(c, guess) : null

          return (
            <div
              key={c.id}
              className={cn(
                'rounded-xl border transition-colors',
                isRevealed
                  ? correct
                    ? 'border-success/50 bg-success/5'
                    : 'border-warn/50 bg-warn/5'
                  : 'border-border bg-surface-2',
              )}
            >
              {/* Claim row */}
              <div className="flex items-start gap-3 p-3">
                <p className="flex-1 text-sm font-medium text-ink">"{c.claim}"</p>
                {!isRevealed && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleGuess(c.id, 'myth')}
                      className="rounded-lg border border-warn/60 bg-warn/10 px-3 py-1 text-xs font-semibold text-warn hover:bg-warn/20 transition-colors"
                    >
                      Myth
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGuess(c.id, 'fact')}
                      className="rounded-lg border border-success/60 bg-success/10 px-3 py-1 text-xs font-semibold text-success hover:bg-success/20 transition-colors"
                    >
                      Fact
                    </button>
                  </div>
                )}
                {isRevealed && (
                  <span
                    className={cn(
                      'shrink-0 rounded-full border px-2 py-0.5 text-xs font-semibold',
                      correct
                        ? 'border-success/60 bg-success/10 text-success'
                        : 'border-warn/60 bg-warn/10 text-warn',
                    )}
                  >
                    {correct ? '✓ Correct' : '✗ Wrong'}
                  </span>
                )}
              </div>

              {/* Verdict + explanation */}
              {isRevealed && (
                <div className="border-t border-border/50 px-3 pb-3 pt-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wide text-warn">
                      Verdict: {c.verdictLabel}
                    </span>
                  </div>
                  <p className="text-sm text-ink leading-relaxed">{c.explanation}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {doneCount === CLAIMS.length && (
        <div className="mt-4 rounded-xl border border-accent/50 bg-accent/10 p-3 text-center text-sm text-accent font-medium">
          All done! The pattern: good nutrition science is about overall dietary patterns, not
          individual foods or meal timing tricks.
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { cn } from '#/lib/cn'

// General health myth-busting cards. User guesses Myth or Fact,
// then sees the verdict and the reasoning lesson.
// Owner: healthy-living (W15).

type Claim = {
  id: string
  claim: string
  verdict: 'myth' | 'fact' | 'nuanced'
  verdictLabel: string
  lesson: string
  reasoningType: string
}

const CLAIMS: Array<Claim> = [
  {
    id: 'water',
    claim: 'You must drink 8 glasses of water a day.',
    verdict: 'myth',
    verdictLabel: 'Myth',
    lesson:
      'The "8 glasses" rule has no firm scientific basis. Hydration needs vary widely by body size, temperature, activity, and diet (fruit and vegetables contain a lot of water). Your kidneys regulate water balance — thirst and urine colour are reliable guides for most healthy people.',
    reasoningType: 'Anecdote → rule',
  },
  {
    id: 'sugar-kids',
    claim: 'Sugar makes children hyperactive.',
    verdict: 'myth',
    verdictLabel: 'Myth',
    lesson:
      "Over a dozen controlled double-blind studies, including a 1995 JAMA meta-analysis, found no effect of sugar on children's behaviour or attention. The perceived effect is real — but it's caused by parental expectation (those told their child had sugar rated them as more hyperactive even when they hadn't). Classic confirmation bias.",
    reasoningType: 'Correlation ≠ causation',
  },
  {
    id: 'knuckles',
    claim: 'Cracking your knuckles causes arthritis.',
    verdict: 'myth',
    verdictLabel: 'Myth',
    lesson:
      'The crack is a gas bubble (mostly CO₂) releasing from the joint fluid — not bone grinding on bone. A physician famously cracked only his left knuckles for 60 years and found no difference in arthritis between hands. Multiple studies confirm: knuckle-cracking does not cause arthritis (though it may cause mild temporary swelling).',
    reasoningType: 'Anecdote as evidence',
  },
  {
    id: 'brain',
    claim: 'We only use 10% of our brains.',
    verdict: 'myth',
    verdictLabel: 'Myth',
    lesson:
      'Brain-imaging studies (fMRI, PET scans) show activity across virtually all brain regions during everyday tasks. Even during sleep, many areas remain active. The myth likely grew from misquoted neuroscience and has been enthusiastically amplified by self-help marketing. Damaging 90% of the brain causes severe disability.',
    reasoningType: 'Marketing amplification',
  },
  {
    id: 'natural',
    claim: '"Natural" products are always safer than synthetic ones.',
    verdict: 'myth',
    verdictLabel: 'Myth',
    lesson:
      'Arsenic, cyanide, and botulinum toxin are entirely natural. Aspirin was synthesised in 1897 but derived from willow bark. Safety depends on the molecule, the dose, and the route of exposure — not whether it was made in a lab or a plant. "Natural" is a marketing label, not a safety certification.',
    reasoningType: 'Marketing red flag',
  },
  {
    id: 'head-heat',
    claim: 'You lose most body heat through your head.',
    verdict: 'myth',
    verdictLabel: 'Myth',
    lesson:
      "The head represents roughly 10% of the body's surface area and loses heat proportional to that area — the same as any uncovered part. The myth may stem from a 1950s US military study in which subjects were given cold-weather suits but no hats. Of course the bare head lost heat — it was the only thing uncovered.",
    reasoningType: 'Flawed study design',
  },
]

export function HealthMyths() {
  const [guesses, setGuesses] = useState<Record<string, 'myth' | 'fact'>>({})
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  function guess(id: string, g: 'myth' | 'fact') {
    if (revealed[id]) return
    setGuesses((p) => ({ ...p, [id]: g }))
    setRevealed((p) => ({ ...p, [id]: true }))
  }

  function isCorrect(c: Claim, g: 'myth' | 'fact' | undefined) {
    if (g === undefined) return null
    return (c.verdict === 'fact') === (g === 'fact')
  }

  const doneCount = Object.keys(revealed).length

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-sm text-muted">
          Guess <span className="font-semibold text-warn">Myth</span> or{' '}
          <span className="font-semibold text-success">Fact</span> for each claim, then see the evidence.
        </p>
        <span className="shrink-0 text-xs text-muted">{doneCount}/{CLAIMS.length} done</span>
      </div>

      <div className="space-y-3">
        {CLAIMS.map((c) => {
          const isRevealed = revealed[c.id] ?? false
          const g = guesses[c.id]
          const correct = isCorrect(c, g)

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
              <div className="flex flex-wrap items-start gap-3 p-3">
                <p className="flex-1 text-sm font-medium text-ink">"{c.claim}"</p>
                {!isRevealed && (
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => guess(c.id, 'myth')}
                      className="rounded-lg border border-warn/60 bg-warn/10 px-3 py-1 text-xs font-semibold text-warn transition-colors hover:bg-warn/20"
                    >
                      Myth
                    </button>
                    <button
                      type="button"
                      onClick={() => guess(c.id, 'fact')}
                      className="rounded-lg border border-success/60 bg-success/10 px-3 py-1 text-xs font-semibold text-success transition-colors hover:bg-success/20"
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

              {isRevealed && (
                <div className="space-y-1 border-t border-border/50 px-3 pb-3 pt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wide text-warn">
                      Verdict: {c.verdictLabel}
                    </span>
                    <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] text-muted border border-border">
                      Reasoning trap: {c.reasoningType}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-ink">{c.lesson}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {doneCount === CLAIMS.length && (
        <div className="mt-4 rounded-xl border border-accent/50 bg-accent/10 p-3 text-center text-sm font-medium text-accent">
          Pattern spotted: the same reasoning traps recur — anecdote as rule, correlation treated as
          causation, and marketing language dressed as science. Recognising the trap is the skill.
        </div>
      )}
    </div>
  )
}

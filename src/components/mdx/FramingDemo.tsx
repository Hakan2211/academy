import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Tversky & Kahneman's "Asian disease" framing problem. A disease threatens 600
// people. The user chooses between a SURE option and a GAMBLE — first described
// in lives SAVED (a gain frame), then the *identical* outcomes described in
// lives LOST (a loss frame). The two programs are mathematically the same. Yet
// in the gain frame people flock to the sure thing; in the loss frame they
// flip to the gamble to avoid a certain loss. The widget records the user's two
// choices and tells them whether they flipped — most people do.
// Used in thinking-traps.

type Frame = 'gain' | 'loss'

const OUTCOMES: Record<Frame, { sure: string; gamble: string; pct: number }> = {
  // pct = % of people who pick the SURE option in this frame (the classic result)
  gain: {
    sure: '200 people will be saved.',
    gamble: '1/3 chance that all 600 are saved, 2/3 chance that no one is saved.',
    pct: 72,
  },
  loss: {
    sure: '400 people will die.',
    gamble: '1/3 chance that nobody dies, 2/3 chance that all 600 die.',
    pct: 22,
  },
}

export function FramingDemo() {
  const [frame, setFrame] = useState<Frame>('gain')
  const [choice, setChoice] = useState<Record<Frame, 'sure' | 'gamble' | null>>({ gain: null, loss: null })

  const o = OUTCOMES[frame]
  const both = choice.gain && choice.loss
  const flipped = both && choice.gain !== choice.loss

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {(['gain', 'loss'] as Array<Frame>).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFrame(f)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              frame === f ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
              choice[f] && frame !== f && 'border-accent/40',
            )}
          >
            {f === 'gain' ? 'Frame A: lives saved' : 'Frame B: lives lost'}
            {choice[f] && <span className="ml-1 text-success">✓</span>}
          </button>
        ))}
      </div>

      <p className="text-sm leading-relaxed text-muted">
        An outbreak is expected to kill <span className="text-ink">600 people</span>. Two response programs are
        proposed. Which do you choose?
      </p>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {(['sure', 'gamble'] as const).map((opt) => {
          const selected = choice[frame] === opt
          return (
            <button
              key={opt}
              type="button"
              onClick={() => setChoice((c) => ({ ...c, [frame]: opt }))}
              className={cn(
                'rounded-xl border p-3 text-left text-sm transition-colors',
                selected ? 'border-accent bg-accent/15 text-ink' : 'border-border text-muted hover:text-ink',
              )}
            >
              <span className="flex items-center gap-1.5 font-semibold">
                <Icon name={opt === 'sure' ? 'ShieldCheck' : 'Dices'} size={15} />
                {opt === 'sure' ? 'Program A (sure thing)' : 'Program B (the gamble)'}
              </span>
              <span className="mt-1 block leading-snug">{opt === 'sure' ? o.sure : o.gamble}</span>
            </button>
          )
        })}
      </div>

      {choice[frame] && (
        <p className="mt-3 text-center text-xs text-muted">
          In this frame, about <span className="font-semibold text-ink">{o.pct}%</span> of people choose the sure
          thing. {!both && <span className="text-accent">Now switch to the other frame and choose again.</span>}
        </p>
      )}

      {both && (
        <div className="mt-3 rounded-xl bg-surface-2 p-3 text-sm leading-snug text-muted">
          <p className="mb-1 font-semibold text-ink">
            {flipped ? 'You flipped — like most people.' : "You stayed consistent — rarer than you'd think."}
          </p>
          The two frames describe <span className="text-ink">identical outcomes</span>: "200 saved" out of 600 is
          the very same world as "400 die". Yet the wording changes everything. Faced with a{' '}
          <span className="text-accent">gain</span> ("saved") we turn cautious and grab the sure thing; faced with
          a <span style={{ color: '#E67E22' }}>loss</span> ("die") we gamble to avoid it. That's{' '}
          <span className="text-ink">framing</span>, powered by loss aversion — losses loom larger than the
          equivalent gains.
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { cn } from '#/lib/cn'
import { Icon } from '#/components/ui/Icon'
import { isSound } from '#/lib/philo'

// Show how VALIDITY (good form) and SOUNDNESS (valid + true premises) are
// independent axes. Four example arguments cover all four cells of the 2×2.

type Example = {
  key: string
  label: string
  premises: Array<string>
  conclusion: string
  valid: boolean
  premisesTrue: boolean
  note: string
}

const EXAMPLES: Array<Example> = [
  {
    key: 'sound',
    label: 'Valid + True premises',
    premises: ['All dogs are mammals.', 'Rex is a dog.'],
    conclusion: 'Therefore, Rex is a mammal.',
    valid: true,
    premisesTrue: true,
    note: 'This is a sound argument: the form is logically valid AND both premises are actually true. The conclusion is guaranteed to be true.',
  },
  {
    key: 'valid-unsound',
    label: 'Valid + False premise',
    premises: ['All birds can fly.', 'Penguins are birds.'],
    conclusion: 'Therefore, penguins can fly.',
    valid: true,
    premisesTrue: false,
    note: 'Valid form (if those premises were true, the conclusion would follow) — but the first premise is false. So the argument is valid yet unsound, and the conclusion is false.',
  },
  {
    key: 'invalid-true',
    label: 'Invalid form (even with true premises)',
    premises: ['If it is raining, the ground is wet.', 'The ground is wet.'],
    conclusion: 'Therefore, it is raining.',
    valid: false,
    premisesTrue: true,
    note: 'Affirming the consequent — a formal fallacy. Both premises happen to be true, yet the conclusion doesn\'t follow (the ground could be wet from a sprinkler). Invalid form ruins the inference.',
  },
  {
    key: 'invalid-false',
    label: 'Invalid + False premise',
    premises: ['All cats are fish.', 'Salmon is a cat.'],
    conclusion: 'Therefore, salmon can meow.',
    valid: false,
    premisesTrue: false,
    note: 'Doubly broken: the premises are false AND the form is invalid (it\'s not even a recognised argument pattern). No part of this argument is doing real logical work.',
  },
]

export function ValiditySoundness() {
  const [selected, setSelected] = useState<string>('sound')

  const ex = EXAMPLES.find((e) => e.key === selected) ?? EXAMPLES[0]
  const sound = isSound(ex.valid, ex.premisesTrue)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* 2×2 selector grid */}
      <p className="mb-2 text-xs font-semibold text-muted">
        Click a cell — each quadrant of the 2×2:
      </p>
      <div className="mb-4 grid grid-cols-[auto_1fr_1fr] gap-1.5 text-xs">
        {/* header row */}
        <div />
        <div className="rounded-lg bg-surface-2 px-2 py-1 text-center font-semibold text-accent">
          True premises
        </div>
        <div className="rounded-lg bg-surface-2 px-2 py-1 text-center font-semibold text-warn">
          False premise
        </div>
        {/* valid row */}
        <div className="flex items-center justify-center rounded-lg bg-surface-2 px-2 py-1 font-semibold text-accent-2 writing-vertical">
          Valid
        </div>
        {[EXAMPLES[0], EXAMPLES[1]].map((e) => (
          <button
            key={e.key}
            type="button"
            onClick={() => setSelected(e.key)}
            className={cn(
              'rounded-xl border px-2 py-2 text-center text-xs transition-colors',
              selected === e.key
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            <div className="font-semibold">{isSound(e.valid, e.premisesTrue) ? '✓ SOUND' : 'valid'}</div>
            <div className="opacity-70">{e.label.split('+')[1]?.trim()}</div>
          </button>
        ))}
        {/* invalid row */}
        <div className="flex items-center justify-center rounded-lg bg-surface-2 px-2 py-1 font-semibold text-warn">
          Invalid
        </div>
        {[EXAMPLES[2], EXAMPLES[3]].map((e) => (
          <button
            key={e.key}
            type="button"
            onClick={() => setSelected(e.key)}
            className={cn(
              'rounded-xl border px-2 py-2 text-center text-xs transition-colors',
              selected === e.key
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            <div className="font-semibold text-warn">✗ invalid</div>
            <div className="opacity-70">{e.label.split('+')[1]?.trim() ?? e.label}</div>
          </button>
        ))}
      </div>

      {/* Detail pane */}
      <div className="rounded-xl border border-border bg-surface-2 p-3">
        {/* Premises */}
        <div className="mb-2 space-y-1.5">
          {ex.premises.map((p, i) => (
            <div
              key={i}
              className={cn(
                'flex items-start gap-2 rounded-lg border px-2.5 py-1.5 text-sm',
                ex.premisesTrue
                  ? 'border-success/40 bg-success/10 text-ink'
                  : 'border-warn/40 bg-warn/10 text-ink',
              )}
            >
              <span className="mt-0.5 text-xs font-semibold text-muted">P{i + 1}</span>
              <span>{p}</span>
              <span className={cn('ml-auto shrink-0 text-xs font-semibold', ex.premisesTrue ? 'text-success' : 'text-warn')}>
                {ex.premisesTrue ? 'TRUE' : 'FALSE'}
              </span>
            </div>
          ))}
        </div>

        {/* Inference indicator */}
        <div className="mb-2 flex items-center gap-2">
          <div className={cn('h-px flex-1', ex.valid ? 'bg-accent' : 'bg-warn')} />
          <span className={cn('text-xs font-semibold', ex.valid ? 'text-accent' : 'text-warn')}>
            {ex.valid ? 'VALID FORM ✓' : 'INVALID FORM ✗'}
          </span>
          <div className={cn('h-px flex-1', ex.valid ? 'bg-accent' : 'bg-warn')} />
        </div>

        {/* Conclusion */}
        <div
          className={cn(
            'rounded-lg border px-2.5 py-1.5 text-sm font-semibold',
            sound
              ? 'border-success bg-success/15 text-success'
              : 'border-warn/60 bg-warn/10 text-warn',
          )}
        >
          <span className="mr-1 opacity-70">∴</span>
          {ex.conclusion}
        </div>
      </div>

      {/* Sound indicator */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div
          className={cn(
            'rounded-xl border p-2',
            ex.valid ? 'border-accent/60 bg-accent/10 text-accent' : 'border-border text-muted',
          )}
        >
          <Icon name={ex.valid ? 'CheckCircle' : 'XCircle'} size={16} className="mx-auto mb-1" />
          <div className="font-semibold">Valid</div>
          <div className="opacity-70">{ex.valid ? 'good form' : 'bad form'}</div>
        </div>
        <div className="flex items-center justify-center text-lg font-bold text-muted">+</div>
        <div
          className={cn(
            'rounded-xl border p-2',
            ex.premisesTrue ? 'border-accent/60 bg-accent/10 text-accent' : 'border-border text-muted',
          )}
        >
          <Icon name={ex.premisesTrue ? 'CheckCircle' : 'XCircle'} size={16} className="mx-auto mb-1" />
          <div className="font-semibold">True premises</div>
          <div className="opacity-70">{ex.premisesTrue ? 'both true' : 'one+ false'}</div>
        </div>
      </div>

      <div
        className={cn(
          'mt-2 rounded-xl border p-2 text-center text-sm font-bold transition-colors',
          sound
            ? 'border-success bg-success/15 text-success'
            : 'border-border bg-surface-2 text-muted',
        )}
      >
        {sound ? '✓ SOUND ARGUMENT' : '✗ NOT SOUND'}
      </div>

      {/* Note */}
      <p className="mt-3 text-xs text-muted">{ex.note}</p>
    </div>
  )
}

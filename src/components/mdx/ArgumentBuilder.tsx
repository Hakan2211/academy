import { useState } from 'react'
import { cn } from '#/lib/cn'
import { Icon } from '#/components/ui/Icon'

// An argument = premises that support a conclusion. This explorer shows how
// premises stack up and funnel into a conclusion via an inferential leap.
// Toggle between preset arguments and hide a premise to see the gap that opens.

type Argument = {
  key: string
  label: string
  premises: Array<{ id: string; text: string }>
  conclusion: string
  hidden: Array<string> // which premise ids can be toggled hidden
  note: string
}

const ARGUMENTS: Array<Argument> = [
  {
    key: 'socrates',
    label: 'Socrates is mortal',
    premises: [
      { id: 'p1', text: 'All human beings are mortal.' },
      { id: 'p2', text: 'Socrates is a human being.' },
    ],
    conclusion: 'Therefore, Socrates is mortal.',
    hidden: ['p1'],
    note: 'A classic syllogism. The conclusion follows with certainty once both premises are in place.',
  },
  {
    key: 'umbrella',
    label: 'Bring the umbrella',
    premises: [
      { id: 'p1', text: 'The forecast says 90% chance of rain today.' },
      { id: 'p2', text: 'If rain is very likely, I should carry an umbrella.' },
    ],
    conclusion: 'Therefore, I should carry an umbrella today.',
    hidden: ['p2'],
    note: 'An everyday practical argument. Premises give strong (but not 100%) support — a good inductive case.',
  },
  {
    key: 'democracy',
    label: 'Democracy needs an informed public',
    premises: [
      { id: 'p1', text: 'In a democracy, voters decide who governs.' },
      { id: 'p2', text: 'Good decisions require accurate information.' },
      { id: 'p3', text: 'Voters who lack accurate information cannot decide well.' },
    ],
    conclusion: 'Therefore, democracy requires an informed public.',
    hidden: ['p2'],
    note: 'A three-premise argument. Remove the middle premise and the chain breaks — the conclusion no longer follows.',
  },
]

export function ArgumentBuilder() {
  const [argKey, setArgKey] = useState<string>('socrates')
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set())

  const arg = ARGUMENTS.find((a) => a.key === argKey) ?? ARGUMENTS[0]

  function switchArg(key: string) {
    setArgKey(key)
    setHiddenIds(new Set())
  }

  function toggleHide(id: string) {
    setHiddenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const visiblePremises = arg.premises.filter((p) => !hiddenIds.has(p.id))
  const allVisible = hiddenIds.size === 0

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Argument picker */}
      <div className="mb-4 flex flex-wrap gap-2">
        {ARGUMENTS.map((a) => (
          <button
            key={a.key}
            type="button"
            onClick={() => switchArg(a.key)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              argKey === a.key
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* Premise cards */}
      <div className="space-y-2">
        {arg.premises.map((p, i) => {
          const isHidden = hiddenIds.has(p.id)
          const canToggle = arg.hidden.includes(p.id)
          return (
            <div key={p.id} className="flex items-start gap-2">
              <div
                className={cn(
                  'flex-1 rounded-xl border px-3 py-2.5 text-sm transition-colors',
                  isHidden
                    ? 'border-dashed border-warn bg-warn/10 text-warn line-through opacity-60'
                    : 'border-border bg-surface-2 text-ink',
                )}
              >
                <span className="mr-2 text-xs font-semibold text-muted">P{i + 1}</span>
                {p.text}
              </div>
              {canToggle && (
                <button
                  type="button"
                  onClick={() => toggleHide(p.id)}
                  title={isHidden ? 'Restore premise' : 'Hide premise'}
                  className={cn(
                    'mt-0.5 rounded-lg border p-1.5 text-xs transition-colors',
                    isHidden
                      ? 'border-accent bg-accent/15 text-accent'
                      : 'border-border text-muted hover:text-ink',
                  )}
                >
                  <Icon name={isHidden ? 'Eye' : 'EyeOff'} size={14} />
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Inference arrow */}
      <div className="my-3 flex flex-col items-center gap-1">
        <div
          className={cn(
            'text-xs font-semibold transition-colors',
            allVisible ? 'text-accent' : 'text-warn',
          )}
        >
          {allVisible ? '∴ follows from' : '? missing premise'}
        </div>
        <div className={cn('h-6 w-0.5 rounded-full', allVisible ? 'bg-accent' : 'bg-warn')} />
        <Icon
          name="ChevronDown"
          size={18}
          className={cn('transition-colors', allVisible ? 'text-accent' : 'text-warn')}
        />
      </div>

      {/* Conclusion */}
      <div
        className={cn(
          'rounded-xl border px-3 py-3 text-sm font-semibold transition-colors',
          allVisible
            ? 'border-accent bg-accent/15 text-accent'
            : 'border-warn/60 bg-warn/10 text-warn',
        )}
      >
        <span className="mr-2 text-xs font-bold opacity-70">∴</span>
        {arg.conclusion}
        {!allVisible && (
          <span className="ml-2 text-xs font-normal opacity-80">
            — gap in the argument!
          </span>
        )}
      </div>

      {/* Visible premise count hint */}
      {!allVisible && (
        <div className="mt-2 flex items-center gap-1 text-xs text-warn">
          <Icon name="AlertTriangle" size={12} />
          <span>
            With {visiblePremises.length} of {arg.premises.length} premises visible, the conclusion no longer fully follows.
          </span>
        </div>
      )}

      {/* Note */}
      <p className="mt-3 rounded-xl border border-border bg-surface-2 px-3 py-2 text-xs text-muted">
        {arg.note}
      </p>
    </div>
  )
}

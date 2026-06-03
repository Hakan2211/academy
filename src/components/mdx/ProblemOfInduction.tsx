import { useState } from 'react'
import { cn } from '#/lib/cn'
import { Icon } from '#/components/ui/Icon'

// Hume's problem of induction: the sun has risen every day — does that
// guarantee it will rise tomorrow? Rack up observations and feel the
// pull of "surely it must" — then see the logical gap Hume identified.

const MILESTONES = [
  { days: 1, label: '1 day', note: 'One sunrise. A coincidence, perhaps.' },
  { days: 30, label: '30 days', note: 'A month of sunrises. A comforting pattern.' },
  { days: 365, label: '1 year', note: 'Every day for a year. You stop worrying about it.' },
  { days: 3650, label: '10 years', note: 'Ten thousand sunrises. You barely notice them.' },
  { days: 36500, label: '100 years', note: 'A full human lifetime. Every single morning.' },
  { days: 1825000, label: '5,000 years', note: 'Since the dawn of written history.' },
]

export function ProblemOfInduction() {
  const [milestoneIdx, setMilestoneIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const milestone = MILESTONES[milestoneIdx]!
  const days = milestone.days
  const pctConfidence = Math.min(99.9, 90 + milestoneIdx * 1.8)

  function advance() {
    if (milestoneIdx < MILESTONES.length - 1) {
      setMilestoneIdx((i) => i + 1)
      setRevealed(false)
    } else {
      setRevealed(true)
    }
  }
  function reset() {
    setMilestoneIdx(0)
    setRevealed(false)
  }

  const sunFill = Math.round((milestoneIdx / (MILESTONES.length - 1)) * 100)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-4 text-sm text-muted">
        The sun has risen every day of recorded history. Accumulate observations — then ask Hume's question.
      </p>

      {/* Sun visual */}
      <div className="mb-4 flex flex-col items-center">
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          aria-hidden="true"
          className="mb-2"
        >
          {/* Rays */}
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i * 45 * Math.PI) / 180
            const x1 = 50 + 30 * Math.cos(angle)
            const y1 = 50 + 30 * Math.sin(angle)
            const x2 = 50 + 42 * Math.cos(angle)
            const y2 = 50 + 42 * Math.sin(angle)
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#f59e0b"
                strokeWidth="3"
                strokeLinecap="round"
                opacity={0.3 + (sunFill / 100) * 0.7}
              />
            )
          })}
          {/* Sun body */}
          <circle cx="50" cy="50" r="22" fill="#fde68a" opacity="0.25" />
          <circle
            cx="50"
            cy="50"
            r="22"
            fill="#f59e0b"
            opacity={0.4 + (sunFill / 100) * 0.6}
          />
          <circle cx="50" cy="50" r="18" fill="#fbbf24" opacity={0.5 + (sunFill / 100) * 0.5} />
        </svg>
        <div className="text-2xl font-bold tabular-nums text-ink">
          {days.toLocaleString()}
        </div>
        <div className="text-sm text-muted">days observed</div>
      </div>

      {/* Milestone info */}
      <div className="mb-4 rounded-xl border border-border bg-surface-2 p-3 text-sm">
        <div className="mb-1 font-semibold text-ink">{milestone.label}</div>
        <p className="text-muted">{milestone.note}</p>
      </div>

      {/* Progress bar — "felt" confidence */}
      <div className="mb-4">
        <div className="mb-1 flex justify-between text-xs text-muted">
          <span>How confident do you feel?</span>
          <span className="font-semibold text-accent">{pctConfidence.toFixed(1)}%</span>
        </div>
        <div className="h-2 rounded-full bg-surface-2 border border-border overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${pctConfidence}%` }}
          />
        </div>
        <p className="mt-1 text-[11px] text-muted italic">
          (Your intuitive confidence — not a logical probability)
        </p>
      </div>

      {/* Milestone progress dots */}
      <div className="mb-4 flex gap-1.5">
        {MILESTONES.map((m, i) => (
          <button
            key={m.days}
            type="button"
            onClick={() => { setMilestoneIdx(i); setRevealed(false) }}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors',
              i === milestoneIdx
                ? 'bg-accent'
                : i < milestoneIdx
                  ? 'bg-success'
                  : 'bg-border',
            )}
            aria-label={m.label}
          />
        ))}
      </div>

      {/* Hume's reveal */}
      {revealed && (
        <div className="mb-4 rounded-xl border border-warn/50 bg-warn/10 p-3 text-sm">
          <div className="mb-1.5 flex items-center gap-2 font-semibold text-warn">
            <Icon name="AlertTriangle" size={14} />
            Hume's Punchline
          </div>
          <p className="text-ink">
            Not once. Not ever. No matter how many sunrises you accumulate,{' '}
            <span className="font-semibold">past observations cannot logically guarantee a future one.</span>
          </p>
          <p className="mt-2 text-muted">
            To say "the sun will rise tomorrow because it always has" assumes that the future will
            resemble the past. But that assumption is itself an inductive claim — you can't prove it
            without using induction. The argument is circular.
          </p>
          <p className="mt-2 text-muted">
            This is Hume's problem of induction: all our confident predictions about the future rest
            on a habit of the mind, not on pure logical necessity. The sun <em>has</em> risen — that it{' '}
            <em>must</em> rise is a feeling, not a proof.
          </p>
        </div>
      )}

      {!revealed && milestoneIdx === MILESTONES.length - 1 && (
        <div className="mb-4 rounded-xl border border-accent/40 bg-accent/10 p-3 text-sm">
          <p className="text-ink">
            5,000 years. Every morning in recorded history. You're{' '}
            <span className="font-semibold text-accent">practically certain</span> the sun will rise
            tomorrow — aren't you? Now let's see what Hume says about that certainty.
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={reset}
          disabled={milestoneIdx === 0 && !revealed}
          className={cn(
            'flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition-colors',
            milestoneIdx === 0 && !revealed
              ? 'cursor-not-allowed border-border text-muted opacity-40'
              : 'border-border text-muted hover:text-ink',
          )}
        >
          <Icon name="RotateCcw" size={14} />
          Reset
        </button>
        <button
          type="button"
          onClick={advance}
          disabled={revealed}
          className={cn(
            'flex flex-1 items-center justify-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors',
            revealed
              ? 'cursor-not-allowed border-border text-muted opacity-40'
              : 'border-accent bg-accent/15 text-accent hover:bg-accent/25',
          )}
        >
          {milestoneIdx < MILESTONES.length - 1 ? (
            <>
              Observe more days
              <Icon name="ChevronRight" size={14} />
            </>
          ) : (
            <>
              Ask Hume's question
              <Icon name="HelpCircle" size={14} />
            </>
          )}
        </button>
      </div>
    </div>
  )
}

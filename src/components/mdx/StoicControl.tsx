import { useState } from 'react'
import { cn } from '#/lib/cn'

// The Stoic dichotomy of control (Epictetus: Enchiridion, §1).
// "Some things are in our control and others not."
// User sorts situations into "Up to me" vs "Not up to me" and receives
// the Stoic verdict + teaching on each.

type Situation = {
  id: string
  label: string
  examples: string
  verdict: 'mine' | 'external'
  stoicNote: string
  thinker?: string
}

const SITUATIONS: Array<Situation> = [
  {
    id: 'judgments',
    label: 'Your judgments & opinions',
    examples: 'what you believe, how you interpret an event',
    verdict: 'mine',
    stoicNote:
      'This is the core of Stoic freedom. No external force can compel what you judge to be true or good — only your own assent can. Viktor Frankl, echoing Stoicism from a Nazi concentration camp, called this "the last of the human freedoms."',
    thinker: 'Epictetus',
  },
  {
    id: 'effort',
    label: 'Your own effort & attention',
    examples: 'how hard you try, how carefully you focus',
    verdict: 'mine',
    stoicNote:
      'The effort you give is entirely within your will. The outcome of that effort is not. Marcus Aurelius: "Confine yourself to the present." Pour your best effort into this moment — the results are not yours to control.',
    thinker: 'Marcus Aurelius',
  },
  {
    id: 'character',
    label: 'Your character & virtues',
    examples: 'honesty, courage, patience, how you treat others',
    verdict: 'mine',
    stoicNote:
      'For the Stoics, virtue is the only genuine good — and it is entirely up to you. A tyrant can take your money, your freedom, your life, but cannot take your commitment to act with integrity. This is why Epictetus (once a slave) felt free.',
    thinker: 'Epictetus',
  },
  {
    id: 'weather',
    label: 'The weather',
    examples: 'rain on your wedding day, a cancelled flight',
    verdict: 'external',
    stoicNote:
      'Completely outside your control. Stoics don\'t say "don\'t feel frustration" — they say: note the frustration, then ask whether the frustration is adding anything. The weather is indifferent to your preferences. Equanimity is the rational response.',
    thinker: 'Marcus Aurelius',
  },
  {
    id: 'others-opinion',
    label: "Others' opinions of you",
    examples: 'what people say behind your back, social media likes',
    verdict: 'external',
    stoicNote:
      'Epictetus is blunt: if you are upset by insults, you are assigning power over your peace of mind to other people\'s tongues. Their opinions live in their minds — not in yours. You control only your own judgments.',
    thinker: 'Epictetus',
  },
  {
    id: 'winning',
    label: 'Whether you win or succeed',
    examples: 'winning a competition, getting a promotion',
    verdict: 'external',
    stoicNote:
      'The outcome depends on judges, competitors, luck, circumstance — all external. The Stoic athlete trains and competes as well as possible and then releases attachment to the result. Indifference to outcomes is not laziness; it is clarity about what is genuinely yours.',
    thinker: 'Epictetus',
  },
  {
    id: 'traffic',
    label: 'Traffic & delays',
    examples: 'a train running late, a queue at the checkout',
    verdict: 'external',
    stoicNote:
      'Marcus Aurelius, emperor of Rome, wrote his private Stoic reflections partly to practise equanimity about things he couldn\'t change. Even an emperor cannot unblock traffic. The question is only: will you spend this time in anger, or in useful thought?',
    thinker: 'Marcus Aurelius',
  },
  {
    id: 'reactions',
    label: 'Your emotional reactions',
    examples: 'choosing how to respond after bad news',
    verdict: 'mine',
    stoicNote:
      'Stoics did not claim to be emotionless — they distinguished passions (automatic, unreasoned reactions) from rational feelings (eupatheiai). You cannot stop the first flash of anger, but you can choose not to act on it, and with practice you can train the flash itself.',
    thinker: 'Chrysippus',
  },
]

type SortState = Record<string, 'mine' | 'external' | null>

function initialSort(): SortState {
  return Object.fromEntries(SITUATIONS.map((s) => [s.id, null]))
}

export function StoicControl() {
  const [sorted, setSorted] = useState<SortState>(initialSort)
  const [revealed, setRevealed] = useState<string | null>(null)

  function place(id: string, col: 'mine' | 'external') {
    setSorted((prev) => ({ ...prev, [id]: col }))
    setRevealed(id)
  }

  function reset() {
    setSorted(initialSort)
    setRevealed(null)
  }

  const unsorted = SITUATIONS.filter((s) => sorted[s.id] === null)
  const mineSorted = SITUATIONS.filter((s) => sorted[s.id] === 'mine')
  const externalSorted = SITUATIONS.filter((s) => sorted[s.id] === 'external')
  const allDone = unsorted.length === 0
  const correct = SITUATIONS.filter((s) => sorted[s.id] === s.verdict).length
  const revealedSit = SITUATIONS.find((s) => s.id === revealed)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      {/* header */}
      <div className="border-b border-border bg-surface-2 px-4 py-3">
        <p className="text-sm font-semibold text-ink">The Stoic Dichotomy of Control</p>
        <p className="text-xs text-muted">
          Epictetus: "Some things are in our control and others not." Sort each situation.
        </p>
      </div>

      <div className="p-4">
        {/* unsorted queue */}
        {unsorted.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
              Decide: is this up to you?
            </p>
            {unsorted.slice(0, 1).map((s) => (
              <div key={s.id} className="rounded-xl border border-border bg-surface-2 p-3">
                <p className="mb-1 font-semibold text-ink text-sm">{s.label}</p>
                <p className="text-xs text-muted mb-3">{s.examples}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => place(s.id, 'mine')}
                    className="flex-1 rounded-xl border border-accent bg-accent/15 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/25"
                  >
                    Up to me
                  </button>
                  <button
                    type="button"
                    onClick={() => place(s.id, 'external')}
                    className="flex-1 rounded-xl border border-border py-2 text-sm font-semibold text-muted transition-colors hover:text-ink"
                  >
                    Not up to me
                  </button>
                </div>
              </div>
            ))}
            <p className="mt-2 text-xs text-muted text-center">
              {unsorted.length} remaining
            </p>
          </div>
        )}

        {/* sorted columns */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent">
              Up to me ({mineSorted.length})
            </p>
            <div className="flex flex-col gap-1.5">
              {mineSorted.map((s) => {
                const correct = s.verdict === 'mine'
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setRevealed(s.id)}
                    className={cn(
                      'rounded-lg border px-2 py-1.5 text-left text-xs transition-colors',
                      correct
                        ? 'border-success/50 bg-success/10 text-success'
                        : 'border-warn/50 bg-warn/10 text-warn',
                    )}
                  >
                    {s.label}
                    <span className="ml-1">{correct ? '✓' : '✗'}</span>
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
              Not up to me ({externalSorted.length})
            </p>
            <div className="flex flex-col gap-1.5">
              {externalSorted.map((s) => {
                const correct = s.verdict === 'external'
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setRevealed(s.id)}
                    className={cn(
                      'rounded-lg border px-2 py-1.5 text-left text-xs transition-colors',
                      correct
                        ? 'border-success/50 bg-success/10 text-success'
                        : 'border-warn/50 bg-warn/10 text-warn',
                    )}
                  >
                    {s.label}
                    <span className="ml-1">{correct ? '✓' : '✗'}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* stoic teaching panel for revealed item */}
        {revealedSit && (
          <div
            className={cn(
              'mb-4 rounded-xl border p-3 text-sm',
              sorted[revealedSit.id] === revealedSit.verdict
                ? 'border-success/40 bg-success/10'
                : 'border-warn/40 bg-warn/10',
            )}
          >
            <div className="mb-1 flex items-center gap-2">
              <span className="font-semibold text-ink">{revealedSit.label}</span>
              <span
                className={cn(
                  'rounded border px-1.5 py-0.5 text-xs',
                  revealedSit.verdict === 'mine'
                    ? 'border-accent/50 text-accent'
                    : 'border-muted/50 text-muted',
                )}
              >
                {revealedSit.verdict === 'mine' ? 'Up to me' : 'Not up to me'}
              </span>
              {revealedSit.thinker && (
                <span className="text-xs text-muted italic">{revealedSit.thinker}</span>
              )}
            </div>
            <p className="text-muted">{revealedSit.stoicNote}</p>
          </div>
        )}

        {/* completion */}
        {allDone && (
          <div className="mb-4 rounded-xl border border-accent/40 bg-accent/10 p-4 text-center">
            <p className="font-semibold text-accent text-sm">
              {correct} / {SITUATIONS.length} correct
            </p>
            <p className="mt-1 text-xs text-muted">
              {correct === SITUATIONS.length
                ? 'Perfect Stoic clarity. Focus all energy on the left column — your character, judgments, effort — and release the rest.'
                : 'Review the highlighted items. The Stoic insight is counterintuitive: even your emotional reactions are (with practice) more in your control than you think.'}
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-3 rounded-lg border border-border px-4 py-1.5 text-xs text-muted hover:text-ink"
            >
              Try again
            </button>
          </div>
        )}

        {/* Stoic teaching footer */}
        <div className="rounded-xl border border-border bg-surface-2 p-3 text-sm text-muted">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink">
            The Stoic teaching
          </p>
          <p>
            Epictetus opens the <em>Enchiridion</em> with this distinction. Freedom and peace follow
            from focusing all effort, desire, and concern on what is genuinely yours: your judgments,
            your effort, your character. Externals — outcomes, others' opinions, fortune — should be
            "preferred" or "dispreferred," but never gripped with such desire that their loss
            destroys you. This is not indifference; it is correct proportion.
          </p>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { cn } from '#/lib/cn'
import { expectedValue } from '#/lib/philo'

// Pascal's Wager as an interactive 2×2 decision matrix. The user can adjust
// the probability they assign to God's existence and see how Pascal's
// expected-value calculation plays out. Then the key criticisms are surfaced.

type Criticism = {
  id: string
  title: string
  body: string
}

const CRITICISMS: Array<Criticism> = [
  {
    id: 'choice',
    title: "You cannot choose belief at will",
    body:
      "Pascal acknowledges this, and suggests acting as if you believe — going to church, living piously — and genuine belief may follow (a kind of habituation). Critics (including William James) argue this makes the Wager a prescription for self-deception. Genuine epistemic virtue, on Clifford's view, demands you proportion belief to evidence, not to self-interest.",
  },
  {
    id: 'manygods',
    title: "The Many-Gods Objection",
    body:
      "Why assume the relevant choice is between the Christian God and atheism? There are indefinitely many possible gods — including jealous gods who punish people for wagering on the wrong one. If you bet on Pascal's God and the actual deity is one who rewards honest sceptics, you lose infinitely. The matrix should have far more columns, which collapses the argument.",
  },
  {
    id: 'sincere',
    title: "Is calculated belief sincere?",
    body:
      "Many religious traditions hold that God is omniscient — and therefore can tell whether belief is genuine or merely strategically adopted for the payoff. If that is so, the Wager may not even achieve its own aim: a deity who wants sincere devotion may not be impressed by a calculated bet.",
  },
  {
    id: 'infinite',
    title: "Problems with infinite payoffs",
    body:
      "Decision theory breaks down with infinite utilities. If infinite gain dominates any finite gain, then any action with even the smallest non-zero probability of infinite gain should be done — leading to paradoxes (Pascal's mugging, St. Petersburg paradox). Some philosophers argue that infinite payoffs simply cannot be handled by standard expected-value reasoning.",
  },
]

// Payoff values: large finite for "believe + no God" loss, symbolic ∞ for eternal outcomes.
// We use large numbers to make the math vivid while keeping it computable.
const PAYOFFS = {
  believeGodExists: 1_000_000, // eternal bliss — stands in for ∞
  believeNoGod: -10,           // "cost of religious practice"
  dontBelieveGodExists: -1_000_000, // eternal loss — stands in for −∞
  dontBelieveNoGod: 5,         // "freedom from religious constraint"
}

export function PascalsWager() {
  const [prob, setProb] = useState(0.01) // prior probability God exists
  const [openCrit, setOpenCrit] = useState<string | null>(null)
  const [showCriticisms, setShowCriticisms] = useState(false)

  const pGod = prob
  const pNo = 1 - prob

  const evBelieve = expectedValue(
    [PAYOFFS.believeGodExists, PAYOFFS.believeNoGod],
    [pGod, pNo],
  )
  const evDontBelieve = expectedValue(
    [PAYOFFS.dontBelieveGodExists, PAYOFFS.dontBelieveNoGod],
    [pGod, pNo],
  )

  const beliefDominates = evBelieve > evDontBelieve

  function fmt(n: number): string {
    if (n > 900_000) return '+∞ (eternal bliss)'
    if (n < -900_000) return '−∞ (eternal loss)'
    if (n > 0) return `+${n}`
    return String(n)
  }

  function fmtEV(n: number): string {
    if (Math.abs(n) > 900_000) return n > 0 ? '+∞' : '−∞'
    return n.toFixed(0)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-1 text-sm font-semibold text-ink">Pascal&rsquo;s Wager — Decision Matrix</p>
      <p className="mb-4 text-sm text-muted">
        Pascal argued: even if the probability of God&rsquo;s existence is tiny, the infinite stakes make believing
        the rational bet. Adjust the probability and see how the expected values change.
      </p>

      {/* Probability slider */}
      <div className="mb-4 rounded-xl border border-border bg-surface-2 px-3 py-2">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>Your estimate: P(God exists)</span>
          <span className="font-mono text-ink">{(prob * 100).toFixed(1)}%</span>
        </div>
        <input
          type="range"
          min={0.001}
          max={0.999}
          step={0.001}
          value={prob}
          onChange={(e) => setProb(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[var(--color-accent)]"
        />
        <div className="flex justify-between text-[10px] text-muted">
          <span>Near zero</span>
          <span>50/50</span>
          <span>Near certain</span>
        </div>
      </div>

      {/* 2×2 matrix */}
      <div className="mb-4 grid grid-cols-[auto_1fr_1fr] gap-1.5 text-sm">
        {/* Header row */}
        <div />
        <div className="rounded-lg border border-border px-2 py-1 text-center text-xs font-semibold text-accent-2">
          God exists ({(pGod * 100).toFixed(1)}%)
        </div>
        <div className="rounded-lg border border-border px-2 py-1 text-center text-xs font-semibold text-muted">
          God does not ({(pNo * 100).toFixed(0)}%)
        </div>

        {/* Believe row */}
        <div className="flex items-center justify-center rounded-lg border border-border px-2 text-center text-xs font-semibold text-accent">
          Believe
        </div>
        <div className="rounded-xl border border-success bg-success/10 p-2 text-center">
          <div className="text-xs font-bold text-success">{fmt(PAYOFFS.believeGodExists)}</div>
          <div className="text-[10px] text-muted">salvation — you wagered correctly</div>
        </div>
        <div className="rounded-xl border border-border bg-surface-2 p-2 text-center">
          <div className="text-xs text-ink">{fmt(PAYOFFS.believeNoGod)}</div>
          <div className="text-[10px] text-muted">small cost of devotion</div>
        </div>

        {/* Don't believe row */}
        <div className="flex items-center justify-center rounded-lg border border-border px-2 text-center text-xs font-semibold text-muted">
          Don&rsquo;t believe
        </div>
        <div className="rounded-xl border border-warn bg-warn/10 p-2 text-center">
          <div className="text-xs font-bold text-warn">{fmt(PAYOFFS.dontBelieveGodExists)}</div>
          <div className="text-[10px] text-muted">damnation — you wagered wrong</div>
        </div>
        <div className="rounded-xl border border-border bg-surface-2 p-2 text-center">
          <div className="text-xs text-ink">+{PAYOFFS.dontBelieveNoGod}</div>
          <div className="text-[10px] text-muted">small gain of freedom</div>
        </div>
      </div>

      {/* Expected value comparison */}
      <div className="mb-4 grid grid-cols-2 gap-2">
        {[
          { label: 'EV(Believe)', ev: evBelieve, highlight: beliefDominates },
          { label: 'EV(Don\'t Believe)', ev: evDontBelieve, highlight: !beliefDominates },
        ].map(({ label, ev, highlight }) => (
          <div
            key={label}
            className={cn(
              'rounded-xl border p-2 text-center',
              highlight ? 'border-accent bg-accent/15' : 'border-border bg-surface-2',
            )}
          >
            <div className="text-[10px] text-muted">{label}</div>
            <div className={cn('font-mono text-sm font-bold', highlight ? 'text-accent' : 'text-ink')}>
              {fmtEV(ev)}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-3 rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-muted">
        {beliefDominates
          ? "Pascal's conclusion: even a tiny probability of infinite gain makes 'Believe' the rational choice. The expected value dominates no matter how low you set the probability — as long as it's above zero."
          : "At this probability, believing still yields higher expected value due to the infinite stakes. Pascal argues this holds for any non-zero probability."}
      </div>

      {/* Criticisms */}
      <button
        type="button"
        onClick={() => setShowCriticisms((s) => !s)}
        className={cn(
          'mb-3 w-full rounded-lg border px-3 py-2 text-sm transition-colors',
          showCriticisms ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
        )}
      >
        {showCriticisms ? 'Hide criticisms' : 'See the criticisms'}
      </button>

      {showCriticisms && (
        <div className="space-y-2">
          <p className="text-xs text-muted">
            The Wager has attracted serious objections. Select each to read it.
          </p>
          {CRITICISMS.map((c) => (
            <div key={c.id} className="rounded-xl border border-border bg-surface-2">
              <button
                type="button"
                onClick={() => setOpenCrit(openCrit === c.id ? null : c.id)}
                className="flex w-full items-center justify-between px-3 py-2 text-left"
              >
                <span className="text-sm font-semibold text-ink">{c.title}</span>
                <span className="text-xs text-muted">{openCrit === c.id ? '▲' : '▼'}</span>
              </button>
              {openCrit === c.id && (
                <div className="border-t border-border px-3 pb-3 pt-2">
                  <p className="text-sm text-ink">{c.body}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

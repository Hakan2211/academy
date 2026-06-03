import { useState } from 'react'
import { cn } from '#/lib/cn'

// Play the Prisoner's Dilemma yourself. You and a partner have been arrested.
// Each independently chooses to COOPERATE (stay silent, protecting the other) or
// DEFECT (confess, betraying the other for a deal). The payoffs (months of
// freedom regained — higher is better) make defecting the dominant move: no
// matter what your partner does, you personally do better by defecting. So both
// rational players defect and land in the mutually worse corner — even though
// mutual cooperation would have been better for both. That gap between
// individually rational and collectively best is the dilemma.

type Move = 'cooperate' | 'defect'

// payoff[you][partner] = { you, partner } — higher is better
const PAYOFF: Record<Move, Record<Move, { you: number; partner: number }>> = {
  cooperate: {
    cooperate: { you: 8, partner: 8 }, // both silent — light sentence
    defect: { you: 0, partner: 10 }, // you stayed loyal, they sold you out
  },
  defect: {
    cooperate: { you: 10, partner: 0 }, // you took the deal, they took the fall
    defect: { you: 3, partner: 3 }, // both confessed — medium sentence
  },
}

export function PrisonersDilemma() {
  const [you, setYou] = useState<Move | null>(null)
  const [partner, setPartner] = useState<Move | null>(null)

  function play(move: Move) {
    // The partner reasons it out: defecting is their dominant strategy, so they
    // always defect. (Deterministic — no randomness in render.)
    setYou(move)
    setPartner('defect')
  }

  const result = you && partner ? PAYOFF[you][partner] : null
  const mutualCoop = you === 'cooperate' && partner === 'cooperate'
  const mutualDefect = you === 'defect' && partner === 'defect'

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-center text-sm text-muted">
        You and your partner are in separate cells. Will you <span className="text-accent">cooperate</span> (stay silent) or{' '}
        <span className="text-accent-2">defect</span> (confess)? Your partner decides too.
      </p>

      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={() => play('cooperate')}
          className={cn(
            'rounded-xl border px-4 py-2 text-sm font-semibold transition-colors',
            you === 'cooperate' ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
          )}
        >
          Cooperate
        </button>
        <button
          type="button"
          onClick={() => play('defect')}
          className={cn(
            'rounded-xl border px-4 py-2 text-sm font-semibold transition-colors',
            you === 'defect' ? 'border-accent-2 bg-accent-2/15 text-accent-2' : 'border-border text-muted hover:text-ink',
          )}
        >
          Defect
        </button>
      </div>

      {result && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-2 text-center text-sm">
            <div>
              <div className="font-mono text-accent">{result.you}</div>
              <div className="text-xs text-muted">your payoff</div>
            </div>
            <div>
              <div className="font-mono text-accent-2">{result.partner}</div>
              <div className="text-xs text-muted">partner's payoff</div>
            </div>
          </div>

          <div
            className={cn(
              'mt-3 rounded-xl border px-3 py-2 text-sm',
              mutualCoop ? 'border-success/50 text-success' : mutualDefect ? 'border-accent-2/50 text-accent-2' : 'border-accent/50 text-accent',
            )}
          >
            {you === 'cooperate' && (
              <>You stayed loyal — but your partner confessed and took the deal. You took the full fall (0) while they walked (10). Staying silent against a defector is the worst payoff of all.</>
            )}
            {mutualDefect && (
              <>You both confessed. You each get 3 — worse than the 8 you'd both have earned by staying silent, yet neither of you could risk being the lone cooperator. This is the equilibrium: where you land when both play their dominant strategy.</>
            )}
          </div>
        </>
      )}

      <div className="mt-4 rounded-xl border border-border bg-surface-2 px-3 py-2 text-xs text-muted">
        <p className="mb-1 font-semibold text-ink">Why defecting is the dominant strategy:</p>
        <ul className="list-disc space-y-0.5 pl-4">
          <li>If your partner cooperates: defecting earns you <span className="text-ink">10</span> vs <span className="text-ink">8</span> — defect.</li>
          <li>If your partner defects: defecting earns you <span className="text-ink">3</span> vs <span className="text-ink">0</span> — defect.</li>
          <li>Either way you do better defecting, so a rational partner reasons the same and defects too — locking in 3 each.</li>
        </ul>
      </div>

      {result && (
        <button
          type="button"
          onClick={() => { setYou(null); setPartner(null) }}
          className="mt-3 w-full rounded-lg border border-border py-1.5 text-xs text-muted transition-colors hover:text-ink"
        >
          Play again
        </button>
      )}
    </div>
  )
}

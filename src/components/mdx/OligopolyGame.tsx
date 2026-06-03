import { useState } from 'react'
import { cn } from '#/lib/cn'

// Why oligopolies struggle to keep prices high. Two firms each choose Price HIGH
// or Price LOW. If both keep prices high they split a fat market and BOTH do
// best (the collusive outcome). But whoever undercuts to LOW while the rival
// stays HIGH steals the market and earns even more — so each is tempted to
// cheat. If both give in and price LOW, they end up in a price war with thin
// profits. Pricing LOW is a dominant strategy, so the stable Nash outcome is
// the mutually worse low–low corner. This interdependence is the bridge to game
// theory.
type Choice = 'high' | 'low'

// payoffs[us][them] = { us, them } profits in $ millions
const PAYOFF: Record<Choice, Record<Choice, { a: number; b: number }>> = {
  high: { high: { a: 8, b: 8 }, low: { a: 2, b: 12 } },
  low: { high: { a: 12, b: 2 }, low: { a: 4, b: 4 } },
}

const ROWS: Array<Choice> = ['high', 'low']
const COLS: Array<Choice> = ['high', 'low']

function label(c: Choice) {
  return c === 'high' ? 'Price High' : 'Price Low'
}

export function OligopolyGame() {
  const [a, setA] = useState<Choice>('high') // Firm A (rows)
  const [b, setB] = useState<Choice>('high') // Firm B (cols)

  const cell = PAYOFF[a][b]
  const isCollusive = a === 'high' && b === 'high'
  const isWar = a === 'low' && b === 'low'

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-2 text-center text-xs font-semibold text-muted">Firm B chooses ↓ &nbsp;·&nbsp; Firm A chooses →</div>

      {/* 2x2 payoff grid */}
      <div className="grid grid-cols-[auto_1fr_1fr] gap-2">
        <span />
        {COLS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setA(c)}
            className={cn(
              'rounded-lg border px-2 py-1 text-center text-xs font-semibold transition-colors',
              a === c ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            A: {label(c)}
          </button>
        ))}

        {ROWS.map((rb) => (
          <div key={rb} className="contents">
            <button
              type="button"
              onClick={() => setB(rb)}
              className={cn(
                'flex w-20 items-center justify-center rounded-lg border px-2 text-center text-xs font-semibold transition-colors',
                b === rb ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
              )}
            >
              B: {label(rb)}
            </button>
            {COLS.map((ca) => {
              const p = PAYOFF[ca][rb]
              const active = a === ca && b === rb
              return (
                <button
                  key={ca}
                  type="button"
                  onClick={() => { setA(ca); setB(rb) }}
                  className={cn(
                    'rounded-xl border p-3 text-center transition-colors',
                    active ? 'border-accent bg-accent/15' : 'border-border bg-surface-2 hover:border-accent/50',
                  )}
                >
                  <div className="font-mono text-sm">
                    <span className="text-accent">A {p.a}</span>
                    <span className="text-muted"> · </span>
                    <span className="text-accent-2">B {p.b}</span>
                  </div>
                  <div className="text-[10px] text-muted">$ million profit</div>
                </button>
              )
            })}
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-center text-sm">
        <div><div className="font-mono text-accent">{cell.a}</div><div className="text-xs text-muted">Firm A profit</div></div>
        <div><div className="font-mono text-accent-2">{cell.b}</div><div className="text-xs text-muted">Firm B profit</div></div>
      </div>

      <div
        className={cn(
          'mt-3 rounded-xl border px-3 py-2 text-sm',
          isCollusive ? 'border-success/50 text-success' : isWar ? 'border-accent/50 text-accent' : 'border-accent-2/50 text-accent-2',
        )}
      >
        {isCollusive && 'Both price high — the collusive outcome. Profits are jointly highest (8 + 8). But each firm sees it could earn 12 by quietly undercutting, so the temptation to cheat is strong.'}
        {isWar && 'A price war. Both gave in to the temptation to undercut, and competition crushed prices — only 4 each. This low–low corner is the stable Nash equilibrium, even though both would prefer high–high.'}
        {!isCollusive && !isWar && 'One firm undercut the other. The low-pricer grabs the market and earns 12 while the high-pricer is left with just 2 — exactly why holding a cartel together is so hard.'}
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        Pricing <span className="text-ink">low</span> is each firm's dominant strategy, so they land in the worse low–low corner — the dilemma at the heart of <span className="text-ink">game theory</span>.
      </p>
    </div>
  )
}

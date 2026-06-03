import { useState } from 'react'
import { cn } from '#/lib/cn'

// FLAGSHIP game-theory interactive: a general, preset-driven 2x2 game. Each
// player picks one of two strategies; the chosen cell highlights and the two
// players' payoffs are read off it. Switch between three classic games —
// Prisoner's Dilemma, a Coordination game, and Chicken — to see how the SAME
// machinery (players, strategies, payoffs, interdependence) produces very
// different strategic logic. Dominant strategies (when one exists) are flagged
// per player. Builds on the OligopolyGame 2x2 grid style, generalised.
//
// Convention: payoff[rowStrat][colStrat] = { row, col } payoffs (higher is
// better for that player). Row player picks a row; Column player picks a column.

type Cell = { row: number; col: number }

type Game = {
  key: string
  name: string
  rowName: string
  colName: string
  // two strategy labels, index 0 and 1
  strats: [string, string]
  // payoff[r][c]
  payoff: [[Cell, Cell], [Cell, Cell]]
  blurb: string
}

const GAMES: Array<Game> = [
  {
    key: 'pd',
    name: "Prisoner's Dilemma",
    rowName: 'Suspect A',
    colName: 'Suspect B',
    strats: ['Stay silent', 'Confess'],
    // years in prison are BAD, so payoff = years saved (higher = better).
    // Both silent: light sentence each (8). One confesses, other silent:
    // confessor walks free (10), silent one takes the fall (0). Both confess:
    // medium each (3).
    payoff: [
      [{ row: 8, col: 8 }, { row: 0, col: 10 }],
      [{ row: 10, col: 0 }, { row: 3, col: 3 }],
    ],
    blurb:
      'Confessing beats staying silent no matter what the other does, so BOTH confess — even though staying silent would have left them both better off. A dominant strategy that traps everyone.',
  },
  {
    key: 'coord',
    name: 'Coordination',
    rowName: 'Engineer',
    colName: 'Engineer',
    strats: ['Standard A', 'Standard B'],
    // Both win if they pick the SAME standard; mismatched is useless.
    payoff: [
      [{ row: 9, col: 9 }, { row: 1, col: 1 }],
      [{ row: 1, col: 1 }, { row: 9, col: 9 }],
    ],
    blurb:
      'No conflict of interest — both just want to match. There is no dominant strategy: the best move depends entirely on the other. Two good outcomes exist (both A or both B); the problem is agreeing on which.',
  },
  {
    key: 'chicken',
    name: 'Chicken',
    rowName: 'Driver A',
    colName: 'Driver B',
    strats: ['Swerve', 'Drive on'],
    // Two cars race head-on. Swerving is "chicken" but safe. Driving on wins
    // glory IF the other swerves — but if both drive on, they crash (disaster).
    payoff: [
      [{ row: 6, col: 6 }, { row: 4, col: 9 }],
      [{ row: 9, col: 4 }, { row: 0, col: 0 }],
    ],
    blurb:
      'Each wants to be the one who holds firm while the other backs down — but if neither yields, they both crash. The worst-case is mutual aggression, so the strategic trick is making the other believe you will NOT swerve.',
  },
]

// Does the row player have a strictly dominant strategy? Returns 0, 1, or null.
function dominantRow(g: Game): number | null {
  // strategy r dominates if row payoff is higher for BOTH columns
  const r0BeatsAll = g.payoff[0][0].row > g.payoff[1][0].row && g.payoff[0][1].row > g.payoff[1][1].row
  const r1BeatsAll = g.payoff[1][0].row > g.payoff[0][0].row && g.payoff[1][1].row > g.payoff[0][1].row
  if (r0BeatsAll) return 0
  if (r1BeatsAll) return 1
  return null
}

function dominantCol(g: Game): number | null {
  const c0BeatsAll = g.payoff[0][0].col > g.payoff[0][1].col && g.payoff[1][0].col > g.payoff[1][1].col
  const c1BeatsAll = g.payoff[0][1].col > g.payoff[0][0].col && g.payoff[1][1].col > g.payoff[1][0].col
  if (c0BeatsAll) return 0
  if (c1BeatsAll) return 1
  return null
}

export function PayoffMatrix() {
  const [gi, setGi] = useState(0)
  const [r, setR] = useState(0) // row player's chosen strategy
  const [c, setC] = useState(0) // column player's chosen strategy

  const g = GAMES[gi]
  const cell = g.payoff[r][c]
  const domR = dominantRow(g)
  const domC = dominantCol(g)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      {/* game preset switch */}
      <div className="mb-3 flex flex-wrap gap-2">
        {GAMES.map((game, i) => (
          <button
            key={game.key}
            type="button"
            onClick={() => { setGi(i); setR(0); setC(0) }}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              gi === i ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {game.name}
          </button>
        ))}
      </div>

      <div className="mb-2 text-center text-xs font-semibold text-muted">
        <span className="text-accent">{g.rowName}</span> picks a row · <span className="text-accent-2">{g.colName}</span> picks a column
      </div>

      {/* 2x2 payoff grid */}
      <div className="grid grid-cols-[auto_1fr_1fr] gap-2">
        <span />
        {[0, 1].map((ci) => (
          <button
            key={ci}
            type="button"
            onClick={() => setC(ci)}
            className={cn(
              'rounded-lg border px-2 py-1 text-center text-xs font-semibold transition-colors',
              c === ci ? 'border-accent-2 bg-accent-2/15 text-accent-2' : 'border-border text-muted hover:text-ink',
            )}
          >
            {g.strats[ci]}
          </button>
        ))}

        {[0, 1].map((ri) => (
          <div key={ri} className="contents">
            <button
              type="button"
              onClick={() => setR(ri)}
              className={cn(
                'flex w-24 items-center justify-center rounded-lg border px-2 text-center text-xs font-semibold transition-colors',
                r === ri ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
              )}
            >
              {g.strats[ri]}
            </button>
            {[0, 1].map((ci) => {
              const p = g.payoff[ri][ci]
              const active = r === ri && c === ci
              return (
                <button
                  key={ci}
                  type="button"
                  onClick={() => { setR(ri); setC(ci) }}
                  className={cn(
                    'rounded-xl border p-3 text-center transition-colors',
                    active ? 'border-accent bg-accent/15' : 'border-border bg-surface-2 hover:border-accent/50',
                  )}
                >
                  <div className="font-mono text-sm">
                    <span className="text-accent">{p.row}</span>
                    <span className="text-muted"> · </span>
                    <span className="text-accent-2">{p.col}</span>
                  </div>
                  <div className="text-[10px] text-muted">payoff to each</div>
                </button>
              )
            })}
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-center text-sm">
        <div>
          <div className="font-mono text-accent">{cell.row}</div>
          <div className="text-xs text-muted">{g.rowName} payoff</div>
        </div>
        <div>
          <div className="font-mono text-accent-2">{cell.col}</div>
          <div className="text-xs text-muted">{g.colName} payoff</div>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-muted">
        {g.blurb}
      </div>

      <div className="mt-3 flex flex-col gap-1 text-xs">
        <div>
          <span className="text-accent">{g.rowName}</span>{' '}
          {domR === null
            ? <span className="text-muted">has no dominant strategy — the best move depends on what the other player does.</span>
            : <span className="text-ink">has a dominant strategy: <span className="font-semibold text-accent">{g.strats[domR]}</span> beats the alternative no matter what.</span>}
        </div>
        <div>
          <span className="text-accent-2">{g.colName}</span>{' '}
          {domC === null
            ? <span className="text-muted">has no dominant strategy — the best move depends on what the other player does.</span>
            : <span className="text-ink">has a dominant strategy: <span className="font-semibold text-accent-2">{g.strats[domC]}</span> beats the alternative no matter what.</span>}
        </div>
      </div>
    </div>
  )
}

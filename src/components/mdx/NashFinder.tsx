import { useState } from 'react'
import { cn } from '#/lib/cn'

// Find the Nash equilibrium by best responses. A BEST RESPONSE is the strategy
// that gives a player their highest payoff GIVEN what the other player does. In
// each column, mark the row player's best response; in each row, mark the column
// player's best response. A cell where BOTH players are simultaneously best-
// responding is a Nash equilibrium — no one can do better by switching alone.
// Toggle the best-response highlights on, then switch games: the Prisoner's
// Dilemma has one equilibrium, the Coordination game has TWO.

type Cell = { row: number; col: number }

type Game = {
  key: string
  name: string
  strats: [string, string]
  payoff: [[Cell, Cell], [Cell, Cell]]
  note: string
}

const GAMES: Array<Game> = [
  {
    key: 'pd',
    name: "Prisoner's Dilemma",
    strats: ['Cooperate', 'Defect'],
    payoff: [
      [{ row: 8, col: 8 }, { row: 0, col: 10 }],
      [{ row: 10, col: 0 }, { row: 3, col: 3 }],
    ],
    note: 'Exactly one Nash equilibrium — both defect (3, 3). Both best-response arrows meet only there, even though both would prefer to cooperate.',
  },
  {
    key: 'coord',
    name: 'Coordination',
    strats: ['Standard A', 'Standard B'],
    payoff: [
      [{ row: 9, col: 9 }, { row: 1, col: 1 }],
      [{ row: 1, col: 1 }, { row: 9, col: 9 }],
    ],
    note: 'TWO Nash equilibria — both pick A, or both pick B. Each is stable: once you have matched, neither side wants to move. The puzzle is which one you coordinate on.',
  },
]

// Is the row player best-responding with strategy r, given column c?
function rowBest(g: Game, r: number, c: number): boolean {
  const other = r === 0 ? 1 : 0
  return g.payoff[r][c].row >= g.payoff[other][c].row
}

// Is the column player best-responding with strategy c, given row r?
function colBest(g: Game, r: number, c: number): boolean {
  const other = c === 0 ? 1 : 0
  return g.payoff[r][c].col >= g.payoff[r][other].col
}

export function NashFinder() {
  const [gi, setGi] = useState(0)
  const [show, setShow] = useState(true)

  const g = GAMES[gi]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {GAMES.map((game, i) => (
            <button
              key={game.key}
              type="button"
              onClick={() => setGi(i)}
              className={cn(
                'rounded-full border px-3 py-1 text-sm transition-colors',
                gi === i ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
              )}
            >
              {game.name}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className={cn(
            'rounded-full border px-3 py-1 text-sm transition-colors',
            show ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
          )}
        >
          {show ? 'Hide best responses' : 'Show best responses'}
        </button>
      </div>

      <div className="mb-2 text-center text-xs font-semibold text-muted">
        <span className="text-accent">Row player</span> picks ↓ · <span className="text-accent-2">Column player</span> picks →
      </div>

      <div className="grid grid-cols-[auto_1fr_1fr] gap-2">
        <span />
        {[0, 1].map((ci) => (
          <div key={ci} className="rounded-lg border border-border px-2 py-1 text-center text-xs font-semibold text-accent-2">
            {g.strats[ci]}
          </div>
        ))}

        {[0, 1].map((ri) => (
          <div key={ri} className="contents">
            <div className="flex w-24 items-center justify-center rounded-lg border border-border px-2 text-center text-xs font-semibold text-accent">
              {g.strats[ri]}
            </div>
            {[0, 1].map((ci) => {
              const p = g.payoff[ri][ci]
              const rb = rowBest(g, ri, ci)
              const cb = colBest(g, ri, ci)
              const isNash = show && rb && cb
              return (
                <div
                  key={ci}
                  className={cn(
                    'rounded-xl border p-3 text-center transition-colors',
                    isNash ? 'border-success bg-success/15' : 'border-border bg-surface-2',
                  )}
                >
                  <div className="font-mono text-sm">
                    <span className={cn(show && rb ? 'font-bold text-accent underline' : 'text-accent')}>{p.row}</span>
                    <span className="text-muted"> · </span>
                    <span className={cn(show && cb ? 'font-bold text-accent-2 underline' : 'text-accent-2')}>{p.col}</span>
                  </div>
                  <div className="text-[10px] text-muted">{isNash ? 'Nash equilibrium' : 'payoffs'}</div>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {show && (
        <p className="mt-3 text-center text-xs text-muted">
          Underlined payoffs mark each player's <span className="text-ink">best response</span>. Where{' '}
          <span className="text-accent">both</span> are underlined, both are best-responding at once — a{' '}
          <span className="text-success">Nash equilibrium</span>.
        </p>
      )}

      <div className="mt-3 rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-muted">
        {g.note}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { cn } from '#/lib/cn'

// Why cooperation can survive when the Prisoner's Dilemma is played over and
// over. In a ONE-SHOT game, defecting is dominant. But repeat it, and your move
// today shapes how the other player treats you tomorrow — reputation matters.
// We pit two famous strategies against each other across many rounds:
//   ALWAYS DEFECT — betray every round, no matter what.
//   TIT-FOR-TAT   — cooperate first, then copy whatever the opponent did last.
//   GRIM TRIGGER  — cooperate until the opponent defects once, then defect forever.
// Per-round PD payoffs (higher = better): both cooperate 3, both defect 1,
// lone defector 5, lone cooperator 0. Slide the number of rounds to watch the
// cumulative scores diverge — and see how two tit-for-tat players settle into
// mutual cooperation while always-defect can only ever bleed points.

type Strat = 'allD' | 'tft' | 'grim'
type Move = 'C' | 'D'

const STRATS: Array<{ key: Strat; label: string; blurb: string }> = [
  { key: 'tft', label: 'Tit-for-tat', blurb: 'Cooperate first, then mirror the opponent.' },
  { key: 'allD', label: 'Always defect', blurb: 'Betray every single round.' },
  { key: 'grim', label: 'Grim trigger', blurb: 'Cooperate until betrayed once, then defect forever.' },
]

// payoff to the FIRST player given (my move, their move)
function payoff(mine: Move, theirs: Move): number {
  if (mine === 'C' && theirs === 'C') return 3
  if (mine === 'D' && theirs === 'D') return 1
  if (mine === 'D' && theirs === 'C') return 5
  return 0 // C vs D — the sucker's payoff
}

// What does a strategy play this round, given the opponent's history?
function move(s: Strat, oppHistory: Array<Move>): Move {
  if (s === 'allD') return 'D'
  if (oppHistory.length === 0) return 'C' // tft & grim both start nice
  if (s === 'tft') return oppHistory[oppHistory.length - 1]
  // grim: defect forever once the opponent has EVER defected
  return oppHistory.includes('D') ? 'D' : 'C'
}

const ROW_H = 28

export function RepeatedGame() {
  const [aStrat, setAStrat] = useState<Strat>('tft')
  const [bStrat, setBStrat] = useState<Strat>('allD')
  const [rounds, setRounds] = useState(8)

  // Deterministic playthrough — no randomness, pure function of strategies.
  const aHist: Array<Move> = []
  const bHist: Array<Move> = []
  let aScore = 0
  let bScore = 0
  const log: Array<{ a: Move; b: Move; aPts: number; bPts: number }> = []
  for (let i = 0; i < rounds; i++) {
    const am = move(aStrat, bHist)
    const bm = move(bStrat, aHist)
    aScore += payoff(am, bm)
    bScore += payoff(bm, am)
    log.push({ a: am, b: bm, aPts: payoff(am, bm), bPts: payoff(bm, am) })
    aHist.push(am)
    bHist.push(bm)
  }

  const maxScore = Math.max(aScore, bScore, 1)
  const aLabel = STRATS.find((s) => s.key === aStrat)!.label
  const bLabel = STRATS.find((s) => s.key === bStrat)!.label

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      {/* strategy pickers */}
      <div className="mb-3 grid grid-cols-2 gap-3">
        <div>
          <div className="mb-1 text-xs font-semibold text-accent">Player A</div>
          <div className="flex flex-col gap-1">
            {STRATS.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setAStrat(s.key)}
                className={cn(
                  'rounded-lg border px-2 py-1 text-left text-xs transition-colors',
                  aStrat === s.key ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1 text-xs font-semibold text-accent-2">Player B</div>
          <div className="flex flex-col gap-1">
            {STRATS.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setBStrat(s.key)}
                className={cn(
                  'rounded-lg border px-2 py-1 text-left text-xs transition-colors',
                  bStrat === s.key ? 'border-accent-2 bg-accent-2/15 text-accent-2' : 'border-border text-muted hover:text-ink',
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* cumulative score bars */}
      <svg viewBox={`0 0 360 ${2 * ROW_H + 16}`} className="w-full">
        {[
          { label: aLabel, score: aScore, color: 'var(--color-accent)', y: 8 },
          { label: bLabel, score: bScore, color: 'var(--color-accent-2)', y: 8 + ROW_H },
        ].map((bar) => {
          const w = (bar.score / maxScore) * 220
          return (
            <g key={bar.label}>
              <text x={8} y={bar.y + ROW_H / 2} fontSize="9" fill="var(--color-muted)">{bar.label}</text>
              <rect x={100} y={bar.y + 2} width={Math.max(1, w)} height={ROW_H - 8} rx="3" fill={bar.color} />
              <text x={100 + w + 6} y={bar.y + ROW_H / 2 + 2} fontSize="10" fill="var(--color-ink)" className="font-mono">{bar.score}</text>
            </g>
          )
        })}
      </svg>

      {/* per-round move log */}
      <div className="mt-2 flex flex-wrap justify-center gap-1">
        {log.map((rnd, i) => (
          <div key={i} className="flex flex-col items-center rounded-md border border-border bg-surface-2 px-1.5 py-1 text-[10px]">
            <span className="text-muted">r{i + 1}</span>
            <span className={cn('font-mono font-bold', rnd.a === 'C' ? 'text-accent' : 'text-muted')}>{rnd.a}</span>
            <span className={cn('font-mono font-bold', rnd.b === 'C' ? 'text-accent-2' : 'text-muted')}>{rnd.b}</span>
          </div>
        ))}
      </div>
      <p className="mt-1 text-center text-[10px] text-muted">C = cooperate · D = defect (top row = A, bottom = B)</p>

      <div className="mt-3 flex flex-col gap-1 text-xs">
        <label className="flex items-center justify-between text-muted">
          <span>Rounds played</span>
          <span className="font-mono text-ink">{rounds}</span>
        </label>
        <input
          type="range"
          min={1}
          max={20}
          step={1}
          value={rounds}
          onChange={(e) => setRounds(Number(e.target.value))}
          className="accent-accent"
        />
      </div>

      <div className="mt-3 rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-muted">
        {aStrat === 'tft' && bStrat === 'tft' && (
          <>Two tit-for-tat players cooperate every round and rack up <span className="text-success">3 points each, every round</span> — the best sustainable outcome. Niceness, when reciprocated, pays.</>
        )}
        {aStrat === 'allD' && bStrat === 'allD' && (
          <>Two defectors are stuck in the one-shot trap forever: <span className="text-ink">1 point each</span> per round. Repetition didn't help — neither ever gives the other a reason to cooperate.</>
        )}
        {((aStrat === 'tft' && bStrat === 'allD') || (aStrat === 'allD' && bStrat === 'tft')) && (
          <>Tit-for-tat loses the first round to the defector, then retaliates — so the defector can never exploit it again. Always-defect edges ahead by a single sucker-payoff, but neither escapes the grim grind of mutual defection.</>
        )}
        {((aStrat === 'grim' && bStrat === 'tft') || (aStrat === 'tft' && bStrat === 'grim') || (aStrat === 'grim' && bStrat === 'grim')) && (
          <>Both start nice and never get a reason to retaliate, so they cooperate the whole way — <span className="text-success">3 points each per round</span>. Cooperation holds as long as no one defects.</>
        )}
        {((aStrat === 'grim' && bStrat === 'allD') || (aStrat === 'allD' && bStrat === 'grim')) && (
          <>The defector betrays in round 1, tripping the grim trigger forever after. From then on it is mutual defection — <span className="text-ink">1 point each</span> — and there is no path back.</>
        )}
      </div>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Two faces of problem solving in one widget.
//
// Mode "hanoi": a 3-disk Tower of Hanoi. Tap a peg to lift its top disk, tap
// another peg to drop it (you can never place a big disk on a small one). The
// optimal solution is 7 moves; the puzzle is fully state-driven (no rAF).
// Solving it by hand is the difference between blindly trying things and using
// a strategy — means-end analysis: at every step, make the move that most
// reduces the gap to the goal.
//
// Mode "candle": Duncker's classic functional-fixedness problem. You see a
// candle, a box of tacks and matches, and must fix the candle to the wall so
// wax won't drip. Most people stay stuck because they see the box as only a
// container. Tap "I give up — show me" to reveal the insight: empty the box and
// tack the BOX to the wall as a shelf. Functional fixedness lifts.
// Used in problem-solving.

type Mode = 'hanoi' | 'candle'

// ---- Tower of Hanoi ------------------------------------------------------
const N = 3
const DISK_COLORS = ['#1ABC9C', '#16A085', '#48C9B0']

function initialPegs(): Array<Array<number>> {
  // peg 0 holds disks largest..smallest (3,2,1 -> stored bottom-first)
  return [[3, 2, 1], [], []]
}

function Hanoi() {
  const [pegs, setPegs] = useState<Array<Array<number>>>(initialPegs)
  const [held, setHeld] = useState<number | null>(null) // peg index a disk is lifted from
  const [moves, setMoves] = useState(0)

  const solved = pegs[2].length === N

  function tapPeg(p: number) {
    if (solved) return
    if (held === null) {
      if (pegs[p].length === 0) return
      setHeld(p)
      return
    }
    if (held === p) {
      setHeld(null)
      return
    }
    const from = pegs[held]
    const to = pegs[p]
    const disk = from[from.length - 1]
    const top = to[to.length - 1]
    if (top !== undefined && top < disk) {
      // illegal: can't put a bigger disk on a smaller one
      setHeld(null)
      return
    }
    const next = pegs.map((s) => s.slice())
    next[held].pop()
    next[p].push(disk)
    setPegs(next)
    setMoves((m) => m + 1)
    setHeld(null)
  }

  function reset() {
    setPegs(initialPegs())
    setHeld(null)
    setMoves(0)
  }

  const W = 360
  const H = 170
  const pegX = [70, 180, 290]

  return (
    <>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <rect x="20" y="140" width="320" height="10" rx="3" fill="var(--color-border)" />
        {pegX.map((x, pi) => (
          <g key={pi}>
            <rect x={x - 3} y="40" width="6" height="100" rx="3" fill="var(--color-border)" />
            {/* invisible tap target over the whole column */}
            <rect
              x={x - 50}
              y="20"
              width="100"
              height="125"
              fill="transparent"
              style={{ cursor: solved ? 'default' : 'pointer' }}
              onClick={() => tapPeg(pi)}
            />
            {pegs[pi].map((disk, di) => {
              const w = 30 + disk * 22
              const lifted = held === pi && di === pegs[pi].length - 1
              return (
                <rect
                  key={di}
                  x={x - w / 2}
                  y={(lifted ? 22 : 140 - (di + 1) * 22) + 0}
                  width={w}
                  height="18"
                  rx="5"
                  fill={DISK_COLORS[disk - 1]}
                  stroke={lifted ? '#fff' : 'none'}
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer' }}
                  onClick={() => tapPeg(pi)}
                />
              )
            })}
          </g>
        ))}
      </svg>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm text-muted">
          Moves: <span className="font-mono text-ink">{moves}</span>{' '}
          <span className="text-xs">(best possible: 7)</span>
        </span>
        <button
          type="button"
          onClick={reset}
          className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-sm text-muted hover:text-ink"
        >
          <Icon name="RotateCcw" size={14} /> Reset
        </button>
      </div>

      <p className="mt-2 text-center text-sm">
        {solved ? (
          <span className="font-semibold text-success">
            Solved in {moves} moves! {moves === 7 ? 'Perfectly optimal.' : 'Can you do it in 7?'}
          </span>
        ) : held === null ? (
          <span className="text-muted">Goal: move the whole stack to the right peg. Tap a peg to lift its top disk.</span>
        ) : (
          <span className="text-accent">Now tap where to drop it — but never onto a smaller disk.</span>
        )}
      </p>
    </>
  )
}

// ---- Candle / functional fixedness --------------------------------------
function Candle() {
  const [revealed, setRevealed] = useState(false)

  return (
    <>
      <svg viewBox="0 0 360 200" className="w-full">
        {/* wall */}
        <rect x="20" y="20" width="200" height="160" rx="6" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="2" />
        {/* table */}
        <rect x="20" y="180" width="320" height="8" fill="var(--color-border)" />

        {!revealed ? (
          <>
            {/* candle, box of tacks, matches sitting on the table — the "stuck" view */}
            <rect x="60" y="150" width="14" height="30" rx="2" fill="#F4D03F" />
            <line x1="67" y1="150" x2="67" y2="142" stroke="#E67E22" strokeWidth="2" />
            <circle cx="67" cy="139" r="3" fill="#E67E22" />
            {/* box of tacks */}
            <rect x="110" y="158" width="40" height="22" rx="3" fill="#1ABC9C" />
            <rect x="116" y="162" width="6" height="6" fill="#16A085" />
            <rect x="126" y="162" width="6" height="6" fill="#16A085" />
            <rect x="136" y="162" width="6" height="6" fill="#16A085" />
            {/* matches */}
            <rect x="172" y="170" width="26" height="10" rx="2" fill="#C0392B" />
          </>
        ) : (
          <>
            {/* the box, emptied, tacked to the wall as a shelf, candle standing on it */}
            <rect x="90" y="110" width="44" height="20" rx="3" fill="#1ABC9C" />
            {/* tacks holding the box */}
            <circle cx="96" cy="120" r="2.5" fill="#16A085" />
            <circle cx="128" cy="120" r="2.5" fill="#16A085" />
            {/* candle on the shelf */}
            <rect x="105" y="80" width="14" height="30" rx="2" fill="#F4D03F" />
            <line x1="112" y1="80" x2="112" y2="72" stroke="#E67E22" strokeWidth="2" />
            <circle cx="112" cy="69" r="4" fill="#E67E22" />
          </>
        )}

        {/* the goal label on the wall */}
        <text x="120" y="44" textAnchor="middle" fontSize="11" fill="var(--color-muted)">
          attach the candle here
        </text>
      </svg>

      <div className="mt-2 rounded-xl bg-surface-2 p-3 text-sm text-muted">
        {revealed ? (
          <>
            <span className="font-semibold text-success">The trick:</span> empty the box, tack the{' '}
            <span className="text-ink">box itself</span> to the wall as a little shelf, and stand the candle on it.
            The block was seeing the box as <span className="text-ink">only a container</span> — that's{' '}
            <span className="text-accent">functional fixedness</span>. The moment the box becomes "a shelf", the
            problem dissolves.
          </>
        ) : (
          <>
            You have a candle, a box of tacks and matches. <span className="text-ink">Fix the candle to the wall</span>{' '}
            so wax won't drip on the table. Most people fail — they try to tack the candle directly, or glue it with
            melted wax. Stuck? There's one elegant move.
          </>
        )}
      </div>

      <div className="mt-2 flex justify-center">
        {!revealed ? (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="rounded-full border border-accent bg-accent/15 px-4 py-1.5 text-sm text-accent"
          >
            I give up — show me
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setRevealed(false)}
            className="flex items-center gap-1 rounded-full border border-border px-4 py-1.5 text-sm text-muted hover:text-ink"
          >
            <Icon name="RotateCcw" size={14} /> Try again
          </button>
        )}
      </div>
    </>
  )
}

export function ProblemSolving() {
  const [mode, setMode] = useState<Mode>('hanoi')
  const tabs = useMemo(
    () => [
      { key: 'hanoi' as Mode, label: 'Solve it: Tower of Hanoi' },
      { key: 'candle' as Mode, label: 'Get unstuck: the candle problem' },
    ],
    [],
  )

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="mb-3 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setMode(t.key)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              mode === t.key ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {mode === 'hanoi' ? <Hanoi /> : <Candle />}
    </div>
  )
}

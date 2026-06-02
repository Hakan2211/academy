import { useState } from 'react'
import { cn } from '#/lib/cn'

// A huge slice of classic AI is SEARCH: the problem is a maze of states, and the
// machine explores possibilities until it reaches a goal. The FRONTIER is the
// set of cells we've discovered but not yet expanded. How we pick the next cell
// to expand defines the strategy: BFS fans out evenly, DFS plunges down one path,
// and A* uses a heuristic (here, distance to the goal) to head straight for it.

type Strategy = 'bfs' | 'dfs' | 'astar'

const COLS = 11
const ROWS = 8
const START = 0 * COLS + 1
const GOAL = (ROWS - 1) * COLS + (COLS - 2)

// 1 = wall. A simple maze with a couple of detours.
const WALLS = new Set<number>()
;[
  [1, 4], [2, 4], [3, 4], [4, 4], [5, 4],
  [5, 5], [5, 6], [5, 7], [5, 8],
  [2, 7], [3, 7], [4, 7],
  [3, 1], [3, 2],
  [6, 2], [6, 3], [6, 4], [6, 5],
].forEach(([r, c]) => WALLS.add(r * COLS + c))

const rc = (i: number) => [Math.floor(i / COLS), i % COLS] as const
const neighbours = (i: number): Array<number> => {
  const [r, c] = rc(i)
  const out: Array<number> = []
  if (r > 0) out.push(i - COLS)
  if (c < COLS - 1) out.push(i + 1)
  if (r < ROWS - 1) out.push(i + COLS)
  if (c > 0) out.push(i - 1)
  return out.filter((n) => !WALLS.has(n))
}
const heuristic = (i: number): number => {
  const [r, c] = rc(i)
  const [gr, gc] = rc(GOAL)
  return Math.abs(r - gr) + Math.abs(c - gc)
}

type Frame = { visited: Set<number>; frontier: Set<number>; current: number; path: Array<number> | null }

// Pre-compute the whole expansion as an array of frames, then scrub through it.
function plan(strategy: Strategy): Array<Frame> {
  const came = new Map<number, number>()
  const cost = new Map<number, number>([[START, 0]])
  const visited = new Set<number>()
  let frontier = [START]
  const frames: Array<Frame> = []

  const popIndex = (): number => {
    if (strategy === 'dfs') return frontier.length - 1
    if (strategy === 'bfs') return 0
    let best = 0
    let bestF = Infinity
    for (let k = 0; k < frontier.length; k++) {
      const g = cost.get(frontier[k]) ?? 0
      const f = g + heuristic(frontier[k])
      if (f < bestF) { bestF = f; best = k }
    }
    return best
  }

  while (frontier.length) {
    const idx = popIndex()
    const current = frontier[idx]
    frontier = frontier.filter((_, k) => k !== idx)
    if (visited.has(current)) continue
    visited.add(current)

    if (current === GOAL) {
      const path: Array<number> = [GOAL]
      let cur = GOAL
      while (came.has(cur)) { cur = came.get(cur)!; path.unshift(cur) }
      frames.push({ visited: new Set(visited), frontier: new Set(frontier), current, path })
      break
    }

    for (const nb of neighbours(current)) {
      if (visited.has(nb)) continue
      const g = (cost.get(current) ?? 0) + 1
      if (!cost.has(nb) || g < (cost.get(nb) ?? Infinity)) {
        cost.set(nb, g)
        came.set(nb, current)
      }
      if (!frontier.includes(nb)) frontier.push(nb)
    }
    frames.push({ visited: new Set(visited), frontier: new Set(frontier), current, path: null })
  }
  return frames
}

const LABEL: Record<Strategy, string> = {
  bfs: 'Breadth-first',
  dfs: 'Depth-first',
  astar: 'A* (heuristic)',
}

export function AiSearch() {
  const [strategy, setStrategy] = useState<Strategy>('astar')
  const [step, setStep] = useState(0)

  const frames = plan(strategy)
  const last = frames.length - 1
  const i = Math.min(step, last)
  const frame = frames[i] ?? { visited: new Set(), frontier: new Set([START]), current: START, path: null }
  const done = !!frame.path
  const pathSet = new Set(frame.path ?? [])

  const choose = (s: Strategy) => { setStrategy(s); setStep(0) }
  const CELL = 32

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {(['bfs', 'dfs', 'astar'] as Array<Strategy>).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => choose(s)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              strategy === s ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {LABEL[s]}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setStep(i >= last ? 0 : i + 1)}
          className="rounded-full border border-accent-2 bg-accent-2/10 px-3 py-1 text-sm font-semibold text-accent-2"
        >
          {i >= last ? 'Restart' : step === 0 ? 'Start' : 'Step'}
        </button>
        <button
          type="button"
          onClick={() => setStep(last)}
          className="rounded-full border border-border px-3 py-1 text-sm text-muted hover:text-ink"
        >
          Run to goal
        </button>
      </div>

      <svg viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`} className="mt-3 w-full">
        {Array.from({ length: COLS * ROWS }).map((_, idx) => {
          const [r, c] = rc(idx)
          const isWall = WALLS.has(idx)
          let fill = 'var(--color-surface-2)'
          if (isWall) fill = 'var(--color-border)'
          else if (idx === GOAL) fill = '#2ECC71'
          else if (idx === START) fill = 'var(--color-accent-2)'
          else if (pathSet.has(idx)) fill = 'var(--color-accent-2)'
          else if (frame.current === idx) fill = '#FFB454'
          else if (frame.frontier.has(idx)) fill = 'var(--color-accent)'
          else if (frame.visited.has(idx)) fill = 'var(--color-accent)'
          const dim = !isWall && frame.visited.has(idx) && !frame.frontier.has(idx) && !pathSet.has(idx) && frame.current !== idx
          return (
            <rect
              key={idx}
              x={c * CELL + 1.5}
              y={r * CELL + 1.5}
              width={CELL - 3}
              height={CELL - 3}
              rx="5"
              fill={fill}
              opacity={dim ? 0.45 : 1}
              stroke={frame.current === idx ? '#FFB454' : 'transparent'}
              strokeWidth="2"
            />
          )
        })}
        <text x={(START % COLS) * CELL + CELL / 2} y={Math.floor(START / COLS) * CELL + CELL / 2 + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0a0f1f">S</text>
        <text x={(GOAL % COLS) * CELL + CELL / 2} y={Math.floor(GOAL / COLS) * CELL + CELL / 2 + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0a0f1f">G</text>
      </svg>

      <p className="mt-1 text-center text-sm text-muted">
        {done ? (
          <>
            Reached the goal in <span className="font-bold text-accent-2">{(frame.path?.length ?? 1) - 1}</span> steps after expanding{' '}
            <span className="font-bold text-accent">{frame.visited.size}</span> cells.
          </>
        ) : (
          <>
            <span className="text-accent">Frontier</span> = discovered, not yet expanded ·{' '}
            <span className="text-accent" style={{ opacity: 0.6 }}>visited</span> = already explored ·{' '}
            <span className="text-warn">orange</span> = expanding now.
          </>
        )}
      </p>
    </div>
  )
}

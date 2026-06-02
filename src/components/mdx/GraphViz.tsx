import { useState } from 'react'
import { cn } from '#/lib/cn'

// A graph is the most general "relationships" structure: nodes (things) joined by
// edges (connections). Friends in a social network, cities on a map, pages linked
// on the web — all graphs. Unlike a tree there's no single root and connections
// can loop back. To explore one we TRAVERSE it: BFS fans out level by level (great
// for shortest hops); DFS dives deep down one path first. Step through to watch.

type Mode = 'bfs' | 'dfs'

const NODES = [
  { id: 0, label: 'A', x: 70, y: 60 },
  { id: 1, label: 'B', x: 200, y: 40 },
  { id: 2, label: 'C', x: 330, y: 70 },
  { id: 3, label: 'D', x: 90, y: 180 },
  { id: 4, label: 'E', x: 220, y: 170 },
  { id: 5, label: 'F', x: 340, y: 190 },
]

const EDGES: Array<[number, number]> = [
  [0, 1], [0, 3], [1, 2], [1, 4], [2, 5], [3, 4], [4, 5],
]

const ADJ: Array<Array<number>> = NODES.map(() => [])
for (const [a, b] of EDGES) {
  ADJ[a].push(b)
  ADJ[b].push(a)
}
for (const list of ADJ) list.sort((x, y) => x - y)

function bfsOrder(start: number): Array<number> {
  const seen = new Set([start])
  const q = [start]
  const out: Array<number> = []
  while (q.length) {
    const n = q.shift()!
    out.push(n)
    for (const nb of ADJ[n]) if (!seen.has(nb)) { seen.add(nb); q.push(nb) }
  }
  return out
}

function dfsOrder(start: number): Array<number> {
  const seen = new Set<number>()
  const out: Array<number> = []
  const go = (n: number) => {
    seen.add(n)
    out.push(n)
    for (const nb of ADJ[n]) if (!seen.has(nb)) go(nb)
  }
  go(start)
  return out
}

export function GraphViz() {
  const [mode, setMode] = useState<Mode>('bfs')
  const [step, setStep] = useState(0)

  const order = mode === 'bfs' ? bfsOrder(0) : dfsOrder(0)
  const visited = order.slice(0, step)
  const visitedSet = new Set(visited)
  const current = step > 0 ? order[step - 1] : null
  const done = step >= order.length

  function setM(m: Mode) {
    setMode(m)
    setStep(0)
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-wrap justify-center gap-2">
        {(['bfs', 'dfs'] as Array<Mode>).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setM(m)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm uppercase transition-colors',
              mode === m ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {m}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setStep(done ? 0 : step + 1)}
          className="rounded-full border border-accent-2 bg-accent-2/10 px-3 py-1 text-sm font-semibold text-accent-2"
        >
          {done ? 'Restart' : step === 0 ? 'Start from A' : 'Next step'}
        </button>
      </div>

      <svg viewBox="0 0 410 230" className="mt-3 w-full">
        {EDGES.map(([a, b], i) => {
          const both = visitedSet.has(a) && visitedSet.has(b)
          return (
            <line
              key={i}
              x1={NODES[a].x}
              y1={NODES[a].y}
              x2={NODES[b].x}
              y2={NODES[b].y}
              stroke={both ? 'var(--color-accent)' : 'var(--color-border)'}
              strokeWidth={both ? 3 : 2}
            />
          )
        })}
        {NODES.map((n) => {
          const seen = visitedSet.has(n.id)
          const isCur = current === n.id
          const orderIdx = visited.indexOf(n.id)
          return (
            <g key={n.id}>
              <circle
                cx={n.x}
                cy={n.y}
                r="18"
                fill={seen ? 'var(--color-accent)' : 'var(--color-surface-2)'}
                stroke={isCur ? 'var(--color-accent-2)' : seen ? 'var(--color-accent)' : 'var(--color-border)'}
                strokeWidth={isCur ? 4 : 2}
              />
              <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={seen ? '#0a0f1f' : 'var(--color-ink)'}>
                {n.label}
              </text>
              {seen && (
                <text x={n.x + 16} y={n.y - 12} textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--color-accent-2)">
                  {orderIdx + 1}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      <p className="mt-1 text-center text-sm text-muted">
        {step === 0
          ? `${mode.toUpperCase()}: press start to explore from node A.`
          : (
            <>
              Visited order: <span className="font-mono font-bold text-accent">{visited.map((i) => NODES[i].label).join(' → ')}</span>
              {done ? ' — every node reached.' : mode === 'bfs' ? ' (fanning out by distance)' : ' (diving deep first)'}
            </>
          )}
      </p>
    </div>
  )
}

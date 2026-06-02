import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'

// A miniature git history you can drive yourself. "Commit" saves a snapshot on
// the current line of work. "Branch" splits off a parallel copy so you can
// experiment without touching the main line. "Merge" brings the branch's work
// back into main. Version control means every state is remembered — you can
// always go back, and many people can work in parallel without overwriting each
// other. Try it: branch, commit a few times, then merge.

type Lane = 0 | 1 // 0 = main, 1 = feature branch
type Node = { id: number; lane: Lane; merge?: boolean }

const COL_X: Record<Lane, number> = { 0: 70, 1: 150 }
const STEP = 46
const TOP = 30
const LABELS = ['init', 'add login', 'fix typo', 'new feature', 'tests', 'tidy up', 'refactor', 'polish']

export function VersionGraph() {
  const [nodes, setNodes] = useState<Array<Node>>([{ id: 0, lane: 0 }])
  const [branched, setBranched] = useState(false)
  const [head, setHead] = useState<Lane>(0)
  const [next, setNext] = useState(1)

  const add = (lane: Lane, merge = false) => {
    setNodes((ns) => [...ns, { id: next, lane, merge }])
    setNext((n) => n + 1)
  }

  const commit = () => add(head)

  const branch = () => {
    setBranched(true)
    setHead(1)
    add(1)
  }

  const merge = () => {
    setHead(0)
    add(0, true)
    setBranched(false)
  }

  const reset = () => {
    setNodes([{ id: 0, lane: 0 }])
    setBranched(false)
    setHead(0)
    setNext(1)
  }

  const y = (i: number) => TOP + i * STEP
  const height = TOP + nodes.length * STEP

  // For drawing edges: connect each node to the previous node on its own lane,
  // and link branch/merge points across lanes.
  const prevIndexOnLane = (idx: number, lane: Lane): number => {
    for (let i = idx - 1; i >= 0; i--) if (nodes[i].lane === lane) return i
    return -1
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={commit}
          className="rounded-lg border border-accent bg-accent/15 px-3 py-1.5 text-sm font-semibold text-accent hover:bg-accent/25"
        >
          <Icon name="GitCommitHorizontal" size={14} className="mr-1 inline" /> Commit
        </button>
        <button
          type="button"
          onClick={branch}
          disabled={branched}
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted hover:text-ink disabled:opacity-40"
        >
          <Icon name="GitBranch" size={14} className="mr-1 inline" /> Branch
        </button>
        <button
          type="button"
          onClick={merge}
          disabled={!branched}
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted hover:text-ink disabled:opacity-40"
        >
          <Icon name="GitMerge" size={14} className="mr-1 inline" /> Merge
        </button>
        <button
          type="button"
          onClick={reset}
          className="ml-auto rounded-lg border border-border px-3 py-1.5 text-sm text-muted hover:text-ink"
        >
          Reset
        </button>
      </div>

      <div className="mt-3 overflow-y-auto rounded-xl border border-border bg-surface-2 p-2" style={{ maxHeight: 320 }}>
        <svg viewBox={`0 0 300 ${height}`} className="w-full" style={{ minHeight: height }}>
          {/* lane guide lines */}
          <line x1={COL_X[0]} y1={TOP} x2={COL_X[0]} y2={height - STEP + 10} stroke="var(--color-accent)" strokeWidth="2" opacity="0.25" />
          {branched && <line x1={COL_X[1]} y1={TOP} x2={COL_X[1]} y2={height - STEP + 10} stroke="var(--color-accent-2)" strokeWidth="2" opacity="0.25" />}

          {/* edges */}
          {nodes.map((nd, i) => {
            const p = prevIndexOnLane(i, nd.lane)
            const lines = []
            if (p >= 0) {
              lines.push(
                <line key={`e${nd.id}`} x1={COL_X[nd.lane]} y1={y(p)} x2={COL_X[nd.lane]} y2={y(i)} stroke={nd.lane === 0 ? 'var(--color-accent)' : 'var(--color-accent-2)'} strokeWidth="2.5" />,
              )
            }
            // branch start: first node on lane 1 links from the prior main node
            if (nd.lane === 1 && p < 0) {
              const from = i - 1
              lines.push(
                <line key={`b${nd.id}`} x1={COL_X[0]} y1={y(from)} x2={COL_X[1]} y2={y(i)} stroke="var(--color-accent-2)" strokeWidth="2.5" />,
              )
            }
            // merge: link from the last lane-1 node into this main node
            if (nd.merge) {
              const from = prevIndexOnLane(i, 1)
              if (from >= 0) {
                lines.push(
                  <line key={`m${nd.id}`} x1={COL_X[1]} y1={y(from)} x2={COL_X[0]} y2={y(i)} stroke="var(--color-accent-2)" strokeWidth="2.5" />,
                )
              }
            }
            return lines
          })}

          {/* nodes */}
          {nodes.map((nd, i) => (
            <g key={nd.id}>
              <circle cx={COL_X[nd.lane]} cy={y(i)} r="9" fill={nd.merge ? 'var(--color-accent-2)' : nd.lane === 0 ? 'var(--color-accent)' : 'var(--color-surface)'} stroke={nd.lane === 0 ? 'var(--color-accent)' : 'var(--color-accent-2)'} strokeWidth="2.5" />
              <text x={COL_X[nd.lane] + 18} y={y(i) + 4} className="text-[10px]" fill="var(--color-muted)">
                {nd.merge ? 'merge branch' : LABELS[nd.id % LABELS.length]}
              </text>
            </g>
          ))}

          <text x={COL_X[0]} y={20} textAnchor="middle" className="text-[9px] font-semibold" fill="var(--color-accent)">main</text>
          {branched && <text x={COL_X[1]} y={20} textAnchor="middle" className="text-[9px] font-semibold" fill="var(--color-accent-2)">feature</text>}
        </svg>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        Every commit is a saved snapshot you can return to. <span className="text-ink">Branches</span> let people work in parallel; a{' '}
        <span className="text-ink">merge</span> reunites the work. With version control, no effort is ever truly lost.
      </p>
    </div>
  )
}

import { useState } from 'react'
import { cn } from '#/lib/cn'

// A binary search tree keeps values *ordered* by a simple rule at every node:
// everything smaller goes left, everything larger goes right. That ordering turns
// search into a guessing game where each step halves what's left — so finding a
// value in a balanced tree takes roughly log-depth steps, not a full scan. Insert
// values to grow the tree; search to watch the path light up from the root down.

type Node = { v: number; left: Node | null; right: Node | null }

function insert(root: Node | null, v: number): Node {
  if (!root) return { v, left: null, right: null }
  if (v === root.v) return root
  if (v < root.v) root.left = insert(root.left, v)
  else root.right = insert(root.right, v)
  return root
}

function clone(n: Node | null): Node | null {
  return n ? { v: n.v, left: clone(n.left), right: clone(n.right) } : null
}

function build(vals: Array<number>): Node | null {
  let root: Node | null = null
  for (const v of vals) root = insert(root, v)
  return root
}

const PRESET = [8, 4, 12, 2, 6, 10, 14, 1, 5]

type Placed = { v: number; x: number; y: number; px?: number; py?: number }

// x by in-order slot (keeps left/right order), y by depth.
function layout(root: Node | null): Array<Placed> {
  const flat: Array<{ n: Node; depth: number; slot: number }> = []
  let slot = 0
  const collect = (n: Node | null, depth: number) => {
    if (!n) return
    collect(n.left, depth + 1)
    flat.push({ n, depth, slot: slot++ })
    collect(n.right, depth + 1)
  }
  collect(root, 0)
  const total = flat.length || 1
  const pos = new Map<Node, Placed>()
  for (const f of flat) {
    const x = 30 + (f.slot + 0.5) * ((400 - 30) / total)
    const p: Placed = { v: f.n.v, x, y: 36 + f.depth * 54 }
    pos.set(f.n, p)
  }
  // set parent coords by walking again
  const link = (n: Node | null, parent: Node | null) => {
    if (!n) return
    const me = pos.get(n)!
    if (parent) {
      const pp = pos.get(parent)!
      me.px = pp.x
      me.py = pp.y
    }
    link(n.left, n)
    link(n.right, n)
  }
  link(root, null)
  return Array.from(pos.values())
}

function searchPath(root: Node | null, target: number): Array<number> {
  const path: Array<number> = []
  let cur = root
  while (cur) {
    path.push(cur.v)
    if (cur.v === target) return path
    cur = target < cur.v ? cur.left : cur.right
  }
  return path
}

export function TreeViz() {
  const [root, setRoot] = useState<Node | null>(() => build([8, 4, 12, 2, 6]))
  const [path, setPath] = useState<Array<number>>([])
  const [target, setTarget] = useState<number | null>(null)
  const [note, setNote] = useState('Insert values: smaller go left, larger go right.')
  const [nextInsert, setNextInsert] = useState(0)

  const placed = layout(root)

  function addPreset() {
    const v = PRESET[nextInsert % PRESET.length]
    const r = clone(root)
    setRoot(insert(r, v))
    setPath([])
    setTarget(null)
    setNote(`Inserted ${v}: walked down comparing — left if smaller, right if larger — and hung it at the bottom.`)
    setNextInsert(nextInsert + 1)
  }

  function addRandom() {
    const v = 1 + Math.floor(Math.random() * 15)
    const r = clone(root)
    setRoot(insert(r, v))
    setPath([])
    setTarget(null)
    setNote(`Inserted ${v}.`)
  }

  function doSearch() {
    const all = placed.map((p) => p.v)
    if (all.length === 0) return
    const t = all[Math.floor(Math.random() * all.length)]
    const p = searchPath(root, t)
    setPath(p)
    setTarget(t)
    setNote(`Searching for ${t}: ${p.length} comparison${p.length === 1 ? '' : 's'} from the root — each step skips half the tree.`)
  }

  function reset() {
    setRoot(build([8, 4, 12, 2, 6]))
    setPath([])
    setTarget(null)
    setNextInsert(0)
    setNote('Insert values: smaller go left, larger go right.')
  }

  const inPath = new Set(path)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-wrap justify-center gap-2">
        <button type="button" onClick={addPreset} className="rounded-full border border-accent bg-accent/15 px-3 py-1 text-sm font-semibold text-accent">
          Insert next
        </button>
        <button type="button" onClick={addRandom} className="rounded-full border border-border px-3 py-1 text-sm text-muted transition-colors hover:text-ink">
          Insert random
        </button>
        <button type="button" onClick={doSearch} className="rounded-full border border-border px-3 py-1 text-sm text-muted transition-colors hover:text-ink">
          Search a value
        </button>
        <button type="button" onClick={reset} className="rounded-full border border-border px-3 py-1 text-sm text-muted transition-colors hover:text-ink">
          Reset
        </button>
      </div>

      <svg viewBox="0 0 430 260" className="mt-3 w-full">
        {/* edges first */}
        {placed.map((p) =>
          p.px !== undefined && p.py !== undefined ? (
            <line
              key={`e${p.v}`}
              x1={p.px}
              y1={p.py}
              x2={p.x}
              y2={p.y}
              stroke={inPath.has(p.v) ? 'var(--color-accent)' : 'var(--color-border)'}
              strokeWidth={inPath.has(p.v) ? 3 : 2}
            />
          ) : null,
        )}
        {placed.map((p) => {
          const on = inPath.has(p.v)
          const isTarget = target === p.v
          return (
            <g key={p.v}>
              <circle
                cx={p.x}
                cy={p.y}
                r="16"
                fill={on ? 'var(--color-accent)' : 'var(--color-surface-2)'}
                stroke={isTarget ? 'var(--color-accent-2)' : on ? 'var(--color-accent)' : 'var(--color-border)'}
                strokeWidth={isTarget ? 3.5 : 2}
              />
              <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill={on ? '#0a0f1f' : 'var(--color-ink)'}>
                {p.v}
              </text>
            </g>
          )
        })}
      </svg>

      <p className={cn('mt-1 text-center text-sm', target !== null ? 'text-accent' : 'text-muted')}>{note}</p>
    </div>
  )
}

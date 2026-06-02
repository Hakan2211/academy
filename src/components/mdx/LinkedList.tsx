import { useState } from 'react'
import { cn } from '#/lib/cn'

// A linked list scatters its nodes anywhere in memory; each node holds a value
// plus a POINTER (an arrow) to the next node. The last node points to null. To
// insert, you make a new node and repoint a single arrow — nothing else moves.
// To delete, you repoint around the node. The trade-off vs an array: no shifting,
// but no jump-to-index either — to reach node 3 you must follow the chain.

let uid = 100

export function LinkedList() {
  const [nodes, setNodes] = useState<Array<{ id: number; v: number }>>([
    { id: 1, v: 7 },
    { id: 2, v: 3 },
    { id: 3, v: 9 },
  ])
  const [next, setNext] = useState(5)
  const [hot, setHot] = useState<number | null>(null)
  const [traverseTo, setTraverseTo] = useState<number | null>(null)
  const [note, setNote] = useState('Insert and delete only repoint arrows — no shifting.')

  function insertAfterHead() {
    const node = { id: ++uid, v: next }
    setNodes([nodes[0], node, ...nodes.slice(1)])
    setHot(node.id)
    setTraverseTo(null)
    setNote(`Inserted ${next} after the head: created a node, repointed two arrows. Nothing else moved.`)
    setNext(((next + 2) % 9) + 1)
  }

  function deleteSecond() {
    if (nodes.length < 2) return
    const gone = nodes[1]
    setNodes([nodes[0], ...nodes.slice(2)])
    setHot(null)
    setTraverseTo(null)
    setNote(`Deleted ${gone.v}: just repointed the previous node's arrow around it. No shifting.`)
  }

  function traverse() {
    if (nodes.length === 0) return
    const target = nodes.length - 1
    setHot(null)
    setTraverseTo(target)
    setNote(`No random access: to reach index ${target} you must hop through ${target + 1} nodes following each arrow.`)
  }

  function reset() {
    setNodes([{ id: 1, v: 7 }, { id: 2, v: 3 }, { id: 3, v: 9 }])
    setHot(null)
    setTraverseTo(null)
    setNote('Insert and delete only repoint arrows — no shifting.')
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-wrap justify-center gap-2">
        <button type="button" onClick={insertAfterHead} className="rounded-full border border-accent bg-accent/15 px-3 py-1 text-sm font-semibold text-accent">
          Insert after head
        </button>
        <button type="button" onClick={deleteSecond} className="rounded-full border border-border px-3 py-1 text-sm text-muted transition-colors hover:text-ink">
          Delete 2nd node
        </button>
        <button type="button" onClick={traverse} className="rounded-full border border-border px-3 py-1 text-sm text-muted transition-colors hover:text-ink">
          Find last (traverse)
        </button>
        <button type="button" onClick={reset} className="rounded-full border border-border px-3 py-1 text-sm text-muted transition-colors hover:text-ink">
          Reset
        </button>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-0">
        {nodes.map((n, i) => {
          const onPath = traverseTo !== null && i <= traverseTo
          const active = hot === n.id || (traverseTo !== null && i === traverseTo)
          return (
            <div key={n.id} className="flex items-center">
              <div
                className={cn(
                  'flex overflow-hidden rounded-lg border-2 font-mono transition-all',
                  active ? 'border-accent' : onPath ? 'border-accent-2' : 'border-border',
                )}
              >
                <span className={cn('flex h-11 w-11 items-center justify-center text-lg font-bold', active ? 'bg-accent/15 text-accent' : 'bg-surface-2 text-ink')}>
                  {n.v}
                </span>
                <span className="flex h-11 w-7 items-center justify-center border-l-2 border-border bg-surface text-[10px] text-muted">●</span>
              </div>
              {/* pointer arrow */}
              <svg width="40" height="24" viewBox="0 0 40 24" className="mx-0.5">
                <line x1="0" y1="12" x2="30" y2="12" stroke={onPath && i < (traverseTo ?? -1) ? 'var(--color-accent-2)' : 'var(--color-muted)'} strokeWidth="2.5" />
                <path d="M30,6 L40,12 L30,18 Z" fill={onPath && i < (traverseTo ?? -1) ? 'var(--color-accent-2)' : 'var(--color-muted)'} />
              </svg>
            </div>
          )
        })}
        <span className="rounded-lg border-2 border-dashed border-border px-3 py-2.5 font-mono text-sm text-muted">null</span>
      </div>

      <div className="mt-1 flex flex-wrap justify-center gap-0">
        {nodes.map((n, i) => (
          <span key={n.id} className="w-[85px] text-center font-mono text-xs text-muted">{i}</span>
        ))}
      </div>

      <p className="mt-3 text-center text-sm text-muted">{note}</p>
    </div>
  )
}

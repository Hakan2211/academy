import { useState } from 'react'
import { cn } from '#/lib/cn'

// An array stores its values in one contiguous block of memory, each slot
// labelled by an index 0,1,2,… Because the slots are evenly spaced, the computer
// can jump straight to any index by arithmetic — that's O(1) "random access".
// The price: inserting or deleting in the middle forces every later element to
// shift over by one. Click an index to access it; insert/delete to see the shift.

const START = ['A', 'B', 'C', 'D', 'E']

export function ArrayViz() {
  const [cells, setCells] = useState<Array<string>>(START)
  const [accessed, setAccessed] = useState<number | null>(null)
  const [shifted, setShifted] = useState<Set<number>>(new Set())
  const [moves, setMoves] = useState(0)
  const [note, setNote] = useState('Click an index to jump straight to it.')
  const [next, setNext] = useState('F')

  const bump = (s: string) => String.fromCharCode(((s.charCodeAt(0) - 64) % 26) + 65)

  function access(i: number) {
    setShifted(new Set())
    setAccessed(i)
    setMoves(0)
    setNote(`Direct access: jump to slot ${i} in one step — O(1). No scanning needed.`)
  }

  function insertMiddle() {
    const i = Math.floor(cells.length / 2)
    const moved = cells.length - i
    const copy = cells.slice()
    copy.splice(i, 0, next)
    setCells(copy)
    setAccessed(i)
    setShifted(new Set(Array.from({ length: moved }, (_, k) => i + 1 + k)))
    setMoves(moved)
    setNote(`Inserted "${next}" at index ${i}. ${moved} elements had to shift right — O(n).`)
    setNext(bump(next))
  }

  function deleteMiddle() {
    if (cells.length <= 1) return
    const i = Math.floor((cells.length - 1) / 2)
    const moved = cells.length - 1 - i
    const copy = cells.slice()
    copy.splice(i, 1)
    setCells(copy)
    setAccessed(null)
    setShifted(new Set(Array.from({ length: moved }, (_, k) => i + k)))
    setMoves(moved)
    setNote(`Deleted index ${i}. ${moved} elements shifted left to close the gap — O(n).`)
  }

  function reset() {
    setCells(START)
    setAccessed(null)
    setShifted(new Set())
    setMoves(0)
    setNext('F')
    setNote('Click an index to jump straight to it.')
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-wrap justify-center gap-2">
        <button type="button" onClick={insertMiddle} className="rounded-full border border-border px-3 py-1 text-sm text-muted transition-colors hover:text-ink">
          Insert in middle
        </button>
        <button type="button" onClick={deleteMiddle} className="rounded-full border border-border px-3 py-1 text-sm text-muted transition-colors hover:text-ink">
          Delete from middle
        </button>
        <button type="button" onClick={reset} className="rounded-full border border-border px-3 py-1 text-sm text-muted transition-colors hover:text-ink">
          Reset
        </button>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
        {cells.map((v, i) => (
          <div key={i} className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => access(i)}
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-lg border-2 font-mono text-lg font-bold transition-all',
                accessed === i
                  ? 'border-accent bg-accent/15 text-accent'
                  : shifted.has(i)
                    ? 'border-warn bg-warn/10 text-warn'
                    : 'border-border bg-surface-2 text-ink hover:border-accent-2',
              )}
            >
              {v}
            </button>
            <span className={cn('mt-1 font-mono text-xs', accessed === i ? 'text-accent' : 'text-muted')}>{i}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-center gap-4 text-xs">
        <span className="text-muted">elements moved: <span className={cn('font-mono font-bold', moves ? 'text-warn' : 'text-ink')}>{moves}</span></span>
        <span className="text-muted">length: <span className="font-mono font-bold text-ink">{cells.length}</span></span>
      </div>

      <p className="mt-2 text-center text-sm text-muted">{note}</p>
    </div>
  )
}

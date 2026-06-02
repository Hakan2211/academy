import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Stacks and queues are arrays with a rule about *where* you may add and remove.
// A STACK is LIFO — last in, first out — you only touch the top (think a stack of
// plates, or undo history). A QUEUE is FIFO — first in, first out — you add at the
// back and remove from the front (think a checkout line, or a print queue). Same
// items, opposite discipline. Watch which end things enter and leave from.

type Mode = 'stack' | 'queue'

export function StackQueue() {
  const [mode, setMode] = useState<Mode>('stack')
  const [items, setItems] = useState<Array<number>>([1, 2, 3])
  const [counter, setCounter] = useState(4)
  const [last, setLast] = useState('Add and remove items to feel the rule.')

  const isStack = mode === 'stack'

  function switchMode(m: Mode) {
    setMode(m)
    setItems([1, 2, 3])
    setCounter(4)
    setLast(m === 'stack' ? 'Stack — you can only touch the top.' : 'Queue — add at the back, leave from the front.')
  }

  function add() {
    // Stack: push onto the top (end). Queue: enqueue at the back (end).
    setItems([...items, counter])
    setLast(isStack ? `Pushed ${counter} onto the top.` : `Enqueued ${counter} at the back.`)
    setCounter(counter + 1)
  }

  function remove() {
    if (items.length === 0) return
    if (isStack) {
      // pop the top (end)
      const v = items[items.length - 1]
      setItems(items.slice(0, -1))
      setLast(`Popped ${v} — the most recent item (LIFO).`)
    } else {
      // dequeue the front (start)
      const v = items[0]
      setItems(items.slice(1))
      setLast(`Dequeued ${v} — the oldest item (FIFO).`)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex justify-center gap-2">
        {(['stack', 'queue'] as Array<Mode>).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm capitalize transition-colors',
              mode === m ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {m} {m === 'stack' ? '(LIFO)' : '(FIFO)'}
          </button>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-2">
        <button type="button" onClick={add} className="flex items-center gap-1 rounded-lg border border-accent bg-accent/15 px-3 py-1.5 text-sm font-semibold text-accent">
          <Icon name="Plus" size={14} /> {isStack ? 'Push' : 'Enqueue'}
        </button>
        <button type="button" onClick={remove} disabled={items.length === 0} className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:text-ink disabled:opacity-40">
          <Icon name="Minus" size={14} /> {isStack ? 'Pop' : 'Dequeue'}
        </button>
      </div>

      {isStack ? (
        <div className="mt-4 flex flex-col items-center">
          <span className="mb-1 text-xs font-semibold text-accent-2">↑ top — in & out here</span>
          <div className="flex w-40 flex-col-reverse gap-1.5 rounded-lg border-x-2 border-b-2 border-border bg-surface-2 p-2">
            {items.length === 0 && <span className="py-4 text-center text-xs text-muted">empty</span>}
            {items.map((v, i) => (
              <div
                key={v}
                className={cn(
                  'flex h-9 items-center justify-center rounded-md border-2 font-mono font-bold',
                  i === items.length - 1 ? 'border-accent bg-accent/15 text-accent' : 'border-border bg-surface text-ink',
                )}
              >
                {v}
              </div>
            ))}
          </div>
          <span className="mt-1 text-xs text-muted">bottom (oldest, untouchable)</span>
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center">
          <div className="flex w-full max-w-md items-stretch justify-between text-xs font-semibold">
            <span className="text-accent">front — out here →</span>
            <span className="text-accent-2">→ in at back</span>
          </div>
          <div className="mt-1 flex w-full max-w-md gap-1.5 overflow-x-auto rounded-lg border-y-2 border-border bg-surface-2 p-2">
            {items.length === 0 && <span className="py-2 text-center text-xs text-muted">empty</span>}
            {items.map((v, i) => (
              <div
                key={v}
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-md border-2 font-mono font-bold',
                  i === 0 ? 'border-accent bg-accent/15 text-accent' : i === items.length - 1 ? 'border-accent-2 bg-accent-2/10 text-accent-2' : 'border-border bg-surface text-ink',
                )}
              >
                {v}
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="mt-3 text-center text-sm text-muted">{last}</p>
    </div>
  )
}

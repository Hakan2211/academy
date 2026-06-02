import { useState } from 'react'
import { cn } from '#/lib/cn'

// A hash table turns a key into a storage slot by running it through a HASH
// FUNCTION — a quick calculation that spits out a bucket index. Because it jumps
// straight to that bucket, lookups are on average O(1): near-instant, no scanning.
// Two keys can hash to the same bucket (a COLLISION); we handle that by chaining
// a tiny list inside the bucket. This is what powers dictionaries, sets and more.

const BUCKETS = 7
const PRESET = ['cat', 'dog', 'sun', 'sky', 'ant', 'owl', 'fox', 'bee', 'elk']

// Simple, visible string hash: sum char codes, mod number of buckets.
function hash(key: string): { sum: number; index: number } {
  let sum = 0
  for (const ch of key) sum += ch.charCodeAt(0)
  return { sum, index: sum % BUCKETS }
}

export function HashTable() {
  const [table, setTable] = useState<Array<Array<string>>>(() => Array.from({ length: BUCKETS }, () => []))
  const [nextIdx, setNextIdx] = useState(0)
  const [last, setLast] = useState<{ key: string; sum: number; index: number; collision: boolean } | null>(null)
  const [lookup, setLookup] = useState<{ key: string; index: number; found: boolean } | null>(null)

  function add(key: string) {
    const { sum, index } = hash(key)
    if (table[index].includes(key)) return
    const collision = table[index].length > 0
    const copy = table.map((b) => b.slice())
    copy[index].push(key)
    setTable(copy)
    setLast({ key, sum, index, collision })
    setLookup(null)
  }

  function addPreset() {
    add(PRESET[nextIdx % PRESET.length])
    setNextIdx(nextIdx + 1)
  }

  function doLookup() {
    const all = table.flat()
    if (all.length === 0) return
    const key = all[Math.floor(Math.random() * all.length)]
    const { index } = hash(key)
    setLookup({ key, index, found: table[index].includes(key) })
    setLast(null)
  }

  function reset() {
    setTable(Array.from({ length: BUCKETS }, () => []))
    setNextIdx(0)
    setLast(null)
    setLookup(null)
  }

  const highlight = last?.index ?? lookup?.index ?? null

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-wrap justify-center gap-2">
        <button type="button" onClick={addPreset} className="rounded-full border border-accent bg-accent/15 px-3 py-1 text-sm font-semibold text-accent">
          Add a key
        </button>
        <button type="button" onClick={doLookup} className="rounded-full border border-border px-3 py-1 text-sm text-muted transition-colors hover:text-ink">
          Look one up
        </button>
        <button type="button" onClick={reset} className="rounded-full border border-border px-3 py-1 text-sm text-muted transition-colors hover:text-ink">
          Reset
        </button>
      </div>

      {(last || lookup) && (
        <div className="mt-3 rounded-lg border border-border bg-surface-2 p-2 text-center font-mono text-xs text-muted">
          {last && (
            <span>
              hash(<span className="text-accent-2">"{last.key}"</span>) = sum {last.sum} mod {BUCKETS} = bucket <span className="font-bold text-accent">{last.index}</span>
              {last.collision && <span className="text-warn"> — collision! chained.</span>}
            </span>
          )}
          {lookup && (
            <span>
              lookup(<span className="text-accent-2">"{lookup.key}"</span>) → jump to bucket <span className="font-bold text-accent">{lookup.index}</span> →{' '}
              <span className="text-success">found in 1 hop (O(1))</span>
            </span>
          )}
        </div>
      )}

      <div className="mt-3 space-y-1.5">
        {table.map((bucket, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 font-mono text-sm font-bold transition-colors',
                highlight === i ? 'border-accent bg-accent/15 text-accent' : 'border-border bg-surface-2 text-muted',
              )}
            >
              {i}
            </span>
            <div className="flex flex-1 flex-wrap items-center gap-1">
              {bucket.length === 0 && <span className="text-xs text-muted/60">empty</span>}
              {bucket.map((key, j) => (
                <span key={key} className="flex items-center gap-1">
                  {j > 0 && <span className="text-warn">→</span>}
                  <span
                    className={cn(
                      'rounded-md border px-2 py-1 font-mono text-xs',
                      bucket.length > 1 ? 'border-warn bg-warn/10 text-warn' : 'border-accent-2 bg-accent-2/10 text-accent-2',
                    )}
                  >
                    {key}
                  </span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-center text-sm text-muted">
        The hash function sends each key straight to a bucket — so lookups skip the search and run in about <span className="font-mono text-ink">O(1)</span>. Orange chains are collisions.
      </p>
    </div>
  )
}

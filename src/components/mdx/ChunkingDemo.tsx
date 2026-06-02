import { useState } from 'react'
import { cn } from '#/lib/cn'

// Chunking: short-term memory holds ~7 ITEMS, but you get to decide what counts
// as an item. The same 13 letters are either 13 separate things to juggle or a
// handful of meaningful chunks well within capacity. Toggle chunking on and the
// impossible string collapses into something you can hold at a glance.
type Example = {
  key: string
  raw: string
  chunks: Array<{ text: string; meaning: string }>
}

const EXAMPLES: Array<Example> = [
  {
    key: 'acronyms',
    raw: 'FBICIAIBMNASA',
    chunks: [
      { text: 'FBI', meaning: 'the Bureau' },
      { text: 'CIA', meaning: 'the agency' },
      { text: 'IBM', meaning: 'the computer firm' },
      { text: 'NASA', meaning: 'the space agency' },
    ],
  },
  {
    key: 'phone',
    raw: '18002653737',
    chunks: [
      { text: '1', meaning: 'country code' },
      { text: '800', meaning: 'toll-free' },
      { text: '265', meaning: 'prefix' },
      { text: '3737', meaning: 'line' },
    ],
  },
  {
    key: 'date',
    raw: '1492177620010',
    chunks: [
      { text: '1492', meaning: 'Columbus' },
      { text: '1776', meaning: 'independence' },
      { text: '2001', meaning: 'the film' },
      { text: '0', meaning: 'and a zero' },
    ],
  },
]

export function ChunkingDemo() {
  const [exIdx, setExIdx] = useState(0)
  const [chunked, setChunked] = useState(false)
  const ex = EXAMPLES[exIdx]

  const rawCount = ex.raw.length
  const chunkCount = ex.chunks.length

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((e, i) => (
            <button
              key={e.key}
              type="button"
              onClick={() => setExIdx(i)}
              className={cn(
                'rounded-full border px-3 py-1 text-sm capitalize transition-colors',
                exIdx === i ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
              )}
            >
              {e.key}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setChunked((c) => !c)}
          className={cn(
            'rounded-full border px-3 py-1 text-sm transition-colors',
            chunked ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
          )}
        >
          {chunked ? 'Chunked' : 'Raw letters'}
        </button>
      </div>

      <div className="mt-4 flex min-h-[88px] flex-wrap items-center justify-center gap-2 rounded-xl bg-surface-2 p-4">
        {chunked
          ? ex.chunks.map((c, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="rounded-lg border border-accent bg-accent/15 px-2.5 py-1.5 font-mono text-xl font-bold tracking-wider text-accent">
                  {c.text}
                </span>
                <span className="mt-1 text-[10px] text-muted">{c.meaning}</span>
              </div>
            ))
          : ex.raw.split('').map((ch, i) => (
              <span
                key={i}
                className="flex h-9 w-7 items-center justify-center rounded-md border border-border font-mono text-lg text-muted"
              >
                {ch}
              </span>
            ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div
          className={cn(
            'rounded-xl border p-3 text-center transition-colors',
            !chunked ? 'border-warn/50 bg-warn/10' : 'border-border bg-surface-2',
          )}
        >
          <p className="text-2xl font-bold text-ink">{rawCount}</p>
          <p className="text-xs text-muted">items as raw letters</p>
          <p className="mt-1 text-[11px] font-medium text-warn">far past 7 ± 2</p>
        </div>
        <div
          className={cn(
            'rounded-xl border p-3 text-center transition-colors',
            chunked ? 'border-success/50 bg-success/10' : 'border-border bg-surface-2',
          )}
        >
          <p className="text-2xl font-bold text-ink">{chunkCount}</p>
          <p className="text-xs text-muted">items as chunks</p>
          <p className="mt-1 text-[11px] font-medium text-success">easily held at once</p>
        </div>
      </div>

      <p className="mt-3 text-center text-xs leading-relaxed text-muted">
        Short-term memory counts <span className="font-medium text-ink">chunks</span>, not raw symbols. Group the stream into
        meaningful units and {rawCount} hopeless items become just {chunkCount} — comfortably within the magical seven. This is why a
        chess master can glance at a board and recall it: they see a few patterns, not 32 pieces.
      </p>
    </div>
  )
}

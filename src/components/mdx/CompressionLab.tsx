import { useState } from 'react'
import { cn } from '#/lib/cn'

// Most data has repetition, and repetition is wasteful to store literally.
// Run-length encoding (RLE) replaces a run of identical items with one copy plus
// a count: "■■■■■□□□" becomes "5■ 3□". Click cells to change the pattern and watch
// the compressed size react — smooth pictures shrink, noisy ones barely do.

const COLORS = ['#4F8CFF', '#FF6B6B', '#FFC83D', '#2ECC71']

const PRESETS: Record<string, Array<number>> = {
  'Smooth': [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  'Noisy': [0, 1, 2, 0, 3, 1, 2, 3, 0, 1, 3, 2, 1, 0, 2, 3, 1, 2, 0, 3, 2, 1, 0, 3],
}

export function CompressionLab() {
  const [cells, setCells] = useState<Array<number>>(PRESETS['Smooth'])

  const cycle = (i: number) => setCells((c) => c.map((v, j) => (j === i ? (v + 1) % COLORS.length : v)))

  // Build RLE runs.
  const runs: Array<{ v: number; n: number }> = []
  for (const v of cells) {
    const last = runs[runs.length - 1]
    if (last && last.v === v) last.n++
    else runs.push({ v, n: 1 })
  }

  const rawUnits = cells.length // one symbol per cell
  const rleUnits = runs.length * 2 // count + symbol per run
  const ratio = (rawUnits / rleUnits).toFixed(2)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex gap-2">
        {Object.keys(PRESETS).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setCells(PRESETS[k])}
            className="rounded-full border border-border px-3 py-1 text-xs text-muted hover:text-ink"
          >
            {k}
          </button>
        ))}
        <span className="self-center text-xs text-muted">· click any cell to change it</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-0.5">
        {cells.map((v, i) => (
          <button key={i} type="button" onClick={() => cycle(i)} className="h-7 w-7 rounded" style={{ background: COLORS[v] }} aria-label={`cell ${i}`} />
        ))}
      </div>

      <div className="mt-4 text-xs text-muted">Encoded as runs:</div>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {runs.map((r, i) => (
          <span key={i} className="flex items-center gap-1 rounded border border-border bg-surface-2 px-2 py-1 font-mono text-sm">
            <span className="font-bold text-ink">{r.n}×</span>
            <span className="h-4 w-4 rounded" style={{ background: COLORS[r.v] }} />
          </span>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-lg border border-border bg-surface-2 p-2">
          <div className="text-xs text-muted">raw</div>
          <div className="font-mono font-bold text-ink">{rawUnits} units</div>
        </div>
        <div className="rounded-lg border border-border bg-surface-2 p-2">
          <div className="text-xs text-muted">compressed</div>
          <div className="font-mono font-bold text-ink">{rleUnits} units</div>
        </div>
        <div className={cn('rounded-lg border p-2', Number(ratio) > 1 ? 'border-success/40 bg-success/10' : 'border-warn/40 bg-warn/10')}>
          <div className="text-xs text-muted">ratio</div>
          <div className="font-mono font-bold text-accent-2">{ratio}×</div>
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-muted">
        RLE is <span className="text-ink">lossless</span> — you can rebuild the original exactly. It only helps when data repeats.
      </p>
    </div>
  )
}

import { useState } from 'react'
import { cn } from '#/lib/cn'
import { formatBytes } from '#/lib/cs'

// An image is a grid of pixels, and each pixel is just a number (or three) saying
// what colour it is. Paint the grid and watch the storage cost: in 1-bit mode each
// pixel is a single on/off bit; in colour mode each pixel needs more bits to name
// its colour from a palette.

type Mode = 'mono' | 'color'

const SIZE = 10
const MONO = ['#0a0f1f', '#e8ecf2'] // off / on
const PALETTE = ['#0a0f1f', '#FF6B6B', '#FFC83D', '#2ECC71', '#00CEC9', '#4F8CFF', '#9B59B6', '#e8ecf2']

export function PixelGrid() {
  const [mode, setMode] = useState<Mode>('color')
  const [pen, setPen] = useState(1)
  const [cells, setCells] = useState<Array<number>>(() => Array(SIZE * SIZE).fill(0))

  const colors = mode === 'mono' ? MONO : PALETTE
  const safePen = pen < colors.length ? pen : 1
  const paint = (i: number) => setCells((c) => c.map((v, j) => (j === i ? safePen : v)))
  const switchMode = (m: Mode) => {
    setMode(m)
    setPen(1)
    setCells((c) => c.map((v) => (m === 'mono' ? (v ? 1 : 0) : v)))
  }

  const bitsPerPixel = mode === 'mono' ? 1 : 3 // 8-colour palette = 3 bits
  const totalBits = SIZE * SIZE * bitsPerPixel

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {(['mono', 'color'] as Array<Mode>).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              className={cn(
                'rounded-full border px-3 py-1 text-sm transition-colors',
                mode === m ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
              )}
            >
              {m === 'mono' ? '1-bit (B/W)' : 'colour'}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {colors.map((c, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPen(i)}
              className={cn('h-6 w-6 rounded border-2', safePen === i ? 'border-accent' : 'border-border')}
              style={{ background: c }}
              aria-label={`colour ${i}`}
            />
          ))}
        </div>
      </div>

      <div
        className="mx-auto mt-3 grid w-fit gap-0.5 rounded-lg bg-border p-1"
        style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}
      >
        {cells.map((v, i) => (
          <button
            key={i}
            type="button"
            onClick={() => paint(i)}
            className="h-6 w-6"
            style={{ background: colors[v] ?? colors[0] }}
            aria-label={`pixel ${i}`}
          />
        ))}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-lg border border-border bg-surface-2 p-2">
          <div className="text-xs text-muted">pixels</div>
          <div className="font-mono font-bold text-ink">{SIZE * SIZE}</div>
        </div>
        <div className="rounded-lg border border-border bg-surface-2 p-2">
          <div className="text-xs text-muted">bits / pixel</div>
          <div className="font-mono font-bold text-ink">{bitsPerPixel}</div>
        </div>
        <div className="rounded-lg border border-border bg-surface-2 p-2">
          <div className="text-xs text-muted">total size</div>
          <div className="font-mono font-bold text-accent-2">{formatBytes(Math.ceil(totalBits / 8))}</div>
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-muted">
        More colours need more bits per pixel — which is why richer images take more storage.
      </p>
    </div>
  )
}

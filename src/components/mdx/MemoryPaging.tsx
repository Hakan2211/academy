import { useState } from 'react'
import { cn } from '#/lib/cn'

// Virtual memory is one of the OS's grandest illusions. Each program sees a big,
// simple, private run of "virtual pages." A page table maps those pages to real
// frames in RAM — or notes that a page is parked on disk. Click a virtual page
// to follow the mapping; click a page that's on disk to trigger a PAGE FAULT and
// watch the OS swap it into RAM.

type Loc = { frame: number } | { disk: true }

// Six virtual pages. Frame indices point into RAM (4 frames). Some start on disk.
const INITIAL: Array<Loc> = [
  { frame: 2 },
  { disk: true },
  { frame: 0 },
  { frame: 3 },
  { disk: true },
  { frame: 1 },
]

const FRAMES = 4
const COLORS = ['#4F8CFF', '#2ECC71', '#FFC83D', '#FF6B6B', '#00CEC9', '#9B59B6']

export function MemoryPaging() {
  const [table, setTable] = useState<Array<Loc>>(INITIAL)
  const [sel, setSel] = useState<number | null>(null)
  const [faulted, setFaulted] = useState<number | null>(null)

  // Which RAM frames are free right now?
  const freeFrames = () => {
    const used = new Set(table.filter((l): l is { frame: number } => 'frame' in l).map((l) => l.frame))
    const free: Array<number> = []
    for (let f = 0; f < FRAMES; f++) if (!used.has(f)) free.push(f)
    return free
  }

  function clickPage(i: number) {
    setSel(i)
    const loc = table[i]
    if ('disk' in loc) {
      // PAGE FAULT: bring the page into a free frame (or evict one if full).
      const free = freeFrames()
      let target: number
      const next = [...table]
      if (free.length > 0) {
        target = free[0]
      } else {
        // evict the first page currently in RAM, sending it to disk
        const victim = next.findIndex((l) => 'frame' in l)
        target = (next[victim] as { frame: number }).frame
        next[victim] = { disk: true }
      }
      next[i] = { frame: target }
      setTable(next)
      setFaulted(i)
    } else {
      setFaulted(null)
    }
  }

  function reset() {
    setTable(INITIAL)
    setSel(null)
    setFaulted(null)
  }

  const selLoc = sel !== null ? table[sel] : null

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {/* Virtual pages */}
        <div>
          <div className="mb-1 text-center text-[10px] uppercase tracking-wide text-muted">
            Program’s virtual pages
          </div>
          <div className="space-y-1.5">
            {table.map((loc, i) => {
              const onDisk = 'disk' in loc
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => clickPage(i)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg border-2 px-2 py-1.5 text-left transition-colors',
                    sel === i ? 'border-accent bg-accent/10' : 'border-border bg-surface-2 hover:border-accent/40',
                  )}
                >
                  <span className="font-mono text-xs text-ink">page {i}</span>
                  <span
                    className={cn('text-[10px] font-semibold', onDisk ? 'text-warn' : 'text-success')}
                    style={!onDisk ? { color: COLORS[i] } : undefined}
                  >
                    {onDisk ? 'on disk' : `frame ${(loc as { frame: number }).frame}`}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Physical RAM frames */}
        <div>
          <div className="mb-1 text-center text-[10px] uppercase tracking-wide text-muted">Physical RAM</div>
          <div className="space-y-1.5">
            {Array.from({ length: FRAMES }).map((_, f) => {
              const owner = table.findIndex((l) => 'frame' in l && l.frame === f)
              const occupied = owner !== -1
              return (
                <div
                  key={f}
                  className={cn(
                    'flex h-[34px] items-center justify-between rounded-lg border-2 px-2',
                    sel !== null && occupied && owner === sel ? 'border-accent' : 'border-border',
                  )}
                  style={occupied ? { background: `${COLORS[owner]}26` } : { background: 'var(--color-surface-2)' }}
                >
                  <span className="font-mono text-[10px] text-muted">frame {f}</span>
                  <span className="font-mono text-xs" style={occupied ? { color: COLORS[owner] } : { color: 'var(--color-muted)' }}>
                    {occupied ? `page ${owner}` : 'free'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Disk */}
        <div>
          <div className="mb-1 text-center text-[10px] uppercase tracking-wide text-muted">Disk (swap)</div>
          <div className="space-y-1.5">
            {table
              .map((loc, i) => ({ loc, i }))
              .filter(({ loc }) => 'disk' in loc)
              .map(({ i }) => (
                <div
                  key={i}
                  className={cn(
                    'flex h-[34px] items-center justify-center rounded-lg border-2 border-dashed px-2 font-mono text-xs',
                    sel === i ? 'border-warn text-warn' : 'border-border text-muted',
                  )}
                >
                  page {i}
                </div>
              ))}
            {table.every((l) => 'frame' in l) && (
              <div className="flex h-[34px] items-center justify-center rounded-lg border-2 border-dashed border-border px-2 text-xs text-muted">
                empty
              </div>
            )}
          </div>
        </div>
      </div>

      {/* status line */}
      <div className="mt-3 rounded-xl border border-border bg-surface-2 p-3 text-center text-sm">
        {sel === null ? (
          <span className="text-muted">Click a virtual page to follow its mapping through the page table.</span>
        ) : faulted === sel ? (
          <span className="text-warn">
            <span className="font-semibold">Page fault!</span> Page {sel} wasn’t in RAM — the OS paused the program, loaded
            it from disk into a free frame, and updated the page table. Now it’s usable.
          </span>
        ) : selLoc && 'frame' in selLoc ? (
          <span className="text-ink/90">
            Page <span className="font-mono">{sel}</span> is mapped to physical{' '}
            <span className="font-mono" style={{ color: COLORS[sel] }}>frame {selLoc.frame}</span> — a fast, direct hit.
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex justify-center">
        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-border px-4 py-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          Reset
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        Each program sees a large, simple, private address space. Real RAM is smaller and shared — the{' '}
        <span className="text-ink">page table</span> keeps up the illusion of abundant private memory.
      </p>
    </div>
  )
}

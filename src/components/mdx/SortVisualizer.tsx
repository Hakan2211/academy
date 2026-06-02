import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

// THE FLAGSHIP. Sort a row of bars and watch four classic algorithms work.
// Each algorithm is run once, ahead of time, recording a list of "frames": the
// array state plus which bars are being compared, swapped, or finalised, and a
// running comparison/swap count. Stepping (or Play, via requestAnimationFrame)
// just advances a frame index — so the algorithms stay 100% correct while the
// view animates smoothly. Bubble/Insertion/Selection are quadratic; Merge is
// the clever O(n log n) one — feel the difference.

type Algo = 'bubble' | 'insertion' | 'selection' | 'merge'
type Frame = { arr: Array<number>; compare: Array<number>; swap: Array<number>; sorted: Array<number>; comps: number; swaps: number }

const SIZE = 12
const MAXH = 100

function randomArr(): Array<number> {
  return Array.from({ length: SIZE }, () => 8 + Math.floor(Math.random() * (MAXH - 8)))
}

function build(algo: Algo, input: Array<number>): Array<Frame> {
  const a = [...input]
  const frames: Array<Frame> = []
  let comps = 0
  let swaps = 0
  const snap = (compare: Array<number>, swap: Array<number>, sorted: Array<number>) =>
    frames.push({ arr: [...a], compare, swap, sorted: [...sorted], comps, swaps })

  snap([], [], [])

  if (algo === 'bubble') {
    const sorted: Array<number> = []
    for (let i = 0; i < a.length - 1; i++) {
      for (let j = 0; j < a.length - 1 - i; j++) {
        comps++; snap([j, j + 1], [], sorted)
        if (a[j] > a[j + 1]) {
          ;[a[j], a[j + 1]] = [a[j + 1], a[j]]; swaps++; snap([], [j, j + 1], sorted)
        }
      }
      sorted.unshift(a.length - 1 - i)
    }
    sorted.unshift(0)
    snap([], [], sorted)
  } else if (algo === 'selection') {
    const sorted: Array<number> = []
    for (let i = 0; i < a.length - 1; i++) {
      let min = i
      for (let j = i + 1; j < a.length; j++) {
        comps++; snap([min, j], [], sorted)
        if (a[j] < a[min]) min = j
      }
      if (min !== i) { ;[a[i], a[min]] = [a[min], a[i]]; swaps++; snap([], [i, min], sorted) }
      sorted.push(i)
    }
    sorted.push(a.length - 1)
    snap([], [], sorted)
  } else if (algo === 'insertion') {
    const sorted = [0]
    for (let i = 1; i < a.length; i++) {
      let j = i
      while (j > 0) {
        comps++; snap([j, j - 1], [], sorted)
        if (a[j] < a[j - 1]) { ;[a[j], a[j - 1]] = [a[j - 1], a[j]]; swaps++; snap([], [j, j - 1], sorted); j-- }
        else break
      }
    }
    snap([], [], a.map((_, k) => k))
  } else {
    // merge sort (top-down, writing back into a)
    const mergeSort = (lo: number, hi: number) => {
      if (hi - lo < 1) return
      const mid = (lo + hi) >> 1
      mergeSort(lo, mid)
      mergeSort(mid + 1, hi)
      const tmp: Array<number> = []
      let i = lo, j = mid + 1
      while (i <= mid && j <= hi) {
        comps++; snap([i, j], [], [])
        if (a[i] <= a[j]) tmp.push(a[i++])
        else tmp.push(a[j++])
      }
      while (i <= mid) tmp.push(a[i++])
      while (j <= hi) tmp.push(a[j++])
      for (let k = 0; k < tmp.length; k++) { a[lo + k] = tmp[k]; swaps++ }
      snap([], Array.from({ length: tmp.length }, (_, k) => lo + k), [])
    }
    mergeSort(0, a.length - 1)
    snap([], [], a.map((_, k) => k))
  }
  return frames
}

export function SortVisualizer() {
  const [algo, setAlgo] = useState<Algo>('bubble')
  const [input, setInput] = useState<Array<number>>(randomArr)
  const [idx, setIdx] = useState(0)
  const [playing, setPlaying] = useState(false)

  const frames = useMemo(() => build(algo, input), [algo, input])
  const frame = frames[Math.min(idx, frames.length - 1)]
  const atEnd = idx >= frames.length - 1

  // rAF auto-advance for Play.
  const idxRef = useRef(idx)
  idxRef.current = idx
  useEffect(() => {
    if (!playing) return
    let raf = 0
    let last = 0
    const loop = (now: number) => {
      if (!last) last = now
      if (now - last >= 140) {
        last = now
        if (idxRef.current >= frames.length - 1) { setPlaying(false); return }
        setIdx((i) => i + 1)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [playing, frames.length])

  function shuffle() { setPlaying(false); setIdx(0); setInput(randomArr()) }
  function pick(a: Algo) { setPlaying(false); setIdx(0); setAlgo(a) }
  function step() { setPlaying(false); if (!atEnd) setIdx((i) => i + 1) }

  const W = 320, H = 120, gap = 4
  const bw = (W - gap * (SIZE - 1)) / SIZE

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-wrap justify-center gap-2">
        {(['bubble', 'insertion', 'selection', 'merge'] as Array<Algo>).map((a) => (
          <button key={a} type="button" onClick={() => pick(a)}
            className={cn('rounded-full border px-3 py-1 text-sm capitalize transition-colors',
              algo === a ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}>
            {a}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H + 8}`} className="mt-4 w-full">
        {frame.arr.map((v, i) => {
          const isSorted = frame.sorted.includes(i)
          const isSwap = frame.swap.includes(i)
          const isCmp = frame.compare.includes(i)
          const fill = isSwap ? 'var(--color-accent)'
            : isCmp ? 'var(--color-accent-2)'
              : isSorted ? '#2ECC71'
                : 'var(--color-surface-2)'
          const h = (v / MAXH) * H
          return (
            <g key={i}>
              <rect x={i * (bw + gap)} y={H - h} width={bw} height={h} rx="2"
                fill={fill} stroke="var(--color-border)" strokeWidth="1" />
              <text x={i * (bw + gap) + bw / 2} y={H + 6} textAnchor="middle" fontSize="6" fill="var(--color-muted)">{v}</text>
            </g>
          )
        })}
      </svg>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: 'var(--color-accent-2)' }} /> comparing</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: 'var(--color-accent)' }} /> swapping</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: '#2ECC71' }} /> sorted</span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg border border-border bg-surface-2 px-2 py-2">
          <div className="text-xs text-muted">comparisons</div>
          <div className="font-mono text-lg font-bold text-accent-2">{frame.comps}</div>
        </div>
        <div className="rounded-lg border border-border bg-surface-2 px-2 py-2">
          <div className="text-xs text-muted">swaps / writes</div>
          <div className="font-mono text-lg font-bold text-accent">{frame.swaps}</div>
        </div>
        <div className="rounded-lg border border-border bg-surface-2 px-2 py-2">
          <div className="text-xs text-muted">progress</div>
          <div className="font-mono text-lg font-bold text-ink">{Math.round((idx / (frames.length - 1)) * 100)}%</div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <button type="button" onClick={shuffle}
          className="rounded-lg border border-border px-4 py-1.5 text-sm text-muted hover:text-ink">Shuffle</button>
        <button type="button" onClick={step} disabled={atEnd}
          className="rounded-lg border border-border px-4 py-1.5 text-sm text-ink hover:bg-surface-2 disabled:opacity-40">Step</button>
        <button type="button" onClick={() => { if (atEnd) { setIdx(0); setPlaying(true) } else setPlaying((p) => !p) }}
          className="rounded-lg border border-accent bg-accent/15 px-5 py-1.5 text-sm font-semibold text-accent">
          {playing ? 'Pause' : atEnd ? 'Replay' : 'Play'}
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        {algo === 'merge'
          ? 'Merge sort divides and conquers: O(n log n). Notice how few comparisons it needs versus the others.'
          : 'Bubble, insertion and selection are simple but quadratic — O(n²). Their counts climb fast.'}
      </p>
    </div>
  )
}

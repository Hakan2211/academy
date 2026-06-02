import { useMemo, useState } from 'react'
import { cn } from '#/lib/cn'

// One CPU, several processes that all "want to run now." The OS scheduler slices
// time and decides who runs when, building the illusion that everything runs at
// once. Switch the algorithm and watch the Gantt timeline — and the average wait
// time — change. Fairness, responsiveness and throughput pull in different ways.

type Algo = 'fcfs' | 'rr' | 'sjf'

type Proc = { id: string; arrival: number; burst: number; color: string }

// Three jobs that all arrive together, so the scheduler's ordering choices —
// not arrival times — drive the difference in average wait between algorithms.
const PROCS: Array<Proc> = [
  { id: 'A', arrival: 0, burst: 7, color: '#4F8CFF' },
  { id: 'B', arrival: 0, burst: 3, color: '#2ECC71' },
  { id: 'C', arrival: 0, burst: 2, color: '#FFC83D' },
]

const QUANTUM = 2 // round-robin time slice

type Slice = { id: string; start: number; len: number; color: string }

const ALGO_LABEL: Record<Algo, string> = {
  fcfs: 'First come, first served',
  rr: 'Round robin',
  sjf: 'Shortest job first',
}

const ALGO_BLURB: Record<Algo, string> = {
  fcfs: 'Runs each job to completion in arrival order. Simple and fair-by-queue, but a long early job makes everyone behind it wait.',
  rr: `Gives each job a fixed slice (${QUANTUM} units) then rotates. Feels responsive — every job makes progress — at the cost of many context switches.`,
  sjf: 'Always runs the shortest ready job next. Minimises average waiting time, but a long job can be starved by a stream of short ones.',
}

// Build the run-order as a list of time slices for the chosen algorithm.
function schedule(algo: Algo): Array<Slice> {
  const left: Record<string, number> = {}
  for (const p of PROCS) left[p.id] = p.burst
  const slices: Array<Slice> = []
  let t = 0
  const total = PROCS.reduce<number>((s, p) => s + p.burst, 0)

  const ready = (now: number) => PROCS.filter((p) => p.arrival <= now && left[p.id] > 0)

  if (algo === 'fcfs') {
    for (const p of [...PROCS].sort((a, b) => a.arrival - b.arrival)) {
      if (t < p.arrival) t = p.arrival
      slices.push({ id: p.id, start: t, len: p.burst, color: p.color })
      t += p.burst
      left[p.id] = 0
    }
  } else if (algo === 'sjf') {
    let doneN = 0
    while (doneN < PROCS.length) {
      const r = ready(t).sort((a, b) => left[a.id] - left[b.id])
      if (r.length === 0) { t++; continue }
      const p = r[0]
      slices.push({ id: p.id, start: t, len: left[p.id], color: p.color })
      t += left[p.id]
      left[p.id] = 0
      doneN++
    }
  } else {
    // round robin: rotate through arrivals, QUANTUM at a time
    const queue: Array<string> = []
    let arrived = 0
    const byArrival = [...PROCS].sort((a, b) => a.arrival - b.arrival)
    const enqueueArrivals = (now: number) => {
      while (arrived < byArrival.length && byArrival[arrived].arrival <= now) {
        queue.push(byArrival[arrived].id)
        arrived++
      }
    }
    enqueueArrivals(t)
    while (slices.reduce<number>((s, sl) => s + sl.len, 0) < total) {
      if (queue.length === 0) { t++; enqueueArrivals(t); continue }
      const id = queue.shift() as string
      const p = PROCS.find((x) => x.id === id) as Proc
      const run = Math.min(QUANTUM, left[id])
      slices.push({ id, start: t, len: run, color: p.color })
      t += run
      left[id] -= run
      enqueueArrivals(t)
      if (left[id] > 0) queue.push(id)
    }
  }
  return slices
}

// Average waiting time = (completion − arrival − burst) averaged over processes.
function avgWait(slices: Array<Slice>): number {
  const finish: Record<string, number> = {}
  for (const s of slices) finish[s.id] = s.start + s.len
  const total = PROCS.reduce<number>((sum, p) => sum + (finish[p.id] - p.arrival - p.burst), 0)
  return total / PROCS.length
}

export function Scheduler() {
  const [algo, setAlgo] = useState<Algo>('fcfs')
  const slices = useMemo(() => schedule(algo), [algo])
  const wait = useMemo(() => avgWait(slices), [slices])
  const endTime = slices.reduce<number>((m, s) => Math.max(m, s.start + s.len), 0)
  const unit = 320 / Math.max(endTime, 1)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-wrap justify-center gap-2">
        {(['fcfs', 'rr', 'sjf'] as Array<Algo>).map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setAlgo(a)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              algo === a ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {ALGO_LABEL[a]}
          </button>
        ))}
      </div>

      {/* process key with arrival/burst */}
      <div className="mt-3 flex flex-wrap justify-center gap-3 text-xs">
        {PROCS.map((p) => (
          <span key={p.id} className="inline-flex items-center gap-1.5 text-muted">
            <span className="inline-block h-3 w-3 rounded-sm" style={{ background: p.color }} />
            <span className="font-mono text-ink">{p.id}</span>
            <span>arrive {p.arrival}, burst {p.burst}</span>
          </span>
        ))}
      </div>

      {/* Gantt chart */}
      <svg viewBox="0 0 360 96" className="mt-3 w-full">
        {slices.map((s, i) => {
          const x = 20 + s.start * unit
          const w = s.len * unit
          return (
            <g key={i}>
              <rect x={x} y={20} width={Math.max(w - 1, 1)} height="38" rx="4" fill={s.color} opacity={0.85} />
              <text x={x + w / 2} y={43} textAnchor="middle" fontSize="13" fontWeight="700" fill="#0a0f1f">{s.id}</text>
            </g>
          )
        })}
        {/* time axis */}
        {Array.from({ length: endTime + 1 }).map((_, t) => (
          <g key={t}>
            <line x1={20 + t * unit} y1={58} x2={20 + t * unit} y2={64} stroke="var(--color-border)" strokeWidth="1" />
            <text x={20 + t * unit} y={78} textAnchor="middle" fontSize="9" fill="var(--color-muted)">{t}</text>
          </g>
        ))}
      </svg>

      <p className="mt-1 text-center text-sm text-muted">{ALGO_BLURB[algo]}</p>

      <div className="mt-3 flex items-center justify-center gap-2 text-sm">
        <span className="text-muted">Average wait time:</span>
        <span className="rounded-md border border-accent bg-accent/15 px-2 py-0.5 font-mono font-bold text-accent">
          {wait.toFixed(2)} units
        </span>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        Slicing one CPU between jobs fast enough creates the <span className="text-ink">illusion</span> that all of them run
        at once. Different algorithms trade off fairness, responsiveness and average wait.
      </p>
    </div>
  )
}

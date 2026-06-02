import { useState } from 'react'
import { cn } from '#/lib/cn'

// An algorithm is a precise, ordered list of steps. A FLOWCHART is one way to
// draw it: rounded boxes start/stop, rectangles do work, diamonds ask yes/no
// questions. Here we trace "find the largest number in a list" — stepping the
// highlight from node to node exactly as the logic dictates, while a readout
// shows the variables changing. Same list every time, same answer: deterministic.

const LIST = [4, 9, 2, 7, 5]

// Node geometry. shape: 'term' (rounded), 'proc' (rectangle), 'dec' (diamond).
type Shape = 'term' | 'proc' | 'dec'
type Node = { id: string; shape: Shape; x: number; y: number; w: number; h: number; label: string }

const NODES: Array<Node> = [
  { id: 'start', shape: 'term', x: 150, y: 12, w: 110, h: 30, label: 'Start' },
  { id: 'init', shape: 'proc', x: 130, y: 58, w: 150, h: 34, label: 'best ← list[0]; i ← 1' },
  { id: 'cond', shape: 'dec', x: 135, y: 104, w: 140, h: 56, label: 'i < length?' },
  { id: 'cmp', shape: 'dec', x: 135, y: 172, w: 140, h: 56, label: 'list[i] > best?' },
  { id: 'upd', shape: 'proc', x: 318, y: 182, w: 120, h: 34, label: 'best ← list[i]' },
  { id: 'inc', shape: 'proc', x: 145, y: 240, w: 120, h: 34, label: 'i ← i + 1' },
  { id: 'end', shape: 'term', x: 150, y: 290, w: 130, h: 30, label: 'Return best' },
]

const N = (id: string) => NODES.find((n) => n.id === id)!

export function AlgorithmFlow() {
  const [active, setActive] = useState('start')
  const [best, setBest] = useState<number | null>(null)
  const [i, setI] = useState<number | null>(null)
  const [done, setDone] = useState(false)

  function reset() {
    setActive('start')
    setBest(null)
    setI(null)
    setDone(false)
  }

  function step() {
    if (done) return
    switch (active) {
      case 'start':
        setActive('init')
        break
      case 'init':
        setBest(LIST[0])
        setI(1)
        setActive('cond')
        break
      case 'cond':
        setActive((i ?? 0) < LIST.length ? 'cmp' : 'end')
        break
      case 'cmp':
        setActive(LIST[i!] > best! ? 'upd' : 'inc')
        break
      case 'upd':
        setBest(LIST[i!])
        setActive('inc')
        break
      case 'inc':
        setI((i ?? 0) + 1)
        setActive('cond')
        break
      case 'end':
        setDone(true)
        break
    }
  }

  const cur = N(active)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <svg viewBox="0 0 470 332" className="w-full">
          {/* edges */}
          {[
            ['start', 'init'], ['init', 'cond'], ['cond', 'cmp'],
            ['cmp', 'inc'], ['upd', 'inc'], ['inc', 'cond'],
          ].map(([a, b]) => {
            const A = N(a), B = N(b)
            return (
              <line key={a + b} x1={A.x + A.w / 2} y1={A.y + A.h} x2={B.x + B.w / 2} y2={B.y}
                stroke="var(--color-border)" strokeWidth="1.5" markerEnd="url(#af-arrow)" />
            )
          })}
          {/* cond -> end (No, branch right then down) */}
          <path d={`M${N('cond').x + N('cond').w} ${N('cond').y + 28} H300 V${N('end').y + 8} H${N('end').x + N('end').w}`}
            fill="none" stroke="var(--color-border)" strokeWidth="1.5" markerEnd="url(#af-arrow)" />
          {/* cmp -> upd (Yes, right) */}
          <line x1={N('cmp').x + N('cmp').w} y1={N('cmp').y + 28} x2={N('upd').x} y2={N('upd').y + 17}
            stroke="var(--color-border)" strokeWidth="1.5" markerEnd="url(#af-arrow)" />

          <defs>
            <marker id="af-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="var(--color-muted)" />
            </marker>
          </defs>

          {/* branch labels */}
          <text x="270" y={N('cond').y + 22} fontSize="9" fill="var(--color-muted)">No</text>
          <text x={N('cond').x + 64} y={N('cmp').y - 4} fontSize="9" fill="var(--color-muted)">Yes</text>
          <text x={N('cmp').x + N('cmp').w + 6} y={N('cmp').y + 22} fontSize="9" fill="var(--color-muted)">Yes</text>
          <text x={N('cmp').x + 64} y={N('inc').y - 4} fontSize="9" fill="var(--color-muted)">No</text>

          {/* nodes */}
          {NODES.map((n) => {
            const on = n.id === active
            const stroke = on ? 'var(--color-accent)' : 'var(--color-border)'
            const fill = on ? 'var(--color-accent)' : 'var(--color-surface-2)'
            const txt = on ? '#0a0f1f' : 'var(--color-ink)'
            const cx = n.x + n.w / 2
            const cy = n.y + n.h / 2
            return (
              <g key={n.id}>
                {n.shape === 'term' && (
                  <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={n.h / 2} fill={fill} stroke={stroke} strokeWidth="2" />
                )}
                {n.shape === 'proc' && (
                  <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="4" fill={fill} stroke={stroke} strokeWidth="2" />
                )}
                {n.shape === 'dec' && (
                  <polygon points={`${cx},${n.y} ${n.x + n.w},${cy} ${cx},${n.y + n.h} ${n.x},${cy}`}
                    fill={fill} stroke={stroke} strokeWidth="2" />
                )}
                <text x={cx} y={cy + 3.5} textAnchor="middle" fontSize="10" fontWeight="600"
                  fill={txt} fontFamily="ui-monospace, monospace">{n.label}</text>
              </g>
            )
          })}
        </svg>

        <div className="flex min-w-[150px] flex-col gap-3">
          <div className="rounded-xl border border-border bg-surface-2 p-3">
            <div className="mb-2 text-xs font-mono uppercase tracking-wide text-accent">List</div>
            <div className="flex gap-1">
              {LIST.map((v, idx) => (
                <span key={idx} className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-md border font-mono text-xs',
                  idx === i ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted',
                )}>{v}</span>
              ))}
            </div>
            <dl className="mt-3 space-y-1 font-mono text-xs">
              <div className="flex justify-between"><dt className="text-muted">best</dt><dd className="text-ink">{best ?? '—'}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">i</dt><dd className="text-ink">{i ?? '—'}</dd></div>
            </dl>
            {done && <div className="mt-2 rounded-md bg-accent/15 px-2 py-1 text-center text-xs font-bold text-accent">Answer: {best}</div>}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={step} disabled={done}
              className="flex-1 rounded-lg border border-accent bg-accent/15 px-3 py-1.5 text-sm font-semibold text-accent disabled:opacity-40">
              {active === 'end' && !done ? 'Finish' : 'Step'}
            </button>
            <button type="button" onClick={reset}
              className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted hover:text-ink">↺</button>
          </div>
          <p className="text-xs text-muted">
            The highlight follows the exact logic. Diamonds branch <span className="text-ink">yes/no</span>; rectangles do work. Same steps every run.
          </p>
        </div>
      </div>
      <p className="mt-1 text-center text-xs text-muted">
        Current step: <span className="font-mono text-ink">{cur.label}</span>
      </p>
    </div>
  )
}

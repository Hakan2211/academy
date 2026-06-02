import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

// The universal model of a computer: it takes INPUT, PROCESSES it, produces
// OUTPUT, and can STORE data for later. Every device — phone, laptop, games
// console — is just this loop running billions of times a second. Pick a task
// and watch the same four parts do the work.

type Scenario = {
  key: string
  label: string
  input: string
  process: string
  output: string
  store: string
}

const SCENARIOS: Array<Scenario> = [
  {
    key: 'type',
    label: 'Type a letter',
    input: 'Key "A" pressed',
    process: 'Look up the key code',
    output: '"A" drawn on screen',
    store: 'Saved in the document',
  },
  {
    key: 'add',
    label: 'Add two numbers',
    input: '7 and 5 entered',
    process: 'CPU adds: 7 + 5',
    output: '12 shown',
    store: 'Result kept in memory',
  },
  {
    key: 'photo',
    label: 'Take a photo',
    input: 'Camera sensor light',
    process: 'Encode the pixels',
    output: 'Image on display',
    store: 'Photo file written',
  },
]

// Path the data token travels: Input -> CPU -> Output, with a drop to Storage.
const FLOW = [
  { x: 96, y: 70 },
  { x: 150, y: 70 },
  { x: 210, y: 70 },
  { x: 264, y: 70 },
]

export function ComputerModel() {
  const [sc, setSc] = useState(0)
  const tokenRefs = useRef<Array<SVGCircleElement | null>>([])

  useEffect(() => {
    let raf = 0
    let start = 0
    const N = 3
    const loop = (now: number) => {
      if (!start) start = now
      const t = (now - start) / 1000
      for (let i = 0; i < N; i++) {
        const p = ((t * 0.5 + i / N) % 1) * (FLOW.length - 1)
        const idx = Math.floor(p)
        const f = p - idx
        const a = FLOW[idx]
        const b = FLOW[Math.min(idx + 1, FLOW.length - 1)]
        const el = tokenRefs.current[i]
        if (el) {
          el.setAttribute('cx', (a.x + (b.x - a.x) * f).toFixed(1))
          el.setAttribute('cy', (a.y + (b.y - a.y) * f).toFixed(1))
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const s = SCENARIOS[sc]
  const box = (x: number, y: number, w: number, color: string, title: string, sub: string) => (
    <g>
      <rect x={x} y={y} width={w} height="40" rx="8" fill="var(--color-surface-2)" stroke={color} strokeWidth="2" />
      <text x={x + w / 2} y={y + 17} textAnchor="middle" fontSize="11" fontWeight="700" fill={color}>{title}</text>
      <text x={x + w / 2} y={y + 31} textAnchor="middle" fontSize="8.5" fill="var(--color-muted)">{sub}</text>
    </g>
  )

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        {SCENARIOS.map((scn, i) => (
          <button
            key={scn.key}
            type="button"
            onClick={() => setSc(i)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              sc === i ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {scn.label}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 360 200" className="w-full">
        {/* connecting arrows */}
        <defs>
          <marker id="cm-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--color-border)" />
          </marker>
        </defs>
        <line x1="96" y1="70" x2="118" y2="70" stroke="var(--color-border)" strokeWidth="2" markerEnd="url(#cm-arrow)" />
        <line x1="242" y1="70" x2="264" y2="70" stroke="var(--color-border)" strokeWidth="2" markerEnd="url(#cm-arrow)" />
        <line x1="180" y1="90" x2="180" y2="128" stroke="var(--color-border)" strokeWidth="2" markerEnd="url(#cm-arrow)" />

        {box(36, 50, 60, '#2ECC71', 'INPUT', s.input)}
        {box(120, 50, 120, '#FFC83D', 'PROCESS', s.process)}
        {box(264, 50, 60, '#FF6B6B', 'OUTPUT', s.output)}
        {box(110, 130, 140, '#5B6CFF', 'STORAGE', s.store)}

        {[0, 1, 2].map((i) => (
          <circle key={i} ref={(el) => { tokenRefs.current[i] = el }} cx="96" cy="70" r="4" fill="var(--color-accent-2)" />
        ))}
      </svg>

      <p className="px-4 pb-4 pt-1 text-center text-sm text-muted">
        Different task, same four parts. A computer is an <span className="text-ink">input → process → output</span> machine that can also <span className="text-ink">store</span> what it learns.
      </p>
    </div>
  )
}

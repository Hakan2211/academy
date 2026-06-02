import { useState } from 'react'
import { cn } from '#/lib/cn'

// A process is a program in the middle of running. It rarely runs straight
// through — it cycles through a handful of states as the OS scheduler grants and
// revokes the CPU, and as it waits for slow devices. Step through the lifecycle
// and watch the single CPU pass from one process to another: a context switch.

type State = 'new' | 'ready' | 'running' | 'waiting' | 'terminated'

type Node = { key: State; label: string; x: number; y: number; color: string; desc: string }

const NODES: Array<Node> = [
  { key: 'new', label: 'New', x: 60, y: 40, color: '#9B59B6', desc: 'The process is being created and loaded into memory.' },
  { key: 'ready', label: 'Ready', x: 180, y: 40, color: '#4F8CFF', desc: 'Loaded and waiting in line — it could run, but the CPU is busy.' },
  { key: 'running', label: 'Running', x: 300, y: 40, color: '#2ECC71', desc: 'Actually executing instructions on the CPU. Only one per core at a time.' },
  { key: 'waiting', label: 'Waiting', x: 300, y: 150, color: '#FFC83D', desc: 'Blocked, asleep until a slow device (disk, network) responds.' },
  { key: 'terminated', label: 'Terminated', x: 180, y: 150, color: '#FF6B6B', desc: 'Finished or killed. Its memory and resources are reclaimed.' },
]

// The lifecycle as an ordered walk, each step labelled with why the transition
// happens. Stepping cycles New → Ready → Running → Waiting → Ready → Running →
// Terminated, exercising every arrow at least once.
type StepT = { from: State; to: State; why: string }
const WALK: Array<StepT> = [
  { from: 'new', to: 'ready', why: 'Admitted: loaded into memory, joins the ready queue.' },
  { from: 'ready', to: 'running', why: 'Scheduled: the OS gives it the CPU.' },
  { from: 'running', to: 'waiting', why: 'I/O request: it asks the disk for data and must wait.' },
  { from: 'waiting', to: 'ready', why: 'I/O done: the data arrived; it rejoins the ready queue.' },
  { from: 'ready', to: 'running', why: 'Scheduled again: its turn on the CPU comes round.' },
  { from: 'running', to: 'terminated', why: 'Exit: the program finished its work.' },
]

const POS: Record<State, { x: number; y: number }> = NODES.reduce<Record<State, { x: number; y: number }>>(
  (acc, n) => {
    acc[n.key] = { x: n.x, y: n.y }
    return acc
  },
  {} as Record<State, { x: number; y: number }>,
)

export function ProcessStates() {
  const [step, setStep] = useState(0)
  // Before the first transition the token sits at New; otherwise at the target.
  const current: State = step === 0 ? 'new' : WALK[step - 1].to
  const lastWhy = step === 0 ? 'A fresh process begins life in the New state.' : WALK[step - 1].why
  const cur = POS[current]
  const done = step >= WALK.length

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 360 200" className="w-full">
        <defs>
          <marker id="ps-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--color-muted)" />
          </marker>
        </defs>

        {/* transition arrows */}
        <Arrow x1={108} y1={40} x2={132} y2={40} />
        <Arrow x1={228} y1={40} x2={252} y2={40} />
        <Arrow x1={310} y1={62} x2={310} y2={120} /> {/* running -> waiting */}
        <Arrow x1={278} y1={142} x2={210} y2={92} /> {/* waiting -> ready */}
        <Arrow x1={252} y1={48} x2={210} y2={130} /> {/* running -> terminated */}

        {/* state nodes */}
        {NODES.map((n) => {
          const active = n.key === current
          return (
            <g key={n.key}>
              <rect
                x={n.x - 48}
                y={n.y - 18}
                width="96"
                height="36"
                rx="10"
                fill={active ? n.color : 'var(--color-surface-2)'}
                stroke={n.color}
                strokeWidth={active ? 3 : 2}
              />
              <text
                x={n.x}
                y={n.y + 4}
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                fill={active ? '#0a0f1f' : n.color}
              >
                {n.label}
              </text>
            </g>
          )
        })}

        {/* the process token */}
        <circle cx={cur.x} cy={cur.y - 26} r="6" fill="var(--color-accent-2)" stroke="var(--color-surface)" strokeWidth="2">
          <animate attributeName="r" values="6;7.5;6" dur="1.2s" repeatCount="indefinite" />
        </circle>
      </svg>

      <p className="mt-1 text-center text-sm text-ink/90">{lastWhy}</p>
      <p className="mt-1 text-center text-xs text-muted">
        {NODES.find((n) => n.key === current)?.desc}
      </p>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(s + 1, WALK.length))}
          disabled={done}
          className={cn(
            'rounded-full border px-4 py-1.5 text-sm transition-colors',
            done ? 'cursor-not-allowed border-border text-muted/50' : 'border-accent bg-accent/15 text-accent',
          )}
        >
          {step === 0 ? 'Start' : 'Next transition'}
        </button>
        <button
          type="button"
          onClick={() => setStep(0)}
          className="rounded-full border border-border px-4 py-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          Reset
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        Only one process actually <span className="text-success">runs</span> per core at a time. Saving one process’s state
        and loading another’s is a <span className="text-ink">context switch</span>.
      </p>
    </div>
  )
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--color-muted)" strokeWidth="2" markerEnd="url(#ps-arrow)" />
}

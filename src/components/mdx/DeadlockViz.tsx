import { useState } from 'react'
import { cn } from '#/lib/cn'

// Deadlock is the trap of shared resources. Two processes each grab one resource,
// then each reaches for the one the other is holding — and neither will let go.
// The wait-for graph forms a cycle, and both freeze forever. Trigger it, see the
// cycle light up red, then resolve it by preempting a resource to break the loop.

type Phase = 'idle' | 'holding' | 'deadlocked' | 'resolved'

const COPY: Record<Phase, string> = {
  idle: 'Two processes, two resources. P1 wants R1 then R2; P2 wants R2 then R1. Press “Acquire” to let each grab its first resource.',
  holding: 'P1 holds R1; P2 holds R2. Each now reaches for the other’s resource. Press “Request other” to see what happens.',
  deadlocked: 'Deadlock! P1 waits for R2 (held by P2); P2 waits for R1 (held by P1). The wait-for graph is a cycle — neither can ever proceed.',
  resolved: 'Resolved. The OS preempted R1 from P1 and handed it to P2, breaking the cycle. P2 finishes, frees both resources, then P1 runs.',
}

export function DeadlockViz() {
  const [phase, setPhase] = useState<Phase>('idle')

  const deadlocked = phase === 'deadlocked'
  // Edge colours: hold-edges green once held; wait-edges red once requested.
  const held = phase === 'holding' || phase === 'deadlocked'
  const waiting = phase === 'deadlocked'

  // P1 top-left, R1 top-right, P2 bottom-right, R2 bottom-left.
  const P1 = { x: 70, y: 45 }
  const R1 = { x: 290, y: 45 }
  const P2 = { x: 290, y: 165 }
  const R2 = { x: 70, y: 165 }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 360 210" className="w-full">
        <defs>
          <marker id="dl-green" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
            <path d="M0,0 L7,3 L0,6 Z" fill="#2ECC71" />
          </marker>
          <marker id="dl-red" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
            <path d="M0,0 L7,3 L0,6 Z" fill="#FF6B6B" />
          </marker>
          <marker id="dl-grey" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
            <path d="M0,0 L7,3 L0,6 Z" fill="var(--color-border)" />
          </marker>
        </defs>

        {/* Hold edges: resource -> process (assignment). R1->P1, R2->P2 */}
        <Edge
          from={R1}
          to={P1}
          color={held ? '#2ECC71' : 'var(--color-border)'}
          marker={held ? 'dl-green' : 'dl-grey'}
          label="held by"
          show={held}
        />
        <Edge
          from={R2}
          to={P2}
          color={phase === 'resolved' ? 'var(--color-border)' : held ? '#2ECC71' : 'var(--color-border)'}
          marker={held ? 'dl-green' : 'dl-grey'}
          label="held by"
          show={held}
        />

        {/* Wait edges: process -> resource (request). P1->R2, P2->R1 */}
        <Edge
          from={P1}
          to={R2}
          color={waiting ? '#FF6B6B' : 'transparent'}
          marker="dl-red"
          label="waits for"
          show={waiting}
        />
        <Edge
          from={P2}
          to={R1}
          color={waiting ? '#FF6B6B' : 'transparent'}
          marker="dl-red"
          label="waits for"
          show={waiting}
        />

        {/* nodes */}
        <ProcNode x={P1.x} y={P1.y} label="P1" />
        <ProcNode x={P2.x} y={P2.y} label="P2" />
        <ResNode x={R1.x} y={R1.y} label="R1" />
        <ResNode x={R2.x} y={R2.y} label="R2" />

        {deadlocked && (
          <text x="180" y="110" textAnchor="middle" fontSize="13" fontWeight="700" fill="#FF6B6B">
            ↻ circular wait
          </text>
        )}
      </svg>

      <p
        className={cn(
          'mt-1 min-h-[3rem] text-center text-sm',
          deadlocked ? 'text-warn' : phase === 'resolved' ? 'text-success' : 'text-muted',
        )}
      >
        {COPY[phase]}
      </p>

      <div className="mt-2 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => setPhase('holding')}
          disabled={phase !== 'idle'}
          className={cn(
            'rounded-full border px-3 py-1.5 text-sm transition-colors',
            phase === 'idle' ? 'border-accent bg-accent/15 text-accent' : 'cursor-not-allowed border-border text-muted/50',
          )}
        >
          1 · Acquire
        </button>
        <button
          type="button"
          onClick={() => setPhase('deadlocked')}
          disabled={phase !== 'holding'}
          className={cn(
            'rounded-full border px-3 py-1.5 text-sm transition-colors',
            phase === 'holding' ? 'border-warn bg-warn/15 text-warn' : 'cursor-not-allowed border-border text-muted/50',
          )}
        >
          2 · Request other
        </button>
        <button
          type="button"
          onClick={() => setPhase('resolved')}
          disabled={phase !== 'deadlocked'}
          className={cn(
            'rounded-full border px-3 py-1.5 text-sm transition-colors',
            phase === 'deadlocked' ? 'border-success text-success' : 'cursor-not-allowed border-border text-muted/50',
          )}
        >
          3 · Resolve (preempt)
        </button>
        <button
          type="button"
          onClick={() => setPhase('idle')}
          className="rounded-full border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          Reset
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        Deadlock needs four conditions at once: mutual exclusion, hold-and-wait, no preemption and a{' '}
        <span className="text-ink">circular wait</span>. Break any one — here, by preempting a resource — and the system frees up.
      </p>
    </div>
  )
}

function Edge({
  from,
  to,
  color,
  marker,
  label,
  show,
}: {
  from: { x: number; y: number }
  to: { x: number; y: number }
  color: string
  marker: string
  label: string
  show: boolean
}) {
  // shorten the segment so the arrowhead lands on the node edge, not its centre
  const dx = to.x - from.x
  const dy = to.y - from.y
  const len = Math.hypot(dx, dy) || 1
  const pad = 30
  const x1 = from.x + (dx / len) * pad
  const y1 = from.y + (dy / len) * pad
  const x2 = to.x - (dx / len) * pad
  const y2 = to.y - (dy / len) * pad
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  return (
    <g opacity={show ? 1 : 0.25}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2.5" markerEnd={`url(#${marker})`} />
      {show && (
        <text x={mx} y={my - 4} textAnchor="middle" fontSize="9" fill={color}>
          {label}
        </text>
      )}
    </g>
  )
}

function ProcNode({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="22" fill="var(--color-surface-2)" stroke="var(--color-accent)" strokeWidth="2" />
      <text x={x} y={y + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--color-accent)">
        {label}
      </text>
    </g>
  )
}

function ResNode({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <rect x={x - 20} y={y - 20} width="40" height="40" rx="6" fill="var(--color-surface-2)" stroke="var(--color-accent-2)" strokeWidth="2" />
      <text x={x} y={y + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--color-accent-2)">
        {label}
      </text>
    </g>
  )
}

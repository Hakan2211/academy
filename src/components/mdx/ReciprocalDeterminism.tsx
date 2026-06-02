import { useState } from 'react'
import { cn } from '#/lib/cn'

// Bandura's reciprocal determinism: the Person (beliefs, self-efficacy),
// Behaviour, and Environment all influence one another in a continuous loop.
// Click any of the three connecting arrows to see a worked example of that
// causal direction. Used in social-cognitive.

type Pair = 'pb' | 'be' | 'ep'

const NODES = {
  person: { x: 180, y: 36, label: 'Person', sub: 'beliefs, self-efficacy' },
  behavior: { x: 78, y: 188, label: 'Behaviour', sub: 'what you do' },
  environment: { x: 282, y: 188, label: 'Environment', sub: 'situation, others' },
}

const ARROWS: Record<Pair, { label: string; body: string }> = {
  pb: {
    label: 'Person ⇄ Behaviour',
    body: 'Believing "I can do this" (high self-efficacy) makes you attempt and persist at the task. Each success you rack up then raises that belief even higher — a self-reinforcing loop.',
  },
  be: {
    label: 'Behaviour ⇄ Environment',
    body: 'Practising the piano (behaviour) changes your environment — people praise you, you join a band. That richer environment then pulls more practice out of you.',
  },
  ep: {
    label: 'Environment ⇄ Person',
    body: 'A supportive teacher (environment) boosts your confidence (person). In turn, a confident, curious learner draws out more attention and encouragement from those around them.',
  },
}

export function ReciprocalDeterminism() {
  const [sel, setSel] = useState<Pair>('pb')

  const edge = (k: Pair, base = 'var(--color-border)') => (sel === k ? '#A29BFE' : base)
  const sw = (k: Pair) => (sel === k ? 3.5 : 2)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 360 240" className="mx-auto block w-full">
        {/* edges (clickable) */}
        <g onClick={() => setSel('pb')} className="cursor-pointer">
          <line x1={NODES.person.x} y1={NODES.person.y + 8} x2={NODES.behavior.x + 8} y2={NODES.behavior.y - 20} stroke="transparent" strokeWidth="20" />
          <line x1={NODES.person.x} y1={NODES.person.y + 8} x2={NODES.behavior.x + 8} y2={NODES.behavior.y - 20} stroke={edge('pb')} strokeWidth={sw('pb')} markerStart="url(#arr)" markerEnd="url(#arr)" />
        </g>
        <g onClick={() => setSel('be')} className="cursor-pointer">
          <line x1={NODES.behavior.x + 30} y1={NODES.behavior.y} x2={NODES.environment.x - 30} y2={NODES.environment.y} stroke="transparent" strokeWidth="20" />
          <line x1={NODES.behavior.x + 30} y1={NODES.behavior.y} x2={NODES.environment.x - 30} y2={NODES.environment.y} stroke={edge('be')} strokeWidth={sw('be')} markerStart="url(#arr)" markerEnd="url(#arr)" />
        </g>
        <g onClick={() => setSel('ep')} className="cursor-pointer">
          <line x1={NODES.environment.x} y1={NODES.environment.y - 20} x2={NODES.person.x} y2={NODES.person.y + 8} stroke="transparent" strokeWidth="20" />
          <line x1={NODES.environment.x} y1={NODES.environment.y - 20} x2={NODES.person.x} y2={NODES.person.y + 8} stroke={edge('ep')} strokeWidth={sw('ep')} markerStart="url(#arr)" markerEnd="url(#arr)" />
        </g>

        <defs>
          <marker id="arr" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M1,1 L7,4 L1,7" fill="none" stroke="#A29BFE" strokeWidth="1.4" />
          </marker>
        </defs>

        {/* nodes */}
        {(Object.values(NODES)).map((n) => (
          <g key={n.label} className="pointer-events-none">
            <circle cx={n.x} cy={n.y} r="34" fill="var(--color-surface-2)" stroke="#A29BFE" strokeWidth="2" />
            <text x={n.x} y={n.y - 1} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--color-ink)">{n.label}</text>
            <text x={n.x} y={n.y + 12} textAnchor="middle" fontSize="7.5" fill="var(--color-muted)">{n.sub}</text>
          </g>
        ))}
      </svg>

      <div className="mt-1 flex flex-wrap gap-1.5">
        {(Object.keys(ARROWS) as Array<Pair>).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setSel(k)}
            className={cn(
              'rounded-full border px-2.5 py-0.5 text-xs transition-colors',
              sel === k ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {ARROWS[k].label}
          </button>
        ))}
      </div>
      <p className="mt-2 rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted">
        <span className="font-semibold text-ink">{ARROWS[sel].label}: </span>
        {ARROWS[sel].body}
      </p>
      <p className="mt-2 text-xs text-muted">
        At the centre sits <span className="font-semibold text-accent">self-efficacy</span> — your belief in your own ability to succeed. Bandura argued it is the single most powerful lever on the whole loop.
      </p>
    </div>
  )
}

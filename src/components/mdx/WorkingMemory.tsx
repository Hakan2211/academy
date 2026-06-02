import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Baddeley's working-memory model. Short-term memory is not a single passive
// box but a small WORKBENCH: a central executive (the boss, allocating
// attention) directing two specialist slave systems — the phonological loop
// (inner voice, for words and sounds) and the visuospatial sketchpad (inner
// eye, for images and locations) — plus an episodic buffer that binds it all to
// long-term memory. Load a verbal vs a visual task and watch which subsystem
// lights up. (The reason you can listen and look at the same time, but struggle
// to do two verbal tasks at once: they fight for the same loop.)
type Task = 'verbal' | 'visual' | 'both'

type System = 'exec' | 'loop' | 'sketch' | 'buffer'

const TASKS: Record<Task, { label: string; example: string; active: Array<System> }> = {
  verbal: {
    label: 'Verbal task',
    example: 'Repeat a phone number in your head, or sound out an unfamiliar word.',
    active: ['exec', 'loop', 'buffer'],
  },
  visual: {
    label: 'Visual task',
    example: 'Picture the route from your home to a shop, or rotate a shape in your mind.',
    active: ['exec', 'sketch', 'buffer'],
  },
  both: {
    label: 'Both at once',
    example: 'Navigate a mental map while counting aloud — each subsystem handles its own stream, so it works.',
    active: ['exec', 'loop', 'sketch', 'buffer'],
  },
}

const W = 360
const H = 250

type Node = { id: System; x: number; y: number; w: number; h: number; label: string; icon: string; color: string }

const NODES: Array<Node> = [
  { id: 'exec', x: 180, y: 18, w: 150, h: 44, label: 'Central executive', icon: 'BrainCircuit', color: '#F39C12' },
  { id: 'loop', x: 70, y: 104, w: 120, h: 50, label: 'Phonological loop', icon: 'Volume2', color: '#3498DB' },
  { id: 'sketch', x: 290, y: 104, w: 120, h: 50, label: 'Visuospatial sketchpad', icon: 'Eye', color: '#9B59B6' },
  { id: 'buffer', x: 180, y: 190, w: 150, h: 44, label: 'Episodic buffer', icon: 'Combine', color: '#2ECC71' },
]

function nodeAt(id: System): Node {
  return NODES.find((n) => n.id === id) as Node
}

export function WorkingMemory() {
  const [task, setTask] = useState<Task>('verbal')
  const active = new Set(TASKS[task].active)

  const edges: Array<[System, System]> = [
    ['exec', 'loop'],
    ['exec', 'sketch'],
    ['exec', 'buffer'],
    ['loop', 'buffer'],
    ['sketch', 'buffer'],
  ]

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="flex flex-wrap gap-2 px-1 pb-2">
        {(['verbal', 'visual', 'both'] as Array<Task>).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTask(t)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              task === t ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {TASKS[t].label}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {edges.map(([a, b], i) => {
          const na = nodeAt(a)
          const nb = nodeAt(b)
          const lit = active.has(a) && active.has(b)
          return (
            <line
              key={i}
              x1={na.x}
              y1={na.y + na.h / 2}
              x2={nb.x}
              y2={nb.y - nb.h / 2 < na.y ? nb.y + nb.h / 2 : nb.y - nb.h / 2}
              stroke={lit ? 'var(--color-accent)' : 'var(--color-border)'}
              strokeWidth={lit ? 2 : 1.5}
            />
          )
        })}

        {NODES.map((n) => {
          const lit = active.has(n.id)
          return (
            <g key={n.id}>
              <rect
                x={n.x - n.w / 2}
                y={n.y - n.h / 2}
                width={n.w}
                height={n.h}
                rx={10}
                fill={lit ? `${n.color}22` : 'var(--color-surface-2)'}
                stroke={lit ? n.color : 'var(--color-border)'}
                strokeWidth={lit ? 2.5 : 1.5}
              />
              <text
                x={n.x}
                y={n.y + 4}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill={lit ? n.color : 'var(--color-muted)'}
              >
                {n.label}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="mt-1 grid grid-cols-2 gap-2 px-1 sm:grid-cols-4">
        {NODES.map((n) => (
          <div
            key={n.id}
            className={cn(
              'flex items-center gap-1.5 rounded-lg border px-2 py-1.5 transition-colors',
              active.has(n.id) ? 'border-accent/50 bg-accent/5' : 'border-border opacity-50',
            )}
          >
            <Icon name={n.icon} size={14} style={{ color: n.color }} />
            <span className="text-[11px] leading-tight text-ink">{n.label}</span>
          </div>
        ))}
      </div>

      <p className="mt-2 px-1 text-sm leading-relaxed text-muted">{TASKS[task].example}</p>
      <p className="mt-1 px-1 text-xs leading-relaxed text-muted">
        The <span style={{ color: '#F39C12' }}>central executive</span> hands words to the{' '}
        <span style={{ color: '#3498DB' }}>phonological loop</span> and images to the{' '}
        <span style={{ color: '#9B59B6' }}>visuospatial sketchpad</span>. Because they are separate, you can look and listen at once —
        but two verbal tasks jam the same loop.
      </p>
    </div>
  )
}

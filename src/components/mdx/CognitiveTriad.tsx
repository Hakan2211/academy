import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'

// Aaron Beck's negative cognitive triad in depression: three linked, automatic
// negative beliefs — about the SELF, the WORLD, and the FUTURE — that feed one
// another in a self-confirming downward spiral. Click each node to see how it
// sounds from the inside, and how the three reinforce one another. Beck's
// insight: change the thoughts and you can lift the mood.
const NODES = [
  {
    key: 'self',
    name: 'The Self',
    icon: 'User',
    thought: '“I’m worthless. I’m a failure. There’s something wrong with me.”',
    body: 'Depression filters self-perception so that flaws loom huge and strengths vanish. The person reads every setback as proof of their own defectiveness.',
  },
  {
    key: 'world',
    name: 'The World',
    icon: 'Globe',
    thought: '“Everything is against me. Nothing ever goes right. No one cares.”',
    body: 'The present world looks bleak and overwhelming. Neutral events are read as obstacles or rejections, confirming the sense of defeat.',
  },
  {
    key: 'future',
    name: 'The Future',
    icon: 'CalendarX',
    thought: '“It will never get better. There’s no point in trying.”',
    body: 'The future seems hopeless. Believing nothing can change drains motivation — which then makes things worse, “proving” the belief.',
  },
] as const

const PTS = [
  { x: 180, y: 46 },
  { x: 92, y: 168 },
  { x: 268, y: 168 },
]

export function CognitiveTriad() {
  const [sel, setSel] = useState(0)
  const n = NODES[sel]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 360 220" className="w-full">
        {/* the self-reinforcing triangle of arrows */}
        {PTS.map((p, i) => {
          const q = PTS[(i + 1) % PTS.length]
          const dx = q.x - p.x
          const dy = q.y - p.y
          const len = Math.hypot(dx, dy)
          const ux = dx / len
          const uy = dy / len
          return (
            <line
              key={i}
              x1={p.x + ux * 30}
              y1={p.y + uy * 30}
              x2={q.x - ux * 30}
              y2={q.y - uy * 30}
              stroke="var(--color-accent)"
              strokeWidth="1.8"
              opacity="0.55"
              markerEnd="url(#ct-arrow)"
            />
          )
        })}
        <defs>
          <marker id="ct-arrow" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--color-accent)" />
          </marker>
        </defs>

        {PTS.map((p, i) => {
          const on = i === sel
          return (
            <g key={i} onClick={() => setSel(i)} style={{ cursor: 'pointer' }}>
              <circle
                cx={p.x}
                cy={p.y}
                r={on ? 30 : 26}
                fill={on ? 'var(--color-accent)' : 'var(--color-surface-2)'}
                stroke={on ? 'var(--color-accent)' : 'var(--color-border)'}
                strokeWidth="2"
              />
              <text
                x={p.x}
                y={p.y + 4}
                textAnchor="middle"
                fontSize="10"
                fontWeight="600"
                fill={on ? 'var(--color-surface)' : 'var(--color-muted)'}
              >
                {NODES[i].name.replace('The ', '')}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="mt-1 min-h-[110px] rounded-xl bg-surface-2 p-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <Icon name={n.icon} size={16} />
          </span>
          <span className="text-sm font-semibold text-ink">Negative view of {n.name.toLowerCase()}</span>
        </div>
        <p className="mt-2 text-sm italic leading-relaxed text-ink/90">{n.thought}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">{n.body}</p>
      </div>

      <p className="mt-2 text-center text-xs text-muted">
        Each belief feeds the next, looping into a downward spiral. Beck’s therapy gently tests these thoughts against reality — and as the thoughts soften, mood can lift.
      </p>
    </div>
  )
}

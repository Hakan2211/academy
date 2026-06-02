import { useState } from 'react'
import { cn } from '#/lib/cn'

// Two ways to build the same system. A MONOLITH wires everything to everything:
// touch one part and you risk breaking all of it. A MODULAR design splits the
// system into boxes that only talk through clean interfaces, so a broken piece
// stays contained. Toggle the view, then "break" a component to see how far the
// damage spreads. This is coupling vs cohesion made visible.

type Node = { id: string; label: string; x: number; y: number }

const NODES: Array<Node> = [
  { id: 'ui', label: 'UI', x: 70, y: 50 },
  { id: 'auth', label: 'Login', x: 230, y: 50 },
  { id: 'data', label: 'Data', x: 70, y: 160 },
  { id: 'pay', label: 'Payments', x: 230, y: 160 },
  { id: 'mail', label: 'Email', x: 150, y: 215 },
]

// Monolith: every node is tangled to every other node (full mesh).
const MONO_EDGES: Array<[string, string]> = []
for (let i = 0; i < NODES.length; i++) {
  for (let j = i + 1; j < NODES.length; j++) MONO_EDGES.push([NODES[i].id, NODES[j].id])
}

// Modular: each box talks only to a central interface "hub", not to each other.
const HUB = { x: 150, y: 110 }
const byId = (id: string) => NODES.find((n) => n.id === id)!

export function ModularityViz() {
  const [modular, setModular] = useState(true)
  const [broken, setBroken] = useState<string | null>(null)

  // Which nodes are affected when `broken` fails?
  const affected = (id: string): boolean => {
    if (!broken) return false
    if (id === broken) return true
    // Monolith: everything is connected to everything, so failure spreads to all.
    // Modular: a broken box is isolated by its interface — only it goes down.
    return !modular
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          {([['Monolith', false], ['Modular', true]] as const).map(([label, val]) => (
            <button
              key={label}
              type="button"
              onClick={() => { setModular(val); setBroken(null) }}
              className={cn(
                'rounded-full border px-3 py-1 text-sm transition-colors',
                modular === val ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setBroken((b) => (b ? null : 'pay'))}
          className="rounded-lg border border-warn/50 px-3 py-1 text-sm text-warn hover:bg-warn/10"
        >
          {broken ? 'Repair' : 'Break Payments'}
        </button>
      </div>

      <svg viewBox="0 0 300 250" className="mt-3 w-full">
        {modular
          ? NODES.map((nd) => (
              <line
                key={nd.id}
                x1={HUB.x}
                y1={HUB.y}
                x2={nd.x}
                y2={nd.y}
                stroke="var(--color-accent)"
                strokeWidth="2"
                opacity={affected(nd.id) ? 0.2 : 0.7}
              />
            ))
          : MONO_EDGES.map(([a, b]) => {
              const na = byId(a)
              const nb = byId(b)
              return (
                <line
                  key={`${a}-${b}`}
                  x1={na.x}
                  y1={na.y}
                  x2={nb.x}
                  y2={nb.y}
                  stroke={broken ? 'var(--color-warn)' : 'var(--color-muted)'}
                  strokeWidth="1.5"
                  opacity={broken ? 0.55 : 0.4}
                />
              )
            })}

        {modular && (
          <g>
            <circle cx={HUB.x} cy={HUB.y} r="16" fill="var(--color-surface-2)" stroke="var(--color-accent)" strokeWidth="2" />
            <text x={HUB.x} y={HUB.y + 3} textAnchor="middle" className="text-[8px]" fill="var(--color-accent)">API</text>
          </g>
        )}

        {NODES.map((nd) => {
          const down = affected(nd.id)
          return (
            <g key={nd.id}>
              <rect
                x={nd.x - 34}
                y={nd.y - 15}
                width="68"
                height="30"
                rx="7"
                fill={down ? 'var(--color-warn)' : 'var(--color-surface-2)'}
                stroke={down ? 'var(--color-warn)' : 'var(--color-accent-2)'}
                strokeWidth="2"
                opacity={down ? 0.85 : 1}
              />
              <text x={nd.x} y={nd.y + 4} textAnchor="middle" className="text-[10px] font-semibold" fill={down ? '#0a0f1f' : 'var(--color-ink)'}>
                {nd.label}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="rounded-xl border border-border bg-surface-2 p-3 text-sm">
        {modular ? (
          <p className="text-ink/90">
            <span className="font-semibold text-success">Modular:</span> each component is <span className="text-ink">loosely coupled</span> — it only talks through a defined interface. Break one and the damage stays contained; the rest keep running.
          </p>
        ) : (
          <p className="text-ink/90">
            <span className="font-semibold text-warn">Monolith:</span> everything is <span className="text-ink">tightly coupled</span> to everything. One failure ripples across the whole system, and every change risks breaking something far away.
          </p>
        )}
        {broken && (
          <p className="mt-2 text-xs text-muted">
            Payments failed → <span className={modular ? 'text-success' : 'text-warn'}>{modular ? 'only Payments is down.' : 'the entire system is down.'}</span>
          </p>
        )}
      </div>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

// THE flagship: packet switching, the idea the whole internet rests on. Instead
// of holding open one dedicated wire, a message is chopped into numbered PACKETS
// that each find their own way across a web of routers. They can take different
// paths, race ahead, fall behind and arrive OUT OF ORDER — then the destination
// uses the numbers to reassemble the original message. Press Send and watch.

// Router/endpoint positions on a 360x190 canvas.
const NODES = {
  A: { x: 30, y: 95, label: 'You' },
  R1: { x: 110, y: 45 },
  R2: { x: 110, y: 145 },
  R3: { x: 200, y: 95 },
  R4: { x: 250, y: 40 },
  R5: { x: 250, y: 150 },
  B: { x: 330, y: 95, label: 'Friend' },
} as const

type NodeKey = keyof typeof NODES
const ROUTERS: Array<NodeKey> = ['R1', 'R2', 'R3', 'R4', 'R5']

// The mesh of links between routers (drawn faint in the background).
const LINKS: Array<[NodeKey, NodeKey]> = [
  ['A', 'R1'], ['A', 'R2'], ['R1', 'R3'], ['R2', 'R3'], ['R1', 'R4'],
  ['R2', 'R5'], ['R3', 'R4'], ['R3', 'R5'], ['R4', 'B'], ['R5', 'B'], ['R3', 'B'],
]

// Four packets, each given a different route + speed so they arrive scrambled.
const ROUTES: Array<{ id: number; path: Array<NodeKey>; speed: number }> = [
  { id: 1, path: ['A', 'R1', 'R4', 'B'], speed: 0.20 },
  { id: 2, path: ['A', 'R2', 'R3', 'B'], speed: 0.30 },
  { id: 3, path: ['A', 'R1', 'R3', 'R5', 'B'], speed: 0.26 },
  { id: 4, path: ['A', 'R2', 'R5', 'B'], speed: 0.34 },
]

const COLORS = ['#FF6B6B', '#FFC83D', '#2ECC71', '#5B6CFF']

export function PacketJourney() {
  const [sending, setSending] = useState(false)
  const [arrived, setArrived] = useState<Array<number>>([]) // ids in arrival order
  const dotRefs = useRef<Array<SVGGElement | null>>([])
  const arrivedRef = useRef<Set<number>>(new Set())

  function send() {
    setArrived([])
    arrivedRef.current = new Set()
    setSending(true)
  }

  useEffect(() => {
    if (!sending) return
    let raf = 0
    let start = 0
    const loop = (now: number) => {
      if (!start) start = now
      const t = (now - start) / 1000
      let allDone = true
      ROUTES.forEach((r, i) => {
        const prog = t * r.speed // segments completed
        const segs = r.path.length - 1
        const done = prog >= segs
        if (!done) allDone = false
        const p = Math.min(prog, segs)
        const idx = Math.floor(Math.min(p, segs - 0.0001))
        const f = p - idx
        const a = NODES[r.path[idx]]
        const b = NODES[r.path[idx + 1]]
        const x = a.x + (b.x - a.x) * f
        const y = a.y + (b.y - a.y) * f
        const el = dotRefs.current[i]
        if (el) {
          el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`)
          el.setAttribute('opacity', done ? '0' : '1')
        }
        if (done && !arrivedRef.current.has(r.id)) {
          arrivedRef.current.add(r.id)
          setArrived((prev) => (prev.includes(r.id) ? prev : [...prev, r.id]))
        }
      })
      if (allDone) {
        setSending(false)
        return
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [sending])

  const allArrived = arrived.length === ROUTES.length

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 190" className="w-full">
        {LINKS.map(([a, b], i) => (
          <line key={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y} stroke="var(--color-border)" strokeWidth="2" />
        ))}

        {/* routers */}
        {ROUTERS.map((k) => (
          <g key={k}>
            <rect x={NODES[k].x - 13} y={NODES[k].y - 10} width="26" height="20" rx="5" fill="var(--color-surface-2)" stroke="var(--color-accent-2)" strokeWidth="2" />
            <text x={NODES[k].x} y={NODES[k].y + 4} textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--color-accent-2)">{k}</text>
          </g>
        ))}

        {/* endpoints */}
        {(['A', 'B'] as Array<NodeKey>).map((k) => (
          <g key={k}>
            <circle cx={NODES[k].x} cy={NODES[k].y} r="20" fill="var(--color-surface-2)" stroke="var(--color-accent)" strokeWidth="2.5" />
            <text x={NODES[k].x} y={NODES[k].y + 4} textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--color-accent)">
              {(NODES[k] as { label?: string }).label}
            </text>
          </g>
        ))}

        {/* packets */}
        {ROUTES.map((r, i) => (
          <g key={r.id} ref={(el) => { dotRefs.current[i] = el }} opacity="0" transform={`translate(${NODES.A.x} ${NODES.A.y})`}>
            <rect x="-8" y="-8" width="16" height="16" rx="3" fill={COLORS[i]} />
            <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="800" fill="#0a0f1f">{r.id}</text>
          </g>
        ))}
      </svg>

      <div className="border-t border-border p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm">
            <span className="text-muted">Reassembled at destination: </span>
            <span className="font-mono font-bold text-ink">
              {arrived.length === 0 ? '—' : arrived.join(' ')}
            </span>
          </div>
          <button
            type="button"
            onClick={send}
            disabled={sending}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm transition-colors',
              sending ? 'cursor-not-allowed border-border text-muted/50' : 'border-accent bg-accent/15 text-accent',
            )}
          >
            {sending ? 'Sending…' : 'Send message'}
          </button>
        </div>

        <div className="mt-2 flex gap-1.5 font-mono text-xs">
          {ROUTES.map((r, i) => (
            <span key={r.id} className="rounded px-1.5 py-0.5 font-bold" style={{ background: COLORS[i], color: '#0a0f1f' }}>
              {r.id}
            </span>
          ))}
          <span className="text-muted">= the four packets of one message</span>
        </div>

        <p className="mt-2 text-xs text-muted">
          No dedicated wire is reserved. Each <span className="text-ink">packet</span> is routed independently, so they take different paths and arrive
          {allArrived ? ' ' : ' '}<span className="text-ink">out of order</span> — the numbers let the receiver <span className="text-ink">reassemble</span> the original. That is <span className="text-ink">packet switching</span>.
        </p>
      </div>
    </div>
  )
}

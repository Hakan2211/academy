import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// A food web: arrows show the flow of energy from prey to predator. Click a
// species to see what it eats and what eats it — then remove one and watch the
// knock-on effects ripple through the web.
type Node = { id: string; emoji: string; label: string; x: number; y: number }
const NODES: Array<Node> = [
  { id: 'grass', emoji: '🌿', label: 'Grass', x: 50, y: 188 },
  { id: 'insect', emoji: '🐛', label: 'Insect', x: 150, y: 192 },
  { id: 'rabbit', emoji: '🐇', label: 'Rabbit', x: 258, y: 186 },
  { id: 'mouse', emoji: '🐭', label: 'Mouse', x: 104, y: 118 },
  { id: 'bird', emoji: '🐦', label: 'Bird', x: 214, y: 116 },
  { id: 'fox', emoji: '🦊', label: 'Fox', x: 188, y: 44 },
  { id: 'hawk', emoji: '🦅', label: 'Hawk', x: 86, y: 44 },
]
// [prey, predator] — energy flows prey → predator
const EDGES: Array<[string, string]> = [
  ['grass', 'rabbit'], ['grass', 'insect'], ['grass', 'mouse'],
  ['insect', 'bird'], ['insect', 'mouse'],
  ['rabbit', 'fox'], ['mouse', 'fox'], ['mouse', 'hawk'], ['bird', 'hawk'],
]

const pos = (id: string) => NODES.find((n) => n.id === id)!

export function FoodWeb() {
  const [sel, setSel] = useState('mouse')
  const [removed, setRemoved] = useState<Set<string>>(new Set())

  const eats = EDGES.filter(([, p]) => p === sel).map(([prey]) => prey)
  const eatenBy = EDGES.filter(([prey]) => prey === sel).map(([, p]) => p)
  // predators that lose a food source if `sel` is removed
  const affected = EDGES.filter(([prey]) => prey === sel).map(([, p]) => p).filter((p) => !removed.has(p))

  const toggleRemove = () => {
    setRemoved((r) => {
      const n = new Set(r)
      n.has(sel) ? n.delete(sel) : n.add(sel)
      return n
    })
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 320 220" className="w-full">
        {EDGES.map(([a, b], i) => {
          const pa = pos(a)
          const pb = pos(b)
          const lit = sel === a || sel === b
          const faded = removed.has(a) || removed.has(b)
          return (
            <line
              key={i}
              x1={pa.x}
              y1={pa.y - 10}
              x2={pb.x}
              y2={pb.y + 12}
              stroke={lit ? '#FDCB6E' : '#475569'}
              strokeWidth={lit ? 2.5 : 1.5}
              opacity={faded ? 0.15 : lit ? 1 : 0.55}
              strokeDasharray={faded ? '3 3' : undefined}
            />
          )
        })}
        {NODES.map((n) => {
          const isRemoved = removed.has(n.id)
          return (
            <g key={n.id} onClick={() => setSel(n.id)} className="cursor-pointer" opacity={isRemoved ? 0.3 : 1}>
              <circle cx={n.x} cy={n.y} r={16} fill={sel === n.id ? '#16A08533' : 'var(--color-surface-2)'} stroke={sel === n.id ? '#16A085' : 'var(--color-border)'} strokeWidth={sel === n.id ? 2.5 : 1} />
              <text x={n.x} y={n.y + 6} textAnchor="middle" className="text-[16px]">{n.emoji}</text>
              {isRemoved && <line x1={n.x - 14} y1={n.y + 14} x2={n.x + 14} y2={n.y - 14} stroke="#E74C3C" strokeWidth={2} />}
            </g>
          )
        })}
      </svg>

      <div className="rounded-lg bg-surface-2 px-3 py-2 text-sm">
        <p className="font-semibold text-ink">{pos(sel).emoji} {pos(sel).label}</p>
        <p className="text-muted">Eats: {eats.length ? eats.map((e) => pos(e).label).join(', ') : 'nothing (a producer)'} · Eaten by: {eatenBy.length ? eatenBy.map((e) => pos(e).label).join(', ') : 'nothing (top predator)'}</p>
        {removed.has(sel) && affected.length > 0 && (
          <p className="mt-1 text-warn">Removing the {pos(sel).label} leaves {affected.map((a) => pos(a).label).join(', ')} short of food — the effect ripples through the web.</p>
        )}
      </div>

      <div className="mt-2 flex justify-center gap-2">
        <button type="button" onClick={toggleRemove} className={cn('flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm transition-colors', removed.has(sel) ? 'border-success bg-success/15 text-success' : 'border-warn bg-warn/15 text-warn')}>
          <Icon name={removed.has(sel) ? 'RotateCcw' : 'X'} size={14} /> {removed.has(sel) ? `Restore ${pos(sel).label}` : `Remove ${pos(sel).label}`}
        </button>
      </div>
    </div>
  )
}

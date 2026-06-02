import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// The taxonomy of long-term memory as a clickable tree. The first big split is
// EXPLICIT (declarative — knowing THAT, available to consciousness) vs IMPLICIT
// (non-declarative — knowing HOW, expressed through performance). Explicit
// branches into semantic (facts) and episodic (events); implicit into
// procedural (skills), classical conditioning, and priming. Tap any leaf for a
// vivid example — these systems are so distinct they can be damaged separately,
// which is the whole reason we draw the tree this way.
type Id = 'explicit' | 'implicit' | 'semantic' | 'episodic' | 'procedural' | 'conditioning' | 'priming'

type Leaf = {
  id: Id
  label: string
  color: string
  example: string
}

const LEAVES: Record<Id, Leaf> = {
  explicit: { id: 'explicit', label: 'Explicit (declarative)', color: '#F39C12', example: 'Memory you can consciously call up and put into words — knowing THAT. Split into facts and events.' },
  implicit: { id: 'implicit', label: 'Implicit (non-declarative)', color: '#3498DB', example: 'Memory expressed through performance, without conscious recall — knowing HOW. It steers you below awareness.' },
  semantic: { id: 'semantic', label: 'Semantic', color: '#E67E22', example: 'General facts and meanings stripped of context: that Paris is the capital of France, or what a dog is. You know it without remembering when you learned it.' },
  episodic: { id: 'episodic', label: 'Episodic', color: '#E84393', example: 'Personally experienced events, tagged with time and place: your last birthday, where you were on a big news day. A kind of mental time travel.' },
  procedural: { id: 'procedural', label: 'Procedural', color: '#2ECC71', example: 'Skills and habits — riding a bike, typing, tying a shoelace. Hard to put into words, but your body just does it.' },
  conditioning: { id: 'conditioning', label: 'Conditioning', color: '#1ABC9C', example: 'Learned associations: a smell that triggers dread, or your mouth watering at a jingle. Built quietly through pairing, like Pavlov’s dogs.' },
  priming: { id: 'priming', label: 'Priming', color: '#9B59B6', example: 'A recent exposure speeds later processing: see "doctor" and you spot "nurse" faster — without ever noticing the nudge.' },
}

const W = 360
const H = 210

type Pos = { id: Id; x: number; y: number }
const POS: Array<Pos> = [
  { id: 'explicit', x: 100, y: 56 },
  { id: 'implicit', x: 268, y: 56 },
  { id: 'semantic', x: 56, y: 132 },
  { id: 'episodic', x: 144, y: 132 },
  { id: 'procedural', x: 224, y: 132 },
  { id: 'conditioning', x: 290, y: 132 },
  { id: 'priming', x: 340, y: 132 },
]
const ROOT = { x: 180, y: 16 }
const EDGES: Array<[{ x: number; y: number }, Id]> = [
  [ROOT, 'explicit'],
  [ROOT, 'implicit'],
]
const SUB: Array<[Id, Id]> = [
  ['explicit', 'semantic'],
  ['explicit', 'episodic'],
  ['implicit', 'procedural'],
  ['implicit', 'conditioning'],
  ['implicit', 'priming'],
]

function posOf(id: Id): Pos {
  return POS.find((p) => p.id === id) as Pos
}

export function MemoryTypes() {
  const [sel, setSel] = useState<Id>('episodic')
  const leaf = LEAVES[sel]

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* root label */}
        <text x={ROOT.x} y={ROOT.y - 2} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--color-ink)">
          Long-term memory
        </text>

        {EDGES.map(([from, id], i) => {
          const to = posOf(id)
          return <line key={`e${i}`} x1={from.x} y1={from.y + 4} x2={to.x} y2={to.y - 12} stroke="var(--color-border)" strokeWidth="1.5" />
        })}
        {SUB.map(([a, b], i) => {
          const pa = posOf(a)
          const pb = posOf(b)
          return <line key={`s${i}`} x1={pa.x} y1={pa.y + 12} x2={pb.x} y2={pb.y - 12} stroke="var(--color-border)" strokeWidth="1.5" />
        })}

        {POS.map((p) => {
          const l = LEAVES[p.id]
          const on = sel === p.id
          return (
            <g key={p.id} onClick={() => setSel(p.id)} style={{ cursor: 'pointer' }}>
              <circle cx={p.x} cy={p.y} r={on ? 13 : 10} fill={on ? l.color : 'var(--color-surface-2)'} stroke={l.color} strokeWidth={on ? 2.5 : 1.5} />
              <text
                x={p.x}
                y={p.y >= 120 ? p.y + 26 : p.y - 16}
                textAnchor="middle"
                fontSize="9.5"
                fontWeight={on ? 700 : 500}
                fill={on ? l.color : 'var(--color-muted)'}
              >
                {l.label.split(' ')[0]}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="mt-1 flex flex-wrap gap-2 px-1">
        {(Object.keys(LEAVES) as Array<Id>).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setSel(id)}
            className={cn(
              'rounded-full border px-2.5 py-1 text-xs transition-colors',
              sel === id ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {LEAVES[id].label.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="mt-2 rounded-xl bg-surface-2 p-4">
        <p className="flex items-center gap-2 text-sm font-semibold" style={{ color: leaf.color }}>
          <Icon name="Tag" size={14} />
          {leaf.label}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{leaf.example}</p>
      </div>

      <p className="mt-2 px-1 text-xs leading-relaxed text-muted">
        These are genuinely <span className="text-ink">separate systems</span>: amnesia can wipe out new{' '}
        <span style={{ color: '#E84393' }}>episodic</span> memories while leaving <span style={{ color: '#2ECC71' }}>procedural</span>{' '}
        skills perfectly intact — a patient who cannot recall meeting you yesterday can still learn to mirror-draw.
      </p>
    </div>
  )
}

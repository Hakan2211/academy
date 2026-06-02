import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// The two big pictures of memory in one place. First the three core PROCESSES
// every memory must pass through — encode -> store -> retrieve — then the
// classic three-STORE model (sensory -> short-term <-> long-term) with the
// attention and rehearsal arrows that move information between them. Toggle the
// view to switch between "what memory does" and "where memory lives".
type View = 'process' | 'stores'

const PROCESS = [
  {
    key: 'encode',
    label: 'Encode',
    icon: 'LogIn',
    color: '#F39C12',
    blurb: 'Turn an experience into a form the brain can keep — a sight becomes a pattern of neural activity. If it is never encoded, it can never be remembered.',
    example: 'Hearing a new name and forming a mental trace of its sound.',
  },
  {
    key: 'store',
    label: 'Store',
    icon: 'Database',
    color: '#3498DB',
    blurb: 'Hold the encoded trace over time, from a fraction of a second to a lifetime. Memories are not filed away whole — they are held in changed connections between neurons.',
    example: 'That name sitting in memory, unrehearsed, for the rest of the party.',
  },
  {
    key: 'retrieve',
    label: 'Retrieve',
    icon: 'LogOut',
    color: '#2ECC71',
    blurb: 'Pull a stored memory back into awareness when you need it. Retrieval can fail even when the memory is intact — the trace is there, but the path to it is lost.',
    example: 'Greeting that person by name the next time you meet.',
  },
] as const

export function MemoryStages() {
  const [view, setView] = useState<View>('process')
  const [sel, setSel] = useState(0)
  const s = PROCESS[sel]

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="flex flex-wrap gap-2 px-1 pb-2">
        {(['process', 'stores'] as Array<View>).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              view === v ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {v === 'process' ? 'Three processes' : 'Three stores'}
          </button>
        ))}
      </div>

      {view === 'process' ? (
        <>
          <div className="grid grid-cols-3 gap-2">
            {PROCESS.map((p, i) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setSel(i)}
                className={cn(
                  'flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all',
                  sel === i ? 'border-accent bg-accent/15' : 'border-border hover:border-accent/50',
                )}
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ background: sel === i ? p.color : 'var(--color-surface-2)', color: sel === i ? '#0a0f1f' : p.color }}
                >
                  <Icon name={p.icon} size={20} />
                </span>
                <span className={cn('text-sm font-semibold', sel === i ? 'text-ink' : 'text-muted')}>{p.label}</span>
              </button>
            ))}
          </div>

          <svg viewBox="0 0 360 24" className="mt-1 w-full">
            <defs>
              <marker id="ms-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0 0 L6 3 L0 6 Z" fill="var(--color-muted)" />
              </marker>
            </defs>
            <line x1="70" y1="12" x2="160" y2="12" stroke="var(--color-muted)" strokeWidth="1.5" markerEnd="url(#ms-arrow)" />
            <line x1="200" y1="12" x2="290" y2="12" stroke="var(--color-muted)" strokeWidth="1.5" markerEnd="url(#ms-arrow)" />
          </svg>

          <div className="mt-1 rounded-xl bg-surface-2 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: s.color }}>
              {s.label}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{s.blurb}</p>
            <p className="mt-2 text-sm text-ink">
              <span className="font-medium text-muted">Example: </span>
              {s.example}
            </p>
          </div>
          <p className="mt-2 text-center text-xs text-muted">
            A memory only survives if it clears all three. A name you never <span className="text-ink">encoded</span> was never
            forgotten — it was never there.
          </p>
        </>
      ) : (
        <StoresDiagram />
      )}
    </div>
  )
}

const W = 360
const H = 200

function box(x: number, label: string, sub: string, color: string) {
  return { x, label, sub, color }
}

const BOXES = [
  box(58, 'Sensory', 'a flash, ~1s', '#9B59B6'),
  box(180, 'Short-term', '~7 items, ~20s', '#3498DB'),
  box(302, 'Long-term', 'vast, durable', '#2ECC71'),
]
const BY = 70
const BW = 86
const BH = 52

function StoresDiagram() {
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <defs>
          <marker id="ms-flow" markerWidth="9" markerHeight="9" refX="6" refY="3.5" orient="auto">
            <path d="M0 0 L7 3.5 L0 7 Z" fill="var(--color-accent)" />
          </marker>
        </defs>

        {/* incoming stimulus */}
        <text x={BOXES[0].x} y={32} textAnchor="middle" fontSize="10" fill="var(--color-muted)">
          stimulus in
        </text>
        <line x1={BOXES[0].x} y1={38} x2={BOXES[0].x} y2={BY - 4} stroke="var(--color-accent)" strokeWidth="1.5" markerEnd="url(#ms-flow)" />

        {BOXES.map((b) => (
          <g key={b.label}>
            <rect x={b.x - BW / 2} y={BY} width={BW} height={BH} rx={8} fill="var(--color-surface-2)" stroke={b.color} strokeWidth="2" />
            <text x={b.x} y={BY + 22} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--color-ink)">
              {b.label}
            </text>
            <text x={b.x} y={BY + 38} textAnchor="middle" fontSize="9" fill="var(--color-muted)">
              {b.sub}
            </text>
          </g>
        ))}

        {/* sensory -> short-term : ATTENTION */}
        <line x1={BOXES[0].x + BW / 2} y1={BY + BH / 2} x2={BOXES[1].x - BW / 2 - 2} y2={BY + BH / 2} stroke="var(--color-accent)" strokeWidth="2" markerEnd="url(#ms-flow)" />
        <text x={(BOXES[0].x + BOXES[1].x) / 2} y={BY + BH / 2 - 8} textAnchor="middle" fontSize="9" fill="var(--color-accent)">
          attention
        </text>

        {/* short-term <-> long-term : ENCODING / RETRIEVAL */}
        <line x1={BOXES[1].x + BW / 2} y1={BY + BH / 2 - 6} x2={BOXES[2].x - BW / 2 - 2} y2={BY + BH / 2 - 6} stroke="var(--color-accent)" strokeWidth="2" markerEnd="url(#ms-flow)" />
        <text x={(BOXES[1].x + BOXES[2].x) / 2} y={BY + BH / 2 - 14} textAnchor="middle" fontSize="9" fill="var(--color-accent)">
          encoding
        </text>
        <line x1={BOXES[2].x - BW / 2} y1={BY + BH / 2 + 12} x2={BOXES[1].x + BW / 2 + 2} y2={BY + BH / 2 + 12} stroke="var(--color-accent-2)" strokeWidth="2" markerEnd="url(#ms-flow)" />
        <text x={(BOXES[1].x + BOXES[2].x) / 2} y={BY + BH / 2 + 26} textAnchor="middle" fontSize="9" fill="var(--color-accent-2)">
          retrieval
        </text>

        {/* rehearsal loop on short-term */}
        <path
          d={`M${BOXES[1].x - 14} ${BY + BH + 4} C ${BOXES[1].x - 40} ${BY + BH + 40}, ${BOXES[1].x + 40} ${BY + BH + 40}, ${BOXES[1].x + 14} ${BY + BH + 4}`}
          fill="none"
          stroke="#F39C12"
          strokeWidth="2"
          markerEnd="url(#ms-flow)"
        />
        <text x={BOXES[1].x} y={BY + BH + 50} textAnchor="middle" fontSize="9" fill="#F39C12">
          rehearsal
        </text>

        {/* forgetting fades from sensory + short-term */}
        <text x={BOXES[0].x} y={BY + BH + 30} textAnchor="middle" fontSize="9" fill="var(--color-muted)">
          ↓ decays fast
        </text>
      </svg>

      <p className="mt-1 text-sm leading-relaxed text-muted">
        The <span className="font-medium text-ink">Atkinson–Shiffrin</span> model: information flows through three stores.{' '}
        <span style={{ color: '#3498DB' }}>Attention</span> rescues a sliver of the sensory flood into short-term memory;{' '}
        <span style={{ color: '#F39C12' }}>rehearsal</span> keeps it alive there; <span style={{ color: '#2ECC71' }}>encoding</span> moves
        it into durable long-term storage, and <span style={{ color: 'var(--color-accent-2)' }}>retrieval</span> brings it back. Whatever is
        not attended to or rehearsed simply fades.
      </p>
    </div>
  )
}

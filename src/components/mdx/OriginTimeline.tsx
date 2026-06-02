import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// From chemistry to the first cell. A plausible sequence for how life could have
// begun on the early Earth — step through the stages.
const STAGES = [
  { emoji: '🌋', title: 'The early Earth (~4 billion years ago)', caption: 'A hot young planet with oceans and an atmosphere of gases like water vapour, carbon dioxide, methane, and ammonia — but no oxygen and no life.' },
  { emoji: '⚡', title: 'Building blocks form', caption: 'Energy from lightning, UV light, and volcanic heat drives simple gases to react into organic molecules — including amino acids. Famous lab experiments (Miller–Urey) reproduced exactly this.' },
  { emoji: '🧬', title: 'Molecules that copy themselves', caption: 'Small molecules join into longer chains. Crucially, RNA can both store information AND act as a catalyst — so it could copy itself. This is the "RNA world" idea.' },
  { emoji: '🫧', title: 'Protocells', caption: 'Lipid molecules spontaneously form tiny bubbles in water. When they enclose self-copying molecules, you get protocells — a separate inside, the first hint of a cell.' },
  { emoji: '🦠', title: 'The first true cells', caption: 'These early cells evolved DNA, the genetic code, and metabolism — becoming LUCA, the last universal common ancestor of every living thing today.' },
]

export function OriginTimeline() {
  const [i, setI] = useState(0)
  const s = STAGES[i]
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-col items-center gap-2 py-3">
        <div className="text-6xl leading-none">{s.emoji}</div>
        <p className="text-center text-base font-bold text-ink">{s.title}</p>
        <p className="min-h-[4.5rem] max-w-md text-center text-sm text-muted">{s.caption}</p>
      </div>

      {/* progress track */}
      <div className="mb-3 flex items-center justify-center gap-1">
        {STAGES.map((st, k) => (
          <div key={k} className="flex items-center">
            <span className={cn('grid h-7 w-7 place-items-center rounded-full text-sm transition-colors', k <= i ? 'bg-accent/20' : 'bg-surface-2 opacity-50')}>{st.emoji}</span>
            {k < STAGES.length - 1 && <span className={cn('h-0.5 w-4', k < i ? 'bg-accent' : 'bg-border')} />}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button type="button" onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0} className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-sm text-muted enabled:hover:text-ink disabled:opacity-30">
          <Icon name="ChevronLeft" size={14} /> Back
        </button>
        <span className="text-xs text-muted">{i + 1} of {STAGES.length}</span>
        <button type="button" onClick={() => setI((v) => Math.min(STAGES.length - 1, v + 1))} disabled={i === STAGES.length - 1} className="flex items-center gap-1 rounded-full border border-accent bg-accent/15 px-3 py-1 text-sm text-accent enabled:hover:bg-accent/25 disabled:opacity-30">
          Next <Icon name="ChevronRight" size={14} />
        </button>
      </div>
    </div>
  )
}

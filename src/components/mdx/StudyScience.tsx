import { useState } from 'react'
import { cn } from '#/lib/cn'

// The science of studying: not all study methods are equal. Pick one and see
// roughly how much you'd still remember a week later. Active recall and spaced
// practice (what this app's Practice mode uses) win decisively.
const METHODS = [
  { name: 'Re-reading', retain: 0.28, note: 'Feels productive but fades fast — recognising words is not the same as remembering them.' },
  { name: 'Highlighting', retain: 0.32, note: 'Mostly passive. It marks what looks important without forcing you to retrieve it.' },
  { name: 'Active recall', retain: 0.67, note: 'Testing yourself forces your brain to retrieve the answer — which is what strengthens the memory.' },
  { name: 'Spaced practice', retain: 0.82, note: 'Active recall, repeated at growing intervals. The single most effective study method we know of.' },
]

export function StudyScience() {
  const [sel, setSel] = useState(0)
  const m = METHODS[sel]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-wrap gap-2">
        {METHODS.map((method, i) => (
          <button
            key={method.name}
            type="button"
            onClick={() => setSel(i)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              i === sel ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {method.name}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <div className="mb-1 flex items-baseline justify-between text-sm">
          <span className="text-muted">Remembered a week later</span>
          <span className="font-mono text-ink">{Math.round(m.retain * 100)}%</span>
        </div>
        <div className="h-5 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${m.retain * 100}%`, background: 'var(--color-accent)' }}
          />
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">{m.note}</p>
      </div>
    </div>
  )
}

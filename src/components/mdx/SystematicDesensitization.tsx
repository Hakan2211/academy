import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Systematic desensitization (Wolpe): build a fear hierarchy from the least to
// the most frightening scene, then climb it one rung at a time while staying
// deeply relaxed. You only move up when the current rung feels calm. Each time
// you "expose & relax" on a rung its anxiety rating (SUDs, 0-100) drops, because
// relaxation and fear cannot coexist (reciprocal inhibition). When a rung falls
// below the comfort line you may climb. The meter shows the principle: keep
// relaxation high and the fear has nowhere to live.

// A spider-fear hierarchy: least feared first.
const RUNGS = [
  'Look at the word "spider"',
  'See a cartoon drawing of a spider',
  'Look at a photo of a real spider',
  'Watch a video of a spider walking',
  'Stand across the room from a jar with a spider',
  'Hold the closed jar in your hands',
  'Let a small spider walk across your open palm',
]

const START = [25, 35, 50, 65, 78, 88, 98] // initial SUDs anxiety per rung
const CALM = 25 // climb only once a rung drops below this
const STEP_DROP = 18 // anxiety fall per exposure-with-relaxation

export function SystematicDesensitization() {
  const [rung, setRung] = useState(0)
  const [suds, setSuds] = useState<Array<number>>(START)
  const [exposures, setExposures] = useState(0)

  const cur = suds[rung]
  const relaxed = cur < CALM
  const atTop = rung === RUNGS.length - 1
  // Relaxation is the complement of anxiety: as fear falls, calm rises.
  const relaxation = Math.round(100 - cur)

  const expose = () => {
    setSuds((prev) => prev.map((v, i) => (i === rung ? Math.max(5, v - STEP_DROP) : v)))
    setExposures((e) => e + 1)
  }
  const climb = () => {
    if (relaxed && !atTop) setRung((r) => r + 1)
  }
  const reset = () => {
    setRung(0)
    setSuds(START)
    setExposures(0)
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      {/* relaxation meter */}
      <div className="mb-3 px-1">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 text-muted">
            <Icon name="Wind" size={13} /> Relaxation
          </span>
          <span className="font-mono font-semibold" style={{ color: relaxed ? '#27AE60' : '#E67E22' }}>
            {relaxation}%
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-surface-2 ring-1 ring-border">
          <div
            className="h-full transition-all"
            style={{ width: `${relaxation}%`, background: relaxed ? '#27AE60' : '#E67E22' }}
          />
        </div>
      </div>

      {/* the ladder, most-feared at the top */}
      <div className="space-y-1.5">
        {RUNGS.map((label, i) => {
          const idx = RUNGS.length - 1 - i // render top-down
          const isCur = idx === rung
          const done = idx < rung
          return (
            <div
              key={idx}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors',
                isCur ? 'border-accent bg-accent/10' : done ? 'border-border bg-surface-2 opacity-70' : 'border-border',
              )}
            >
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                style={{
                  background: done ? '#27AE6022' : isCur ? 'var(--color-accent)' : 'var(--color-surface-2)',
                  color: done ? '#27AE60' : isCur ? 'white' : 'var(--color-muted)',
                }}
              >
                {done ? <Icon name="Check" size={13} /> : idx + 1}
              </span>
              <span className={cn('flex-1', isCur ? 'text-ink' : 'text-muted')}>{label}</span>
              <span
                className="font-mono text-xs"
                style={{ color: suds[idx] < CALM ? '#27AE60' : suds[idx] > 70 ? '#E74C3C' : 'var(--color-muted)' }}
              >
                {suds[idx]}
              </span>
            </div>
          )
        })}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 px-1">
        <p className="text-xs leading-snug text-muted">
          Rung {rung + 1}: anxiety <span className="font-mono text-ink">{cur}</span>/100.{' '}
          {relaxed ? (
            <span style={{ color: '#27AE60' }}>Calm enough — climb up.</span>
          ) : (
            <span style={{ color: '#E67E22' }}>Stay, breathe, relax until it falls.</span>
          )}
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-border px-3 py-1 text-sm text-muted hover:text-ink"
          >
            Reset
          </button>
          {atTop && relaxed ? (
            <span className="rounded-full border border-success/40 bg-success/10 px-3 py-1 text-sm text-success">
              Fear conquered
            </span>
          ) : relaxed ? (
            <button
              type="button"
              onClick={climb}
              className="rounded-full border border-accent bg-accent/15 px-4 py-1 text-sm text-accent transition-colors"
            >
              Climb up
            </button>
          ) : (
            <button
              type="button"
              onClick={expose}
              className="rounded-full border border-accent bg-accent/15 px-4 py-1 text-sm text-accent transition-colors"
            >
              Expose &amp; relax
            </button>
          )}
        </div>
      </div>

      <p className="mt-2 px-1 text-xs leading-relaxed text-muted">
        Relaxation and fear can't share the same moment — so meeting each scene while deeply calm slowly drains its dread
        ({exposures} exposure{exposures === 1 ? '' : 's'} so far). Master a rung, then climb to the next.
      </p>
    </div>
  )
}

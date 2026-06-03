import { useState } from 'react'
import { cn } from '#/lib/cn'
import { clamp } from '#/lib/philo'

// Free Will & Determinism — a spectrum slider with three labelled camps.
// The user picks a position; a concrete scenario ("you reached for tea instead
// of coffee") is analysed from that camp's viewpoint.

type Camp = 'hard-determinism' | 'compatibilism' | 'libertarian'

type CampDef = {
  id: Camp
  label: string
  short: string
  position: number // 0–100 on the spectrum
  free: boolean | null // null = "depends how you define it"
  determined: boolean
  verdict: string
  summary: string
}

const CAMPS: Array<CampDef> = [
  {
    id: 'hard-determinism',
    label: 'Hard Determinism',
    short: 'No free will',
    position: 10,
    free: false,
    determined: true,
    verdict:
      'Your choice was the inevitable result of prior causes — brain chemistry, habit, the temperature of the room. There was never any genuine alternative. Free will is an illusion.',
    summary: 'Every event, including every human decision, is fully fixed by prior causes. Free will does not exist.',
  },
  {
    id: 'compatibilism',
    label: 'Compatibilism',
    short: 'Both true',
    position: 50,
    free: true,
    determined: true,
    verdict:
      'Your choice was determined — but it was *also* free, because you acted on your own desire without coercion. Freedom doesn\'t require breaking the causal chain; it just requires that the cause was YOU, not someone forcing you.',
    summary:
      'Free will and determinism are compatible. You are free when you act from your own reasons, without external compulsion — even if those reasons were themselves caused.',
  },
  {
    id: 'libertarian',
    label: 'Libertarian Free Will',
    short: 'Genuine freedom',
    position: 90,
    free: true,
    determined: false,
    verdict:
      'You genuinely *could* have chosen coffee. Determinism is false (or at least incomplete). You have agent causation — the ability to originate actions in a way that goes beyond the prior physical state of the world.',
    summary:
      'Determinism is false. Humans have genuine free will — an ability to initiate action that is not fully fixed by prior causes. Moral responsibility requires this.',
  },
]

function positionToActiveCamp(pos: number): Camp {
  if (pos < 30) return 'hard-determinism'
  if (pos < 70) return 'compatibilism'
  return 'libertarian'
}

export function FreeWillSpectrum() {
  const [sliderPos, setSliderPos] = useState(50)
  const activeCampId = positionToActiveCamp(sliderPos)
  const activeCamp = CAMPS.find((c) => c.id === activeCampId)!

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-1 text-sm font-semibold text-ink">
        Scenario: You reached for tea instead of coffee this morning.
      </p>
      <p className="mb-4 text-sm text-muted">
        Was that choice free? Was it determined? Slide to explore three philosophical answers.
      </p>

      {/* spectrum labels */}
      <div className="mb-1 flex justify-between text-xs text-muted">
        <span>Fully determined</span>
        <span>Fully free</span>
      </div>

      {/* slider track with camp markers */}
      <div className="relative mb-2">
        <input
          type="range"
          min={0}
          max={100}
          value={sliderPos}
          onChange={(e) => setSliderPos(clamp(Number(e.target.value), 0, 100))}
          className="w-full accent-[var(--color-accent)]"
          aria-label="Free will spectrum"
        />
        {/* camp ticks */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2">
          {CAMPS.map((c) => (
            <div
              key={c.id}
              className={cn(
                'absolute -translate-x-1/2 -translate-y-3 rounded-full w-2 h-2 border',
                activeCampId === c.id
                  ? 'bg-accent border-accent'
                  : 'bg-surface-2 border-border',
              )}
              style={{ left: `${c.position}%` }}
            />
          ))}
        </div>
      </div>

      {/* camp labels below track */}
      <div className="relative mb-5 h-6">
        {CAMPS.map((c) => (
          <span
            key={c.id}
            className={cn(
              'absolute -translate-x-1/2 text-xs transition-colors',
              activeCampId === c.id ? 'font-semibold text-accent' : 'text-muted',
            )}
            style={{ left: `${c.position}%` }}
          >
            {c.short}
          </span>
        ))}
      </div>

      {/* active camp header */}
      <div
        className={cn(
          'mb-3 flex items-center justify-between rounded-xl border px-3 py-2',
          'border-accent bg-accent/10',
        )}
      >
        <span className="font-semibold text-accent">{activeCamp.label}</span>
        <div className="flex gap-3 text-xs">
          <span className={cn('rounded-full px-2 py-0.5 border', activeCamp.free ? 'border-success text-success' : 'border-warn text-warn')}>
            Free will: {activeCamp.free === null ? 'redefined' : activeCamp.free ? 'yes' : 'no'}
          </span>
          <span className={cn('rounded-full px-2 py-0.5 border', activeCamp.determined ? 'border-accent-2 text-accent-2' : 'border-border text-muted')}>
            Determined: {activeCamp.determined ? 'yes' : 'no'}
          </span>
        </div>
      </div>

      {/* verdict */}
      <div className="mb-3 rounded-xl border border-border bg-surface-2 p-3 text-sm text-muted">
        <span className="font-semibold text-ink">Verdict on the tea choice: </span>
        {activeCamp.verdict}
      </div>

      {/* one-line summary */}
      <div className="rounded-xl border border-border px-3 py-2 text-xs text-muted">
        <span className="font-semibold text-ink">Core claim: </span>
        {activeCamp.summary}
      </div>
    </div>
  )
}

import { useState, useEffect, useRef } from 'react'
import { cn } from '#/lib/cn'

// Heart rate and breathing rate change with activity level.
// A pulsing dot beats at a pace matching the chosen heart rate.

type Level = {
  id: string
  label: string
  bpm: number
  breaths: number
  why: string
}

const LEVELS: Array<Level> = [
  {
    id: 'resting',
    label: 'Resting',
    bpm: 70,
    breaths: 14,
    why: 'At rest, muscles need little energy, so the heart and lungs cruise at a comfortable idle.',
  },
  {
    id: 'walking',
    label: 'Walking',
    bpm: 100,
    breaths: 20,
    why: 'Light activity raises muscle demand — heart rate and breathing increase to match, but stay comfortable.',
  },
  {
    id: 'running',
    label: 'Running',
    bpm: 160,
    breaths: 40,
    why: 'Hard exercise demands far more oxygen. The heart pumps up to 5× more blood per minute and the lungs breathe much deeper and faster.',
  },
]

export function HeartRateDemo() {
  const [activeId, setActiveId] = useState<string>('resting')
  const [pulse, setPulse] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const level = LEVELS.find((l) => l.id === activeId) ?? LEVELS[0]

  // Beat interval in ms = 60000 / bpm
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    const interval = Math.round(60000 / level.bpm)
    intervalRef.current = setInterval(() => {
      setPulse(true)
      setTimeout(() => setPulse(false), Math.min(200, interval * 0.4))
    }, interval)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [level.bpm])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Activity selector */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        {LEVELS.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => setActiveId(l.id)}
            className={cn(
              'rounded-xl border px-3 py-2 text-sm transition-colors',
              activeId === l.id
                ? 'border-accent bg-accent/15 font-semibold text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Pulse dot + stats */}
      <div className="flex items-center gap-6">
        {/* Animated pulse */}
        <div className="flex shrink-0 flex-col items-center gap-1">
          <div
            className="rounded-full transition-transform duration-75"
            style={{
              width: 44,
              height: 44,
              backgroundColor: '#E74C3C',
              transform: pulse ? 'scale(1.35)' : 'scale(1)',
              boxShadow: pulse ? '0 0 14px 4px #E74C3c88' : '0 0 4px 1px #E74C3C44',
              transition: 'transform 0.08s ease-out, box-shadow 0.08s ease-out',
            }}
            aria-hidden="true"
          />
          <span className="text-xs text-muted">pulse</span>
        </div>

        {/* Numbers */}
        <div className="flex flex-1 gap-4">
          <div className="rounded-xl border border-border bg-surface-2 px-4 py-3 text-center">
            <div className="text-2xl font-bold text-ink">{level.bpm}</div>
            <div className="text-xs text-muted">bpm</div>
            <div className="mt-0.5 text-xs text-muted">heart rate</div>
          </div>
          <div className="rounded-xl border border-border bg-surface-2 px-4 py-3 text-center">
            <div className="text-2xl font-bold text-ink">{level.breaths}</div>
            <div className="text-xs text-muted">/min</div>
            <div className="mt-0.5 text-xs text-muted">breathing</div>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <p className="mt-3 rounded-xl border border-border bg-surface-2 px-3 py-2 text-xs text-muted">{level.why}</p>
    </div>
  )
}

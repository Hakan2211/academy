import { useState, useEffect, useRef } from 'react'
import { cn } from '#/lib/cn'

// Box-breathing pacer: 4 s inhale → 4 s hold → 4 s exhale → 4 s hold, looping.
// A circle expands/contracts with the breath. Phase label and cycle counter shown.
// SSR-safe: no Math.random, no window access at module scope.

type Phase = 'inhale' | 'hold-in' | 'exhale' | 'hold-out'
const PHASES: Array<Phase> = ['inhale', 'hold-in', 'exhale', 'hold-out']
const DURATION = 4 // seconds per phase

const PHASE_LABELS: Record<Phase, string> = {
  'inhale':   'Breathe in…',
  'hold-in':  'Hold',
  'exhale':   'Breathe out…',
  'hold-out': 'Hold',
}

const PHASE_DETAIL: Record<Phase, string> = {
  'inhale':   'Slowly breathe in through your nose for 4 seconds.',
  'hold-in':  'Hold your breath gently for 4 seconds.',
  'exhale':   'Slowly exhale through your mouth for 4 seconds.',
  'hold-out': 'Hold with lungs empty for 4 seconds.',
}

// Min/max radius of the circle
const R_MIN = 28
const R_MAX = 54

export function BreathPacer() {
  const [running, setRunning]     = useState(false)
  const [phase, setPhase]         = useState<Phase>('inhale')
  const [elapsed, setElapsed]     = useState(0)   // seconds within current phase
  const [cycles, setCycles]       = useState(0)
  const rafRef                    = useRef<number | null>(null)
  const startRef                  = useRef<number>(0)
  const elapsedAtStartRef         = useRef<number>(0) // elapsed seconds at rAF start
  const cyclesRef                 = useRef<number>(0)

  function cancelAnim() {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
  }

  useEffect(() => {
    if (!running) {
      cancelAnim()
      return
    }
    startRef.current = performance.now()
    elapsedAtStartRef.current = elapsed

    function tick(now: number) {
      const dt = (now - startRef.current) / 1000 // seconds since rAF started
      const totalElapsed = elapsedAtStartRef.current + dt
      const phaseElapsed = totalElapsed % DURATION

      // Which phase are we in?
      const phaseIdx = Math.floor(totalElapsed / DURATION) % PHASES.length
      const newPhase = PHASES[phaseIdx]

      // Count completed full cycles (all 4 phases)
      const completedCycles = Math.floor(totalElapsed / (DURATION * PHASES.length))
      if (completedCycles !== cyclesRef.current) {
        cyclesRef.current = completedCycles
        setCycles(completedCycles)
      }

      setPhase(newPhase)
      setElapsed(phaseElapsed)

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnim()
  }, [running]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleToggle() {
    if (running) {
      cancelAnim()
      setRunning(false)
    } else {
      // Reset to start of inhale
      cyclesRef.current = 0
      setCycles(0)
      setPhase('inhale')
      setElapsed(0)
      setRunning(true)
    }
  }

  // Compute circle radius
  const t = elapsed / DURATION // 0..1 within phase
  let radius: number
  if (phase === 'inhale') {
    radius = R_MIN + (R_MAX - R_MIN) * t
  } else if (phase === 'hold-in') {
    radius = R_MAX
  } else if (phase === 'exhale') {
    radius = R_MAX - (R_MAX - R_MIN) * t
  } else {
    radius = R_MIN
  }

  const secondsLeft = Math.ceil(DURATION - elapsed)
  const accentColor = 'var(--color-accent)'

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Circle visualiser */}
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 140 140" className="w-48" aria-label="Breathing circle">
          {/* Background circle */}
          <circle cx={70} cy={70} r={R_MAX + 6} fill="var(--color-surface-2)" />
          {/* Guide ring */}
          <circle cx={70} cy={70} r={R_MAX} fill="none" stroke="var(--color-border)" strokeWidth={1} strokeDasharray="4 4" />
          {/* Animated breath circle */}
          <circle
            cx={70}
            cy={70}
            r={radius}
            fill={accentColor}
            opacity={0.18}
            style={{ transition: 'r 0.1s linear' }}
          />
          <circle
            cx={70}
            cy={70}
            r={radius}
            fill="none"
            stroke={accentColor}
            strokeWidth={2.5}
            style={{ transition: 'r 0.1s linear' }}
          />
          {/* Timer in centre */}
          <text x={70} y={66} textAnchor="middle" fontSize={22} fontWeight="bold" fill={accentColor}>
            {running ? secondsLeft : '4'}
          </text>
          <text x={70} y={82} textAnchor="middle" fontSize={9} fill="var(--color-muted)">
            seconds
          </text>
        </svg>

        {/* Phase label */}
        <p className="mt-2 text-base font-semibold text-accent">
          {running ? PHASE_LABELS[phase] : 'Ready'}
        </p>
        <p className="mt-0.5 text-xs text-muted">
          {running ? PHASE_DETAIL[phase] : 'Press Start to begin box breathing.'}
        </p>

        {/* Cycle counter */}
        {running && (
          <p className="mt-2 text-xs text-muted">
            Completed cycles: <span className="font-semibold text-ink">{cycles}</span>
          </p>
        )}

        {/* Start / Pause button */}
        <button
          type="button"
          onClick={handleToggle}
          className={cn(
            'mt-4 rounded-full border px-6 py-2 text-sm font-semibold transition-colors',
            running
              ? 'border-border text-muted hover:text-ink'
              : 'border-accent bg-accent/15 text-accent hover:bg-accent/25',
          )}
        >
          {running ? 'Stop' : 'Start'}
        </button>
      </div>

      {/* Phase progress bar */}
      {running && (
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-[10px] text-muted">
            {PHASES.map((p) => (
              <span key={p} className={cn('transition-colors', phase === p ? 'font-semibold text-accent' : '')}>
                {PHASE_LABELS[p]}
              </span>
            ))}
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-accent transition-all duration-100"
              style={{ width: `${(elapsed / DURATION) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-4 rounded-xl border border-border bg-surface-2 p-3 text-xs text-muted">
        <p className="font-semibold text-ink mb-1">Why box breathing works</p>
        <p>
          Slow, deliberate breathing activates the parasympathetic nervous system — the "rest and digest" counter to the fight-or-flight response. Extending the exhale, in particular, stimulates the vagus nerve and lowers heart rate, telling the brain that the crisis has passed.
        </p>
      </div>
    </div>
  )
}

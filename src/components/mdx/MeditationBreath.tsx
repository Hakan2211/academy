import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'
import { clamp } from '#/lib/psych'

// A calming breathing pacer. A circle expands and holds and contracts on a
// box-breathing rhythm (inhale - hold - exhale - hold), each phase the same
// length. The animation is driven by rAF mutating the circle radius via a ref;
// the phase LABEL is the only thing in React state (updated at phase changes,
// not per frame). This is just a visual aid — it doesn't measure you.
type Pattern = { key: string; label: string; phases: ReadonlyArray<number> }

// Phase lengths in seconds: [inhale, hold, exhale, hold].
const PATTERNS: ReadonlyArray<Pattern> = [
  { key: 'box', label: 'Box · 4-4-4-4', phases: [4, 4, 4, 4] },
  { key: 'relax', label: 'Relaxing · 4-7-8', phases: [4, 7, 8, 0] },
  { key: 'calm', label: 'Calm · 5-0-5-0', phases: [5, 0, 5, 0] },
]

const PHASE_NAMES = ['Breathe in', 'Hold', 'Breathe out', 'Hold'] as const

const W = 260
const H = 260
const CX = W / 2
const CY = H / 2
const R_MIN = 38
const R_MAX = 110

export function MeditationBreath() {
  const [patternKey, setPatternKey] = useState('box')
  const [phaseName, setPhaseName] = useState<string>(PHASE_NAMES[0])
  const [running, setRunning] = useState(false)

  const patternRef = useRef(patternKey)
  const runningRef = useRef(running)
  const circleRef = useRef<SVGCircleElement | null>(null)
  const phaseNameRef = useRef(phaseName)

  useEffect(() => {
    patternRef.current = patternKey
  }, [patternKey])
  useEffect(() => {
    runningRef.current = running
  }, [running])

  useEffect(() => {
    let raf = 0
    let last = 0
    let elapsed = 0 // seconds into the current full cycle

    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      const pattern = PATTERNS.find((p) => p.key === patternRef.current) ?? PATTERNS[0]
      const phases = pattern.phases
      const cycleLen = phases.reduce((s, x) => s + x, 0) || 1

      if (runningRef.current) {
        elapsed = (elapsed + dt) % cycleLen
      }

      // Find which phase we're in and how far through it.
      let acc = 0
      let phaseIdx = 0
      let phaseT = 0
      for (let i = 0; i < phases.length; i++) {
        if (elapsed < acc + phases[i] || i === phases.length - 1) {
          phaseIdx = i
          phaseT = phases[i] > 0 ? (elapsed - acc) / phases[i] : 1
          break
        }
        acc += phases[i]
      }
      phaseT = clamp(phaseT, 0, 1)

      // Radius target: grow during inhale, full during first hold, shrink during
      // exhale, min during last hold.
      let r: number
      if (phaseIdx === 0) r = R_MIN + phaseT * (R_MAX - R_MIN)
      else if (phaseIdx === 1) r = R_MAX
      else if (phaseIdx === 2) r = R_MAX - phaseT * (R_MAX - R_MIN)
      else r = R_MIN

      const el = circleRef.current
      if (el) el.setAttribute('r', r.toFixed(1))

      const name = PHASE_NAMES[phaseIdx]
      if (name !== phaseNameRef.current) {
        phaseNameRef.current = name
        setPhaseName(name)
      }

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="flex flex-wrap justify-center gap-2">
        {PATTERNS.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => setPatternKey(p.key)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              patternKey === p.key
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-2 block w-full max-w-[280px]">
        <defs>
          <radialGradient id="breath-fill" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.08" />
          </radialGradient>
        </defs>
        {/* outer reference rings */}
        <circle cx={CX} cy={CY} r={R_MAX} fill="none" stroke="var(--color-border)" strokeWidth={1} strokeDasharray="2 5" />
        {/* breathing circle */}
        <circle ref={circleRef} cx={CX} cy={CY} r={R_MIN} fill="url(#breath-fill)" stroke="var(--color-accent)" strokeWidth={2} />
        <text x={CX} y={CY + 5} textAnchor="middle" fontSize="16" fontWeight="600" fill="var(--color-ink)">
          {running ? phaseName : 'Ready'}
        </text>
      </svg>

      <div className="mt-1 flex justify-center">
        <button
          type="button"
          onClick={() => setRunning((v) => !v)}
          className={cn(
            'rounded-full border px-5 py-1.5 text-sm transition-colors',
            running
              ? 'border-border text-muted hover:text-ink'
              : 'border-accent bg-accent/15 text-accent',
          )}
        >
          {running ? 'Pause' : 'Begin'}
        </button>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted">
        Follow the circle with your breath. Slow, paced breathing nudges the body toward <span className="font-medium text-ink">lowered arousal</span> —
        a calmer heart rate and a shift in brain waves toward slower <span className="font-medium text-ink">alpha and theta</span> rhythms, the
        signature of relaxed, meditative states. This is only a visual pacer, not a measurement.
      </p>
    </div>
  )
}

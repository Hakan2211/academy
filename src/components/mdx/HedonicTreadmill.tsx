import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

// The hedonic treadmill (hedonic adaptation): a big life event spikes happiness,
// but we adapt back toward a stable baseline "set point" over time. Press a
// trigger and watch the line jump, then drift home. The animation runs entirely
// through ref.setAttribute on a growing <path> — no per-frame React state.
const W = 360
const H = 220
const PAD_L = 34
const PAD_R = 16
const PAD_T = 16
const PAD_B = 28
const BASELINE = 0.55 // happiness set point, 0..1
const SPAN = 6000 // ms of history shown across the x-axis

type Trigger = {
  key: string
  label: string
  jump: number // signed displacement from baseline
}

const TRIGGERS: Array<Trigger> = [
  { key: 'raise', label: 'Big raise', jump: 0.34 },
  { key: 'car', label: 'New car', jump: 0.26 },
  { key: 'breakup', label: 'Breakup', jump: -0.32 },
  { key: 'injury', label: 'Injury', jump: -0.28 },
]

const yOf = (h: number) => PAD_T + (1 - h) * (H - PAD_T - PAD_B)
const xOf = (tNorm: number) => PAD_L + tNorm * (W - PAD_L - PAD_R)

export function HedonicTreadmill() {
  const [last, setLast] = useState<string | null>(null)
  const pathRef = useRef<SVGPathElement | null>(null)
  const dotRef = useRef<SVGCircleElement | null>(null)
  // current happiness level + impulse queue, mutated by the loop (not React state).
  const levelRef = useRef(BASELINE)
  const impulseRef = useRef(0)

  useEffect(() => {
    // ring buffer of recent happiness samples for the trailing line.
    const N = 120
    const samples = new Array<number>(N).fill(BASELINE)
    let head = 0
    let raf = 0
    let lastT = 0
    let acc = 0
    const stepMs = SPAN / N

    const loop = (now: number) => {
      if (!lastT) lastT = now
      acc += Math.min(80, now - lastT)
      lastT = now

      while (acc >= stepMs) {
        acc -= stepMs
        // apply any pending impulse instantly, then decay toward baseline.
        if (impulseRef.current !== 0) {
          levelRef.current = Math.max(0.04, Math.min(0.98, levelRef.current + impulseRef.current))
          impulseRef.current = 0
        }
        // exponential return to the set point — the treadmill.
        levelRef.current += (BASELINE - levelRef.current) * 0.045
        samples[head] = levelRef.current
        head = (head + 1) % N
      }

      let d = ''
      for (let i = 0; i < N; i++) {
        const v = samples[(head + i) % N]
        const x = xOf(i / (N - 1))
        const y = yOf(v)
        d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
      }
      if (pathRef.current) pathRef.current.setAttribute('d', d)
      if (dotRef.current) dotRef.current.setAttribute('cy', yOf(levelRef.current).toFixed(1))

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const trigger = (t: Trigger) => {
    impulseRef.current += t.jump
    setLast(t.label)
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* axes */}
        <line x1={PAD_L} y1={H - PAD_B} x2={W - PAD_R} y2={H - PAD_B} stroke="var(--color-border)" strokeWidth="1.5" />
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={H - PAD_B} stroke="var(--color-border)" strokeWidth="1.5" />
        {/* baseline / set-point line */}
        <line
          x1={PAD_L}
          y1={yOf(BASELINE)}
          x2={W - PAD_R}
          y2={yOf(BASELINE)}
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          opacity="0.6"
        />
        <text x={W - PAD_R} y={yOf(BASELINE) - 5} textAnchor="end" fontSize="9" fill="var(--color-accent)">
          set point
        </text>
        <text x={11} y={H / 2} textAnchor="middle" fontSize="10" fill="var(--color-muted)" transform={`rotate(-90 11 ${H / 2})`}>
          Happiness →
        </text>
        <text x={(PAD_L + W - PAD_R) / 2} y={H - 7} textAnchor="middle" fontSize="10" fill="var(--color-muted)">
          Time →
        </text>
        {/* the adapting happiness trace */}
        <path ref={pathRef} d="" fill="none" stroke="var(--color-accent-2)" strokeWidth="2.5" strokeLinejoin="round" />
        <circle ref={dotRef} cx={W - PAD_R} cy={yOf(BASELINE)} r="5" fill="var(--color-accent-2)" />
      </svg>

      <div className="flex flex-wrap gap-2 px-1 pt-1">
        {TRIGGERS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => trigger(t)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              t.jump > 0
                ? 'border-border text-muted hover:border-accent/60 hover:text-ink'
                : 'border-border text-muted hover:border-[#E74C3C]/60 hover:text-ink',
            )}
          >
            {t.jump > 0 ? '+ ' : '− '}
            {t.label}
          </button>
        ))}
      </div>

      <p className="mt-2 px-1 text-sm leading-snug text-muted">
        {last ? (
          <>
            <span className="font-medium text-ink">{last}</span> spikes happiness — then watch it drift back toward your{' '}
            <span className="font-medium text-ink">set point</span>. Good and bad events both fade as you adapt. That return
            home is the <span className="font-medium text-ink">hedonic treadmill</span>.
          </>
        ) : (
          <>Press a life event and watch its effect on happiness — then watch how quickly you adapt back to baseline.</>
        )}
      </p>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

// Mood plotted over time. A typical person's mood drifts gently around a
// baseline (everyday ups and downs). In bipolar disorder, mood swings far
// beyond that band — soaring into mania and plunging into depression, often
// for weeks at a time. The shaded band is the "ordinary" range; watch the
// marker ride the curve and notice how far the bipolar trace leaves the band.
type Mode = 'everyday' | 'bipolar'

const W = 360
const H = 200
const MIDY = H / 2
const LEFT = 30
const RIGHT = W - 14
const SPAN = RIGHT - LEFT
const BAND = 26 // half-height of the "normal" band, in px

// mood value in [-1, 1] at phase t in [0, 1)
function moodAt(mode: Mode, t: number): number {
  if (mode === 'everyday') {
    return 0.22 * Math.sin(t * Math.PI * 8) + 0.1 * Math.sin(t * Math.PI * 21 + 1)
  }
  // long, large swings: a slow mania/depression cycle plus smaller wobble
  return 0.82 * Math.sin(t * Math.PI * 3) + 0.12 * Math.sin(t * Math.PI * 17)
}

const toY = (m: number) => MIDY - m * (MIDY - 14)

function pathFor(mode: Mode): string {
  const N = 160
  let d = ''
  for (let i = 0; i <= N; i++) {
    const t = i / N
    const x = LEFT + t * SPAN
    const y = toY(moodAt(mode, t))
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)} `
  }
  return d
}

export function BipolarMood() {
  const [mode, setMode] = useState<Mode>('bipolar')
  const modeRef = useRef(mode)
  const dotRef = useRef<SVGCircleElement | null>(null)

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  useEffect(() => {
    let raf = 0
    let last = 0
    let t = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      t += dt * 0.00006
      if (t >= 1) t -= 1
      const m = moodAt(modeRef.current, t)
      const el = dotRef.current
      if (el) {
        el.setAttribute('cx', (LEFT + t * SPAN).toFixed(1))
        el.setAttribute('cy', toY(m).toFixed(1))
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="mb-2 flex flex-wrap gap-2 px-1">
        {(['everyday', 'bipolar'] as Array<Mode>).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm capitalize transition-colors',
              mode === m ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {m === 'everyday' ? 'Everyday mood' : 'Bipolar disorder'}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* normal mood band */}
        <rect x={LEFT} y={MIDY - BAND} width={SPAN} height={BAND * 2} fill="var(--color-success)" opacity="0.12" />
        <line x1={LEFT} y1={MIDY} x2={RIGHT} y2={MIDY} stroke="var(--color-muted)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

        {/* axis labels */}
        <text x={LEFT - 4} y={20} textAnchor="end" fontSize="9" fill="var(--color-muted)">mania</text>
        <text x={LEFT - 4} y={MIDY + 4} textAnchor="end" fontSize="9" fill="var(--color-muted)">even</text>
        <text x={LEFT - 4} y={H - 10} textAnchor="end" fontSize="9" fill="var(--color-muted)">low</text>
        <text x={RIGHT} y={H - 2} textAnchor="end" fontSize="9" fill="var(--color-muted)">time →</text>

        {/* the mood trace */}
        <path
          d={pathFor(mode)}
          fill="none"
          stroke={mode === 'bipolar' ? 'var(--color-accent)' : 'var(--color-success)'}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* moving marker */}
        <circle ref={dotRef} cx={LEFT} cy={MIDY} r="5" fill="var(--color-ink)" stroke="var(--color-surface)" strokeWidth="1.5" />
      </svg>

      <p className="px-2 pb-2 pt-1 text-center text-sm text-muted">
        {mode === 'everyday' ? (
          <>Everyone’s mood drifts up and down — but it stays inside the ordinary band (shaded).</>
        ) : (
          <>
            In <span className="font-semibold text-ink">bipolar disorder</span>, mood swings far past that band — soaring into
            <span className="font-semibold text-ink"> mania</span> and plunging into <span className="font-semibold text-ink">depression</span>, often for weeks at a time.
          </>
        )}
      </p>
    </div>
  )
}

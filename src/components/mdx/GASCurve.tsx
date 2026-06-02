import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

// Hans Selye's General Adaptation Syndrome: the body's resistance to stress over
// time, in three phases. ALARM — resistance dips as the shock hits, then the
// fight-or-flight surge. RESISTANCE — the body braces at a costly high plateau,
// coping but burning reserves. EXHAUSTION — if the stressor never lets up, the
// reserves run dry and resistance collapses below normal. Slide time across the
// phases and watch the marker ride the curve.

const W = 360
const H = 220
const PAD = 34
const NORMAL = 0.45 // baseline resistance level (0..1)

// Phase boundaries on a 0..100 time axis.
const ALARM_END = 18
const RESIST_END = 70

// Resistance level as a function of time (0..100).
function resistanceAt(t: number): number {
  if (t <= ALARM_END) {
    // dip below normal then climb toward the plateau
    const u = t / ALARM_END
    const dip = NORMAL - 0.22 * Math.sin(u * Math.PI * 0.5) * (1 - u)
    const climb = dip + (0.85 - dip) * u * u
    return climb
  }
  if (t <= RESIST_END) {
    // high, slightly declining plateau
    const u = (t - ALARM_END) / (RESIST_END - ALARM_END)
    return 0.85 - 0.07 * u
  }
  // exhaustion: fall below baseline
  const u = (t - RESIST_END) / (100 - RESIST_END)
  return 0.78 - 0.65 * u * u
}

function phaseOf(t: number) {
  if (t <= ALARM_END)
    return { name: 'Alarm', color: 'var(--color-warn)', note: 'The stressor hits. Resistance briefly dips with the shock, then the fight-or-flight surge mobilises the body.' }
  if (t <= RESIST_END)
    return { name: 'Resistance', color: 'var(--color-success)', note: 'The body braces at a high plateau — coping outwardly fine, but quietly burning through its reserves to stay there.' }
  return { name: 'Exhaustion', color: 'var(--color-danger)', note: 'If the stressor never lets up, the reserves run dry. Resistance collapses below normal — the doorway to stress-related illness.' }
}

const xOf = (t: number) => PAD + (t / 100) * (W - 2 * PAD)
const yOf = (r: number) => H - PAD - r * (H - 2 * PAD)

const N = 120
const CURVE = Array.from({ length: N + 1 }, (_, i) => {
  const t = (100 * i) / N
  return `${i ? 'L' : 'M'}${xOf(t).toFixed(1)} ${yOf(resistanceAt(t)).toFixed(1)}`
}).join(' ')

export function GASCurve() {
  const [t, setT] = useState(8)
  const dotRef = useRef<SVGCircleElement | null>(null)
  const lineRef = useRef<SVGLineElement | null>(null)

  // smooth the marker between slider steps via rAF
  const target = useRef(t)
  const cur = useRef(t)
  useEffect(() => {
    target.current = t
  }, [t])
  useEffect(() => {
    let raf = 0
    let last = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      cur.current += (target.current - cur.current) * 0.012 * dt
      const x = xOf(cur.current)
      const y = yOf(resistanceAt(cur.current))
      dotRef.current?.setAttribute('cx', x.toFixed(1))
      dotRef.current?.setAttribute('cy', y.toFixed(1))
      lineRef.current?.setAttribute('x1', x.toFixed(1))
      lineRef.current?.setAttribute('x2', x.toFixed(1))
      lineRef.current?.setAttribute('y2', y.toFixed(1))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const ph = phaseOf(t)

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* phase bands */}
        <rect x={xOf(0)} y={PAD} width={xOf(ALARM_END) - xOf(0)} height={H - 2 * PAD} fill="#ffb02018" />
        <rect x={xOf(ALARM_END)} y={PAD} width={xOf(RESIST_END) - xOf(ALARM_END)} height={H - 2 * PAD} fill="#2ecc7118" />
        <rect x={xOf(RESIST_END)} y={PAD} width={xOf(100) - xOf(RESIST_END)} height={H - 2 * PAD} fill="#ff6b6b18" />

        <text x={(xOf(0) + xOf(ALARM_END)) / 2} y={PAD - 6} textAnchor="middle" fontSize="9" fill="var(--color-warn)">Alarm</text>
        <text x={(xOf(ALARM_END) + xOf(RESIST_END)) / 2} y={PAD - 6} textAnchor="middle" fontSize="9" fill="var(--color-success)">Resistance</text>
        <text x={(xOf(RESIST_END) + xOf(100)) / 2} y={PAD - 6} textAnchor="middle" fontSize="9" fill="var(--color-danger)">Exhaustion</text>

        {/* normal baseline */}
        <line x1={PAD} y1={yOf(NORMAL)} x2={W - PAD} y2={yOf(NORMAL)} stroke="var(--color-muted)" strokeWidth="1" strokeDasharray="4 4" />
        <text x={W - PAD} y={yOf(NORMAL) - 4} textAnchor="end" fontSize="9" fill="var(--color-muted)">normal resistance</text>

        {/* axes */}
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="var(--color-border)" strokeWidth="1.5" />
        <line x1={PAD} y1={H - PAD} x2={PAD} y2={PAD} stroke="var(--color-border)" strokeWidth="1.5" />
        <text x={W / 2} y={H - 8} textAnchor="middle" fontSize="10" fill="var(--color-muted)">Time under stress →</text>
        <text x={12} y={H / 2} textAnchor="middle" fontSize="10" fill="var(--color-muted)" transform={`rotate(-90 12 ${H / 2})`}>Resistance →</text>

        {/* curve + marker */}
        <path d={CURVE} fill="none" stroke="var(--color-accent)" strokeWidth="2.5" />
        <line ref={lineRef} x1={xOf(t)} y1={H - PAD} x2={xOf(t)} y2={yOf(resistanceAt(t))} stroke="var(--color-ink)" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle ref={dotRef} cx={xOf(t)} cy={yOf(resistanceAt(t))} r="6" fill="var(--color-ink)" />
      </svg>

      <div className="px-1 pt-1">
        <SceneSlider label="Time under a relentless stressor" value={t} min={0} max={100} step={1} unit="" onChange={setT} />
        <p className="mt-2 text-center text-sm font-semibold" style={{ color: ph.color }}>
          {ph.name} phase
        </p>
        <p className="mt-1 text-center text-sm leading-snug text-muted">{ph.note}</p>
      </div>
    </div>
  )
}

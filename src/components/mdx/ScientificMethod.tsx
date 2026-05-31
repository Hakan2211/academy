import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

type Stage = { name: string; desc: string; color: string }

const STAGES: Array<Stage> = [
  { name: 'Observe', desc: 'Notice something in the world that needs explaining — a pattern, a surprise, a question.', color: '#74b9ff' },
  { name: 'Hypothesise', desc: 'Propose a clear, testable explanation. A good hypothesis can be proved wrong.', color: '#a29bfe' },
  { name: 'Predict', desc: 'Work out what *should* happen if the hypothesis is true — a specific, measurable claim.', color: '#fdcb6e' },
  { name: 'Experiment', desc: 'Test the prediction with a fair, controlled experiment. Change one thing at a time.', color: '#55efc4' },
  { name: 'Refine', desc: 'Compare the data to the prediction. Keep, revise, or discard — then go round again.', color: '#fab1a0' },
]

const CX = 200
const CY = 120
const R = 78
const STEP_MS = 2600

// position of node i, starting at the top and going clockwise
function nodePos(i: number) {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / STAGES.length
  return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a), a }
}

// Science isn't a single eureka moment — it's a loop. Watch it turn, or click any
// stage to jump to it. The cycle never really ends: every answer sharpens the next
// question.
export function ScientificMethod() {
  const [active, setActive] = useState(0)
  const activeRef = useRef(active)
  const [paused, setPaused] = useState(false)
  const pausedRef = useRef(paused)

  useEffect(() => { activeRef.current = active }, [active])
  useEffect(() => { pausedRef.current = paused }, [paused])

  useEffect(() => {
    let raf = 0
    let acc = 0
    let last = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = now - last
      last = now
      if (!pausedRef.current) {
        acc += dt
        if (acc >= STEP_MS) {
          acc = 0
          setActive((a) => (a + 1) % STAGES.length)
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const cur = STAGES[active]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 400 240" className="w-full">
        {/* the cycle ring */}
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--color-border)" strokeWidth="2" strokeDasharray="3 5" />

        {/* direction arrowheads spaced around the ring */}
        {[0, 1, 2, 3, 4].map((k) => {
          const a = -Math.PI / 2 + ((k + 0.5) * 2 * Math.PI) / STAGES.length
          const x = CX + R * Math.cos(a)
          const y = CY + R * Math.sin(a)
          // tangent (clockwise) direction
          const tx = -Math.sin(a)
          const ty = Math.cos(a)
          const px = -ty
          const py = tx
          return (
            <polygon
              key={k}
              points={`${x + tx * 6},${y + ty * 6} ${x - tx * 3 + px * 4},${y - ty * 3 + py * 4} ${x - tx * 3 - px * 4},${y - ty * 3 - py * 4}`}
              fill="var(--color-border)"
            />
          )
        })}

        {/* nodes */}
        {STAGES.map((s, i) => {
          const { x, y } = nodePos(i)
          const on = i === active
          return (
            <g key={s.name} className="cursor-pointer" onClick={() => setActive(i)}>
              <circle cx={x} cy={y} r={on ? 22 : 15} fill={on ? s.color : 'var(--color-surface-2)'} stroke={s.color} strokeWidth={on ? 0 : 2} />
              <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill={on ? '#10151f' : 'var(--color-muted)'}>
                {i + 1}
              </text>
            </g>
          )
        })}

        {/* labels just outside each node */}
        {STAGES.map((s, i) => {
          const { a } = nodePos(i)
          const lx = CX + (R + 34) * Math.cos(a)
          const ly = CY + (R + 34) * Math.sin(a)
          const anchor = Math.abs(Math.cos(a)) < 0.3 ? 'middle' : Math.cos(a) > 0 ? 'start' : 'end'
          return (
            <text key={s.name} x={lx} y={ly + 3} textAnchor={anchor} fontSize="11" fontWeight={i === active ? 700 : 400} fill={i === active ? 'var(--color-ink)' : 'var(--color-muted)'}>
              {s.name}
            </text>
          )
        })}
      </svg>

      <div className="px-4 pb-4 pt-1">
        <div className="min-h-[3.5rem] rounded-xl border p-3" style={{ borderColor: cur.color + '66', background: cur.color + '14' }}>
          <span className="font-semibold" style={{ color: cur.color }}>{active + 1}. {cur.name}</span>{' '}
          <span className="text-sm text-muted">{cur.desc}</span>
        </div>
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className={cn(
              'rounded-full border px-4 py-1 text-sm transition-colors',
              paused ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {paused ? '▶ Resume cycle' : '⏸ Pause'}
          </button>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Hunger as a feedback loop that defends a body-weight set point. The
// hypothalamus reads chemical signals: ghrelin (from an empty stomach) shouts
// "eat!", while leptin (from fat cells) whispers "you're full, slow down". Push
// weight away from the set point and watch the loop pull it back — which is part
// of why diets so often rebound.
const SET = 70 // kg set point
const MIN = 58
const MAX = 82
const W = 340
const H = 150
const X0 = 40
const X1 = W - 14
const TOP = 16
const BOT = H - 26

const yFor = (kg: number) => BOT - ((kg - MIN) / (MAX - MIN)) * (BOT - TOP)

export function HungerRegulation() {
  const [defend, setDefend] = useState(true)
  const defendRef = useRef(defend)
  const weight = useRef(SET)
  const history = useRef<Array<number>>(Array(70).fill(SET))
  const traceRef = useRef<SVGPolylineElement | null>(null)
  const markerRef = useRef<SVGCircleElement | null>(null)
  const valueRef = useRef<HTMLSpanElement | null>(null)
  const signalRef = useRef<HTMLParagraphElement | null>(null)

  useEffect(() => {
    defendRef.current = defend
  }, [defend])

  useEffect(() => {
    const N = history.current.length
    let raf = 0
    let acc = 0
    let last = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      // the feedback correction: drift back toward the set point
      if (defendRef.current) weight.current += (SET - weight.current) * 0.0011 * dt
      acc += dt
      if (acc > 60) {
        acc = 0
        history.current.push(weight.current)
        if (history.current.length > N) history.current.shift()
        const pts = history.current.map(
          (g, i) => `${(X0 + (i / (N - 1)) * (X1 - X0)).toFixed(1)},${yFor(g).toFixed(1)}`,
        )
        traceRef.current?.setAttribute('points', pts.join(' '))
        markerRef.current?.setAttribute('cx', String(X1))
        markerRef.current?.setAttribute('cy', yFor(weight.current).toFixed(1))
      }
      if (valueRef.current) valueRef.current.textContent = weight.current.toFixed(1) + ' kg'
      if (signalRef.current) {
        const d = weight.current - SET
        signalRef.current.textContent =
          d < -1.2
            ? '↑ Ghrelin surges + leptin drops → "EAT" → hunger up, metabolism slows'
            : d > 1.2
              ? '↓ Leptin rises → "FULL" → hunger falls, metabolism speeds up'
              : '✓ Near set point — the hypothalamus is satisfied'
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const nudge = (kg: number) => {
    weight.current = Math.max(MIN + 1, Math.min(MAX - 1, weight.current + kg))
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* set-point band */}
        <rect x={X0} y={yFor(SET + 1)} width={X1 - X0} height={yFor(SET - 1) - yFor(SET + 1)} fill="#FF704322" />
        <line x1={X0} y1={yFor(SET)} x2={X1} y2={yFor(SET)} stroke="#FF7043" strokeWidth={1} strokeDasharray="4 4" />
        <text x={X1} y={yFor(SET) - 4} textAnchor="end" fontSize="9" fill="#FF7043">set point</text>
        {/* axes */}
        <line x1={X0} y1={TOP} x2={X0} y2={BOT} stroke="var(--color-border)" strokeWidth={1} />
        <line x1={X0} y1={BOT} x2={X1} y2={BOT} stroke="var(--color-border)" strokeWidth={1} />
        <text x={8} y={H / 2} transform={`rotate(-90 8 ${H / 2})`} textAnchor="middle" fontSize="9" fill="var(--color-muted)">
          body weight
        </text>
        <polyline ref={traceRef} points="" fill="none" stroke="var(--color-accent-2)" strokeWidth={2} />
        <circle ref={markerRef} cx={X1} cy={yFor(SET)} r={4} fill="var(--color-accent-2)" />
      </svg>

      <p ref={signalRef} className="my-1 text-center text-sm font-medium text-ink">
        ✓ Near set point — the hypothalamus is satisfied
      </p>
      <p className="mb-3 text-center text-xs text-muted">
        weight: <span ref={valueRef} className="font-mono text-ink">70.0 kg</span>
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => nudge(-4)}
          className="flex items-center gap-1.5 rounded-full border border-accent bg-accent/15 px-3 py-1.5 text-sm text-accent hover:bg-accent/25"
        >
          <Icon name="TrendingDown" size={14} /> Crash diet (−4 kg)
        </button>
        <button
          type="button"
          onClick={() => nudge(4)}
          className="flex items-center gap-1.5 rounded-full border border-warn bg-warn/15 px-3 py-1.5 text-sm text-warn hover:bg-warn/25"
        >
          <Icon name="TrendingUp" size={14} /> Overeat (+4 kg)
        </button>
        <button
          type="button"
          onClick={() => setDefend((d) => !d)}
          className={cn(
            'rounded-full border px-3 py-1.5 text-sm transition-colors',
            defend ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
          )}
        >
          {defend ? 'Feedback: ON' : 'Feedback: OFF'}
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        With feedback <span className="text-ink">ON</span>, leptin and ghrelin pull weight back toward the defended set
        point. Turn it <span className="text-ink">OFF</span> and the nudge simply stays — no biological correction.
      </p>
    </div>
  )
}

import { useEffect, useRef } from 'react'
import { Icon } from '#/components/ui/Icon'

// Homeostasis by negative feedback. Blood glucose is held near a set point: when
// it rises, insulin brings it down; when it falls, glucagon brings it up. Poke
// it and watch the body correct.
const SET = 90
const N = 80
const X0 = 40
const X1 = 308
const yFor = (g: number) => 150 - (g - 40) * (130 / 120) // 40→150, 160→20

export function Homeostasis() {
  const glucose = useRef(SET)
  const history = useRef<Array<number>>(Array(N).fill(SET))
  const traceRef = useRef<SVGPolylineElement | null>(null)
  const markerRef = useRef<SVGCircleElement | null>(null)
  const valueRef = useRef<HTMLSpanElement | null>(null)
  const hormoneRef = useRef<HTMLParagraphElement | null>(null)

  useEffect(() => {
    let raf = 0
    let acc = 0
    let last = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      // drift back toward the set point (the feedback correction)
      glucose.current += (SET - glucose.current) * 0.0009 * dt
      acc += dt
      if (acc > 70) {
        acc = 0
        history.current.push(glucose.current)
        if (history.current.length > N) history.current.shift()
        const pts = history.current.map((g, i) => `${(X0 + (i / (N - 1)) * (X1 - X0)).toFixed(1)},${yFor(g).toFixed(1)}`)
        traceRef.current?.setAttribute('points', pts.join(' '))
        const lastY = yFor(glucose.current)
        markerRef.current?.setAttribute('cx', String(X1))
        markerRef.current?.setAttribute('cy', lastY.toFixed(1))
      }
      if (valueRef.current) valueRef.current.textContent = Math.round(glucose.current) + ' mg/dL'
      if (hormoneRef.current) {
        const g = glucose.current
        hormoneRef.current.textContent =
          g > 104 ? '🔻 Insulin released → cells take up glucose → level falls'
            : g < 76 ? '🔺 Glucagon released → liver frees glucose → level rises'
              : '✓ Balanced — glucose is near the set point'
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 320 168" className="w-full">
        {/* normal range band */}
        <rect x={X0} y={yFor(100)} width={X1 - X0} height={yFor(80) - yFor(100)} fill="#2ECC7122" />
        <line x1={X0} y1={yFor(SET)} x2={X1} y2={yFor(SET)} stroke="#2ECC71" strokeWidth={1} strokeDasharray="4 4" />
        <text x={X1} y={yFor(SET) - 4} textAnchor="end" className="fill-[#2ECC71] text-[9px]">set point</text>
        {/* axes */}
        <line x1={X0} y1={18} x2={X0} y2={155} stroke="var(--color-border)" strokeWidth={1} />
        <line x1={X0} y1={155} x2={X1} y2={155} stroke="var(--color-border)" strokeWidth={1} />
        <text x={6} y={90} transform="rotate(-90 10 90)" className="fill-muted text-[9px]">blood glucose</text>
        {/* trace */}
        <polyline ref={traceRef} points="" fill="none" stroke="#0984E3" strokeWidth={2} />
        <circle ref={markerRef} cx={X1} cy={yFor(SET)} r={4} fill="#0984E3" />
      </svg>

      <p ref={hormoneRef} className="my-1 text-center text-sm font-medium text-ink">✓ Balanced — glucose is near the set point</p>
      <p className="mb-2 text-center text-xs text-muted">current: <span ref={valueRef} className="font-mono text-ink">90 mg/dL</span></p>

      <div className="flex justify-center gap-2">
        <button type="button" onClick={() => (glucose.current += 50)} className="flex items-center gap-1.5 rounded-full border border-warn bg-warn/15 px-4 py-1.5 text-sm text-warn hover:bg-warn/25">
          <Icon name="Cookie" size={14} /> Eat sugar
        </button>
        <button type="button" onClick={() => (glucose.current -= 40)} className="flex items-center gap-1.5 rounded-full border border-accent bg-accent/15 px-4 py-1.5 text-sm text-accent hover:bg-accent/25">
          <Icon name="Bike" size={14} /> Exercise
        </button>
      </div>
    </div>
  )
}

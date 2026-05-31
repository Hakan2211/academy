import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

const COLS = 10
const ROWS = 10
const TOTAL = COLS * ROWS
const GX = 24
const GY = 26
const GAP = 20
const ALIVE = '#a29bfe'

// plot panel
const PX0 = 262
const PX1 = 442
const PY_TOP = 40
const PY_BASE = 200
const PH = PY_BASE - PY_TOP
const MAX_HL = 5 // half-lives shown on the x-axis

// Radioactive decay is random: you can't say *when* one nucleus will decay, only
// that half of any large batch will be gone after one half-life — then half of
// what's left after the next, and so on. Watch 100 nuclei wink out and trace the
// curve they carve. Shorten the half-life and they go faster; the shape is identical.
export function HalfLifeLab() {
  const [halfLife, setHalfLife] = useState(3) // seconds
  const [seed, setSeed] = useState(0) // bump to reset
  const halfLifeRef = useRef(halfLife)
  const dotRefs = useRef<Array<SVGCircleElement | null>>([])
  const remainRef = useRef<SVGTextElement>(null)
  const hlRef = useRef<SVGTextElement>(null)
  const markerRef = useRef<SVGCircleElement>(null)

  useEffect(() => { halfLifeRef.current = halfLife }, [halfLife])

  useEffect(() => {
    const alive: Array<boolean> = Array.from({ length: TOTAL }, () => true)
    for (let i = 0; i < TOTAL; i++) {
      const el = dotRefs.current[i]
      if (el) {
        el.setAttribute('fill', ALIVE)
        el.setAttribute('opacity', '1')
      }
    }
    let raf = 0
    let start = 0
    let last = 0
    const loop = (now: number) => {
      if (!start) start = now
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      const T = halfLifeRef.current
      const pDecay = 1 - Math.pow(2, -(dt / 1000) / T)
      let remaining = 0
      for (let i = 0; i < TOTAL; i++) {
        if (alive[i]) {
          if (Math.random() < pDecay) {
            alive[i] = false
            const el = dotRefs.current[i]
            if (el) {
              el.setAttribute('fill', 'var(--color-surface-2)')
              el.setAttribute('opacity', '0.5')
            }
          } else {
            remaining++
          }
        }
      }
      const elapsed = (now - start) / 1000
      const hl = Math.min(MAX_HL, elapsed / T)
      const frac = remaining / TOTAL
      if (remainRef.current) remainRef.current.textContent = `${remaining} / ${TOTAL} remaining`
      if (hlRef.current) hlRef.current.textContent = `${hl.toFixed(1)} half-lives elapsed`
      if (markerRef.current) {
        markerRef.current.setAttribute('cx', String(PX0 + (hl / MAX_HL) * (PX1 - PX0)))
        markerRef.current.setAttribute('cy', String(PY_BASE - PH * frac))
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [seed])

  // theoretical N = N0 · 2^(−t/T) curve (universal in half-life units)
  let curve = ''
  for (let i = 0; i <= 50; i++) {
    const hl = (i / 50) * MAX_HL
    const x = PX0 + (hl / MAX_HL) * (PX1 - PX0)
    const y = PY_BASE - PH * Math.pow(2, -hl)
    curve += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)} `
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 460 232" className="w-full">
        {/* nuclei grid */}
        {Array.from({ length: TOTAL }).map((_, i) => {
          const col = i % COLS
          const row = Math.floor(i / COLS)
          return (
            <circle
              key={i}
              ref={(el) => { dotRefs.current[i] = el }}
              cx={GX + col * GAP}
              cy={GY + row * GAP}
              r="7"
              fill={ALIVE}
            />
          )
        })}
        <text ref={remainRef} x="24" y="228" fill="var(--color-ink)" fontSize="12" fontWeight="600">
          {TOTAL} / {TOTAL} remaining
        </text>

        {/* decay-curve panel */}
        <line x1={PX0} y1={PY_TOP} x2={PX0} y2={PY_BASE} stroke="var(--color-border)" strokeWidth="1.5" />
        <line x1={PX0} y1={PY_BASE} x2={PX1 + 6} y2={PY_BASE} stroke="var(--color-border)" strokeWidth="1.5" />
        {/* half markers */}
        <line x1={PX0} y1={PY_TOP + PH * 0.5} x2={PX1} y2={PY_TOP + PH * 0.5} stroke="var(--color-border)" strokeWidth="0.75" strokeDasharray="2 4" />
        <text x={PX0 - 5} y={PY_TOP + 4} fill="var(--color-muted)" fontSize="9" textAnchor="end">100%</text>
        <text x={PX0 - 5} y={PY_TOP + PH * 0.5 + 4} fill="var(--color-muted)" fontSize="9" textAnchor="end">50%</text>
        <path d={curve.trim()} fill="none" stroke="var(--color-muted)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
        <circle ref={markerRef} cx={PX0} cy={PY_TOP} r="4.5" fill={ALIVE} />
        <text ref={hlRef} x={(PX0 + PX1) / 2} y={PY_BASE + 22} fill="var(--color-ink)" fontSize="11" textAnchor="middle">
          0.0 half-lives elapsed
        </text>
      </svg>

      <div className="grid items-end gap-3 border-t border-border px-4 py-3 sm:grid-cols-[1fr_auto]">
        <SceneSlider label="Half-life" value={halfLife} min={1} max={6} step={1} unit="s" onChange={setHalfLife} />
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="rounded-full border border-border px-4 py-1.5 text-sm text-ink hover:bg-surface-2"
        >
          ↺ Reset
        </button>
      </div>

      <p className="px-4 pb-4 text-center text-xs text-muted">
        Each nucleus decays at a random moment, yet the crowd obeys a precise rule: half gone every half-life. The dashed line is the prediction; the dot is your run.
      </p>
    </div>
  )
}

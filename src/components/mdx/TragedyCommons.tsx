import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'
import { clamp } from '#/lib/econ'

// The tragedy of the commons, played out on a shared fishing ground. The stock
// REGENERATES each year in proportion to how full the lake is (logistic growth,
// fastest near half-full). Several boats each haul out fish; under OPEN ACCESS
// every boat grabs as much as it can — individually rational, collectively
// ruinous — and the combined catch outstrips regrowth, so the stock crashes to
// near zero and stays there. Switch on a QUOTA (the fix: property rights /
// regulation that caps the total catch at the sustainable yield) and the stock
// settles at a healthy level that feeds everyone year after year. A small
// animation runs the stock smoothly between yearly steps so the collapse — or
// the steady plateau — is something you watch happen.
const CAP = 100 // carrying capacity of the lake
const GROW = 0.5 // intrinsic regrowth rate

const VX0 = 40
const VW = 300
const VY_TOP = 24
const VY_BASE = 168
const VH = VY_BASE - VY_TOP

export function TragedyCommons() {
  const [boats, setBoats] = useState(4)
  const [quota, setQuota] = useState(false) // false = open access
  const [reset, setReset] = useState(0)

  const boatsRef = useRef(boats)
  const quotaRef = useRef(quota)
  useEffect(() => { boatsRef.current = boats }, [boats])
  useEffect(() => { quotaRef.current = quota }, [quota])

  // live readouts
  const lakeFillRef = useRef<SVGRectElement>(null)
  const lakeWaterRef = useRef<SVGRectElement>(null)
  const yearTextRef = useRef<SVGTextElement>(null)
  const stockTextRef = useRef<SVGTextElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const markerRef = useRef<SVGCircleElement>(null)
  const [verdict, setVerdict] = useState<'ok' | 'crash' | 'running'>('running')

  useEffect(() => {
    let raf = 0
    let last = 0
    let year = 0
    let stock = CAP // start with a full lake
    let displayed = CAP // smoothly animated value
    let acc = 0
    const STEP_MS = 900 // one fishing year
    const MAX_YEARS = 28
    const hist: Array<number> = [CAP]
    let done = false

    const drawPath = () => {
      if (!pathRef.current) return
      let d = ''
      for (let i = 0; i < hist.length; i++) {
        const x = VX0 + (i / (MAX_YEARS - 1)) * VW
        const y = VY_BASE - (hist[i] / CAP) * VH
        d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)} `
      }
      pathRef.current.setAttribute('d', d.trim())
    }

    const render = () => {
      const h = (displayed / CAP) * VH
      if (lakeWaterRef.current) {
        lakeWaterRef.current.setAttribute('y', String(VY_BASE - h))
        lakeWaterRef.current.setAttribute('height', String(Math.max(0, h)))
      }
      if (stockTextRef.current) stockTextRef.current.textContent = `${Math.round(displayed)} / ${CAP}`
      if (yearTextRef.current) yearTextRef.current.textContent = `Year ${year}`
      if (markerRef.current) {
        const i = hist.length - 1
        markerRef.current.setAttribute('cx', String(VX0 + (i / (MAX_YEARS - 1)) * VW))
        markerRef.current.setAttribute('cy', String(VY_BASE - (displayed / CAP) * VH))
      }
    }

    const tick = () => {
      year++
      const n = boatsRef.current
      // each boat WANTS a fixed effort-share of the current stock
      const perBoatWant = stock * 0.22
      let totalCatch = n * perBoatWant
      if (quotaRef.current) {
        // sustainable total allowable catch = the regrowth at half capacity
        const sustainable = GROW * CAP * 0.25 // max sustainable yield
        totalCatch = Math.min(totalCatch, sustainable)
      }
      totalCatch = Math.min(totalCatch, stock)
      // logistic regrowth happens, then the catch is removed
      const regrowth = GROW * stock * (1 - stock / CAP)
      stock = clamp(stock + regrowth - totalCatch, 0, CAP)
      hist.push(stock)
      if (hist.length > MAX_YEARS) hist.shift()
      drawPath()
    }

    setVerdict('running')
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(60, now - last)
      last = now
      if (!done) {
        acc += dt
        while (acc >= STEP_MS) {
          acc -= STEP_MS
          tick()
          if (year >= MAX_YEARS - 1) {
            done = true
            setVerdict(stock < 12 ? 'crash' : 'ok')
            break
          }
        }
      }
      // ease the displayed value toward the true stock each frame
      const target = stock
      displayed += (target - displayed) * Math.min(1, dt * 0.006)
      render()
      raf = requestAnimationFrame(loop)
    }
    drawPath()
    render()
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [reset, quota, boats])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap items-center gap-2 p-3">
        {([['Open access', false], ['Quota / property rights', true]] as Array<[string, boolean]>).map(([label, q]) => (
          <button
            key={label}
            type="button"
            onClick={() => setQuota(q)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              quota === q
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setReset((r) => r + 1)}
          className="ml-auto rounded-full border border-border px-4 py-1 text-sm text-ink hover:bg-surface-2"
        >
          ↺ Replay
        </button>
      </div>

      <svg viewBox="0 0 360 230" className="w-full">
        {/* the lake tank (left) */}
        <text x={68} y={18} textAnchor="middle" fontSize="10" fill="var(--color-muted)">The fish stock</text>
        <rect x={48} y={VY_TOP} width="40" height={VH} rx="4" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="2" />
        <rect ref={lakeFillRef} x={48} y={VY_TOP} width="40" height={VH} rx="4" fill="none" />
        <rect ref={lakeWaterRef} x={48} y={VY_TOP} width="40" height={VH} rx="4" fill="var(--color-accent-2)" opacity="0.85" />
        <text ref={stockTextRef} x={68} y={VY_BASE + 16} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--color-ink)">100 / 100</text>

        {/* the history plot (right) */}
        <line x1={VX0 + 80} y1={VY_TOP} x2={VX0 + 80} y2={VY_BASE} stroke="var(--color-border)" strokeWidth="0" />
        <text x={120} y={18} textAnchor="middle" fontSize="10" fill="var(--color-muted)">Stock over the years</text>
        <line x1={108} y1={VY_BASE} x2={348} y2={VY_BASE} stroke="var(--color-border)" strokeWidth="1.5" />
        <line x1={108} y1={VY_TOP} x2={108} y2={VY_BASE} stroke="var(--color-border)" strokeWidth="1.5" />
        {/* danger zone */}
        <rect x={108} y={VY_BASE - (12 / CAP) * VH} width="240" height={(12 / CAP) * VH} fill="var(--color-muted)" opacity="0.12" />
        <path ref={pathRef} d="" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" />
        <circle ref={markerRef} cx={108} cy={VY_TOP} r="4.5" fill="var(--color-accent)" />
        <text ref={yearTextRef} x={228} y={VY_BASE + 16} textAnchor="middle" fontSize="11" fill="var(--color-ink)">Year 0</text>
      </svg>

      <div className="flex flex-col gap-3 p-4">
        <SceneSlider label="Boats sharing the lake" value={boats} min={1} max={8} step={1} unit="" onChange={setBoats} />
        <div
          className={cn(
            'rounded-xl border px-3 py-2 text-center text-sm',
            verdict === 'crash' ? 'border-accent/50 text-accent'
              : verdict === 'ok' ? 'border-success/50 text-success'
                : 'border-border text-muted',
          )}
        >
          {verdict === 'running' && 'Watch the lake. Each year the stock first regrows, then the boats take their haul…'}
          {verdict === 'crash' && 'Collapse. With open access, no boat has any reason to hold back — whatever you leave, someone else takes. Every boat acting in its own interest drains the shared stock to nothing. That is the tragedy of the commons.'}
          {verdict === 'ok' && 'Sustainable. A quota (or assigning property rights so someone owns the future of the stock) caps the total catch at what the lake can regrow. Self-interest now works WITH conservation, and the stock feeds everyone year after year.'}
        </div>
        {verdict !== 'ok' && !quota && (
          <p className="text-center text-xs text-muted">Add more boats and the crash comes faster. Then switch on a quota.</p>
        )}
      </div>
    </div>
  )
}

import { useEffect, useRef } from 'react'
import { clamp } from '#/lib/econ'

// The business cycle: real GDP doesn't grow smoothly — it oscillates ABOVE and
// BELOW a rising long-run trend. The wave's high points are PEAKS, the low points
// are TROUGHS; the climb from trough to peak is an EXPANSION, the slide from peak
// to trough a RECESSION. A small rAF dot traces the curve so the four phases read
// as a continuous story. Self-contained + robust (no external state, guards
// reduced-motion) — reused by the Aggregate Economy and Policy worlds.

const X0 = 40
const Y0 = 168
const PW = 304
const PH = 150
const N = 240 // sample points across the plot

// trend: a gently rising straight line. cycle: a sine wave whose amplitude is a
// fixed fraction of the plot. realGDP = trend + cycle.
const TREND_LO = 0.22 // fraction of PH at left
const TREND_HI = 0.78 // fraction of PH at right
const AMP = 0.16 // cycle amplitude as fraction of PH
const CYCLES = 1.5 // number of full waves shown

function trendY(t: number) {
  return Y0 - (TREND_LO + (TREND_HI - TREND_LO) * t) * PH
}
function cycleOffset(t: number) {
  return -Math.sin(t * Math.PI * 2 * CYCLES) * AMP * PH
}
function curveY(t: number) {
  return trendY(t) + cycleOffset(t)
}
const sx = (t: number) => X0 + t * PW

// phase markers at the sine extrema. curveY = trendY + cycleOffset, where
// cycleOffset = -sin(t·2π·CYCLES) and a SMALLER y is plotted HIGHER (more GDP).
// GDP is highest (a peak) where the offset is most negative, i.e. sin = +1, which
// first happens at t = (1/4)/CYCLES; the next trough (sin = -1) at t = (3/4)/CYCLES.
const PEAK_T = 0.25 / CYCLES
const TROUGH_T = 0.75 / CYCLES

export function BusinessCycle() {
  const dotRef = useRef<SVGCircleElement | null>(null)

  // trend path + cycle path strings (static)
  let trendPath = ''
  let cyclePath = ''
  for (let i = 0; i <= N; i++) {
    const t = i / N
    trendPath += `${i === 0 ? 'M' : 'L'}${sx(t).toFixed(1)} ${trendY(t).toFixed(1)} `
    cyclePath += `${i === 0 ? 'M' : 'L'}${sx(t).toFixed(1)} ${curveY(t).toFixed(1)} `
  }

  useEffect(() => {
    const dot = dotRef.current
    if (!dot) return
    const place = (t: number) => {
      dot.setAttribute('cx', sx(t).toFixed(1))
      dot.setAttribute('cy', curveY(t).toFixed(1))
    }
    place(0)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    let raf = 0
    let last = 0
    let t = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      t += dt * 0.00009
      if (t > 1) t -= 1
      place(clamp(t, 0, 1))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 210" className="w-full">
        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 16} textAnchor="end" fontSize="11" fill="var(--color-muted)">Time →</text>
        <text x={X0 - 6} y={Y0 - PH} textAnchor="end" fontSize="11" fill="var(--color-muted)">↑ Real GDP</text>

        {/* long-run trend */}
        <path d={trendPath} fill="none" stroke="var(--color-muted)" strokeWidth="1.5" strokeDasharray="6 4" />
        <text x={sx(0.5)} y={trendY(0.5) - 6} fontSize="10" fill="var(--color-muted)" transform={`rotate(-12 ${sx(0.5)} ${trendY(0.5)})`}>long-run trend</text>

        {/* the cyclical real-GDP wave */}
        <path d={cyclePath} fill="none" stroke="var(--color-accent)" strokeWidth="3" />

        {/* peak + trough markers */}
        <circle cx={sx(PEAK_T)} cy={curveY(PEAK_T)} r="4" fill="var(--color-accent-2)" />
        <text x={sx(PEAK_T)} y={curveY(PEAK_T) - 8} textAnchor="middle" fontSize="10" fill="var(--color-accent-2)">peak</text>
        <circle cx={sx(TROUGH_T)} cy={curveY(TROUGH_T)} r="4" fill="var(--color-success)" />
        <text x={sx(TROUGH_T)} y={curveY(TROUGH_T) + 16} textAnchor="middle" fontSize="10" fill="var(--color-success)">trough</text>

        {/* phase labels */}
        <text x={sx((0 + PEAK_T) / 2)} y={curveY((0 + PEAK_T) / 2) - 10} textAnchor="middle" fontSize="9" fill="var(--color-muted)">expansion</text>
        <text x={sx((PEAK_T + TROUGH_T) / 2)} y={curveY((PEAK_T + TROUGH_T) / 2) - 10} textAnchor="middle" fontSize="9" fill="var(--color-muted)">recession</text>
        <text x={sx((TROUGH_T + 1) / 2)} y={curveY((TROUGH_T + 1) / 2) - 10} textAnchor="middle" fontSize="9" fill="var(--color-muted)">expansion</text>

        {/* tracing dot */}
        <circle ref={dotRef} r="5" fill="var(--color-ink)" />
      </svg>

      <div className="flex flex-wrap items-center justify-center gap-3 px-4 pb-4 text-xs text-muted">
        <span className="inline-flex items-center gap-1"><span className="inline-block h-2 w-3 rounded-sm" style={{ background: 'var(--color-accent)' }} /> real GDP</span>
        <span className="inline-flex items-center gap-1"><span className="inline-block h-2 w-3 rounded-sm" style={{ background: 'var(--color-muted)' }} /> trend</span>
        <span className="inline-flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: 'var(--color-accent-2)' }} /> peak</span>
        <span className="inline-flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: 'var(--color-success)' }} /> trough</span>
      </div>
    </div>
  )
}

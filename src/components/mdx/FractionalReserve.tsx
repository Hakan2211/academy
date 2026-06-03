import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { Formula } from '#/components/mdx/Formula'
import { clamp, formatUSD } from '#/lib/econ'

// How banks create money. A first deposit of $1,000 is NOT locked in a vault:
// the bank keeps a reserve fraction and lends the rest out. That loan gets spent
// and redeposited at another bank, which again keeps a fraction and lends the
// rest — and on, and on. Each round is smaller (it is shrunk by the reserve
// ratio every time), so the chain of new deposits sums to a finite total:
//   deposit ÷ reserve ratio  =  deposit × the money multiplier.
// Slide the reserve ratio: a smaller fraction kept back means more is lent at
// every step, so the same first deposit balloons into a much larger money supply.
const INITIAL = 1000
const ROUNDS = 8 // shown rounds (the tail is folded into "+ later rounds")

const VW = 360
const ROW_H = 24
const TOP = 12
const LABEL_W = 38
const TRACK_X = LABEL_W + 6
const TRACK_W = VW - TRACK_X - 8

export function FractionalReserve() {
  const [reservePct, setReservePct] = useState(10) // reserve ratio in %
  const rr = clamp(reservePct, 1, 100) / 100
  const multiplier = 1 / rr

  // successive new deposits: round k = INITIAL × (1 − rr)^k
  const deposits: Array<number> = []
  for (let k = 0; k < ROUNDS; k++) deposits.push(INITIAL * (1 - rr) ** k)
  const shown = deposits.reduce((s, d) => s + d, 0)
  const total = INITIAL * multiplier
  const tail = total - shown // folded later rounds
  const maxDep = deposits[0] // first round is always largest

  // animate the bars growing in from the left (visual only — widths held in refs)
  const barRefs = useRef<Array<SVGRectElement | null>>([])
  const reserveRefs = useRef<Array<SVGRectElement | null>>([])
  const rrRef = useRef(rr)
  useEffect(() => { rrRef.current = rr }, [rr])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const target = (k: number) => INITIAL * (1 - rrRef.current) ** k
    if (reduce) {
      for (let k = 0; k < ROUNDS; k++) {
        const full = (target(k) / INITIAL) * TRACK_W
        const lent = full * (1 - rrRef.current)
        barRefs.current[k]?.setAttribute('width', lent.toFixed(1))
        reserveRefs.current[k]?.setAttribute('x', (TRACK_X + lent).toFixed(1))
        reserveRefs.current[k]?.setAttribute('width', Math.max(0, full - lent).toFixed(1))
      }
      return
    }
    let raf = 0
    let t0 = 0
    const loop = (now: number) => {
      if (!t0) t0 = now
      const p = clamp((now - t0) / 700, 0, 1)
      const ease = 1 - (1 - p) ** 3
      for (let k = 0; k < ROUNDS; k++) {
        const full = (target(k) / INITIAL) * TRACK_W * ease
        const lent = full * (1 - rrRef.current)
        barRefs.current[k]?.setAttribute('width', lent.toFixed(1))
        reserveRefs.current[k]?.setAttribute('x', (TRACK_X + lent).toFixed(1))
        reserveRefs.current[k]?.setAttribute('width', Math.max(0, full - lent).toFixed(1))
      }
      if (p < 1) raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [rr])

  const svgH = TOP + ROUNDS * ROW_H + 20

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox={`0 0 ${VW} ${svgH}`} className="w-full">
        {deposits.map((d, k) => {
          const y = TOP + k * ROW_H
          const full = (d / maxDep) * TRACK_W // unanimated reference width (bar drawn via refs)
          return (
            <g key={k}>
              <text x={LABEL_W} y={y + ROW_H / 2 + 1} textAnchor="end" fontSize="9" fill="var(--color-muted)">
                {k === 0 ? 'start' : `R${k}`}
              </text>
              {/* faint track */}
              <rect x={TRACK_X} y={y + 4} width={full} height={ROW_H - 12} rx="2" fill="var(--color-surface-2)" />
              {/* lent-out portion (the new money) */}
              <rect ref={(el) => { barRefs.current[k] = el }} x={TRACK_X} y={y + 4} width={0} height={ROW_H - 12} rx="2" fill="var(--color-accent)" />
              {/* reserve held back */}
              <rect ref={(el) => { reserveRefs.current[k] = el }} x={TRACK_X} y={y + 4} width={0} height={ROW_H - 12} rx="2" fill="var(--color-accent-2)" />
              <text x={TRACK_X + full + 4} y={y + ROW_H / 2 + 1} fontSize="9" fill="var(--color-muted)">
                {formatUSD(d)}
              </text>
            </g>
          )
        })}
        <text x={TRACK_X} y={TOP + ROUNDS * ROW_H + 12} fontSize="9" fill="var(--color-muted)">
          + later rounds {formatUSD(tail)} … each deposit smaller than the last
        </text>
      </svg>

      <div className="flex items-center justify-center gap-4 px-4 pb-1">
        <span className="inline-flex items-center gap-1 text-xs text-muted"><span className="inline-block h-2 w-3 rounded-sm" style={{ background: 'var(--color-accent)' }} /> lent out (new money)</span>
        <span className="inline-flex items-center gap-1 text-xs text-muted"><span className="inline-block h-2 w-3 rounded-sm" style={{ background: 'var(--color-accent-2)' }} /> reserve held back</span>
      </div>

      <div className="px-4">
        <Formula tex="\text{money multiplier} = \frac{1}{\text{reserve ratio}}" block />
      </div>

      <div className="grid grid-cols-3 gap-2 px-4 text-center text-sm">
        <div><div className="font-mono text-ink">{reservePct}%</div><div className="text-xs text-muted">reserve ratio</div></div>
        <div><div className="font-mono text-accent">×{multiplier.toFixed(1)}</div><div className="text-xs text-muted">money multiplier</div></div>
        <div><div className="font-mono text-success">{formatUSD(total)}</div><div className="text-xs text-muted">total money created</div></div>
      </div>

      <div className="p-4">
        <SceneSlider label="Reserve ratio" value={reservePct} min={1} max={50} step={1} unit="%" onChange={setReservePct} />
        <p className="mt-2 text-sm leading-relaxed text-muted">
          One real {formatUSD(INITIAL)} deposit becomes <span className="text-success">{formatUSD(total)}</span> of money once
          every loan is spent and redeposited. Lower the reserve ratio and banks lend more at each step, so the multiplier —
          and the money supply — grows. Raise it and the chain dies out faster.
        </p>
      </div>
    </div>
  )
}

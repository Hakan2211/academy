import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

const LX = 50
const RX = 370
const MX = 210
const OY = 108
const C = 0.11 // light speed (px/ms)
const VT = 0.045 // train speed (px/ms)
const P = 3000
const LIGHT = '#fdcb6e'
const BLUE = '#0984e3'
const RED = '#e17055'

// Einstein's train. Lightning strikes both ends at once — but "at once" for whom?
// The observer standing on the embankment, exactly between the strikes, gets both
// flashes together. The observer on the train is rushing toward one flash and away
// from the other, so she meets the front flash first. Both are right. Whether two
// distant events are simultaneous depends on how you're moving.
export function Simultaneity() {
  const [frame, setFrame] = useState<'ground' | 'train'>('ground')
  const lp = useRef<SVGCircleElement>(null)
  const rp = useRef<SVGCircleElement>(null)
  const tObs = useRef<SVGGElement>(null)
  const ringM = useRef<SVGCircleElement>(null)
  const ringT = useRef<SVGCircleElement>(null)

  useEffect(() => {
    let raf = 0
    let start = 0
    const near = (a: number, b: number) => Math.max(0, 1 - Math.abs(a - b) / 14)
    const loop = (now: number) => {
      if (!start) start = now
      const s = (now - start) % P
      const xl = Math.min(RX, LX + C * s)
      const xr = Math.max(LX, RX - C * s)
      const xt = MX + VT * s
      lp.current?.setAttribute('cx', xl.toFixed(1))
      rp.current?.setAttribute('cx', xr.toFixed(1))
      tObs.current?.setAttribute('transform', `translate(${(xt - MX).toFixed(1)},0)`)
      ringM.current?.setAttribute('opacity', String(Math.max(near(xl, MX), near(xr, MX))))
      ringT.current?.setAttribute('cx', xt.toFixed(1))
      ringT.current?.setAttribute('opacity', String(Math.max(near(xl, xt), near(xr, xt))))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        {([['ground', 'Embankment observer'], ['train', 'Train observer']] as Array<[typeof frame, string]>).map(
          ([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setFrame(k)}
              className={cn(
                'rounded-full border px-3 py-1 text-sm transition-colors',
                frame === k ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
              )}
            >
              {label}
            </button>
          ),
        )}
      </div>

      <svg viewBox="0 0 420 180" className="w-full">
        {/* embankment */}
        <line x1="20" y1="140" x2="400" y2="140" stroke="var(--color-border)" strokeWidth="2" />
        {/* strike posts */}
        {[LX, RX].map((x) => (
          <g key={x}>
            <line x1={x} y1="60" x2={x} y2="140" stroke={LIGHT} strokeWidth="3" />
            <text x={x} y="52" fill={LIGHT} fontSize="10" fontWeight="700" textAnchor="middle">⚡</text>
          </g>
        ))}

        {/* train (moves with the train observer) */}
        <g ref={tObs}>
          <rect x={MX - 78} y="86" width="156" height="44" rx="8" fill={RED} opacity="0.18" stroke={RED} strokeWidth="1.5" />
          <circle ref={ringT} cx={MX} cy={OY} r="14" fill="none" stroke={RED} strokeWidth="3" opacity="0" />
          <circle cx={MX} cy={OY} r="6" fill={RED} />
          <text x={MX} y={OY - 20} fill={RED} fontSize="10" textAnchor="middle">train (T)</text>
        </g>

        {/* embankment observer */}
        <circle ref={ringM} cx={MX} cy={OY} r="14" fill="none" stroke={BLUE} strokeWidth="3" opacity="0" />
        <circle cx={MX} cy="140" r="6" fill={BLUE} />
        <text x={MX} y="158" fill={BLUE} fontSize="10" textAnchor="middle">ground (M)</text>

        {/* light pulses */}
        <circle ref={lp} cx={LX} cy={OY} r="5" fill={LIGHT} />
        <circle ref={rp} cx={RX} cy={OY} r="5" fill={LIGHT} />
      </svg>

      <p className="px-4 pb-4 pt-1 text-center text-sm text-muted">
        {frame === 'ground'
          ? 'Standing midway, the embankment observer (M) receives both flashes at the same instant — for her, the strikes are simultaneous.'
          : 'Speeding toward the right-hand strike, the train observer (T) meets that flash first — for her, the right strike happened before the left.'}
      </p>
    </div>
  )
}

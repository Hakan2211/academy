import { useState } from 'react'
import { cn } from '#/lib/cn'
import { clamp } from '#/lib/econ'

// Four-step market analysis as a guessing game: read an event, decide WHICH
// curve moves (demand or supply) and WHICH WAY (right = increase, left =
// decrease), then reveal the new equilibrium on a small S&D diagram. The base
// curves are P = 100 − Q (demand) and P = 10 + Q (supply); a shift slides the
// chosen curve's intercept, moving the crossing point.
const X0 = 44
const Y0 = 196
const PW = 230
const PH = 168
const QMAX = 100
const PMAX = 100

type Curve = 'demand' | 'supply'
type Dir = 'right' | 'left'
type Event = {
  id: string
  text: string
  curve: Curve
  dir: Dir
  why: string
}

// dir 'right' = the curve shifts toward higher quantity (increase)
const EVENTS: Array<Event> = [
  {
    id: 'heatwave',
    text: 'A summer heatwave hits — everyone craves ice cream.',
    curve: 'demand',
    dir: 'right',
    why: 'Hotter weather makes buyers want more ice cream at every price: demand increases (shifts right). Price and quantity both rise.',
  },
  {
    id: 'cream',
    text: 'The price of cream (a key input) jumps after a dairy shortage.',
    curve: 'supply',
    dir: 'left',
    why: 'A costlier input makes ice cream more expensive to produce, so sellers offer less at every price: supply decreases (shifts left). Price rises, quantity falls.',
  },
  {
    id: 'tech',
    text: 'A new freezer technology cuts production costs in half.',
    curve: 'supply',
    dir: 'right',
    why: 'Cheaper production lets sellers offer more at every price: supply increases (shifts right). Price falls, quantity rises.',
  },
  {
    id: 'fad',
    text: 'A viral study claims ice cream is bad for you.',
    curve: 'demand',
    dir: 'left',
    why: 'Worse tastes/expectations make buyers want less at every price: demand decreases (shifts left). Price and quantity both fall.',
  },
]

export function MarketShifts() {
  const [eventId, setEventId] = useState(EVENTS[0].id)
  const [pickCurve, setPickCurve] = useState<Curve | null>(null)
  const [pickDir, setPickDir] = useState<Dir | null>(null)
  const [revealed, setRevealed] = useState(false)

  const ev = EVENTS.find((e) => e.id === eventId)!
  const correct = pickCurve === ev.curve && pickDir === ev.dir

  const sx = (q: number) => X0 + (q / QMAX) * PW
  const sy = (p: number) => Y0 - (p / PMAX) * PH

  // base curves
  const dInt = 100
  const sInt = 10
  // applied shift (only after a correct-or-revealed answer, show the TRUE shift)
  const mag = 28
  const showShift = revealed
  const dShift = showShift && ev.curve === 'demand' ? (ev.dir === 'right' ? mag : -mag) : 0
  const sShift = showShift && ev.curve === 'supply' ? (ev.dir === 'right' ? -mag : mag) : 0

  const dInt2 = dInt + dShift
  const sInt2 = sInt + sShift

  const eq = (di: number, si: number) => {
    const q = clamp((di - si) / 2, 0, QMAX)
    return { q, p: si + q }
  }
  const e0 = eq(dInt, sInt)
  const e1 = eq(dInt2, sInt2)

  // line endpoints across the plot
  const demLine = (di: number) => ({ x1: sx(0), y1: sy(di), x2: sx(QMAX), y2: sy(di - QMAX) })
  const supLine = (si: number) => ({ x1: sx(0), y1: sy(si), x2: sx(QMAX), y2: sy(si + QMAX) })
  const d0 = demLine(dInt)
  const s0 = supLine(sInt)
  const d1 = demLine(dInt2)
  const s1 = supLine(sInt2)

  const reset = () => {
    setPickCurve(null)
    setPickDir(null)
    setRevealed(false)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      {/* event cards */}
      <div className="flex flex-col gap-2 p-3">
        {EVENTS.map((e) => (
          <button
            key={e.id}
            type="button"
            onClick={() => { setEventId(e.id); reset() }}
            className={cn(
              'rounded-xl border px-3 py-2 text-left text-sm transition-colors',
              e.id === eventId
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {e.text}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 318 230" className="w-full">
        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 16} textAnchor="end" fontSize="10" fill="var(--color-muted)">Quantity →</text>
        <text x={X0 - 6} y={Y0 - PH + 2} textAnchor="end" fontSize="10" fill="var(--color-muted)">↑ Price</text>

        {/* original curves */}
        <line x1={d0.x1} y1={d0.y1} x2={d0.x2} y2={d0.y2} stroke="var(--color-accent)" strokeWidth="2.5" opacity={showShift ? 0.3 : 1} />
        <line x1={s0.x1} y1={s0.y1} x2={s0.x2} y2={s0.y2} stroke="var(--color-accent-2)" strokeWidth="2.5" opacity={showShift ? 0.3 : 1} />

        {/* shifted curve (after reveal) */}
        {showShift && ev.curve === 'demand' && (
          <line x1={d1.x1} y1={d1.y1} x2={d1.x2} y2={d1.y2} stroke="var(--color-accent)" strokeWidth="3" />
        )}
        {showShift && ev.curve === 'supply' && (
          <line x1={s1.x1} y1={s1.y1} x2={s1.x2} y2={s1.y2} stroke="var(--color-accent-2)" strokeWidth="3" />
        )}

        {/* original equilibrium */}
        <circle cx={sx(e0.q)} cy={sy(e0.p)} r="5" fill="var(--color-ink)" opacity={showShift ? 0.35 : 1} />

        {/* new equilibrium */}
        {showShift && (
          <>
            <line x1={sx(e1.q)} y1={sy(e1.p)} x2={sx(e1.q)} y2={Y0} stroke="var(--color-success)" strokeWidth="1" strokeDasharray="3 2" />
            <line x1={sx(e1.q)} y1={sy(e1.p)} x2={X0} y2={sy(e1.p)} stroke="var(--color-success)" strokeWidth="1" strokeDasharray="3 2" />
            <circle cx={sx(e1.q)} cy={sy(e1.p)} r="5.5" fill="var(--color-success)" />
          </>
        )}
      </svg>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex flex-1 flex-col gap-1">
            <span className="text-xs text-muted">Which curve shifts?</span>
            <div className="flex gap-2">
              {(['demand', 'supply'] as Array<Curve>).map((c) => (
                <button
                  key={c}
                  type="button"
                  disabled={revealed}
                  onClick={() => setPickCurve(c)}
                  className={cn(
                    'flex-1 rounded-full border px-3 py-1 text-sm capitalize transition-colors',
                    pickCurve === c
                      ? 'border-accent bg-accent/15 text-accent'
                      : 'border-border text-muted hover:text-ink',
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <span className="text-xs text-muted">Which way?</span>
            <div className="flex gap-2">
              {(['right', 'left'] as Array<Dir>).map((d) => (
                <button
                  key={d}
                  type="button"
                  disabled={revealed}
                  onClick={() => setPickDir(d)}
                  className={cn(
                    'flex-1 rounded-full border px-3 py-1 text-sm transition-colors',
                    pickDir === d
                      ? 'border-accent bg-accent/15 text-accent'
                      : 'border-border text-muted hover:text-ink',
                  )}
                >
                  {d === 'right' ? 'Right (increase)' : 'Left (decrease)'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {!revealed ? (
          <button
            type="button"
            disabled={!pickCurve || !pickDir}
            onClick={() => setRevealed(true)}
            className={cn(
              'rounded-full border px-3 py-2 text-sm transition-colors',
              pickCurve && pickDir
                ? 'border-accent bg-accent/15 text-accent hover:bg-accent/25'
                : 'border-border text-muted',
            )}
          >
            Reveal the new equilibrium
          </button>
        ) : (
          <>
            <div
              className={cn(
                'rounded-xl border px-3 py-2 text-sm',
                correct ? 'border-success/50 text-success' : 'border-accent/50 text-accent',
              )}
            >
              {correct ? 'Correct! ' : 'Not quite. '}
              {ev.why}
            </div>
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-border px-3 py-1 text-sm text-muted hover:text-ink"
            >
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  )
}

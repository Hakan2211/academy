import { useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'
import { clamp } from '#/lib/econ'

// Price controls on a standard S&D diagram. A price CEILING (a legal maximum,
// e.g. rent control) bites only when set BELOW equilibrium → quantity demanded
// outruns quantity supplied → a shortage (shaded gap). A price FLOOR (a legal
// minimum, e.g. a minimum wage) bites only ABOVE equilibrium → quantity supplied
// outruns demand → a surplus. Drag the controlled price to see the gap open.
const X0 = 48
const Y0 = 250
const PW = 292
const PH = 222
const QMAX = 140
const PMAX = 140

// demand P = 100 − Q ; supply P = 10 + Q  →  equilibrium at Q=45, P=55
const D_INT = 100
const S_INT = 10
const Q_STAR = (D_INT - S_INT) / 2
const P_STAR = S_INT + Q_STAR

type Mode = 'ceiling' | 'floor'

export function PriceControlLab() {
  const [mode, setMode] = useState<Mode>('ceiling')
  const [ctrl, setCtrl] = useState(38) // controlled price

  const sx = (q: number) => X0 + (q / QMAX) * PW
  const sy = (p: number) => Y0 - (p / PMAX) * PH

  const qd = clamp(D_INT - ctrl, 0, QMAX) // quantity demanded at controlled price
  const qs = clamp(ctrl - S_INT, 0, QMAX) // quantity supplied at controlled price

  // Does the control bind? Ceiling binds below P*, floor binds above P*.
  const binds = mode === 'ceiling' ? ctrl < P_STAR : ctrl > P_STAR
  // When a control binds, the quantity traded is the SHORT side of the market.
  const gap = mode === 'ceiling' ? qd - qs : qs - qd // amount of shortage / surplus
  const gapLabel = mode === 'ceiling' ? 'shortage' : 'surplus'
  const gapColor = mode === 'ceiling' ? 'var(--color-accent)' : 'var(--color-accent-2)'

  const dem = { x1: sx(0), y1: sy(D_INT), x2: sx(QMAX), y2: sy(D_INT - QMAX) }
  const sup = { x1: sx(0), y1: sy(S_INT), x2: sx(QMAX), y2: sy(S_INT + QMAX) }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex gap-2 p-3">
        {(['ceiling', 'floor'] as Array<Mode>).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => { setMode(m); setCtrl(m === 'ceiling' ? 38 : 72) }}
            className={cn(
              'flex-1 rounded-full border px-3 py-1 text-sm capitalize transition-colors',
              mode === m
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            Price {m}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 360 290" className="w-full">
        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 18} textAnchor="end" fontSize="11" fill="var(--color-muted)">Quantity →</text>
        <text x={X0 - 6} y={Y0 - PH + 4} textAnchor="end" fontSize="11" fill="var(--color-muted)">↑ Price</text>

        {/* shaded gap between Qs and Qd at the controlled price */}
        {binds && Math.abs(gap) > 0.5 && (
          <line
            x1={sx(Math.min(qd, qs))} y1={sy(ctrl)} x2={sx(Math.max(qd, qs))} y2={sy(ctrl)}
            stroke={gapColor} strokeWidth="8" opacity="0.45"
          />
        )}

        {/* curves */}
        <line x1={dem.x1} y1={dem.y1} x2={dem.x2} y2={dem.y2} stroke="var(--color-accent)" strokeWidth="3" />
        <line x1={sup.x1} y1={sup.y1} x2={sup.x2} y2={sup.y2} stroke="var(--color-accent-2)" strokeWidth="3" />
        <text x={dem.x2 - 12} y={dem.y2 - 4} fontSize="11" fill="var(--color-accent)">D</text>
        <text x={sup.x2 - 12} y={sup.y2 + 12} fontSize="11" fill="var(--color-accent-2)">S</text>

        {/* equilibrium point */}
        <circle cx={sx(Q_STAR)} cy={sy(P_STAR)} r="5" fill="var(--color-ink)" opacity="0.5" />
        <text x={sx(Q_STAR) + 8} y={sy(P_STAR) - 4} fontSize="10" fill="var(--color-muted)">free-market price</text>

        {/* the controlled price line */}
        <line
          x1={X0} y1={sy(ctrl)} x2={X0 + PW} y2={sy(ctrl)}
          stroke={binds ? gapColor : 'var(--color-muted)'} strokeWidth="2.5"
          strokeDasharray={binds ? '0' : '5 4'}
        />
        <text x={X0 + 4} y={sy(ctrl) - 5} fontSize="10" fill={binds ? gapColor : 'var(--color-muted)'}>
          {mode === 'ceiling' ? 'ceiling' : 'floor'}
        </text>

        {/* Qd / Qs ticks when binding */}
        {binds && (
          <>
            <circle cx={sx(qd)} cy={sy(ctrl)} r="4" fill="var(--color-accent)" />
            <circle cx={sx(qs)} cy={sy(ctrl)} r="4" fill="var(--color-accent-2)" />
          </>
        )}
      </svg>

      <div className="grid grid-cols-3 gap-2 px-4 text-center text-sm">
        <div><div className="font-mono text-accent">{Math.round(qd)}</div><div className="text-xs text-muted">demanded</div></div>
        <div><div className="font-mono text-accent-2">{Math.round(qs)}</div><div className="text-xs text-muted">supplied</div></div>
        <div>
          <div className="font-mono" style={{ color: binds ? gapColor : 'var(--color-muted)' }}>
            {binds ? Math.round(Math.abs(gap)) : 0}
          </div>
          <div className="text-xs text-muted">{gapLabel}</div>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <SceneSlider
          label={mode === 'ceiling' ? 'Set the ceiling price' : 'Set the floor price'}
          value={ctrl} min={20} max={90} step={1} unit="" onChange={setCtrl}
        />
        <div
          className={cn(
            'rounded-xl border px-3 py-2 text-sm',
            !binds ? 'border-border text-muted'
              : mode === 'ceiling' ? 'border-accent/50 text-accent'
                : 'border-accent-2/50 text-accent-2',
          )}
        >
          {!binds && mode === 'ceiling' &&
            'A ceiling ABOVE the free-market price does nothing — the market already clears below it. Drag it lower to bite.'}
          {!binds && mode === 'floor' &&
            'A floor BELOW the free-market price does nothing — the market already clears above it. Drag it higher to bite.'}
          {binds && mode === 'ceiling' &&
            `Binding ceiling: at this capped price buyers want ${Math.round(qd)} but sellers offer only ${Math.round(qs)} — a shortage of ${Math.round(gap)}. Think rent control or fuel queues.`}
          {binds && mode === 'floor' &&
            `Binding floor: at this propped-up price sellers offer ${Math.round(qs)} but buyers want only ${Math.round(qd)} — a surplus of ${Math.round(gap)}. Think a minimum wage or farm price supports.`}
        </div>
      </div>
    </div>
  )
}

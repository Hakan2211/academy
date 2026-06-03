import { useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'
import { clamp } from '#/lib/econ'

// A minimum wage is a price FLOOR in the labour market. Below it, employers may
// not legally pay. Set it BELOW the equilibrium wage and nothing happens — firms
// already pay more, so the market clears. Set it ABOVE equilibrium and it bites:
// the high wage tempts MORE workers to look for jobs (quantity supplied rises)
// while firms want FEWER of them (quantity demanded falls). The gap between the
// two — workers who want a job at this wage but can't find one — is a labour
// SURPLUS, which in the labour market we call unemployment. It is shaded along
// the wage-floor line.
const X0 = 48
const Y0 = 250
const PW = 292
const PH = 222
const QMAX = 140
const WMAX = 140

// demand W = 100 − L ; supply W = 10 + L → equilibrium at L=45, W=55
const D_INT = 100
const S_INT = 10
const L_STAR = (D_INT - S_INT) / 2
const W_STAR = S_INT + L_STAR

export function MinimumWageLab() {
  const [floor, setFloor] = useState(78) // the legislated minimum wage

  const sx = (l: number) => X0 + (l / QMAX) * PW
  const sy = (w: number) => Y0 - (w / WMAX) * PH

  const ld = clamp(D_INT - floor, 0, QMAX) // labour demanded by firms at the floor
  const ls = clamp(floor - S_INT, 0, QMAX) // labour supplied by workers at the floor

  const binds = floor > W_STAR // a wage floor bites only above equilibrium
  const unemployed = ls - ld // surplus of labour when binding

  const dem = { x1: sx(0), y1: sy(D_INT), x2: sx(QMAX), y2: sy(D_INT - QMAX) }
  const sup = { x1: sx(0), y1: sy(S_INT), x2: sx(QMAX), y2: sy(S_INT + QMAX) }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 290" className="w-full">
        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 18} textAnchor="end" fontSize="11" fill="var(--color-muted)">Workers (quantity of labour) →</text>
        <text x={X0 - 6} y={Y0 - PH + 4} textAnchor="end" fontSize="11" fill="var(--color-muted)">↑ Wage</text>

        {/* surplus (unemployment) shaded between L demanded and L supplied at the floor */}
        {binds && Math.abs(unemployed) > 0.5 && (
          <line
            x1={sx(ld)} y1={sy(floor)} x2={sx(ls)} y2={sy(floor)}
            stroke="var(--color-accent)" strokeWidth="8" opacity="0.45"
          />
        )}

        {/* curves */}
        <line x1={dem.x1} y1={dem.y1} x2={dem.x2} y2={dem.y2} stroke="var(--color-accent)" strokeWidth="3" />
        <line x1={sup.x1} y1={sup.y1} x2={sup.x2} y2={sup.y2} stroke="var(--color-accent-2)" strokeWidth="3" />
        <text x={dem.x2 - 12} y={dem.y2 - 4} fontSize="11" fill="var(--color-accent)">labour demand</text>
        <text x={sup.x2 - 12} y={sup.y2 + 12} fontSize="11" fill="var(--color-accent-2)">labour supply</text>

        {/* free-market equilibrium */}
        <circle cx={sx(L_STAR)} cy={sy(W_STAR)} r="5" fill="var(--color-ink)" opacity="0.5" />
        <text x={sx(L_STAR) + 8} y={sy(W_STAR) + 14} fontSize="10" fill="var(--color-muted)">market wage</text>

        {/* the minimum-wage floor line */}
        <line
          x1={X0} y1={sy(floor)} x2={X0 + PW} y2={sy(floor)}
          stroke={binds ? 'var(--color-accent)' : 'var(--color-muted)'} strokeWidth="2.5"
          strokeDasharray={binds ? '0' : '5 4'}
        />
        <text x={X0 + 4} y={sy(floor) - 5} fontSize="10" fill={binds ? 'var(--color-accent)' : 'var(--color-muted)'}>
          minimum wage
        </text>

        {/* L demanded / supplied ticks when binding */}
        {binds && (
          <>
            <circle cx={sx(ld)} cy={sy(floor)} r="4" fill="var(--color-accent)" />
            <circle cx={sx(ls)} cy={sy(floor)} r="4" fill="var(--color-accent-2)" />
          </>
        )}
      </svg>

      <div className="grid grid-cols-3 gap-2 px-4 text-center text-sm">
        <div><div className="font-mono text-accent">{Math.round(ld)}</div><div className="text-xs text-muted">jobs offered</div></div>
        <div><div className="font-mono text-accent-2">{Math.round(ls)}</div><div className="text-xs text-muted">workers seeking</div></div>
        <div>
          <div className="font-mono" style={{ color: binds ? 'var(--color-accent)' : 'var(--color-muted)' }}>
            {binds ? Math.round(unemployed) : 0}
          </div>
          <div className="text-xs text-muted">unemployed</div>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <SceneSlider label="Set the minimum wage" value={floor} min={20} max={120} step={1} unit="" onChange={setFloor} />
        <div
          className={cn(
            'rounded-xl border px-3 py-2 text-sm',
            binds ? 'border-accent/50 text-accent' : 'border-border text-muted',
          )}
        >
          {!binds &&
            'This minimum wage sits at or below the market wage, so it does nothing — firms already pay more and the labour market clears. Drag it higher to make it bite.'}
          {binds &&
            `Binding minimum wage: at this wage ${Math.round(ls)} workers want jobs but firms offer only ${Math.round(ld)} — a labour surplus of ${Math.round(unemployed)}, i.e. unemployment. The wage helps those who keep a job but prices the rest out.`}
        </div>
      </div>
    </div>
  )
}

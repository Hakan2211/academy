import { useId, useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'
import { clamp } from '#/lib/econ'

// The aggregate-demand / aggregate-supply model — the master diagram of
// macroeconomics. The PRICE LEVEL sits on the vertical axis, REAL GDP on the
// horizontal. Aggregate demand (AD) slopes DOWN; short-run aggregate supply
// (SRAS) slopes UP; long-run aggregate supply (LRAS) is VERTICAL at the economy's
// POTENTIAL output. The short-run equilibrium is where AD crosses SRAS; comparing
// its real GDP to potential reveals a RECESSIONARY gap (output below potential)
// or an INFLATIONARY gap (above). Sliders shift AD and SRAS; an optional preset
// stages a scenario. Self-contained + robust — reused by the Policy world.
const X0 = 52
const Y0 = 252
const PW = 286
const PH = 224
const YMAX = 140 // real-GDP axis span
const PMAX = 140 // price-level axis span
const POTENTIAL = 70 // potential real GDP — fixed LRAS position

type Scenario = 'balanced' | 'recession' | 'overheating'

const PRESETS: Record<Scenario, { ad: number; sras: number; label: string }> = {
  balanced: { ad: 0, sras: 0, label: 'At potential' },
  recession: { ad: -28, sras: 0, label: 'Recession' },
  overheating: { ad: 28, sras: 0, label: 'Boom' },
}

export function ADASModel({
  scenario = 'balanced',
}: {
  scenario?: Scenario
}) {
  const clipId = useId()
  const [adShift, setAdShift] = useState(PRESETS[scenario].ad) // + = AD right (more demand)
  const [srasShift, setSrasShift] = useState(PRESETS[scenario].sras) // + = SRAS right (more supply)

  // AD: P = aAD - Y ; SRAS: P = aSRAS + Y
  const aAD = 110 + adShift
  const aSRAS = 10 - srasShift
  const yStar = clamp((aAD - aSRAS) / 2, 0, YMAX)
  const pStar = aSRAS + yStar

  const gap = yStar - POTENTIAL // + inflationary, - recessionary
  const state = Math.abs(gap) < 1.5 ? 'potential' : gap < 0 ? 'recessionary' : 'inflationary'

  const sx = (y: number) => X0 + (y / YMAX) * PW
  const sy = (p: number) => Y0 - (p / PMAX) * PH

  // long line endpoints (clipped to the plot box via clipPath)
  const ad = { x1: sx(-20), y1: sy(aAD + 20), x2: sx(160), y2: sy(aAD - 160) }
  const sras = { x1: sx(-20), y1: sy(aSRAS - 20), x2: sx(160), y2: sy(aSRAS + 160) }

  const gapColor = state === 'recessionary' ? 'var(--color-accent)' : 'var(--color-accent-2)'

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 296" className="w-full">
        <defs>
          <clipPath id={clipId}>
            <rect x={X0} y={Y0 - PH} width={PW} height={PH} />
          </clipPath>
        </defs>

        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 18} textAnchor="end" fontSize="11" fill="var(--color-muted)">Real GDP →</text>
        <text x={X0 - 6} y={Y0 - PH + 4} textAnchor="end" fontSize="11" fill="var(--color-muted)">↑ Price level</text>

        {/* output-gap band: between equilibrium GDP and potential GDP */}
        {state !== 'potential' && (
          <rect
            x={sx(Math.min(yStar, POTENTIAL))}
            y={Y0 - PH}
            width={Math.abs(sx(yStar) - sx(POTENTIAL))}
            height={PH}
            fill={gapColor}
            opacity="0.1"
          />
        )}

        <g clipPath={`url(#${clipId})`}>
          {/* curves */}
          <line x1={ad.x1} y1={ad.y1} x2={ad.x2} y2={ad.y2} stroke="var(--color-accent)" strokeWidth="3" />
          <line x1={sras.x1} y1={sras.y1} x2={sras.x2} y2={sras.y2} stroke="var(--color-accent-2)" strokeWidth="3" />

          {/* equilibrium guides + point */}
          <line x1={sx(yStar)} y1={sy(pStar)} x2={sx(yStar)} y2={Y0} stroke="var(--color-ink)" strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
          <line x1={sx(yStar)} y1={sy(pStar)} x2={X0} y2={sy(pStar)} stroke="var(--color-ink)" strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
          <circle cx={sx(yStar)} cy={sy(pStar)} r="6" fill="var(--color-ink)" />
        </g>

        {/* long-run aggregate supply: vertical at potential output */}
        <line x1={sx(POTENTIAL)} y1={Y0} x2={sx(POTENTIAL)} y2={Y0 - PH} stroke="var(--color-success)" strokeWidth="2.5" strokeDasharray="7 4" />
        <text x={sx(POTENTIAL)} y={Y0 - PH - 4} textAnchor="middle" fontSize="10" fill="var(--color-success)">LRAS</text>
        <text x={sx(POTENTIAL)} y={Y0 + 16} textAnchor="middle" fontSize="9" fill="var(--color-success)">potential</text>

        {/* curve labels */}
        <text x={clamp(ad.x2 - 14, X0, X0 + PW)} y={clamp(ad.y2 + 4, 22, Y0)} fontSize="11" fill="var(--color-accent)">AD</text>
        <text x={X0 + PW - 18} y={clamp(sy(aSRAS + YMAX) + 6, 22, Y0)} fontSize="11" fill="var(--color-accent-2)">SRAS</text>
      </svg>

      <div className="grid grid-cols-2 gap-2 px-4 text-center text-sm">
        <div><div className="font-mono text-ink">{Math.round(pStar)}</div><div className="text-xs text-muted">price level</div></div>
        <div><div className="font-mono text-ink">{Math.round(yStar)}</div><div className="text-xs text-muted">real GDP (potential {POTENTIAL})</div></div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <SceneSlider label="Shift aggregate demand (AD)" value={adShift} min={-40} max={40} step={1} unit="" onChange={setAdShift} />
        <SceneSlider label="Shift short-run supply (SRAS)" value={srasShift} min={-40} max={40} step={1} unit="" onChange={setSrasShift} />
        <div
          className={cn(
            'rounded-xl border px-3 py-2 text-center text-sm',
            state === 'potential' ? 'border-success/50 text-success'
              : state === 'recessionary' ? 'border-accent/50 text-accent'
                : 'border-accent-2/50 text-accent-2',
          )}
        >
          {state === 'potential' && 'At potential: equilibrium real GDP sits right on the LRAS — full employment, no output gap.'}
          {state === 'recessionary' && `Recessionary gap: equilibrium GDP is ${Math.round(-gap)} below potential. Output is wasted and unemployment is high.`}
          {state === 'inflationary' && `Inflationary gap: equilibrium GDP is ${Math.round(gap)} above potential. The economy is overheating and the price level is bid up.`}
        </div>
      </div>
    </div>
  )
}

import { useId, useState } from 'react'
import { cn } from '#/lib/cn'

// Fiscal policy on the AD/AS diagram. The economy starts in a RECESSION — short-run
// equilibrium real GDP sits BELOW potential (the recessionary gap). Government has
// two levers to push aggregate demand back toward potential: change its own
// SPENDING (G), or change TAXES (which works on consumption C). Spending up or
// taxes down are EXPANSIONARY — they shift AD RIGHT and close a recessionary gap.
// Spending down or taxes up are CONTRACTIONARY — they shift AD LEFT, the right
// medicine for an overheating economy. Pick a response and watch AD slide toward
// the vertical LRAS at potential output. A focused cousin of <ADASModel />.
const X0 = 50
const Y0 = 248
const PW = 288
const PH = 218
const YMAX = 140
const PMAX = 140
const POTENTIAL = 70 // potential real GDP — the vertical LRAS

type Lever = 'spend-up' | 'tax-cut' | 'spend-down' | 'tax-up' | 'none'

const LEVERS: Array<{ key: Lever; label: string; shift: number; stance: 'exp' | 'con' | 'none' }> = [
  { key: 'spend-up', label: 'Raise spending (G↑)', shift: 48, stance: 'exp' },
  { key: 'tax-cut', label: 'Cut taxes', shift: 34, stance: 'exp' },
  { key: 'tax-up', label: 'Raise taxes', shift: -34, stance: 'con' },
  { key: 'spend-down', label: 'Cut spending (G↓)', shift: -48, stance: 'con' },
]

type Start = 'recession' | 'overheating'

export function FiscalPolicyLab({ start = 'recession' }: { start?: Start }) {
  const clipId = useId()
  const [lever, setLever] = useState<Lever>('none')

  // baseline AD intercept: a recession sits left of potential (gap −24), a boom
  // right of it (gap +24). The full-strength lever (spending ±48) closes the gap;
  // an equal-sized tax change (±34) does less — spending packs a bigger punch.
  const aAD0 = start === 'recession' ? 102 : 198
  const aSRAS = 10
  const picked = LEVERS.find((l) => l.key === lever)
  const aAD = aAD0 + (picked?.shift ?? 0)

  const eq = (ad: number) => {
    const y = Math.max(0, Math.min(YMAX, (ad - aSRAS) / 2))
    return { y, p: aSRAS + y }
  }
  const before = eq(aAD0)
  const after = eq(aAD)
  const gap = after.y - POTENTIAL
  const atPotential = Math.abs(gap) < 2

  const sx = (y: number) => X0 + (y / YMAX) * PW
  const sy = (p: number) => Y0 - (p / PMAX) * PH

  // AD lines (slope -1), clipped to the plot box
  const adLine = (intercept: number) => ({
    x1: sx(-20), y1: sy(intercept + 20),
    x2: sx(160), y2: sy(intercept - 160),
  })
  const ad0 = adLine(aAD0)
  const adNow = adLine(aAD)
  const sras = { x1: sx(-20), y1: sy(aSRAS - 20), x2: sx(160), y2: sy(aSRAS + 160) }

  const stance = picked?.stance ?? 'none'

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        {LEVERS.map((l) => (
          <button
            key={l.key}
            type="button"
            onClick={() => setLever((cur) => (cur === l.key ? 'none' : l.key))}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              lever === l.key
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {l.label}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 360 290" className="w-full">
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

        {/* output-gap band: between current equilibrium GDP and potential */}
        {!atPotential && (
          <rect
            x={sx(Math.min(after.y, POTENTIAL))}
            y={Y0 - PH}
            width={Math.abs(sx(after.y) - sx(POTENTIAL))}
            height={PH}
            fill={gap < 0 ? 'var(--color-accent)' : 'var(--color-accent-2)'}
            opacity="0.1"
          />
        )}

        <g clipPath={`url(#${clipId})`}>
          {/* starting AD (faint) when a lever is active */}
          {lever !== 'none' && (
            <line x1={ad0.x1} y1={ad0.y1} x2={ad0.x2} y2={ad0.y2} stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="5 4" opacity="0.35" />
          )}
          {/* SRAS */}
          <line x1={sras.x1} y1={sras.y1} x2={sras.x2} y2={sras.y2} stroke="var(--color-accent-2)" strokeWidth="3" />
          {/* current AD (bold) */}
          <line x1={adNow.x1} y1={adNow.y1} x2={adNow.x2} y2={adNow.y2} stroke="var(--color-accent)" strokeWidth="3" />

          {/* move arrow from old to new equilibrium */}
          {lever !== 'none' && (
            <line x1={sx(before.y)} y1={sy(before.p)} x2={sx(after.y)} y2={sy(after.p)} stroke="var(--color-ink)" strokeWidth="1.5" strokeDasharray="4 3" />
          )}
          <circle cx={sx(after.y)} cy={sy(after.p)} r="6" fill="var(--color-ink)" />
        </g>

        {/* LRAS: vertical at potential */}
        <line x1={sx(POTENTIAL)} y1={Y0} x2={sx(POTENTIAL)} y2={Y0 - PH} stroke="var(--color-success)" strokeWidth="2.5" strokeDasharray="7 4" />
        <text x={sx(POTENTIAL)} y={Y0 - PH - 4} textAnchor="middle" fontSize="10" fill="var(--color-success)">LRAS</text>
        <text x={sx(POTENTIAL)} y={Y0 + 16} textAnchor="middle" fontSize="9" fill="var(--color-success)">potential</text>

        {/* curve labels */}
        <text x={Math.max(X0, Math.min(X0 + PW, adNow.x2 - 14))} y={Math.max(22, Math.min(Y0, adNow.y2 + 4))} fontSize="11" fill="var(--color-accent)">AD</text>
        <text x={X0 + PW - 18} y={Math.max(22, Math.min(Y0, sy(aSRAS + YMAX) + 6))} fontSize="11" fill="var(--color-accent-2)">SRAS</text>
      </svg>

      <div className="grid grid-cols-2 gap-2 px-4 text-center text-sm">
        <div><div className="font-mono text-ink">{Math.round(after.y)}</div><div className="text-xs text-muted">real GDP (potential {POTENTIAL})</div></div>
        <div><div className="font-mono text-ink">{Math.round(after.p)}</div><div className="text-xs text-muted">price level</div></div>
      </div>

      <div className="p-4">
        <div
          className={cn(
            'rounded-xl border px-3 py-2 text-center text-sm',
            atPotential ? 'border-success/50 text-success'
              : gap < 0 ? 'border-accent/50 text-accent'
                : 'border-accent-2/50 text-accent-2',
          )}
        >
          {lever === 'none' && start === 'recession' && `Recession: output is ${Math.round(-gap)} below potential — a recessionary gap. Choose an expansionary response to shift AD right.`}
          {lever === 'none' && start === 'overheating' && `Overheating: output is ${Math.round(gap)} above potential — an inflationary gap. Choose a contractionary response to shift AD left.`}
          {lever !== 'none' && atPotential && `${stance === 'exp' ? 'Expansionary' : 'Contractionary'} fiscal policy did the job — AD shifted ${stance === 'exp' ? 'right' : 'left'} and output is back at potential, the gap closed.`}
          {lever !== 'none' && !atPotential && gap < 0 && `${stance === 'exp' ? 'Expansionary' : 'Contractionary'} policy: this ${stance === 'con' ? 'shifts AD the wrong way — output is now ' + Math.round(-gap) + ' below potential. A recession needs stimulus, not restraint.' : 'helps, but output is still ' + Math.round(-gap) + ' below potential.'}`}
          {lever !== 'none' && !atPotential && gap > 0 && `${stance === 'exp' ? 'Expansionary' : 'Contractionary'} policy: output is now ${Math.round(gap)} above potential — ${stance === 'exp' ? 'expansionary policy overshot a recovering economy into a boom.' : 'still an inflationary gap; tighten further.'}`}
        </div>
      </div>
    </div>
  )
}

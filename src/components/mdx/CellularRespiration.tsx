import { useState } from 'react'
import { cn } from '#/lib/cn'

// Respiration releases the energy in glucose to recharge ATP. With oxygen
// (aerobic) it releases a LOT; without oxygen (anaerobic) it releases little and
// leaves a by-product. Compare the three.
type Mode = 'aerobic' | 'muscle' | 'yeast'

const DATA: Record<Mode, { label: string; eq: string; atp: number; note: string }> = {
  aerobic: {
    label: 'Aerobic (with oxygen)',
    eq: 'glucose + oxygen → carbon dioxide + water',
    atp: 38,
    note: 'Happens in the mitochondria. Oxygen lets glucose be fully broken down, releasing a large amount of energy.',
  },
  muscle: {
    label: 'Anaerobic — your muscles',
    eq: 'glucose → lactic acid',
    atp: 2,
    note: 'During hard exercise, oxygen runs short. Muscles release energy without it, but build up lactic acid — the burn and the "oxygen debt" you repay by panting.',
  },
  yeast: {
    label: 'Anaerobic — yeast (fermentation)',
    eq: 'glucose → ethanol + carbon dioxide',
    atp: 2,
    note: 'Yeast does anaerobic respiration too — making the ethanol in beer and wine and the CO₂ that makes bread rise.',
  },
}

export function CellularRespiration() {
  const [mode, setMode] = useState<Mode>('aerobic')
  const d = DATA[mode]
  const aerobic = mode === 'aerobic'

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {(Object.keys(DATA) as Array<Mode>).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              mode === m ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {m === 'aerobic' ? 'Aerobic' : m === 'muscle' ? 'Muscle' : 'Yeast'}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 360 120" className="w-full">
        {/* the cell / mitochondrion */}
        {aerobic ? (
          <g transform="translate(180 56)">
            <ellipse rx={48} ry={28} fill="#c0392b" stroke="#ff7a66" strokeWidth={2} />
            <path d="M -34 0 Q -22 -14 -10 0 Q 2 14 14 0 Q 26 -14 34 0" fill="none" stroke="#ffd2c9" strokeWidth={1.6} />
            <text y={44} textAnchor="middle" className="fill-muted text-[9px]">mitochondrion</text>
          </g>
        ) : (
          <g transform="translate(180 56)">
            <circle r={30} fill="#10243a" stroke="#4FD1C5" strokeWidth={2} />
            <text y={48} textAnchor="middle" className="fill-muted text-[9px]">cytoplasm (no O₂)</text>
          </g>
        )}
        {/* glucose in */}
        <text x={50} y={60} textAnchor="middle" className="fill-[#FDCB6E] text-[11px] font-semibold">glucose</text>
        <line x1={84} y1={56} x2={128} y2={56} stroke="#94a3b8" strokeWidth={2} />
        {aerobic && <text x={50} y={78} textAnchor="middle" className="fill-[#7CFC9A] text-[10px]">+ oxygen</text>}
        {/* products out */}
        <line x1={232} y1={56} x2={276} y2={56} stroke="#94a3b8" strokeWidth={2} />
        <text x={318} y={60} textAnchor="middle" className="fill-muted text-[10px]">products</text>
      </svg>

      <p className="mb-1 text-center text-xs font-mono text-muted">{d.eq}</p>

      {/* ATP yield bar */}
      <div className="mb-2 mt-2">
        <div className="mb-1 flex items-center justify-between text-xs text-muted">
          <span>ATP yield per glucose</span>
          <span className="font-mono text-ink">~{d.atp} ATP</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${(d.atp / 38) * 100}%` }} />
        </div>
      </div>

      <p className="rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted">{d.note}</p>
    </div>
  )
}

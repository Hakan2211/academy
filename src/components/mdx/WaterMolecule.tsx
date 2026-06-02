import { useState } from 'react'
import { cn } from '#/lib/cn'

// Water's superpower is its lopsided charge. Oxygen hogs the electrons (δ-) and
// the hydrogens go slightly positive (δ+), so water molecules stick to each
// other and to other charged things. Explore polarity, hydrogen bonds, and why
// water dissolves so much.
type Tab = 'polarity' | 'bonds' | 'solvent'

const INFO: Record<Tab, string> = {
  polarity: 'Each water is polar: oxygen pulls electrons toward itself (δ−), leaving the hydrogens slightly positive (δ+). One molecule, two opposite ends.',
  bonds: 'Opposite charges attract, so the δ+ hydrogen of one water is drawn to the δ− oxygen of another. These hydrogen bonds make water cohesive — they cause surface tension and let water climb up plants.',
  solvent: 'Polar water surrounds charged particles (like the Na+ and Cl− in salt), pulling them apart and dissolving them. That’s why water is life’s great solvent — most of biology happens dissolved in it.',
}

function Water({ x, y, hi }: { x: number; y: number; hi: boolean }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x - 16} y2={y + 14} stroke="#64748b" strokeWidth={2} />
      <line x1={x} y1={y} x2={x + 16} y2={y + 14} stroke="#64748b" strokeWidth={2} />
      <circle cx={x} cy={y} r={13} fill="#e74c3c" />
      <text x={x} y={y + 4} textAnchor="middle" className="fill-white text-[10px] font-bold">O</text>
      {hi && <text x={x + 16} y={y - 6} textAnchor="middle" className="fill-[#FF7A66] text-[9px]">δ−</text>}
      <circle cx={x - 16} cy={y + 14} r={8} fill="#cbd5e1" />
      <circle cx={x + 16} cy={y + 14} r={8} fill="#cbd5e1" />
      {hi && <text x={x - 24} y={y + 30} textAnchor="middle" className="fill-[#4F8CFF] text-[9px]">δ+</text>}
    </g>
  )
}

export function WaterMolecule() {
  const [tab, setTab] = useState<Tab>('polarity')

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 360 180" className="w-full">
        {tab === 'solvent' ? (
          <>
            {/* a salt ion being surrounded (hydration) */}
            <circle cx={180} cy={90} r={18} fill="#A29BFE" />
            <text x={180} y={94} textAnchor="middle" className="fill-white text-[11px] font-bold">Na+</text>
            {[0, 60, 120, 180, 240, 300].map((a) => {
              const r = (a * Math.PI) / 180
              return <Water key={a} x={180 + Math.cos(r) * 58} y={90 + Math.sin(r) * 50} hi={false} />
            })}
            <text x={180} y={170} textAnchor="middle" className="fill-muted text-[10px]">water pulls the ion out of the crystal</text>
          </>
        ) : (
          <>
            {/* hydrogen-bonded cluster */}
            {tab === 'bonds' && (
              <>
                <line x1={120} y1={70} x2={170} y2={56} stroke="#4F8CFF" strokeWidth={1.6} strokeDasharray="3 3" />
                <line x1={196} y1={84} x2={250} y2={70} stroke="#4F8CFF" strokeWidth={1.6} strokeDasharray="3 3" />
                <line x1={150} y1={96} x2={150} y2={130} stroke="#4F8CFF" strokeWidth={1.6} strokeDasharray="3 3" />
              </>
            )}
            <Water x={104} y={56} hi={tab === 'polarity'} />
            <Water x={186} y={70} hi={tab === 'polarity'} />
            <Water x={266} y={56} hi={tab === 'polarity'} />
            <Water x={150} y={120} hi={tab === 'polarity'} />
            {tab === 'bonds' && <text x={210} y={170} textAnchor="middle" className="fill-muted text-[10px]">dashed lines = hydrogen bonds</text>}
          </>
        )}
      </svg>

      <div className="mt-2 flex flex-wrap gap-2">
        {(Object.keys(INFO) as Array<Tab>).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm capitalize transition-colors',
              tab === t ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {t === 'bonds' ? 'Hydrogen bonds' : t}
          </button>
        ))}
      </div>

      <p className="mt-2 rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted">{INFO[tab]}</p>
    </div>
  )
}

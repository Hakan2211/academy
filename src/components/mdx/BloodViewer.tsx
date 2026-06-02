import { useState } from 'react'
import { cn } from '#/lib/cn'

// Two views of the transport system: what blood is made of, and the three kinds
// of vessel that carry it.
type Tab = 'blood' | 'vessels'

const PARTS = [
  { id: 'plasma', label: 'Plasma', color: '#FDCB6E', fn: 'The pale yellow liquid (mostly water) that carries everything: cells, nutrients, CO₂, hormones, and heat.' },
  { id: 'red', label: 'Red blood cells', color: '#E74C3C', fn: 'Packed with haemoglobin to carry oxygen. No nucleus and a biconcave disc shape — all to maximise oxygen capacity.' },
  { id: 'white', label: 'White blood cells', color: '#ECF0F1', fn: 'The immune defenders — they engulf microbes and produce antibodies to fight infection.' },
  { id: 'platelets', label: 'Platelets', color: '#A29BFE', fn: 'Tiny cell fragments that clump together to clot blood and seal wounds.' },
]

const VESSELS = [
  { id: 'artery', label: 'Artery', fn: 'Carries blood AWAY from the heart at high pressure. Thick, muscular, elastic walls; a narrow lumen.' },
  { id: 'vein', label: 'Vein', fn: 'Returns blood TO the heart at low pressure. Thinner walls, a wide lumen, and valves to stop backflow.' },
  { id: 'capillary', label: 'Capillary', fn: 'Microscopic vessels where exchange happens. Walls just one cell thick, so substances diffuse in and out easily.' },
]

export function BloodViewer() {
  const [tab, setTab] = useState<Tab>('blood')
  const [selB, setSelB] = useState('red')
  const [selV, setSelV] = useState('artery')
  const part = PARTS.find((p) => p.id === selB)!
  const vessel = VESSELS.find((v) => v.id === selV)!

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex gap-2">
        {(['blood', 'vessels'] as Array<Tab>).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={cn('rounded-full border px-3 py-1 text-sm capitalize transition-colors', tab === t ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}>
            {t === 'blood' ? "What's in blood" : 'Blood vessels'}
          </button>
        ))}
      </div>

      {tab === 'blood' ? (
        <>
          <svg viewBox="0 0 320 90" className="w-full">
            <rect x={10} y={10} width={300} height={70} rx={10} fill="#FDCB6E22" stroke="#FDCB6E" strokeWidth={1.5} />
            {Array.from({ length: 14 }).map((_, i) => (
              <circle key={i} cx={30 + (i % 7) * 40} cy={30 + Math.floor(i / 7) * 30} r={9} fill="#E74C3C" />
            ))}
            <circle cx={150} cy={45} r={13} fill="#ECF0F1" stroke="#94a3b8" />
            <circle cx={260} cy={32} r={5} fill="#A29BFE" />
            <circle cx={285} cy={58} r={5} fill="#A29BFE" />
          </svg>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {PARTS.map((p) => (
              <button key={p.id} type="button" onClick={() => setSelB(p.id)} className={cn('rounded-full border px-2.5 py-0.5 text-xs transition-colors', selB === p.id ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}>
                {p.label}
              </button>
            ))}
          </div>
          <p className="mt-2 rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted">
            <span className="font-semibold" style={{ color: part.color }}>{part.label}: </span>{part.fn}
          </p>
        </>
      ) : (
        <>
          <svg viewBox="0 0 320 90" className="w-full">
            {/* artery: thick wall narrow lumen */}
            <g onClick={() => setSelV('artery')} className="cursor-pointer">
              <circle cx={55} cy={45} r={32} fill="#E74C3C" stroke={selV === 'artery' ? '#FACC15' : '#0e1c2e'} strokeWidth={2} />
              <circle cx={55} cy={45} r={9} fill="#0e1c2e" />
              <text x={55} y={86} textAnchor="middle" className="fill-muted text-[9px]">artery</text>
            </g>
            {/* vein: thin wall wide lumen */}
            <g onClick={() => setSelV('vein')} className="cursor-pointer">
              <circle cx={160} cy={45} r={32} fill="#2d6cb8" stroke={selV === 'vein' ? '#FACC15' : '#0e1c2e'} strokeWidth={2} />
              <circle cx={160} cy={45} r={22} fill="#0e1c2e" />
              <text x={160} y={86} textAnchor="middle" className="fill-muted text-[9px]">vein</text>
            </g>
            {/* capillary: tiny, one cell thick */}
            <g onClick={() => setSelV('capillary')} className="cursor-pointer">
              <circle cx={265} cy={45} r={16} fill="#c0392b" stroke={selV === 'capillary' ? '#FACC15' : '#0e1c2e'} strokeWidth={1.5} />
              <circle cx={265} cy={45} r={11} fill="#0e1c2e" />
              <text x={265} y={86} textAnchor="middle" className="fill-muted text-[9px]">capillary</text>
            </g>
          </svg>
          <p className="mt-2 rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted">
            <span className="font-semibold text-ink">{vessel.label}: </span>{vessel.fn}
          </p>
        </>
      )}
    </div>
  )
}

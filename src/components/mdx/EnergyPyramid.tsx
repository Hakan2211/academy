import { useState } from 'react'

// Energy flows up a food chain, but most is lost at each step. Only about 10%
// passes to the next level — which is why pyramids of energy taper so sharply and
// food chains are short. Click a level.
const LEVELS = [
  { label: 'Tertiary consumers', eg: 'e.g. eagle, fox', energy: 100, w: 70, color: '#E74C3C', note: 'Top predators. With so little energy left up here, there are very few of them — and food chains rarely go higher.' },
  { label: 'Secondary consumers', eg: 'e.g. small birds', energy: 1000, w: 130, color: '#E67E22', note: 'Carnivores that eat the herbivores. They receive only ~10% of the energy the herbivores held.' },
  { label: 'Primary consumers', eg: 'e.g. rabbits, insects', energy: 10000, w: 200, color: '#FDCB6E', note: 'Herbivores that eat the producers — getting ~10% of the energy the plants captured.' },
  { label: 'Producers', eg: 'e.g. grass, trees', energy: 100000, w: 280, color: '#2ECC71', note: 'Plants capture sunlight by photosynthesis. They hold the most energy — the base that feeds everything above.' },
]

export function EnergyPyramid() {
  const [sel, setSel] = useState(3)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 320 200" className="w-full">
        {LEVELS.map((lv, i) => {
          const y = 16 + i * 44
          const wTop = i === 0 ? lv.w : LEVELS[i - 1].w
          const cx = 160
          const on = sel === i
          return (
            <g key={i} onClick={() => setSel(i)} className="cursor-pointer">
              <path
                d={`M ${cx - wTop / 2} ${y} L ${cx + wTop / 2} ${y} L ${cx + lv.w / 2} ${y + 40} L ${cx - lv.w / 2} ${y + 40} Z`}
                fill={lv.color}
                opacity={on ? 1 : 0.8}
                stroke={on ? '#FACC15' : 'var(--color-surface)'}
                strokeWidth={on ? 3 : 1.5}
              />
              <text x={cx} y={y + 25} textAnchor="middle" className="fill-[#0e1c2e] text-[11px] font-semibold">
                {lv.energy.toLocaleString()} kJ
              </text>
            </g>
          )
        })}
        {/* 10% arrows */}
        {[0, 1, 2].map((i) => (
          <text key={i} x={296} y={60 + i * 44} className="fill-muted text-[9px]">↑ 10%</text>
        ))}
        <text x={20} y={196} className="fill-muted text-[9px]">90% lost at each step (heat, movement, waste)</text>
      </svg>

      <div className="mt-1 rounded-lg bg-surface-2 px-3 py-2">
        <p className="text-sm font-semibold" style={{ color: LEVELS[sel].color }}>
          {LEVELS[sel].label} <span className="text-xs font-normal text-muted">· {LEVELS[sel].eg}</span>
        </p>
        <p className="mt-0.5 text-sm text-muted">{LEVELS[sel].note}</p>
      </div>
    </div>
  )
}

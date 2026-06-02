import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

// A "powers of ten" tour of biology: drag from a single DNA molecule up to the
// whole living planet. Each rung is ~10× the last, so life spans more than ten
// orders of magnitude in size.
type Tier = { label: string; size: string; metres: number; emoji: string; note: string }

const TIERS: Array<Tier> = [
  { label: 'DNA molecule', size: '2 nm', metres: 2e-9, emoji: '🧬', note: 'The width of the double helix that stores your genes.' },
  { label: 'Protein', size: '10 nm', metres: 1e-8, emoji: '🔘', note: 'A folded molecular machine — a hundred fit across a virus.' },
  { label: 'Virus', size: '100 nm', metres: 1e-7, emoji: '🦠', note: 'Far smaller than a cell — it can only copy itself inside one.' },
  { label: 'Mitochondrion', size: '1 µm', metres: 1e-6, emoji: '🔋', note: 'A cell’s power plant — about the size of a bacterium.' },
  { label: 'Bacterium', size: '2 µm', metres: 2e-6, emoji: '🧫', note: 'A whole living cell with no nucleus.' },
  { label: 'Animal cell', size: '20 µm', metres: 2e-5, emoji: '⚪', note: 'Ten times wider than a bacterium — still invisible to the eye.' },
  { label: 'Human hair (width)', size: '100 µm', metres: 1e-4, emoji: '〰️', note: 'About the limit of what your unaided eye can resolve.' },
  { label: 'Ant', size: '5 mm', metres: 5e-3, emoji: '🐜', note: 'A whole organism made of millions of cells.' },
  { label: 'Human', size: '1.7 m', metres: 1.7, emoji: '🧍', note: 'Roughly 37 trillion cells working together.' },
  { label: 'Blue whale', size: '30 m', metres: 30, emoji: '🐋', note: 'The largest animal that has ever lived.' },
  { label: 'Forest', size: '1 km', metres: 1e3, emoji: '🌲', note: 'A community of countless organisms — an ecosystem.' },
  { label: 'The biosphere', size: '12,700 km', metres: 1.27e7, emoji: '🌍', note: 'Every living thing, on one thin shell of one planet.' },
]

export function BioScale() {
  const [i, setI] = useState(5)
  const t = TIERS[i]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-col items-center gap-2 py-4">
        <div className="text-6xl leading-none">{t.emoji}</div>
        <p className="text-lg font-bold text-ink">{t.label}</p>
        <p className="font-mono text-2xl text-accent-2">{t.size}</p>
        <p className="max-w-md text-center text-sm text-muted">{t.note}</p>
      </div>

      {/* log ruler */}
      <div className="relative mx-1 mb-4 mt-1 h-2 rounded-full bg-surface-2">
        <div
          className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
          style={{ left: `${(i / (TIERS.length - 1)) * 100}%` }}
        />
      </div>
      <div className="mb-2 flex justify-between px-1 text-[10px] text-muted">
        <span>🧬 molecules</span>
        <span>cells</span>
        <span>organisms</span>
        <span>🌍 planet</span>
      </div>

      <SceneSlider
        label="Zoom out"
        value={i}
        min={0}
        max={TIERS.length - 1}
        step={1}
        unit=""
        onChange={(v) => setI(Math.round(v))}
      />
    </div>
  )
}

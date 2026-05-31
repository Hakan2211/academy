import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

const CX = 110
const CY = 110
const RED = '#e17055' // protons
const GRAY = '#95a5a6' // neutrons
const PROTONS = 6 // carbon

function packPositions(count: number) {
  const out: Array<{ x: number; y: number }> = []
  for (let i = 0; i < count; i++) {
    const r = 7 * Math.sqrt(i)
    const a = i * 2.39996
    out.push({ x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) })
  }
  return out
}

function status(n: number): { label: string; sub: string; color: string } {
  if (n === 6) return { label: 'Stable', sub: 'Carbon-12 — 98.9% of all natural carbon', color: '#00b894' }
  if (n === 7) return { label: 'Stable', sub: 'Carbon-13 — the other 1.1%', color: '#00b894' }
  if (n === 8)
    return {
      label: 'Radioactive (β⁻)',
      sub: 'Carbon-14 — half-life 5,730 yr — basis of radiocarbon dating',
      color: '#fdcb6e',
    }
  return { label: 'Very unstable', sub: 'decays in seconds or less — not found in nature', color: '#e17055' }
}

// Same element, different neutron counts: isotopes. Carbon always has 6 protons,
// so it's always carbon — but the neutron count changes its mass and whether the
// nucleus holds together. Drag neutrons and watch the isotope change.
export function IsotopeLab() {
  const [neutrons, setNeutrons] = useState(6)
  const total = PROTONS + neutrons
  const positions = packPositions(total)
  const types: Array<'p' | 'n'> = []
  for (let i = 0; i < total; i++) types.push(i < PROTONS ? 'p' : 'n')
  const A = PROTONS + neutrons
  const st = status(neutrons)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="grid items-center gap-2 p-3 sm:grid-cols-2">
        <svg viewBox="0 0 220 220" className="w-full">
          <circle cx={CX} cy={CY} r="86" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1" />
          {positions.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="6.5" fill={types[i] === 'p' ? RED : GRAY} />
          ))}
        </svg>

        <div className="text-center">
          <div className="font-mono text-4xl text-ink">
            <sup className="text-xl">{A}</sup>C
          </div>
          <div className="mt-1 text-sm text-muted">
            {PROTONS} protons · {neutrons} neutrons
          </div>
          <div
            className="mt-3 inline-block rounded-full px-3 py-1 text-sm font-semibold"
            style={{ background: st.color + '22', color: st.color }}
          >
            {st.label}
          </div>
          <div className="mt-2 text-xs text-muted">{st.sub}</div>
        </div>
      </div>

      <div className="border-t border-border px-4 py-3">
        <SceneSlider label="Neutrons" value={neutrons} min={2} max={10} step={1} unit="" onChange={setNeutrons} />
        <div className="mt-1 flex justify-center gap-3 text-xs text-muted">
          <span style={{ color: RED }}>● protons (always 6)</span>
          <span style={{ color: GRAY }}>● neutrons</span>
        </div>
      </div>

      <p className="px-4 pb-4 text-center text-xs text-muted">
        Carbon-12, -13 and -14 are all carbon — identical chemistry. Only the mass differs, and only some neutron counts make a nucleus that lasts.
      </p>
    </div>
  )
}

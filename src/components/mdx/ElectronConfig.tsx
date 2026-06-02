import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

// The quantum picture: electrons fill sub-shells (orbitals) in a set energy
// order — the aufbau principle. Each orbital box holds two electrons of
// opposite spin, and electrons spread out singly before pairing up (Hund's
// rule). Slide the atomic number and watch the boxes fill.
const SUBSHELLS = [
  { label: '1s', orbs: 1 },
  { label: '2s', orbs: 1 },
  { label: '2p', orbs: 3 },
  { label: '3s', orbs: 1 },
  { label: '3p', orbs: 3 },
  { label: '4s', orbs: 1 },
  { label: '3d', orbs: 5 },
  { label: '4p', orbs: 3 },
]

const SUP = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹']
const sup = (n: number) =>
  String(n)
    .split('')
    .map((d) => SUP[Number(d)])
    .join('')

// Returns, per subshell, an array of orbital occupancies (0,1,2) using Hund's rule.
function fill(z: number) {
  let left = z
  return SUBSHELLS.map((ss) => {
    const cap = ss.orbs * 2
    const take = Math.min(cap, Math.max(0, left))
    left -= take
    const orbitals = Array.from({ length: ss.orbs }, () => 0)
    // one each first (spin up), then pair
    for (let i = 0; i < take; i++) {
      const idx = i < ss.orbs ? i : i - ss.orbs
      orbitals[idx] += 1
    }
    return { label: ss.label, orbitals, count: take }
  }).filter((s) => s.count > 0 || s.label === '1s')
}

export function ElectronConfig() {
  const [z, setZ] = useState(8) // oxygen
  const filled = fill(z)
  const notation = filled
    .filter((s) => s.count > 0)
    .map((s) => `${s.label}${sup(s.count)}`)
    .join(' ')

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="space-y-2">
        {filled
          .filter((s) => s.count > 0)
          .map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="w-8 font-mono text-sm text-muted">{s.label}</span>
              <div className="flex gap-1.5">
                {s.orbitals.map((occ, i) => (
                  <div
                    key={i}
                    className="flex h-7 w-7 items-center justify-center rounded border border-border bg-surface-2 text-xs font-bold leading-none text-accent"
                  >
                    {occ === 0 ? '' : occ === 1 ? '↑' : '↑↓'}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      <p className="mt-3 rounded-lg bg-surface-2 p-2 text-center font-mono text-sm text-ink">
        {notation}
      </p>

      <SceneSlider
        label="Atomic number (Z)"
        value={z}
        min={1}
        max={36}
        step={1}
        unit=""
        onChange={(v) => setZ(Math.round(v))}
      />
    </div>
  )
}

import { useState } from 'react'
import { toBinary, toHex } from '#/lib/cs'
import { SceneSlider } from '#/components/three/SceneSlider'

// Screens make every colour by mixing three lights: red, green and blue. Each
// channel is one byte (0–255), so a pixel's colour is just three numbers — 24
// bits in total, giving over 16 million possible colours.

export function ColorMixer() {
  const [r, setR] = useState(79)
  const [g, setG] = useState(140)
  const [b, setB] = useState(255)

  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`
  const channels: Array<[string, number, (v: number) => void, string]> = [
    ['Red', r, setR, '#FF6B6B'],
    ['Green', g, setG, '#2ECC71'],
    ['Blue', b, setB, '#4F8CFF'],
  ]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
        <div className="space-y-3">
          {channels.map(([label, val, set, color]) => (
            <div key={label}>
              <div style={{ color }}>
                <SceneSlider label={label} value={val} min={0} max={255} step={1} unit="" onChange={(v) => set(Math.round(v))} />
              </div>
              <div className="text-right font-mono text-[10px] text-muted">{toBinary(val, 8)}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <div className="h-24 w-24 rounded-xl border border-border" style={{ background: hex }} />
          <div className="font-mono text-sm font-bold uppercase text-ink">{hex}</div>
          <div className="font-mono text-[10px] text-muted">rgb({r}, {g}, {b})</div>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        3 channels × 8 bits = <span className="text-ink">24 bits per pixel</span> = 2²⁴ ≈ <span className="text-accent-2">16.7 million</span> colours. This is "true colour".
      </p>
    </div>
  )
}

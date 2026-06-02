import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

// Sound is a smooth, continuous wave — but a computer can only store numbers. To
// digitise it we SAMPLE: measure the wave's height many times a second, and round
// each measurement to one of a fixed set of levels (the bit depth). More samples
// and more levels mean a more faithful — but larger — recording.

const X0 = 20
const X1 = 344
const YMID = 90
const AMP = 64

function wave(x: number): number {
  const t = (x - X0) / (X1 - X0)
  return YMID - AMP * Math.sin(t * Math.PI * 3) * Math.exp(-t * 0.2)
}

export function SamplingLab() {
  const [samples, setSamples] = useState(16)
  const [depth, setDepth] = useState(3)
  const levels = 2 ** depth

  // Smooth reference curve.
  const smooth = Array.from({ length: 80 }, (_, i) => {
    const x = X0 + ((X1 - X0) * i) / 79
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${wave(x).toFixed(1)}`
  }).join(' ')

  // Quantise a y value to the nearest of `levels` steps.
  const quant = (y: number) => {
    const top = YMID - AMP
    const bottom = YMID + AMP
    const f = (y - top) / (bottom - top)
    const step = Math.round(f * (levels - 1)) / (levels - 1)
    return top + step * (bottom - top)
  }

  const pts = Array.from({ length: samples }, (_, i) => {
    const x = X0 + ((X1 - X0) * i) / (samples - 1)
    return { x, y: quant(wave(x)) }
  })
  // Stair-step reconstruction.
  let stair = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`
  for (let i = 1; i < pts.length; i++) {
    stair += ` L${pts[i].x.toFixed(1)},${pts[i - 1].y.toFixed(1)} L${pts[i].x.toFixed(1)},${pts[i].y.toFixed(1)}`
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 360 180" className="w-full">
        {Array.from({ length: levels }).map((_, i) => {
          const y = YMID - AMP + (2 * AMP * i) / (levels - 1)
          return <line key={i} x1={X0} y1={y} x2={X1} y2={y} stroke="var(--color-border)" strokeWidth="0.5" opacity="0.5" />
        })}
        <path d={smooth} fill="none" stroke="var(--color-muted)" strokeWidth="2" opacity="0.6" />
        <path d={stair} fill="none" stroke="var(--color-accent)" strokeWidth="2" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="var(--color-accent-2)" />
        ))}
      </svg>

      <div className="grid gap-3 sm:grid-cols-2">
        <SceneSlider label="Samples (rate)" value={samples} min={4} max={40} step={1} unit="" onChange={(v) => setSamples(Math.round(v))} />
        <SceneSlider label="Bit depth" value={depth} min={1} max={4} step={1} unit="bits" onChange={(v) => setDepth(Math.round(v))} />
      </div>
      <p className="mt-2 text-center text-xs text-muted">
        <span className="text-muted">Grey</span> = the real sound · <span className="text-accent">orange</span> = the stored digital version ({levels} levels). Crank both sliders up and the steps vanish — at the cost of more data.
      </p>
    </div>
  )
}

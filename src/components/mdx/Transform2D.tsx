import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

// Every shape on screen is a list of corner coordinates. To move, spin or resize
// it, the computer doesn't redraw it by hand — it does ARITHMETIC on those numbers.
// Translate adds an offset, scale multiplies, and rotate mixes x and y with sine
// and cosine. Each is a matrix multiply; chaining them transforms a whole shape at
// once. Because the shape is stored as math (vectors), it stays razor-sharp at any
// size — that's why vector graphics never pixelate.

const CX = 180
const CY = 130
const U = 30 // world units -> pixels

// A capital "F" in local coordinates (units), so rotation is obvious.
const SHAPE: Array<[number, number]> = [
  [-1, -2],
  [-1, 2],
  [1.4, 2],
  [1.4, 1.2],
  [0, 1.2],
  [0, 0.4],
  [1, 0.4],
  [1, -0.4],
  [0, -0.4],
  [0, -2],
]

export function Transform2D() {
  const [tx, setTx] = useState(0)
  const [ty, setTy] = useState(0)
  const [angle, setAngle] = useState(0)
  const [scale, setScale] = useState(1.2)

  const rad = (angle * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)

  const transform = ([x, y]: [number, number]): [number, number] => {
    // scale -> rotate -> translate (order matters; this is one combined matrix)
    const sx = x * scale
    const sy = y * scale
    const rx = sx * cos - sy * sin
    const ry = sx * sin + sy * cos
    return [rx + tx, ry + ty]
  }

  const toScreen = ([x, y]: [number, number]) => `${(CX + x * U).toFixed(1)},${(CY - y * U).toFixed(1)}`
  const ghost = SHAPE.map((p) => toScreen(p)).join(' ')
  const live = SHAPE.map((p) => toScreen(transform(p))).join(' ')

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 360 260" className="w-full">
        <rect x="6" y="6" width="348" height="248" rx="10" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1.5" />
        {/* axes */}
        <line x1="14" y1={CY} x2="346" y2={CY} stroke="var(--color-border)" strokeWidth="1" />
        <line x1={CX} y1="14" x2={CX} y2="246" stroke="var(--color-border)" strokeWidth="1" />
        {/* original outline as a ghost */}
        <polygon points={ghost} fill="none" stroke="var(--color-muted)" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
        {/* transformed shape */}
        <polygon points={live} fill="var(--color-accent)" fillOpacity="0.2" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinejoin="round" />
        {/* the moved origin/anchor */}
        <circle cx={CX + tx * U} cy={CY - ty * U} r="3.5" fill="var(--color-accent-2)" />
      </svg>

      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        <SceneSlider label="Translate X" value={tx} min={-3} max={3} step={0.1} unit="u" onChange={setTx} />
        <SceneSlider label="Translate Y" value={ty} min={-3} max={3} step={0.1} unit="u" onChange={setTy} />
        <SceneSlider label="Rotate" value={angle} min={-180} max={180} step={1} unit="°" onChange={(v) => setAngle(Math.round(v))} />
        <SceneSlider label="Scale" value={scale} min={0.3} max={2.5} step={0.05} unit="×" onChange={setScale} />
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        Each corner of the <span className="text-accent">F</span> is just a pair of numbers. Translate{' '}
        <span className="font-mono">adds</span>, scale <span className="font-mono">multiplies</span>, and rotate
        mixes them with <span className="font-mono">sin/cos</span> — all one matrix multiply. The shape is math, so it never blurs.
      </p>
    </div>
  )
}

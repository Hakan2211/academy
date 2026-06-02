import { useState } from 'react'

// Volume of a prism = base area × length. A cuboid is l·w·h; a cylinder is
// πr²·h. Both are "stack the base up the height". Used in volume-of-prisms.
export function VolumePrism() {
  const [shape, setShape] = useState<'cuboid' | 'cyl'>('cuboid')
  const [a, setA] = useState(4) // l or r
  const [b, setB] = useState(3) // w (cuboid only)
  const [hgt, setHgt] = useState(3)

  const baseArea = shape === 'cuboid' ? a * b : Math.PI * a * a
  const vol = baseArea * hgt

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex justify-center gap-2">
        <button onClick={() => setShape('cuboid')} className={`rounded-lg border px-3 py-1 text-xs transition ${shape === 'cuboid' ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>Cuboid</button>
        <button onClick={() => setShape('cyl')} className={`rounded-lg border px-3 py-1 text-xs transition ${shape === 'cyl' ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>Cylinder</button>
      </div>

      <svg viewBox="0 0 200 150" className="mx-auto w-full max-w-[200px]">
        {shape === 'cuboid' ? (
          <g stroke="var(--color-accent)" strokeWidth="1.6" fill="var(--color-accent)" fillOpacity="0.15">
            <polygon points="50,60 110,60 110,120 50,120" />
            <polygon points="50,60 75,40 135,40 110,60" />
            <polygon points="110,60 135,40 135,100 110,120" fillOpacity="0.25" />
          </g>
        ) : (
          <g stroke="var(--color-accent)" strokeWidth="1.6" fill="var(--color-accent)" fillOpacity="0.15">
            <ellipse cx="95" cy="45" rx="40" ry="13" />
            <rect x="55" y="45" width="80" height="70" fillOpacity="0.2" stroke="none" />
            <line x1="55" y1="45" x2="55" y2="115" />
            <line x1="135" y1="45" x2="135" y2="115" />
            <ellipse cx="95" cy="115" rx="40" ry="13" />
          </g>
        )}
      </svg>

      <div className="space-y-1.5 px-1 text-sm">
        <label className="flex items-center justify-between gap-3">
          <span className="text-muted">{shape === 'cuboid' ? 'length' : 'radius'}</span>
          <input type="range" min={1} max={6} value={a} onChange={(e) => setA(Number(e.target.value))} className="w-1/2 accent-accent" />
          <span className="w-6 text-right font-mono text-ink">{a}</span>
        </label>
        {shape === 'cuboid' && (
          <label className="flex items-center justify-between gap-3">
            <span className="text-muted">width</span>
            <input type="range" min={1} max={6} value={b} onChange={(e) => setB(Number(e.target.value))} className="w-1/2 accent-accent" />
            <span className="w-6 text-right font-mono text-ink">{b}</span>
          </label>
        )}
        <label className="flex items-center justify-between gap-3">
          <span className="text-muted">height</span>
          <input type="range" min={1} max={6} value={hgt} onChange={(e) => setHgt(Number(e.target.value))} className="w-1/2 accent-accent" />
          <span className="w-6 text-right font-mono text-ink">{hgt}</span>
        </label>
      </div>

      <p className="mt-2 text-center font-mono text-sm">
        V = {shape === 'cuboid' ? `${a}×${b}×${hgt}` : `π×${a}²×${hgt}`} = <span className="font-bold text-success">{+vol.toFixed(1)}</span> cubic units
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        Volume = base area ({+baseArea.toFixed(1)}) × height. A prism is its cross-section, stacked up.
      </p>
    </div>
  )
}

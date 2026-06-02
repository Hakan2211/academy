import { useState } from 'react'

// Dissolving: water molecules pull ions off a crystal one by one and surround
// them (hydration), spreading them evenly through the liquid. Drag the slider
// to break the lattice apart and watch the ions disperse.
function rnd(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 4.1) * 43758.5
  return x - Math.floor(x)
}

export function DissolveLab() {
  const [t, setT] = useState(0) // 0 = solid crystal, 1 = fully dissolved
  const N = 16

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 300 170" className="w-full">
        {/* beaker of water */}
        <path d="M 50 25 L 250 25 L 240 160 L 60 160 Z" fill="#5DADE2" opacity={0.12} stroke="var(--color-muted)" strokeWidth={1.5} />

        {Array.from({ length: N }).map((_, i) => {
          const isNa = (i % 2) === 0
          // lattice home position (a tidy 4x4 grid near the bottom)
          const col = i % 4
          const row = (i / 4) | 0
          const hx = 116 + col * 18
          const hy = 96 + row * 18
          // dispersed position (spread through the beaker)
          const dx = 70 + rnd(i, 1) * 160
          const dy = 40 + rnd(i, 2) * 105
          const x = hx + (dx - hx) * t
          const y = hy + (dy - hy) * t
          return (
            <g key={i}>
              {/* hydration shell appears as ions free */}
              {t > 0.15 && <circle cx={x} cy={y} r={9} fill="#5DADE2" opacity={0.18 * t} />}
              <circle cx={x} cy={y} r={isNa ? 6 : 7.5} fill={isNa ? '#9B59B6' : '#2ECC71'} />
              <text x={x} y={y + 3} textAnchor="middle" className="fill-white text-[7px] font-bold">
                {isNa ? '+' : '−'}
              </text>
            </g>
          )
        })}
      </svg>

      <p className="my-2 text-center text-sm text-muted">
        {t < 0.1
          ? 'A solid crystal: ions locked in a rigid lattice.'
          : t < 0.85
            ? 'Water molecules pull ions off the surface and surround each one (hydration).'
            : 'Fully dissolved — ions spread evenly through the water. This is a solution.'}
      </p>

      <label className="flex flex-col gap-1 text-sm">
        <span className="flex items-center justify-between text-muted">
          <span>Dissolve / stir</span>
          <span className="font-mono text-ink">{(t * 100).toFixed(0)}%</span>
        </span>
        <input type="range" min={0} max={1} step={0.01} value={t} onChange={(e) => setT(Number(e.target.value))} className="accent-accent" />
      </label>
    </div>
  )
}

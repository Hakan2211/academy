import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

// Drag the magnification up and watch a leaf's surface resolve into cells, then
// into the structures inside them. Higher magnification = a bigger image, more
// visible detail, and a smaller field of view.
const COLS = 6
const ROWS = 6
const CELL = 46
const W = COLS * CELL // world span
const WCX = W / 2
const WCY = W / 2
const FCX = 190 // field centre (viewBox units)
const FCY = 140
const FR = 118 // field radius

// fixed per-cell chloroplast offsets (world units, relative to cell centre)
const CHLORO = [
  [-12, -8], [8, -12], [-6, 6], [13, 7], [0, -2], [-14, 10], [11, -3],
]

function note(mag: number): string {
  if (mag < 100) return 'Low power: you can make out a patchwork of individual cells.'
  if (mag < 430) return 'Higher power: the cell walls and green chloroplasts come into view.'
  return 'High power: even the nucleus inside each cell is clearly visible.'
}

export function MicroscopeZoom() {
  const [mag, setMag] = useState(100)
  const z = mag / 40 // 40× → 1, 1000× → 25

  const cells = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      cells.push({ x: c * CELL + CELL / 2, y: r * CELL + CELL / 2, key: `${r}-${c}` })
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="relative mx-auto w-full max-w-[380px]">
        <svg viewBox="0 0 380 280" className="w-full">
          <defs>
            <clipPath id="micro-field">
              <circle cx={FCX} cy={FCY} r={FR} />
            </clipPath>
          </defs>

          {/* field of view */}
          <circle cx={FCX} cy={FCY} r={FR} fill="#0c1a12" />
          <g clipPath="url(#micro-field)">
            <g transform={`translate(${FCX} ${FCY}) scale(${z}) translate(${-WCX} ${-WCY})`}>
              {cells.map((cell) => (
                <g key={cell.key} transform={`translate(${cell.x} ${cell.y})`}>
                  {/* cell wall + cytoplasm */}
                  <rect
                    x={-CELL / 2 + 1.5}
                    y={-CELL / 2 + 1.5}
                    width={CELL - 3}
                    height={CELL - 3}
                    rx={6}
                    fill="#1f6b3a"
                    stroke="#3ddc84"
                    strokeWidth={1.2}
                  />
                  {/* chloroplasts */}
                  {CHLORO.map(([ox, oy], k) => (
                    <ellipse key={k} cx={ox} cy={oy} rx={3.4} ry={2.2} fill="#2ECC71" />
                  ))}
                  {/* nucleus */}
                  <circle cx={4} cy={3} r={4.5} fill="#6c4bd6" opacity={0.9} />
                </g>
              ))}
            </g>
          </g>

          {/* eyepiece vignette */}
          <circle cx={FCX} cy={FCY} r={FR} fill="none" stroke="#000" strokeWidth={26} opacity={0.55} />
          <circle cx={FCX} cy={FCY} r={FR + 13} fill="none" stroke="var(--color-border)" strokeWidth={3} />

          {/* magnification badge */}
          <g>
            <rect x={250} y={236} width={120} height={30} rx={8} fill="var(--color-surface-2)" />
            <text x={310} y={256} textAnchor="middle" className="fill-ink text-[15px] font-mono">
              {Math.round(mag)}×
            </text>
          </g>
        </svg>
      </div>

      <p className="mb-3 mt-1 text-center text-sm text-muted">{note(mag)}</p>

      <SceneSlider
        label="Magnification"
        value={mag}
        min={40}
        max={1000}
        step={10}
        unit="×"
        onChange={setMag}
      />
    </div>
  )
}

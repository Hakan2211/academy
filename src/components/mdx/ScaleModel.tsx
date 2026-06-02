import { useState } from 'react'

// Scale factor made concrete. A model (or map) and the real thing share a shape
// but not a size; the scale "1 : n" multiplies every length by n. Used in
// scale-and-maps.
export function ScaleModel() {
  const [n, setN] = useState(50)
  const [modelCm, setModelCm] = useState(8)
  const realCm = modelCm * n
  const realM = realCm / 100

  // draw two similar rectangles, model small, real scaled (capped for display)
  const modelW = 40
  const modelH = 26
  const dispScale = Math.min(3.2, 1 + Math.log10(n)) // visual only, capped
  const realW = modelW * dispScale
  const realH = modelH * dispScale

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 320 150" className="mx-auto w-full max-w-sm">
        <g>
          <rect x={30} y={75 - modelH / 2} width={modelW} height={modelH} rx="2" fill="var(--color-accent-2)" fillOpacity="0.3" stroke="var(--color-accent-2)" />
          <text x={30 + modelW / 2} y={75 + modelH / 2 + 16} textAnchor="middle" fontSize="9" fill="var(--color-muted)">model {modelCm} cm</text>
          <text x={30 + modelW / 2} y={75 - modelH / 2 - 6} textAnchor="middle" fontSize="9" fill="var(--color-accent-2)">model</text>
        </g>
        <text x={150} y={78} textAnchor="middle" fontSize="13" fill="var(--color-muted)">× {n}</text>
        <g>
          <rect x={210} y={75 - realH / 2} width={realW} height={realH} rx="2" fill="var(--color-accent)" fillOpacity="0.18" stroke="var(--color-accent)" />
          <text x={210 + realW / 2} y={75 + realH / 2 + 16} textAnchor="middle" fontSize="9" fill="var(--color-muted)">real {realM} m</text>
          <text x={210 + realW / 2} y={75 - realH / 2 - 6} textAnchor="middle" fontSize="9" fill="var(--color-accent)">real</text>
        </g>
      </svg>

      <div className="mt-2 space-y-2 px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">scale 1 :</span>
          <input type="range" min={10} max={200} step={5} value={n} onChange={(e) => setN(Number(e.target.value))} className="w-1/2 accent-accent" />
          <span className="w-10 text-right font-mono text-ink">{n}</span>
        </label>
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">model length</span>
          <input type="range" min={1} max={20} step={1} value={modelCm} onChange={(e) => setModelCm(Number(e.target.value))} className="w-1/2 accent-accent" />
          <span className="w-14 text-right font-mono text-ink">{modelCm} cm</span>
        </label>
      </div>

      <p className="mt-2 text-center text-sm font-mono">
        {modelCm} cm × {n} = {realCm} cm = <span className="font-bold text-accent">{realM} m</span>
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        A scale of 1 : {n} means 1 cm on the model is {n} cm in real life. Shape stays the same; only size changes.
      </p>
    </div>
  )
}

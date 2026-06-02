import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

// Why cells stay small. As a cube grows, its volume races ahead of its surface
// area, so the surface-area-to-volume ratio falls. A big cell can't exchange
// materials across its membrane fast enough to feed its insides.
export function SurfaceVolume() {
  const [L, setL] = useState(2)
  const sa = 6 * L * L
  const vol = L * L * L
  const ratio = sa / vol // = 6 / L

  // isometric cube, scaled by L
  const s = 14 + L * 12
  const ox = 150
  const oy = 150

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 360 220" className="w-full">
        {/* cube (front, top, right faces) */}
        <g transform={`translate(${ox} ${oy})`}>
          {/* front */}
          <rect x={-s / 2} y={-s / 2} width={s} height={s} fill="#1e5fb455" stroke="#4F8CFF" strokeWidth={2} />
          {/* top */}
          <path d={`M ${-s / 2} ${-s / 2} l ${s * 0.4} ${-s * 0.4} l ${s} 0 l ${-s * 0.4} ${s * 0.4} z`} fill="#4F8CFF33" stroke="#4F8CFF" strokeWidth={2} />
          {/* right */}
          <path d={`M ${s / 2} ${-s / 2} l ${s * 0.4} ${-s * 0.4} l 0 ${s} l ${-s * 0.4} ${s * 0.4} z`} fill="#1e5fb480" stroke="#4F8CFF" strokeWidth={2} />
        </g>
        <text x={ox} y={210} textAnchor="middle" className="fill-muted text-[11px]">
          side = {L}
        </text>

        {/* stats */}
        <g transform="translate(244 40)">
          <text x={0} y={0} className="fill-muted text-[11px]">surface area = 6L²</text>
          <text x={0} y={18} className="fill-ink text-[15px] font-mono">{sa}</text>
          <text x={0} y={48} className="fill-muted text-[11px]">volume = L³</text>
          <text x={0} y={66} className="fill-ink text-[15px] font-mono">{vol}</text>
          <text x={0} y={96} className="fill-muted text-[11px]">SA : V ratio</text>
          <text x={0} y={114} className="fill-accent text-[18px] font-mono font-bold">{ratio.toFixed(2)} : 1</text>
        </g>
      </svg>

      <p className="my-2 text-center text-sm text-muted">
        {ratio >= 3
          ? 'Small cell: a high surface-to-volume ratio — plenty of membrane to feed the inside.'
          : ratio >= 1.5
            ? 'As it grows, the ratio drops — exchange across the surface gets harder.'
            : 'Too big: tiny surface for a huge volume. The centre would starve — so cells stay small or divide.'}
      </p>

      <SceneSlider label="Cube side length" value={L} min={1} max={6} step={1} unit="units" onChange={(v) => setL(Math.round(v))} />
    </div>
  )
}

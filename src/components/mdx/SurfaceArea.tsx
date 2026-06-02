import { useState } from 'react'

// Surface area of a cuboid = the area of its unfolded net. Six rectangles in
// three matching pairs: 2(lw + lh + wh). Used in surface-area.
export function SurfaceArea() {
  const [l, setL] = useState(4)
  const [w, setW] = useState(3)
  const [h, setH] = useState(2)
  const U = 16
  const sa = 2 * (l * w + l * h + w * h)

  // net layout (cross): centre = front (l×h), top/bottom (l×w), sides (w×h), back (l×h far right)
  const cx = 60
  const cy = 50
  const lw = l * U
  const wh = w * U
  const hh = h * U

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex justify-center">
        <svg viewBox="0 0 240 170" className="max-w-full" style={{ width: 240 }}>
          {/* top */}
          <rect x={cx} y={cy - wh} width={lw} height={wh} fill="var(--color-accent)" fillOpacity="0.12" stroke="var(--color-accent)" strokeWidth="1.2" />
          {/* left */}
          <rect x={cx - hh} y={cy} width={hh} height={hh} fill="var(--color-accent-2)" fillOpacity="0.12" stroke="var(--color-accent-2)" strokeWidth="1.2" />
          {/* front */}
          <rect x={cx} y={cy} width={lw} height={hh} fill="var(--color-accent)" fillOpacity="0.2" stroke="var(--color-accent)" strokeWidth="1.4" />
          {/* right */}
          <rect x={cx + lw} y={cy} width={hh} height={hh} fill="var(--color-accent-2)" fillOpacity="0.12" stroke="var(--color-accent-2)" strokeWidth="1.2" />
          {/* bottom */}
          <rect x={cx} y={cy + hh} width={lw} height={wh} fill="var(--color-accent)" fillOpacity="0.12" stroke="var(--color-accent)" strokeWidth="1.2" />
          {/* back (attach below bottom) */}
          <rect x={cx} y={cy + hh + wh} width={lw} height={hh} fill="var(--color-accent)" fillOpacity="0.12" stroke="var(--color-accent)" strokeWidth="1.2" />
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-2 px-1 text-xs">
        {[['l', l, setL], ['w', w, setW], ['h', h, setH]].map(([lab, val, set]) => (
          <label key={lab as string} className="flex items-center gap-1.5">
            <span className="text-muted">{lab as string}</span>
            <input type="range" min={1} max={6} value={val as number} onChange={(e) => (set as (n: number) => void)(Number(e.target.value))} className="flex-1 accent-accent" />
            <span className="w-4 font-mono text-ink">{val as number}</span>
          </label>
        ))}
      </div>

      <p className="mt-2 text-center font-mono text-sm">
        SA = 2(lw + lh + wh) = 2({l * w} + {l * h} + {w * h}) = <span className="font-bold text-success">{sa}</span> sq units
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        Unfold the box into its net: six faces, three matching pairs. Add their areas.
      </p>
    </div>
  )
}

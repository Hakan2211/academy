import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

// Two opposing horizontal forces on a block. Drag the sliders and watch the net
// force (and the resulting acceleration arrow) appear. Reused for "adding
// forces", equilibrium (First Law), and applied-vs-friction.
export function ForceDiagram({
  leftLabel = 'Push left',
  rightLabel = 'Push right',
  leftColor = '#74b9ff',
  rightColor = '#00b894',
  leftInit = 6,
  rightInit = 10,
  showSurface = false,
}: {
  leftLabel?: string
  rightLabel?: string
  leftColor?: string
  rightColor?: string
  leftInit?: number
  rightInit?: number
  showSurface?: boolean
}) {
  const [left, setLeft] = useState(leftInit)
  const [right, setRight] = useState(rightInit)
  const net = right - left // + => to the right
  const scale = 6 // px per newton
  const cx = 250
  const cy = 120
  const half = 35

  const balanced = Math.abs(net) < 0.1
  const netTipX = cx + net * scale

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 500 240" className="w-full">
        {showSurface && (
          <line
            x1="40"
            y1={cy + half + 4}
            x2="460"
            y2={cy + half + 4}
            stroke="var(--color-border)"
            strokeWidth="3"
          />
        )}

        {/* the block */}
        <rect
          x={cx - half}
          y={cy - half}
          width={half * 2}
          height={half * 2}
          rx="6"
          fill="var(--color-accent)"
        />

        {/* left force */}
        {left > 0.05 && (
          <>
            <line
              x1={cx - half}
              y1={cy}
              x2={cx - half - left * scale}
              y2={cy}
              stroke={leftColor}
              strokeWidth="5"
            />
            <polygon
              points={`${cx - half - left * scale},${cy} ${cx - half - left * scale + 10},${cy - 6} ${cx - half - left * scale + 10},${cy + 6}`}
              fill={leftColor}
            />
          </>
        )}
        <text x={cx - half - 6} y={cy - 46} fill={leftColor} fontSize="13" textAnchor="end">
          {leftLabel}: {left.toFixed(0)} N
        </text>

        {/* right force */}
        {right > 0.05 && (
          <>
            <line
              x1={cx + half}
              y1={cy}
              x2={cx + half + right * scale}
              y2={cy}
              stroke={rightColor}
              strokeWidth="5"
            />
            <polygon
              points={`${cx + half + right * scale},${cy} ${cx + half + right * scale - 10},${cy - 6} ${cx + half + right * scale - 10},${cy + 6}`}
              fill={rightColor}
            />
          </>
        )}
        <text x={cx + half + 6} y={cy - 46} fill={rightColor} fontSize="13">
          {rightLabel}: {right.toFixed(0)} N
        </text>

        {/* net / acceleration arrow */}
        {!balanced && (
          <>
            <line
              x1={cx}
              y1={cy + half + 24}
              x2={netTipX}
              y2={cy + half + 24}
              stroke="#fdcb6e"
              strokeWidth="4"
              strokeDasharray="2 4"
            />
            <polygon
              points={
                net > 0
                  ? `${netTipX},${cy + half + 24} ${netTipX - 10},${cy + half + 18} ${netTipX - 10},${cy + half + 30}`
                  : `${netTipX},${cy + half + 24} ${netTipX + 10},${cy + half + 18} ${netTipX + 10},${cy + half + 30}`
              }
              fill="#fdcb6e"
            />
          </>
        )}

        <text x={cx} y="222" fill="var(--color-ink)" fontSize="14" textAnchor="middle" fontWeight="600">
          {balanced
            ? 'Forces balanced — net force 0, no acceleration'
            : `Net force ${Math.abs(net).toFixed(0)} N to the ${net > 0 ? 'right' : 'left'} → accelerates`}
        </text>
      </svg>

      <div className="grid gap-4 p-4 sm:grid-cols-2">
        <SceneSlider label={leftLabel} value={left} min={0} max={20} step={1} unit="N" onChange={setLeft} />
        <SceneSlider label={rightLabel} value={right} min={0} max={20} step={1} unit="N" onChange={setRight} />
      </div>
    </div>
  )
}

import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

// Every element the browser draws is a box, and CSS lays it out with the BOX
// MODEL: a content area, wrapped by PADDING (space inside the border), then the
// BORDER itself, then MARGIN (space pushing other boxes away). Drag the sliders
// and watch each coloured layer grow. This is how CSS controls spacing and
// layout — content is HTML; how it's spaced and styled is CSS.

const CONTENT_W = 120
const CONTENT_H = 44

export function BoxModel() {
  const [padding, setPadding] = useState(16)
  const [border, setBorder] = useState(6)
  const [margin, setMargin] = useState(20)

  // Outer box dimensions grow as each layer thickens.
  const innerW = CONTENT_W
  const innerH = CONTENT_H
  const padW = innerW + padding * 2
  const padH = innerH + padding * 2
  const borW = padW + border * 2
  const borH = padH + border * 2
  const totalW = borW + margin * 2
  const totalH = borH + margin * 2

  const cx = totalW / 2
  const cy = totalH / 2

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_1fr]">
        <div className="flex items-center justify-center">
          <svg viewBox={`0 0 ${Math.max(totalW, 200)} ${Math.max(totalH, 160)}`} className="w-full max-w-[260px]">
            {/* margin layer */}
            <rect x={cx - totalW / 2} y={cy - totalH / 2} width={totalW} height={totalH} fill="rgba(255,200,61,0.18)" stroke="#FFC83D" strokeDasharray="3 3" strokeWidth="1" />
            {/* border layer */}
            <rect x={cx - borW / 2} y={cy - borH / 2} width={borW} height={borH} fill="#5B6CFF" />
            {/* padding layer */}
            <rect x={cx - padW / 2} y={cy - padH / 2} width={padW} height={padH} fill="rgba(46,204,113,0.30)" />
            {/* content */}
            <rect x={cx - innerW / 2} y={cy - innerH / 2} width={innerW} height={innerH} fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1" />
            <text x={cx} y={cy + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--color-ink)">content</text>
          </svg>
        </div>

        <div className="space-y-3">
          <SceneSlider label="padding" value={padding} min={0} max={40} step={1} unit="px" onChange={setPadding} />
          <SceneSlider label="border" value={border} min={0} max={20} step={1} unit="px" onChange={setBorder} />
          <SceneSlider label="margin" value={margin} min={0} max={40} step={1} unit="px" onChange={setMargin} />

          <div className="flex flex-wrap gap-2 pt-1 text-[10px]">
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }} /> content</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: 'rgba(46,204,113,0.5)' }} /> padding</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: '#5B6CFF' }} /> border</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: 'rgba(255,200,61,0.5)' }} /> margin</span>
          </div>
        </div>
      </div>

      <pre className="mt-3 rounded-lg border border-border bg-surface-2 p-3 font-mono text-xs leading-5 text-ink">{`.card {
  padding: ${padding}px;   /* space inside the border */
  border:  ${border}px solid;
  margin:  ${margin}px;   /* space pushing others away */
}`}</pre>

      <p className="mt-3 text-center text-xs text-muted">
        HTML supplies the <span className="text-ink">content</span>; CSS wraps it in <span className="text-ink">padding</span>, <span className="text-ink">border</span> and <span className="text-ink">margin</span>. The box model is how the browser decides where everything sits.
      </p>
    </div>
  )
}

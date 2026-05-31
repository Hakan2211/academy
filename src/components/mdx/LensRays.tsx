import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { cn } from '#/lib/cn'

const LX = 230 // lens plane x
const AXIS = 120
const HEIGHTS = [-72, -46, -22, 22, 46, 72]

// Parallel rays meeting glass. A converging (convex) lens bends them all to a
// single focal point; a diverging (concave) lens spreads them so they seem to
// come from a focal point behind. Drag the focal length to move F.
export function LensRays() {
  const [converging, setConverging] = useState(true)
  const [f, setF] = useState(120) // focal length in px

  const Fx = converging ? LX + f : LX - f

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        {([['convex (converging)', true], ['concave (diverging)', false]] as Array<[string, boolean]>).map(
          ([label, val]) => (
            <button
              key={label}
              type="button"
              onClick={() => setConverging(val)}
              className={cn(
                'rounded-full border px-3 py-1 text-sm transition-colors',
                converging === val
                  ? 'border-accent bg-accent/15 text-accent'
                  : 'border-border text-muted hover:text-ink',
              )}
            >
              {label}
            </button>
          ),
        )}
      </div>

      <svg viewBox="0 0 460 240" className="w-full">
        {/* principal axis */}
        <line x1="10" y1={AXIS} x2="450" y2={AXIS} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="2 4" />

        {/* lens shape */}
        {converging ? (
          <path
            d={`M ${LX} ${AXIS - 80} Q ${LX + 22} ${AXIS} ${LX} ${AXIS + 80} Q ${LX - 22} ${AXIS} ${LX} ${AXIS - 80} Z`}
            fill="var(--color-accent-2)"
            opacity="0.25"
            stroke="var(--color-accent-2)"
            strokeWidth="1.5"
          />
        ) : (
          <path
            d={`M ${LX - 16} ${AXIS - 80} Q ${LX + 8} ${AXIS} ${LX - 16} ${AXIS + 80} L ${LX + 16} ${AXIS + 80} Q ${LX - 8} ${AXIS} ${LX + 16} ${AXIS - 80} Z`}
            fill="var(--color-accent-2)"
            opacity="0.25"
            stroke="var(--color-accent-2)"
            strokeWidth="1.5"
          />
        )}

        {/* rays */}
        {HEIGHTS.map((h, i) => {
          const y = AXIS + h
          const incoming = <line x1="10" y1={y} x2={LX} y2={y} stroke="#fdcb6e" strokeWidth="2" />
          if (converging) {
            // bend to pass through F, continue beyond
            const slope = (AXIS - y) / (Fx - LX)
            const xEnd = 450
            const yEnd = y + slope * (xEnd - LX)
            return (
              <g key={i}>
                {incoming}
                <line x1={LX} y1={y} x2={xEnd} y2={yEnd} stroke="var(--color-accent)" strokeWidth="2" />
              </g>
            )
          }
          // diverging: outgoing away from virtual focus Fx (behind the lens)
          const slope = (y - AXIS) / (LX - Fx)
          const xEnd = 450
          const yEnd = y + slope * (xEnd - LX)
          return (
            <g key={i}>
              {incoming}
              <line x1={LX} y1={y} x2={xEnd} y2={yEnd} stroke="var(--color-accent)" strokeWidth="2" />
              <line x1={LX} y1={y} x2={Fx} y2={AXIS} stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
            </g>
          )
        })}

        {/* focal point */}
        <circle cx={Fx} cy={AXIS} r="5" fill="var(--color-ink)" />
        <text x={Fx} y={AXIS + 20} fill="var(--color-ink)" fontSize="13" textAnchor="middle">F</text>
      </svg>

      <div className="px-4 pt-2">
        <SceneSlider label="Focal length" value={f} min={60} max={170} step={5} unit="px" onChange={setF} />
        <p className="mt-2 pb-4 text-center text-sm text-muted">
          {converging
            ? 'Converging lens: parallel rays meet at the focal point F.'
            : 'Diverging lens: rays spread as if they came from F behind the lens.'}
        </p>
      </div>
    </div>
  )
}

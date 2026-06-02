import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { cn } from '#/lib/cn'

// Perceptual constancy: objects keep a stable identity even as their retinal
// image changes. Size constancy — a person doesn't seem to shrink as they walk
// away, though their image does. Shape constancy — a door stays "rectangular"
// even as it swings and projects a trapezoid. Drag the slider and compare the
// raw retinal image with what you actually perceive.
type Mode = 'size' | 'shape'

const W = 360
const H = 200

export function PerceptualConstancy() {
  const [mode, setMode] = useState<Mode>('size')
  const [dist, setDist] = useState(3) // 1 (near) .. 10 (far)
  const [angle, setAngle] = useState(0) // door open angle 0..80 deg

  // Retinal scale shrinks with distance.
  const scale = 1 / (0.4 + dist * 0.16)

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="mb-3 flex flex-wrap gap-2">
        {([
          ['size', 'Size constancy'],
          ['shape', 'Shape constancy'],
        ] as Array<[Mode, string]>).map(([m, label]) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              mode === m ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {/* Retinal image (what hits the eye) */}
        <div className="rounded-xl bg-surface-2 p-2">
          <p className="mb-1 text-center text-xs font-semibold uppercase tracking-wide text-muted">Retinal image</p>
          <svg viewBox={`0 0 ${W / 2} ${H}`} className="w-full">
            {mode === 'size' ? (
              <g transform={`translate(${W / 4} ${H / 2})`}>
                <g transform={`scale(${scale})`}>
                  <Person />
                </g>
              </g>
            ) : (
              <g transform={`translate(${W / 4} ${H / 2})`}>
                {/* door projects a trapezoid as it opens */}
                <DoorTrapezoid angle={angle} />
              </g>
            )}
          </svg>
        </div>

        {/* What you perceive (constant) */}
        <div className="rounded-xl bg-surface-2 p-2">
          <p className="mb-1 text-center text-xs font-semibold uppercase tracking-wide text-accent">You perceive</p>
          <svg viewBox={`0 0 ${W / 2} ${H}`} className="w-full">
            {mode === 'size' ? (
              <g transform={`translate(${W / 4} ${H / 2})`}>
                <Person />
                <text x="0" y="78" textAnchor="middle" fontSize="9" fill="var(--color-muted)">same height</text>
              </g>
            ) : (
              <g transform={`translate(${W / 4} ${H / 2})`}>
                <DoorTrapezoid angle={0} />
                <text x="0" y="78" textAnchor="middle" fontSize="9" fill="var(--color-muted)">still rectangular</text>
              </g>
            )}
          </svg>
        </div>
      </div>

      <div className="mt-3 px-1">
        {mode === 'size' ? (
          <SceneSlider label="Distance" value={dist} min={1} max={10} step={0.1} unit="m" onChange={setDist} />
        ) : (
          <SceneSlider label="Door angle" value={angle} min={0} max={80} step={1} unit="°" onChange={setAngle} />
        )}
        <p className="mt-2 text-center text-sm text-muted">
          {mode === 'size' ? (
            <>As distance grows the <span className="text-ink">retinal image shrinks</span>, yet the person doesn't look smaller — your brain rescales using depth cues. That's <span className="text-accent">size constancy</span>.</>
          ) : (
            <>The open door throws a <span className="text-ink">slanted trapezoid</span> onto the retina, but you still see a <span className="text-ink">rectangular</span> door. That's <span className="text-accent">shape constancy</span>.</>
          )}
        </p>
      </div>
    </div>
  )
}

function Person() {
  return (
    <g fill="#00CEC9" stroke="#0a9a96" strokeWidth="1">
      <circle cx="0" cy="-50" r="10" />
      <rect x="-9" y="-38" width="18" height="44" rx="6" />
      <rect x="-8" y="6" width="6" height="30" rx="3" />
      <rect x="2" y="6" width="6" height="30" rx="3" />
    </g>
  )
}

function DoorTrapezoid({ angle }: { angle: number }) {
  // Foreshorten the far edge as the door rotates away.
  const w = 56
  const fore = Math.cos((angle * Math.PI) / 180)
  const farW = w * fore
  const x0 = -w / 2
  return (
    <polygon
      points={`${x0} -50, ${x0 + farW} ${-50 + (1 - fore) * 8}, ${x0 + farW} ${50 - (1 - fore) * 8}, ${x0} 50`}
      fill="#FDCB6E"
      stroke="#c79a3a"
      strokeWidth="2"
      opacity="0.9"
    />
  )
}

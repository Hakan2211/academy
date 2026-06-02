import { useState } from 'react'
import { cn } from '#/lib/cn'

// How a flat retinal image yields a 3-D world. Toggle the monocular (one-eye)
// pictorial cues on and off in a single scene — relative size, linear
// perspective, interposition, texture gradient — and feel the depth appear or
// flatten. Binocular cues (needing two eyes) are noted separately.
type Cue = 'size' | 'perspective' | 'interposition' | 'texture'

const TABS: Array<[Cue, string]> = [
  ['size', 'Relative size'],
  ['perspective', 'Linear perspective'],
  ['interposition', 'Interposition'],
  ['texture', 'Texture gradient'],
]

const COPY: Record<Cue, string> = {
  size: 'When two objects are the same real size, the one casting a smaller image is read as farther away.',
  perspective: 'Parallel lines (rails, a road) appear to converge toward a vanishing point as they recede.',
  interposition: 'If one object blocks another, the blocker must be closer. Overlap is a powerful depth cue.',
  texture: 'A textured surface looks finer and denser as it stretches into the distance.',
}

export function DepthCues() {
  const [on, setOn] = useState<Record<Cue, boolean>>({
    size: true,
    perspective: true,
    interposition: true,
    texture: true,
  })
  const [focus, setFocus] = useState<Cue>('size')
  const toggle = (c: Cue) => setOn((s) => ({ ...s, [c]: !s[c] }))

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="mb-3 flex flex-wrap gap-2">
        {TABS.map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setFocus(key)
              if (!on[key]) toggle(key)
            }}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              on[key] ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full align-middle" style={{ background: on[key] ? 'var(--color-accent)' : 'var(--color-border)' }} />
            {label}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 360 200" className="w-full rounded-xl" style={{ background: 'linear-gradient(#dff6f5, #f3fbfb)' }}>
        {/* horizon */}
        <line x1="0" y1="90" x2="360" y2="90" stroke="#9fd6d2" strokeWidth="1.5" />

        {/* Texture gradient: ground rows getting denser toward horizon */}
        {on.texture &&
          Array.from({ length: 9 }).map((_, i) => {
            const y = 200 - i * (110 / 9)
            return <line key={i} x1="0" y1={y} x2="360" y2={y} stroke="#6fbfb9" strokeWidth="0.8" opacity={0.3 + i * 0.06} />
          })}

        {/* Linear perspective: a road converging on a vanishing point */}
        {on.perspective && (
          <g stroke="#3a9d96" strokeWidth="2" fill="none">
            <line x1="120" y1="200" x2="178" y2="90" />
            <line x1="240" y1="200" x2="182" y2="90" />
          </g>
        )}

        {/* Relative size: three same-real-size trees, shrinking with distance */}
        {on.size && (
          <g fill="#2e8b85">
            {[
              { x: 60, y: 175, s: 1 },
              { x: 175, y: 120, s: 0.55 },
              { x: 270, y: 102, s: 0.34 },
            ].map((t, i) => (
              <g key={i} transform={`translate(${t.x} ${t.y}) scale(${t.s})`}>
                <rect x="-4" y="0" width="8" height="26" fill="#7a5230" />
                <circle cx="0" cy="-6" r="20" />
              </g>
            ))}
          </g>
        )}

        {/* Interposition: a near box overlapping a farther box */}
        {on.interposition && (
          <g>
            <rect x="210" y="130" width="56" height="44" rx="3" fill="#FDCB6E" stroke="#c79a3a" />
            <rect x="244" y="116" width="52" height="40" rx="3" fill="#FF6B9D" stroke="#c84f78" />
          </g>
        )}
      </svg>

      <div className="mt-3 rounded-xl bg-surface-2 p-3 text-sm text-muted">
        <span className="font-semibold text-accent">{TABS.find(([k]) => k === focus)?.[1]}: </span>
        {COPY[focus]}
      </div>

      <div className="mt-2 rounded-xl border border-border p-3 text-sm text-muted">
        <span className="font-semibold text-ink">Binocular cues</span> need both eyes: <span className="text-ink">retinal disparity</span> (each eye sees a slightly different image — the brain compares them) and <span className="text-ink">convergence</span> (the inward turn of the eyes for near objects). These give precise depth up close, where the pictorial cues above are weakest.
      </div>
    </div>
  )
}

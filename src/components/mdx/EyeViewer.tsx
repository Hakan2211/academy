import { useState } from 'react'
import { cn } from '#/lib/cn'

// A labelled cross-section of the human eye. Click a part to learn its job and
// follow light's path from the cornea through to the retina, where it is
// finally turned into nerve signals. A "show light path" toggle traces the rays.
type Part = {
  key: string
  name: string
  role: string
  // x,y for the label dot
  lx: number
  ly: number
}

const PARTS: Array<Part> = [
  { key: 'cornea', name: 'Cornea', role: 'The clear front dome. Does most of the bending (focusing) of incoming light.', lx: 60, ly: 60 },
  { key: 'pupil', name: 'Pupil', role: 'The hole that light passes through. The iris widens or shrinks it to control how much light enters.', lx: 70, ly: 150 },
  { key: 'iris', name: 'Iris', role: 'The coloured muscle ring around the pupil. It adjusts pupil size in bright vs dim light.', lx: 40, ly: 110 },
  { key: 'lens', name: 'Lens', role: 'Fine-tunes focus by changing shape (accommodation) — flatter for far, rounder for near.', lx: 110, ly: 60 },
  { key: 'retina', name: 'Retina', role: 'The light-sensitive screen at the back, packed with rods and cones that transduce light into neural signals.', lx: 290, ly: 60 },
  { key: 'fovea', name: 'Fovea', role: 'A tiny pit in the retina, dense with cones — your point of sharpest, most detailed vision.', lx: 300, ly: 150 },
  { key: 'optic', name: 'Optic nerve', role: 'The cable that carries signals from the retina to the brain. Where it leaves, there are no receptors — your blind spot.', lx: 320, ly: 110 },
]

export function EyeViewer() {
  const [sel, setSel] = useState('cornea')
  const [showLight, setShowLight] = useState(true)
  const part = PARTS.find((p) => p.key === sel) ?? PARTS[0]

  const isSel = (k: string) => sel === k
  const stroke = (k: string) => (isSel(k) ? 'var(--color-accent)' : 'var(--color-border)')
  const sw = (k: string) => (isSel(k) ? 3 : 2)

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="mb-2 flex flex-wrap gap-2">
        {PARTS.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => setSel(p.key)}
            className={cn(
              'rounded-full border px-2.5 py-1 text-xs transition-colors',
              isSel(p.key) ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {p.name}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowLight((v) => !v)}
          className={cn(
            'ml-auto rounded-full border px-2.5 py-1 text-xs transition-colors',
            showLight ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
          )}
        >
          Light path
        </button>
      </div>

      <svg viewBox="0 0 360 220" className="w-full">
        {/* Eyeball: large circle, opening on the left for cornea */}
        <circle cx="200" cy="110" r="92" fill="var(--color-surface-2)" stroke={stroke('retina')} strokeWidth={sw('retina')} />
        {/* Retina arc highlight (back of the eye) */}
        <path d="M 200 18 A 92 92 0 0 1 200 202" fill="none" stroke={isSel('retina') ? 'var(--color-accent)' : 'var(--color-accent-2)'} strokeWidth={isSel('retina') ? 5 : 3} opacity="0.7" />

        {/* Cornea — clear dome on the front (left) */}
        <path d="M 116 70 Q 88 110 116 150" fill="none" stroke={stroke('cornea')} strokeWidth={sw('cornea')} />

        {/* Iris (two bars) + pupil opening between them */}
        <line x1="130" y1="60" x2="130" y2="92" stroke={stroke('iris')} strokeWidth={isSel('iris') ? 6 : 4} />
        <line x1="130" y1="128" x2="130" y2="160" stroke={stroke('iris')} strokeWidth={isSel('iris') ? 6 : 4} />
        {/* Pupil gap marker */}
        <circle cx="130" cy="110" r={isSel('pupil') ? 7 : 5} fill="none" stroke={stroke('pupil')} strokeWidth={sw('pupil')} />

        {/* Lens */}
        <ellipse cx="150" cy="110" rx="10" ry="26" fill={isSel('lens') ? 'var(--color-accent)' : '#4F8CFF'} opacity="0.5" stroke={stroke('lens')} strokeWidth={sw('lens')} />

        {/* Fovea: small notch on the retina */}
        <circle cx="291" cy="110" r={isSel('fovea') ? 6 : 4} fill={isSel('fovea') ? 'var(--color-accent)' : 'var(--color-accent-2)'} />

        {/* Optic nerve leaving the back */}
        <path d="M 286 138 q 30 18 56 14" fill="none" stroke={stroke('optic')} strokeWidth={isSel('optic') ? 6 : 4} />

        {/* Light path: parallel rays bend at the cornea/lens and converge (inverted) on the retina */}
        {showLight && (
          <g stroke="#FDCB6E" strokeWidth="1.6" opacity="0.9">
            <path d="M 20 78 L 116 80 L 150 96 L 291 132" fill="none" />
            <path d="M 20 142 L 116 140 L 150 124 L 291 88" fill="none" />
            <circle cx="20" cy="78" r="2.5" fill="#FDCB6E" stroke="none" />
            <circle cx="20" cy="142" r="2.5" fill="#FDCB6E" stroke="none" />
          </g>
        )}
        {showLight && (
          <text x="20" y="200" fontSize="8" fill="#FDCB6E">light enters → focused → inverted on retina</text>
        )}

        {/* Pointer dot for the selected part */}
        <circle cx={part.lx} cy={part.ly} r="4" fill="var(--color-accent)">
          <animate attributeName="r" values="4;7;4" dur="1.4s" repeatCount="indefinite" />
        </circle>
      </svg>

      <div className="mt-2 rounded-xl bg-surface-2 p-3">
        <p className="text-sm font-semibold text-accent">{part.name}</p>
        <p className="mt-0.5 text-sm text-muted">{part.role}</p>
      </div>
    </div>
  )
}

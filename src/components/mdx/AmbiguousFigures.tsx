import { useState } from 'react'
import { cn } from '#/lib/cn'

// Bistable (ambiguous) figures: one unchanging image, two stable
// interpretations the mind flips between. The data on the page never change —
// only the top-down hypothesis your brain imposes does. Pick a figure and flip
// the reading; each reading highlights so you can lock onto it.
type Fig = 'necker' | 'duckrabbit' | 'facevase'

const TABS: Array<[Fig, string]> = [
  ['necker', 'Necker cube'],
  ['duckrabbit', 'Duck / rabbit'],
  ['facevase', 'Faces / vase'],
]

const READINGS: Record<Fig, [string, string]> = {
  necker: ['Front face = lower-left', 'Front face = upper-right'],
  duckrabbit: ['A duck (beak points left)', 'A rabbit (ears point left)'],
  facevase: ['Two faces in profile', 'A single vase'],
}

const NOTE: Record<Fig, string> = {
  necker: "The line drawing is depth-ambiguous: nothing says which square is in front, so your brain commits to one 3-D reading, then spontaneously flips.",
  duckrabbit: 'The very same contour is a beak or a pair of ears. Expectation and where you fixate tip which animal you see first.',
  facevase: 'Figure-ground reversal: whichever region you treat as the figure becomes the object, and the rest recedes into background.',
}

export function AmbiguousFigures() {
  const [fig, setFig] = useState<Fig>('necker')
  const [alt, setAlt] = useState(false) // false = reading 0, true = reading 1

  const accent = '#00CEC9'
  const dim = 'var(--color-border)'

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="mb-3 flex flex-wrap gap-2">
        {TABS.map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => {
              setFig(k)
              setAlt(false)
            }}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              fig === k ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 360 200" className="w-full rounded-xl bg-surface-2">
        {fig === 'necker' && (
          <g fill="none" strokeWidth="2.5" strokeLinejoin="round">
            {/* back square */}
            <rect x="150" y="50" width="90" height="90" stroke={alt ? accent : dim} />
            {/* front square */}
            <rect x="110" y="80" width="90" height="90" stroke={alt ? dim : accent} />
            {/* connecting edges */}
            <g stroke="var(--color-muted)">
              <line x1="110" y1="80" x2="150" y2="50" />
              <line x1="200" y1="80" x2="240" y2="50" />
              <line x1="110" y1="170" x2="150" y2="140" />
              <line x1="200" y1="170" x2="240" y2="140" />
            </g>
          </g>
        )}

        {fig === 'duckrabbit' && (
          <g>
            {/* head body */}
            <path d="M 130 110 q 0 -45 60 -45 q 50 0 95 25 q 20 10 5 25 q -30 20 -90 22 q -70 2 -75 -27 Z" fill="#00CEC9" opacity="0.25" stroke="#0a9a96" strokeWidth="2" />
            {/* beak / ears on the left */}
            <path d="M 130 100 l -40 -6 l 40 22 Z" fill={alt ? dim : accent} stroke="#0a9a96" strokeWidth="1.5" opacity={alt ? 0.4 : 0.9} />
            <path d="M 132 95 q -38 -22 -52 -8 q 18 4 50 24 Z" fill={alt ? accent : dim} stroke="#0a9a96" strokeWidth="1.5" opacity={alt ? 0.9 : 0.4} />
            {/* eye */}
            <circle cx="160" cy="92" r="5" fill="var(--color-ink)" />
            <text x="270" y="160" fontSize="10" fill="var(--color-muted)">
              {alt ? 'ears →' : '← beak'}
            </text>
          </g>
        )}

        {fig === 'facevase' && (
          <g>
            <rect x="100" y="20" width="160" height="160" rx="6" fill={alt ? 'var(--color-ink)' : accent} opacity={alt ? 1 : 0.2} />
            <path
              d="M 150 25 C 150 65, 128 72, 128 95 C 128 122, 150 130, 150 175 L 210 175 C 210 130, 232 122, 232 95 C 232 72, 210 65, 210 25 Z"
              fill={alt ? 'var(--color-surface-2)' : accent}
              stroke="#0a9a96"
              strokeWidth="1.5"
            />
          </g>
        )}
      </svg>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-sm">
          <span className="text-muted">Now seeing: </span>
          <span className="font-semibold text-accent">{READINGS[fig][alt ? 1 : 0]}</span>
        </p>
        <button
          type="button"
          onClick={() => setAlt((v) => !v)}
          className="rounded-full border border-accent bg-accent/15 px-4 py-1.5 text-sm text-accent"
        >
          Flip interpretation
        </button>
      </div>

      <div className="mt-3 rounded-xl bg-surface-2 p-3 text-sm text-muted">
        {NOTE[fig]} The image is fixed — what changes is the brain's <span className="text-ink">top-down</span> hypothesis. You can hold a reading, but not see both at once.
      </div>
    </div>
  )
}

import { useState } from 'react'
import { cn } from '#/lib/cn'

// The Gestalt principles of grouping: the mind organises raw dots into wholes
// using simple rules. Pick a principle; the same field of elements re-renders
// to show how that rule binds them together — "the whole is other than the sum
// of its parts."
type Principle = 'proximity' | 'similarity' | 'closure' | 'continuity' | 'figureground'

const TABS: Array<[Principle, string]> = [
  ['proximity', 'Proximity'],
  ['similarity', 'Similarity'],
  ['closure', 'Closure'],
  ['continuity', 'Continuity'],
  ['figureground', 'Figure-ground'],
]

const COPY: Record<Principle, string> = {
  proximity: 'Elements close together are seen as a group. Here the dots read as three columns, not one even field — spacing alone does the grouping.',
  similarity: 'Elements that look alike group together. The matching colour pulls the field into rows, cutting across the grid.',
  closure: 'The mind completes a familiar shape from fragments. You see a full triangle and circle even though the outlines have gaps.',
  continuity: 'We prefer smooth, continuous paths. Where two lines cross, you see one flowing curve and one straight line — not four separate segments.',
  figureground: 'Perception splits a scene into a figure and its background. This classic shape flips between a vase and two faces — the same edges, two readings.',
}

const ACCENT = '#00CEC9'

export function GestaltGrouping() {
  const [p, setP] = useState<Principle>('proximity')

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="mb-3 flex flex-wrap gap-2">
        {TABS.map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setP(key)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              p === key ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 360 180" className="w-full rounded-xl bg-surface-2">
        {p === 'proximity' &&
          [0, 1, 2].map((grp) =>
            [0, 1, 2, 3].map((row) => (
              <circle key={`${grp}-${row}`} cx={70 + grp * 110 + (row % 2) * 24} cy={40 + row * 32} r="8" fill={ACCENT} />
            )),
          )}

        {p === 'similarity' &&
          Array.from({ length: 5 }).map((_, row) =>
            Array.from({ length: 7 }).map((__, col) => {
              const fill = row % 2 === 0 ? ACCENT : '#FF6B9D'
              const shapeSquare = row % 2 === 1
              const x = 50 + col * 44
              const y = 30 + row * 30
              return shapeSquare ? (
                <rect key={`${row}-${col}`} x={x - 7} y={y - 7} width="14" height="14" rx="2" fill={fill} />
              ) : (
                <circle key={`${row}-${col}`} cx={x} cy={y} r="8" fill={fill} />
              )
            }),
          )}

        {p === 'closure' && (
          <g stroke={ACCENT} strokeWidth="4" fill="none" strokeLinecap="round">
            {/* triangle with gaps */}
            <path d="M 90 40 L 60 110" />
            <path d="M 75 130 L 130 130" />
            <path d="M 145 110 L 110 45" />
            {/* circle with gaps */}
            <path d="M 250 50 A 45 45 0 0 1 295 95" />
            <path d="M 295 105 A 45 45 0 0 1 250 150" />
            <path d="M 240 145 A 45 45 0 0 1 210 95" />
          </g>
        )}

        {p === 'continuity' && (
          <g fill="none" strokeWidth="4" strokeLinecap="round">
            <path d="M 40 140 C 120 40, 240 40, 320 140" stroke={ACCENT} />
            <line x1="40" y1="60" x2="320" y2="120" stroke="#FF6B9D" />
          </g>
        )}

        {p === 'figureground' && (
          <g>
            {/* black background, white vase / two faces */}
            <rect x="100" y="20" width="160" height="140" rx="6" fill="var(--color-ink)" />
            <path
              d="M 150 25 C 150 60, 130 70, 130 90 C 130 115, 150 125, 150 155 L 210 155 C 210 125, 230 115, 230 90 C 230 70, 210 60, 210 25 Z"
              fill="var(--color-surface)"
            />
            <text x="180" y="172" textAnchor="middle" fontSize="9" fill="var(--color-muted)">vase? …or two faces in profile?</text>
          </g>
        )}
      </svg>

      <div className="mt-3 rounded-xl bg-surface-2 p-3 text-sm text-muted">
        <span className="font-semibold text-accent">{TABS.find(([k]) => k === p)?.[1]}: </span>
        {COPY[p]}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { cn } from '#/lib/cn'

// Justified True Belief Venn diagram — three overlapping circles; each region
// is clickable to reveal what kind of mental state lives there.

type RegionId =
  | 'justified-only'
  | 'true-only'
  | 'belief-only'
  | 'justified-true'
  | 'justified-belief'
  | 'true-belief'
  | 'knowledge'

type Region = {
  id: RegionId
  label: string
  description: string
  example: string
}

const REGIONS: Region[] = [
  {
    id: 'knowledge',
    label: 'Knowledge',
    description: 'Justified + True + Believed',
    example: '"Water boils at 100 °C" — you believe it, it\'s true, and you have good reason to believe it.',
  },
  {
    id: 'justified-belief',
    label: 'Reasonable mistake',
    description: 'Justified + Believed — but FALSE',
    example: 'Before 1492 you were justified in believing the Earth was the center of the cosmos. Believed? Yes. Justified? Mostly yes. True? No.',
  },
  {
    id: 'true-belief',
    label: 'Lucky guess',
    description: 'True + Believed — but UNJUSTIFIED',
    example: 'You guess on a multiple-choice exam and happen to pick the right answer. True? Yes. Believed? Yes. Justified? No.',
  },
  {
    id: 'justified-true',
    label: 'Unaccepted fact',
    description: 'Justified + True — but NOT believed',
    example: 'The evidence for evolution was strong long before most people believed it. The proposition was justified and true, but many did not hold the belief.',
  },
  {
    id: 'justified-only',
    label: 'Reasonable but false',
    description: 'Justified — but neither True nor Believed',
    example: 'A hypothesis well-supported by available data, but which turns out to be wrong and which the researcher hasn\'t yet personally accepted.',
  },
  {
    id: 'true-only',
    label: 'True but unnoticed',
    description: 'True — but neither Justified nor Believed',
    example: '"The number of hairs on your head is even" — probably true or false, but you have no justification and no belief about it.',
  },
  {
    id: 'belief-only',
    label: 'Pure faith / delusion',
    description: 'Believed — but neither True nor Justified',
    example: 'Believing you will definitely win the lottery tomorrow — no justification, almost certainly false, but you believe it.',
  },
]

// SVG geometry: three circles laid out in an equilateral triangle arrangement.
// Center of the whole diagram: (200, 185)
// Radius: 90. Offsets chosen so all three-way and two-way intersections are visible.
const CX = 200
const CY = 185
const R = 90
const OFFSET = 52

const circles = [
  { cx: CX, cy: CY - OFFSET, label: 'Justified', anchor: { x: CX, y: CY - OFFSET - R - 6 } },
  { cx: CX - OFFSET, cy: CY + OFFSET * 0.6, label: 'Believed', anchor: { x: CX - OFFSET - R + 4, y: CY + OFFSET * 0.6 + R - 4 } },
  { cx: CX + OFFSET, cy: CY + OFFSET * 0.6, label: 'True', anchor: { x: CX + OFFSET + R - 4, y: CY + OFFSET * 0.6 + R - 4 } },
]

// Approximate clickable hotspot centres for each region
const hotspots: Record<RegionId, { x: number; y: number }> = {
  'justified-only': { x: CX, y: CY - OFFSET - 28 },
  'belief-only': { x: CX - OFFSET - 22, y: CY + OFFSET * 0.6 + 28 },
  'true-only': { x: CX + OFFSET + 22, y: CY + OFFSET * 0.6 + 28 },
  'justified-belief': { x: CX - OFFSET + 4, y: CY - 6 },
  'justified-true': { x: CX + OFFSET - 4, y: CY - 6 },
  'true-belief': { x: CX, y: CY + OFFSET * 0.6 + 22 },
  knowledge: { x: CX, y: CY + 8 },
}

export function JTBVenn() {
  const [active, setActive] = useState<RegionId | null>('knowledge')

  const activeRegion = REGIONS.find((r) => r.id === active)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-2 text-center text-sm text-muted">
        Click any region to see what kind of mental state lives there.
      </p>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        {/* SVG Venn diagram */}
        <svg
          viewBox="0 0 400 340"
          className="w-full max-w-xs shrink-0 sm:w-56"
          aria-label="Venn diagram of Justified, True, and Believed"
        >
          {/* Three circles */}
          {circles.map((c) => (
            <circle
              key={c.label}
              cx={c.cx}
              cy={c.cy}
              r={R}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="text-border"
            />
          ))}

          {/* Clickable region hotspots */}
          {(Object.entries(hotspots) as [RegionId, { x: number; y: number }][]).map(([id, pos]) => {
            const isKnowledge = id === 'knowledge'
            const isActive = active === id
            return (
              <g key={id} onClick={() => setActive(id)} style={{ cursor: 'pointer' }}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isKnowledge ? 24 : 16}
                  className={cn(
                    'transition-all',
                    isActive
                      ? isKnowledge
                        ? 'fill-accent/40 stroke-accent'
                        : 'fill-accent-2/30 stroke-accent-2'
                      : 'fill-transparent stroke-transparent hover:fill-surface-2/60',
                  )}
                  strokeWidth={isActive ? 1.5 : 0}
                />
                {isKnowledge && (
                  <text
                    x={pos.x}
                    y={pos.y + 5}
                    textAnchor="middle"
                    fontSize={10}
                    className={cn('font-bold select-none', isActive ? 'fill-accent' : 'fill-muted')}
                  >
                    KNOWLEDGE
                  </text>
                )}
              </g>
            )
          })}

          {/* Circle labels */}
          {circles.map((c) => (
            <text
              key={c.label}
              x={c.anchor.x}
              y={c.anchor.y}
              textAnchor="middle"
              fontSize={12}
              fontWeight="600"
              className="fill-ink select-none"
            >
              {c.label}
            </text>
          ))}
        </svg>

        {/* Region description panel */}
        <div className="flex-1">
          {activeRegion ? (
            <div className="rounded-xl border border-border bg-surface-2 p-3 text-sm">
              <div
                className={cn(
                  'mb-1 inline-block rounded-md px-2 py-0.5 text-xs font-semibold',
                  activeRegion.id === 'knowledge'
                    ? 'bg-accent/15 text-accent'
                    : 'bg-accent-2/15 text-accent-2',
                )}
              >
                {activeRegion.label}
              </div>
              <p className="font-semibold text-ink">{activeRegion.description}</p>
              <p className="mt-1 text-muted">{activeRegion.example}</p>
            </div>
          ) : (
            <p className="text-sm text-muted">Click a region in the diagram.</p>
          )}

          {/* Legend buttons */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {REGIONS.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setActive(r.id)}
                className={cn(
                  'rounded-lg border px-2 py-1 text-xs transition-colors',
                  active === r.id
                    ? r.id === 'knowledge'
                      ? 'border-accent bg-accent/15 text-accent'
                      : 'border-accent-2/60 bg-accent-2/10 text-accent-2'
                    : 'border-border text-muted hover:text-ink',
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

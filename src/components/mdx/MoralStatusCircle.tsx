import { useState } from 'react'
import { cn } from '#/lib/cn'

// MoralStatusCircle — the expanding circle of moral concern.
// Concentric rings from self outward. User selects where to draw their boundary
// (which ring is the outermost one that "counts morally"). Rings inside the
// boundary are included; rings outside are excluded. Note of historical widening.
// Fully self-contained — reusable across worlds.

type Ring = {
  id: string
  label: string
  sublabel: string
  radius: number   // SVG units, outermost = 115
  textRadius: number
  example: string
  historicalNote: string
}

const RINGS: Array<Ring> = [
  {
    id: 'self',
    label: 'Self',
    sublabel: '',
    radius: 18,
    textRadius: 0,
    example: 'Your own interests, wellbeing, and rights.',
    historicalNote: 'Every moral system grants some status to the individual self.',
  },
  {
    id: 'family',
    label: 'Family',
    sublabel: 'close kin',
    radius: 36,
    textRadius: 27,
    example: 'Parents, children, siblings — those bound by close kinship.',
    historicalNote: 'Kin-based morality is ancient; most early ethical systems centred on family loyalty.',
  },
  {
    id: 'community',
    label: 'Community',
    sublabel: 'tribe / nation',
    radius: 57,
    textRadius: 46,
    example: 'Your in-group: village, nation, religion, ethnic group.',
    historicalNote: 'Ancient Greek ethics was largely about citizens; duties beyond the polis were thin.',
  },
  {
    id: 'all-humans',
    label: 'All humans',
    sublabel: 'humanity',
    radius: 79,
    textRadius: 68,
    example: 'Every person, regardless of nationality, race, or status.',
    historicalNote: 'The Stoics and later Enlightenment thinkers expanded the circle to all of humanity — a dramatic historical shift.',
  },
  {
    id: 'animals',
    label: 'Animals',
    sublabel: 'sentient beings',
    radius: 99,
    textRadius: 89,
    example: 'Sentient creatures capable of suffering: mammals, birds, fish…',
    historicalNote: 'Peter Singer\'s Animal Liberation (1975) argued suffering, not species, determines moral status. Still contested.',
  },
  {
    id: 'future',
    label: 'Future generations',
    sublabel: 'posterity',
    radius: 115,
    textRadius: 107,
    example: 'People not yet born; obligations around climate and long-run wellbeing.',
    historicalNote: 'Long-termism (Parfit, Ord) extends concern to vast numbers of potential future people. A live frontier of moral philosophy.',
  },
]

// For simplicity the "ecosystems" ring is captured within future generations / environment;
// keep 6 rings for clean display.

const CENTER = 120
const SVG_SIZE = 240

type BoundaryId = Ring['id'] | 'none'

function ringIndex(id: BoundaryId): number {
  if (id === 'none') return -1
  return RINGS.findIndex((r) => r.id === id)
}

export function MoralStatusCircle() {
  const [boundary, setBoundary] = useState<BoundaryId>('all-humans')
  const bIdx = ringIndex(boundary)

  const includedRings = RINGS.filter((_, i) => i <= bIdx)
  const excludedRings = RINGS.filter((_, i) => i > bIdx)

  const activeRing = boundary !== 'none' ? RINGS[bIdx] : null

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-1 text-sm font-semibold text-ink">The expanding circle of moral concern</p>
      <p className="mb-4 text-xs text-muted">
        Select where you draw the boundary of "things that matter morally." Everything inside counts; everything outside does not (yet).
      </p>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        {/* SVG concentric circles */}
        <div className="shrink-0">
          <svg
            width={SVG_SIZE}
            height={SVG_SIZE}
            viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
            aria-label="Moral status circle diagram"
          >
            {/* Render rings from outside in so inner rings paint on top */}
            {[...RINGS].reverse().map((ring, revIdx) => {
              const idx = RINGS.length - 1 - revIdx
              const included = idx <= bIdx
              const isBoundary = idx === bIdx

              return (
                <g key={ring.id}>
                  <circle
                    cx={CENTER}
                    cy={CENTER}
                    r={ring.radius}
                    fill={
                      included
                        ? isBoundary
                          ? 'rgba(var(--color-accent-rgb, 56,189,248), 0.18)'
                          : 'rgba(var(--color-accent-rgb, 56,189,248), 0.08)'
                        : 'rgba(128,128,128,0.04)'
                    }
                    stroke={
                      isBoundary
                        ? 'var(--color-accent, #38bdf8)'
                        : included
                          ? 'rgba(var(--color-accent-rgb, 56,189,248), 0.4)'
                          : 'var(--color-border, #334155)'
                    }
                    strokeWidth={isBoundary ? 2 : 1}
                    strokeDasharray={included ? undefined : '4 3'}
                    className="cursor-pointer transition-all"
                    onClick={() => setBoundary(ring.id)}
                  />
                </g>
              )
            })}

            {/* Ring labels — placed along top of each arc */}
            {RINGS.map((ring, idx) => {
              if (ring.textRadius === 0) return null
              const included = idx <= bIdx
              return (
                <text
                  key={`label-${ring.id}`}
                  x={CENTER}
                  y={CENTER - ring.textRadius + 5}
                  textAnchor="middle"
                  fontSize={8.5}
                  fontWeight={idx === bIdx ? '700' : '400'}
                  fill={included ? 'var(--color-accent, #38bdf8)' : 'var(--color-text-muted, #64748b)'}
                  className="pointer-events-none select-none"
                >
                  {ring.label}
                </text>
              )
            })}
            {/* Center label */}
            <text
              x={CENTER}
              y={CENTER + 4}
              textAnchor="middle"
              fontSize={8}
              fontWeight="700"
              fill="var(--color-accent, #38bdf8)"
              className="pointer-events-none select-none"
            >
              Self
            </text>
          </svg>
        </div>

        {/* Controls + info */}
        <div className="flex-1 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Draw your boundary at:</p>
          {RINGS.map((ring, idx) => {
            const included = idx <= bIdx
            const isActive = ring.id === boundary
            return (
              <button
                key={ring.id}
                type="button"
                onClick={() => setBoundary(ring.id)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs transition-colors',
                  isActive
                    ? 'border-accent bg-accent/15 text-accent'
                    : included
                      ? 'border-accent/30 text-ink hover:border-accent/60'
                      : 'border-border text-muted hover:text-ink',
                )}
              >
                <span
                  className={cn(
                    'inline-block h-2 w-2 shrink-0 rounded-full',
                    isActive ? 'bg-accent' : included ? 'bg-accent/40' : 'bg-border',
                  )}
                />
                <span className="font-semibold">{ring.label}</span>
                {ring.sublabel && <span className="opacity-70">({ring.sublabel})</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Detail panel */}
      {activeRing && (
        <div className="mt-4 rounded-xl border border-accent/30 bg-surface-2 p-3">
          <p className="mb-1 text-sm font-semibold text-accent">{activeRing.label}</p>
          <p className="mb-1 text-xs text-ink">{activeRing.example}</p>
          <p className="text-xs text-muted">
            <span className="font-semibold text-ink">Historical note: </span>
            {activeRing.historicalNote}
          </p>
        </div>
      )}

      {/* Summary of included / excluded */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl border border-accent/30 bg-surface-2 p-2">
          <p className="mb-1 font-semibold text-accent">Included ({includedRings.length})</p>
          {includedRings.map((r) => (
            <p key={r.id} className="text-muted">• {r.label}</p>
          ))}
          {includedRings.length === 0 && <p className="text-muted italic">Nothing selected</p>}
        </div>
        <div className="rounded-xl border border-border bg-surface-2 p-2">
          <p className="mb-1 font-semibold text-muted">Outside boundary ({excludedRings.length})</p>
          {excludedRings.map((r) => (
            <p key={r.id} className="text-muted">• {r.label}</p>
          ))}
          {excludedRings.length === 0 && <p className="text-muted italic">All included</p>}
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted">
        <span className="font-semibold text-ink">The historical arc: </span>
        Peter Singer's term "expanding circle" captures a real pattern in moral history — from kin to tribe to
        nation to all humans, and now debates about animals and future generations. Each expansion was once
        considered radical. Where should the circle stop — and why?
      </p>
    </div>
  )
}

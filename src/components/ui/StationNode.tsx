import { Link } from '@tanstack/react-router'
import { Icon } from './Icon'
import { cn } from '#/lib/cn'

export type StationState = 'locked' | 'available' | 'current' | 'complete'

const BOX = 84 // ring container px
const R = 38 // ring radius
const CENTER = BOX / 2
const CIRC = 2 * Math.PI * R
const EMBLEM = 58 // inner emblem px

// A single category "station" on the overworld: an accent emblem ringed by a
// done/total progress arc. Click → that category's trail. Locked stations are
// desaturated with a lock and a "finish the previous one" tooltip.
export function StationNode({
  subjectSlug,
  unitSlug,
  name,
  icon,
  accent,
  state,
  done,
  total,
  isSummit,
  lockHint,
}: {
  subjectSlug: string
  unitSlug: string
  name: string
  icon?: string
  accent: string
  state: StationState
  done: number
  total: number
  isSummit?: boolean
  lockHint?: string
}) {
  const locked = state === 'locked'
  const frac =
    state === 'complete' ? 1 : total > 0 ? Math.min(1, done / total) : 0

  const content = (
    <div className="relative grid place-items-center" style={{ width: BOX }}>
      {/* progress ring */}
      <svg
        width={BOX}
        height={BOX}
        className={state === 'current' ? 'animate-pulse' : undefined}
      >
        <circle
          cx={CENTER}
          cy={CENTER}
          r={R}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={4}
        />
        {frac > 0 && (
          <circle
            cx={CENTER}
            cy={CENTER}
            r={R}
            fill="none"
            stroke={accent}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - frac)}
            transform={`rotate(-90 ${CENTER} ${CENTER})`}
          />
        )}
      </svg>

      {/* emblem */}
      <div
        className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2"
        style={{
          width: EMBLEM,
          height: EMBLEM,
          background: locked ? 'var(--color-surface-2)' : `${accent}22`,
          borderColor: locked ? 'var(--color-border)' : accent,
          color: locked ? 'var(--color-muted)' : accent,
          filter: locked ? 'grayscale(0.7)' : undefined,
          boxShadow:
            !locked && (state === 'current' || (isSummit && state === 'complete'))
              ? `0 0 22px -4px ${accent}`
              : undefined,
        }}
      >
        <Icon name={icon ?? 'Folder'} size={26} />
      </div>

      {/* state badges */}
      {state === 'complete' && (
        <span
          className="absolute -right-0.5 -top-0.5 grid h-6 w-6 place-items-center rounded-full border-2 border-bg bg-success text-white"
          style={{ borderColor: 'var(--color-bg)' }}
        >
          <Icon name="Check" size={13} />
        </span>
      )}
      {locked && (
        <span
          className="absolute -right-0.5 -top-0.5 grid h-6 w-6 place-items-center rounded-full bg-surface-2 text-muted"
          style={{ borderColor: 'var(--color-bg)' }}
        >
          <Icon name="Lock" size={12} />
        </span>
      )}
      {isSummit && (
        <span
          className="absolute -top-4 left-1/2 -translate-x-1/2"
          style={{ color: accent }}
        >
          <Icon name="Flag" size={16} />
        </span>
      )}

      {/* label */}
      <div className="absolute left-1/2 top-[90px] w-[150px] -translate-x-1/2 text-center">
        <p
          className={cn(
            'text-sm font-semibold leading-tight',
            locked ? 'text-muted' : 'text-ink',
          )}
        >
          {name}
        </p>
        <p className="mt-0.5 text-xs text-muted">
          {locked
            ? 'Locked'
            : state === 'complete'
              ? `${total}/${total} ✓`
              : total > 0
                ? `${done}/${total} lessons`
                : 'Coming soon'}
        </p>
      </div>
    </div>
  )

  if (locked) {
    return (
      <div className="cursor-not-allowed" title={lockHint} aria-disabled>
        {content}
      </div>
    )
  }
  return (
    <Link
      to="/subjects/$subjectSlug/$unitSlug"
      params={{ subjectSlug, unitSlug }}
      className="block transition-transform hover:scale-[1.05]"
    >
      {content}
    </Link>
  )
}

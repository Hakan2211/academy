import { badgeMeta } from '#/lib/badges'
import { cn } from '#/lib/cn'
import { Icon } from './Icon'

// Circular collectible medal. Earned = full-colour accent ring + glow; not yet
// earned = the same emblem desaturated (grayscale + opacity), per the design's
// "locked states derived in CSS" rule.
export function BadgeMedal({
  badgeKey,
  earned,
}: {
  badgeKey: string
  earned: boolean
}) {
  const meta = badgeMeta(badgeKey)
  return (
    <div className="flex flex-col items-center text-center">
      <div
        className="grid h-20 w-20 place-items-center rounded-full border-2"
        style={{
          borderColor: earned ? meta.color : 'var(--color-border)',
          background: earned ? `${meta.color}22` : 'var(--color-surface-2)',
          color: earned ? meta.color : 'var(--color-muted)',
          filter: earned ? undefined : 'grayscale(0.85)',
          opacity: earned ? 1 : 0.5,
          boxShadow: earned
            ? `0 0 0 4px ${meta.color}22, 0 0 26px -6px ${meta.color}`
            : undefined,
        }}
      >
        <Icon name={meta.icon} size={30} />
      </div>
      <p
        className={cn(
          'mt-2 text-sm font-semibold leading-tight',
          earned ? 'text-ink' : 'text-muted',
        )}
      >
        {meta.label}
      </p>
      <p className="text-xs text-muted">{earned ? 'Earned' : 'Locked'}</p>
    </div>
  )
}

import { badgeMeta } from '#/lib/badges'
import { Icon } from './Icon'

export function Badge({ badge }: { badge: string }) {
  const meta = badgeMeta(badge)
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1.5 text-sm">
      <span
        className="grid h-6 w-6 place-items-center rounded-full"
        style={{ background: `${meta.color}22`, color: meta.color }}
      >
        <Icon name={meta.icon} size={14} />
      </span>
      <span>{meta.label}</span>
    </div>
  )
}

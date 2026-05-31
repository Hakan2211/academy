import type { ReactNode } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

type CalloutType = 'info' | 'tip' | 'warn'

const STYLES: Record<CalloutType, { box: string; icon: string }> = {
  info: { box: 'border-accent-2/40 bg-accent-2/10', icon: 'Info' },
  tip: { box: 'border-success/40 bg-success/10', icon: 'Lightbulb' },
  warn: { box: 'border-warn/40 bg-warn/10', icon: 'TriangleAlert' },
}

export function Callout({
  type = 'info',
  title,
  children,
}: {
  type?: CalloutType
  title?: string
  children: ReactNode
}) {
  const s = STYLES[type] ?? STYLES.info
  return (
    <div className={cn('rounded-xl border p-4', s.box)}>
      {title && (
        <div className="mb-1 flex items-center gap-2 font-semibold">
          <Icon name={s.icon} size={16} />
          {title}
        </div>
      )}
      <div className="text-sm text-ink/90">{children}</div>
    </div>
  )
}

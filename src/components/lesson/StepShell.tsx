import type { ReactNode } from 'react'
import { ProgressDots } from './ProgressDots'

const KIND_LABEL: Record<string, string> = {
  explain: 'Concept',
  interactive: 'Explore',
  quiz: 'Check yourself',
  recap: 'Recap',
}

export function StepShell({
  title,
  kind,
  current,
  total,
  children,
  footer,
}: {
  title: string
  kind: string
  current: number
  total: number
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/80 p-6 backdrop-blur-sm sm:p-8">
      <header className="mb-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-accent-2">
            {KIND_LABEL[kind] ?? kind}
          </span>
          <ProgressDots current={current} total={total} />
        </div>
        <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
      </header>
      <div className="space-y-4 text-[15px] leading-relaxed text-ink/90">
        {children}
      </div>
      {footer}
    </div>
  )
}

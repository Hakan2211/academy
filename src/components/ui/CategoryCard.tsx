import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { Icon } from './Icon'
import { cn } from '#/lib/cn'

export type CategoryCardData = {
  slug: string
  name: string
  description?: string
  icon?: string
  accentColor?: string
  levelRange?: string
  done: number
  total: number // published lesson count; 0 => category is "coming soon"
}

export function CategoryCard({
  subjectSlug,
  category,
}: {
  subjectSlug: string
  category: CategoryCardData
}) {
  const accent = category.accentColor ?? '#4F8CFF'
  const live = category.total > 0
  const pct = live ? Math.round((category.done / category.total) * 100) : 0

  const body = (
    <motion.div
      whileHover={live ? { y: -4 } : undefined}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface p-5 transition-colors',
        live ? 'hover:border-accent/50' : 'opacity-60',
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <div
          className="grid h-12 w-12 place-items-center rounded-xl"
          style={{ background: `${accent}22`, color: accent }}
        >
          <Icon name={category.icon ?? 'Folder'} size={24} />
        </div>
        {category.levelRange && (
          <span className="rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-muted">
            {category.levelRange}
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold">{category.name}</h3>
      {category.description && (
        <p className="mt-1 text-sm text-muted">{category.description}</p>
      )}

      <div className="mt-4 flex-1" />

      {live ? (
        <div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${pct}%`, background: accent }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-muted">
              {category.done}/{category.total} lessons
            </span>
            <span
              className="inline-flex items-center gap-1 font-medium"
              style={{ color: accent }}
            >
              {category.done > 0 ? 'Continue' : 'Start'}{' '}
              <Icon name="ArrowRight" size={16} />
            </span>
          </div>
        </div>
      ) : (
        <span className="text-sm text-muted">Coming soon</span>
      )}
    </motion.div>
  )

  if (!live) return body
  return (
    <Link
      to="/subjects/$subjectSlug/$unitSlug"
      params={{ subjectSlug, unitSlug: category.slug }}
      className="block h-full"
    >
      {body}
    </Link>
  )
}

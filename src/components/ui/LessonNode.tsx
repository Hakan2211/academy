import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { Icon } from './Icon'
import { cn } from '#/lib/cn'

// 'soon' = authored MDX doesn't exist yet; shown in the roadmap, not playable.
export type LessonNodeState =
  | 'locked'
  | 'available'
  | 'current'
  | 'complete'
  | 'soon'

export type LessonLevel = 'beginner' | 'intermediate' | 'advanced'

export type LessonNodeData = {
  contentSlug: string
  title: string
  summary: string
  minutes: number
  xp: number
  state: LessonNodeState
  level?: LessonLevel
  // 'deepdive' lessons render as larger "capstone" milestones on the trail.
  format?: 'core' | 'deepdive'
}

const LEVEL_STYLES: Record<LessonLevel, string> = {
  beginner: 'border-success/40 bg-success/10 text-success',
  intermediate: 'border-warn/40 bg-warn/10 text-warn',
  advanced: 'border-danger/40 bg-danger/10 text-danger',
}

export function LessonNode({
  title,
  summary,
  minutes,
  xp,
  state,
  level,
  contentSlug,
}: LessonNodeData) {
  const interactive = state !== 'locked' && state !== 'soon'
  const ring = {
    locked: 'border-border bg-surface text-muted',
    soon: 'border-dashed border-border bg-surface text-muted',
    available: 'border-accent bg-accent/15 text-accent',
    current: 'border-accent-2 bg-accent-2/15 text-accent-2',
    complete: 'border-success bg-success/20 text-success',
  }[state]
  const iconName =
    state === 'complete'
      ? 'Check'
      : state === 'locked'
        ? 'Lock'
        : state === 'soon'
          ? 'Clock'
          : 'Play'

  const node = (
    <div className="flex items-center gap-4">
      <motion.div
        whileHover={interactive ? { scale: 1.06 } : undefined}
        className={cn(
          'grid h-14 w-14 shrink-0 place-items-center rounded-full border-2',
          ring,
          state === 'current' && 'animate-pulse',
        )}
      >
        <Icon name={iconName} size={22} />
      </motion.div>
      <div
        className={cn(
          'flex-1 rounded-2xl border border-border bg-surface p-4 transition-colors',
          interactive && 'group-hover:border-accent/50',
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold">{title}</h4>
            {level && (
              <span
                className={cn(
                  'rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                  LEVEL_STYLES[level],
                )}
              >
                {level}
              </span>
            )}
          </div>
          <span className="shrink-0 text-xs text-muted">
            {state === 'soon' ? 'Coming soon' : `${minutes} min · ${xp} XP`}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted">{summary}</p>
      </div>
    </div>
  )

  if (!interactive) return <div className="opacity-60">{node}</div>
  return (
    <Link
      to="/learn/$"
      params={{ _splat: contentSlug }}
      className="group block"
    >
      {node}
    </Link>
  )
}

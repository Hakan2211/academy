import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { Icon } from './Icon'
import { cn } from '#/lib/cn'
import type { LessonNodeData, LessonNodeState } from './LessonNode'

// Ring palette by state — reused from LessonNode so the visual grammar
// (lock / play / check / clock / dashed) stays consistent across layers.
const RING: Record<LessonNodeState, string> = {
  locked: 'border-border bg-surface text-muted',
  soon: 'border-dashed border-border bg-surface text-muted',
  available: 'border-accent bg-accent/15 text-accent',
  current: 'border-accent-2 bg-accent-2/15 text-accent-2',
  complete: 'border-success bg-success/20 text-success',
}

// A single circular station on the trail. Core lessons are 54px; deep-dive
// capstones are larger with a double ring + accent glow and a Trophy icon.
export function TrailNode({
  state,
  format,
  contentSlug,
  accent,
}: Pick<LessonNodeData, 'state' | 'format' | 'contentSlug'> & {
  accent: string
}) {
  const isDeep = format === 'deepdive'
  const interactive = state !== 'locked' && state !== 'soon'
  const size = isDeep ? 74 : 54
  const iconName = isDeep
    ? state === 'locked'
      ? 'Lock'
      : state === 'soon'
        ? 'Clock'
        : 'Trophy'
    : state === 'complete'
      ? 'Check'
      : state === 'locked'
        ? 'Lock'
        : state === 'soon'
          ? 'Clock'
          : 'Play'

  const circle = (
    <motion.div
      whileHover={interactive ? { scale: 1.07 } : undefined}
      whileTap={interactive ? { scale: 0.97 } : undefined}
      className={cn(
        'grid place-items-center rounded-full border-2',
        RING[state],
        state === 'current' && 'animate-pulse',
        !interactive && 'opacity-60',
      )}
      style={{
        width: size,
        height: size,
        boxShadow: isDeep
          ? interactive
            ? `0 0 0 4px ${accent}22, 0 0 26px -4px ${accent}`
            : '0 0 0 4px rgba(42,53,86,0.6)'
          : undefined,
      }}
    >
      <Icon name={iconName} size={isDeep ? 30 : 22} />
    </motion.div>
  )

  if (!interactive) return circle
  return (
    <Link to="/learn/$" params={{ _splat: contentSlug }} className="block">
      {circle}
    </Link>
  )
}

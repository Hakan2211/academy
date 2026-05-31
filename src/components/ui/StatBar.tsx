import { Link, useRouterState } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../../convex/_generated/api'
import { useDeviceId } from '#/lib/deviceId.context'
import { xpToNextLevel } from '#/lib/xp'
import { cn } from '#/lib/cn'
import { Icon } from './Icon'

// Persistent gamification chrome: level, XP-to-next, streak, badge count — on
// every screen so the progress that already exists is finally visible. Hidden
// on the lesson player to keep the lesson immersive. New/unknown devices fall
// back to "Lv.1 · 0 XP · no streak" (a target, not a blank).
export function StatBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const deviceId = useDeviceId()
  const statsQ = useQuery({
    ...convexQuery(api.progress.getUserStats, { deviceId: deviceId ?? '' }),
    enabled: Boolean(deviceId),
  })

  // Immersive lesson player: no chrome. (Hooks run first, so this early return
  // is safe.)
  if (pathname.startsWith('/learn')) return null

  const stats = statsQ.data ?? null
  const { level, into, needed } = xpToNextLevel(stats?.totalXP ?? 0)
  const pct = Math.min(100, (into / needed) * 100)
  const streak = stats?.currentStreak ?? 0
  const badgeCount = stats?.badges.length ?? 0

  return (
    <div className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-[52px] max-w-6xl items-center gap-3 px-4 sm:gap-5">
        {/* logo / home */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 font-bold transition-opacity hover:opacity-80"
        >
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent/15 text-accent-2">
            <Icon name="Atom" size={18} />
          </span>
          <span className="hidden sm:inline">Academy</span>
        </Link>

        {/* level + xp bar */}
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <span className="shrink-0 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-bold text-accent-2">
            Lv.{level}
          </span>
          <div
            className="h-2 w-full max-w-[240px] overflow-hidden rounded-full bg-surface-2"
            title={`${into} / ${needed} XP to next level`}
          >
            <motion.div
              className="h-full rounded-full bg-accent"
              initial={false}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <span className="hidden shrink-0 text-xs text-muted sm:inline">
            {into}/{needed} XP
          </span>
        </div>

        {/* streak */}
        <div
          className={cn(
            'flex shrink-0 items-center gap-1.5 text-sm font-semibold',
            streak > 0 ? 'text-warn' : 'text-muted',
          )}
          title={
            streak > 0
              ? `${streak}-day streak`
              : 'No streak yet — finish a lesson today'
          }
        >
          <Icon name="Flame" size={18} />
          <span>{streak}</span>
        </div>

        {/* badges */}
        <Link
          to="/badges"
          className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-ink transition-opacity hover:opacity-80"
          title={`${badgeCount} badge${badgeCount === 1 ? '' : 's'} earned — view all`}
        >
          <span className="text-warn">
            <Icon name="Medal" size={18} />
          </span>
          <span>{badgeCount}</span>
        </Link>
      </div>
    </div>
  )
}

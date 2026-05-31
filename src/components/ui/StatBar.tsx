import { Link, useRouterState } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../../convex/_generated/api'
import { useDeviceId } from '#/lib/deviceId.context'
import { xpToNextLevel } from '#/lib/xp'
import { Icon } from './Icon'

const RIM = 'rgba(79,140,255,0.30)' // azure rim
const FLAME = '#FF8A4C'

function Divider() {
  return <span className="h-5 w-px shrink-0 bg-white/12" aria-hidden />
}

// Persistent gamification chrome (design.md §8 step 5, mockup `2.6`): a floating
// glass HUD pill with a glowing azure rim — level, XP-to-next, streak, badge
// count — on every screen so the progress that already exists stays visible.
// Hidden on the lesson player to keep the lesson immersive. The outer wrapper
// keeps a fixed 52px reserved height so the full-bleed cosmos pages
// (calc(100vh - 52px)) stay aligned. New/unknown devices fall back to Lv.1.
export function StatBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const reduce = useReducedMotion()
  const deviceId = useDeviceId()
  const statsQ = useQuery({
    ...convexQuery(api.progress.getUserStats, { deviceId: deviceId ?? '' }),
    enabled: Boolean(deviceId),
  })

  // Immersive lesson player: no chrome. (Hooks run first, so this is safe.)
  if (pathname.startsWith('/learn')) return null

  const stats = statsQ.data ?? null
  const { level, into, needed } = xpToNextLevel(stats?.totalXP ?? 0)
  const pct = Math.min(100, (into / needed) * 100)
  const streak = stats?.currentStreak ?? 0
  const badgeCount = stats?.badges.length ?? 0

  return (
    <div className="sticky top-0 z-40 px-3">
      <div className="mx-auto flex h-[52px] max-w-3xl items-center">
        <div
          className="flex h-11 w-full items-center gap-2.5 rounded-2xl border bg-black/40 px-3 backdrop-blur-xl sm:gap-3.5"
          style={{
            borderColor: RIM,
            boxShadow:
              '0 0 0 1px rgba(79,140,255,0.08), 0 12px 34px -14px rgba(79,140,255,0.7), inset 0 1px 0 rgba(255,255,255,0.07)',
          }}
        >
          {/* logo / home */}
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80"
          >
            <span
              className="grid h-7 w-7 place-items-center rounded-lg bg-accent/15 text-accent"
              style={{ boxShadow: '0 0 14px -2px rgba(79,140,255,0.85)' }}
            >
              <Icon name="Atom" size={17} />
            </span>
            <span className="hidden font-bold lg:inline">Academy</span>
          </Link>

          <Divider />

          {/* level chip */}
          <span className="shrink-0 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent">
            Lv.{level}
          </span>

          {/* xp bar */}
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="hidden text-[11px] font-bold uppercase tracking-wide text-muted sm:inline">
              XP
            </span>
            <div
              className="h-2 w-full max-w-[260px] overflow-hidden rounded-full bg-white/10"
              title={`${into} / ${needed} XP to next level`}
            >
              <motion.div
                className="h-full rounded-full bg-accent"
                style={{ boxShadow: '0 0 10px rgba(79,140,255,0.9)' }}
                initial={false}
                animate={{ width: `${pct}%` }}
                transition={reduce ? { duration: 0 } : { duration: 0.6, ease: 'easeOut' }}
              />
            </div>
            <span className="hidden shrink-0 text-xs text-muted sm:inline">
              {into}/{needed}
            </span>
          </div>

          <Divider />

          {/* streak */}
          <div
            className="flex shrink-0 items-center gap-1.5 text-sm font-semibold"
            title={
              streak > 0
                ? `${streak}-day streak`
                : 'No streak yet — finish a lesson today'
            }
          >
            <span
              style={{
                color: streak > 0 ? FLAME : 'var(--color-muted)',
                filter: streak > 0 ? `drop-shadow(0 0 6px ${FLAME})` : undefined,
              }}
            >
              <Icon name="Flame" size={18} />
            </span>
            <span className={streak > 0 ? 'text-ink' : 'text-muted'}>{streak}</span>
          </div>

          <Divider />

          {/* badges */}
          <Link
            to="/badges"
            className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-ink transition-opacity hover:opacity-80"
            title={`${badgeCount} badge${badgeCount === 1 ? '' : 's'} earned — view all`}
          >
            <span
              className="text-accent"
              style={{ filter: 'drop-shadow(0 0 6px rgba(79,140,255,0.85))' }}
            >
              <Icon name="Medal" size={18} />
            </span>
            <span>{badgeCount}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

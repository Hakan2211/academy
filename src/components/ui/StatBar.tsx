import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../../convex/_generated/api'
import { xpToNextLevel } from '#/lib/xp'
import { Icon } from './Icon'
import { NavMenu } from './NavMenu'

const RIM = 'rgba(79,140,255,0.32)'
const FLAME = '#FF8A4C'
const HEX = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
// Shared "floating glass" look for each HUD capsule — a thin azure rim, a soft
// drop + accent glow (so it lifts off the cosmos), and a top inner highlight.
const GLASS =
  '0 0 0 1px rgba(79,140,255,0.08), 0 16px 40px -16px rgba(79,140,255,0.75), inset 0 1px 0 rgba(255,255,255,0.08)'

function Divider() {
  return <span className="h-5 w-px shrink-0 bg-white/12" aria-hidden />
}

// Persistent gamification chrome (design.md §8 step 5, mockups `2.6`/`1B`/`1.5A`):
// three floating glass capsules — a home button, the stat pill (hero hexagon
// Level badge · XP · streak · badges), and a menu button — that hover over the
// shared universe with a gap from the top edge. The outer wrapper keeps a fixed
// 64px reserved height so the full-bleed cosmos pages (calc(100vh - 64px)) stay
// aligned. Hidden on the immersive lesson player. New devices fall back to Lv.1.
export function StatBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const reduce = useReducedMotion()
  const [menuOpen, setMenuOpen] = useState(false)
  const statsQ = useQuery(convexQuery(api.progress.getUserStats, {}))

  // Immersive lesson player: no chrome. (Hooks run first, so this is safe.)
  if (pathname.startsWith('/learn')) return null

  const stats = statsQ.data ?? null
  const { level, into, needed } = xpToNextLevel(stats?.totalXP ?? 0)
  const pct = Math.min(100, (into / needed) * 100)
  const streak = stats?.currentStreak ?? 0
  const badgeCount = stats?.badges.length ?? 0

  return (
    <div className="sticky top-0 z-40 px-3">
      <div className="mx-auto flex h-16 max-w-[1180px] items-center gap-2.5 sm:gap-3">
        {/* home — its own floating capsule */}
        <Link
          to="/"
          aria-label="Home"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border bg-black/40 text-accent backdrop-blur-xl transition-colors hover:bg-black/60"
          style={{ borderColor: RIM, boxShadow: GLASS }}
        >
          <span style={{ filter: 'drop-shadow(0 0 8px rgba(79,140,255,0.9))' }}>
            <Icon name="Atom" size={20} />
          </span>
        </Link>

        {/* stat pill — the center module */}
        <div
          className="flex h-11 min-w-0 flex-1 items-center gap-2.5 rounded-2xl border bg-black/40 px-2.5 backdrop-blur-xl sm:gap-3.5 sm:px-4"
          style={{ borderColor: RIM, boxShadow: GLASS }}
        >
          {/* hexagon level badge (hero element) */}
          <div className="relative grid h-9 w-9 shrink-0 place-items-center">
            <span
              aria-hidden
              className="absolute inset-0"
              style={{
                clipPath: HEX,
                background:
                  'linear-gradient(155deg, color-mix(in srgb, var(--color-accent) 72%, white), var(--color-accent))',
                boxShadow: '0 0 16px -3px rgba(79,140,255,0.95)',
              }}
            />
            <span
              aria-hidden
              className="absolute inset-[2px]"
              style={{ clipPath: HEX, background: 'rgba(8,12,24,0.82)' }}
            />
            <span className="relative text-center leading-none">
              <span className="block text-[7px] font-bold uppercase tracking-wider text-accent">
                Lv
              </span>
              <span className="block text-sm font-extrabold text-ink">{level}</span>
            </span>
          </div>

          <Divider />

          {/* xp */}
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="hidden text-[11px] font-bold uppercase tracking-wide text-muted md:inline">
              XP
            </span>
            <div
              className="h-2 w-full max-w-[280px] overflow-hidden rounded-full bg-white/10"
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
            <span className="hidden shrink-0 text-xs font-medium text-muted sm:inline">
              {into.toLocaleString()} / {needed.toLocaleString()}
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
            <span className="hidden text-xs font-medium text-muted lg:inline">
              day streak
            </span>
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
            <span className="hidden text-xs font-medium text-muted lg:inline">badges</span>
          </Link>
        </div>

        {/* menu — its own floating capsule */}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border bg-black/40 text-ink backdrop-blur-xl transition-colors hover:bg-black/60 hover:text-accent"
          style={{ borderColor: RIM, boxShadow: GLASS }}
        >
          <Icon name="Menu" size={20} />
        </button>
      </div>

      <NavMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  )
}

import { useEffect } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { CompleteResult } from './context'
import { badgeMeta } from '#/lib/badges'
import { xpToNextLevel } from '#/lib/xp'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

const GOLD = '#FFB020'
const GREEN = '#2ECC71'
const FLAME = '#FF8A4C'
const FLAME_SLOTS = 7

// The lesson-complete celebration (design.md §8 step 5, mockup `2.4`). A frosted
// Cosmic Glass panel on the confetti'd cosmos: a big gold +XP, a level bar with
// a LEVEL UP! pill, the new badge as a glowing coin, and a streak row of flames.
// Glows in the lesson's category accent (panel rim, emblem, Continue); XP/level/
// streak keep their semantic gold/green/flame colours like the mockup.
export function LessonCompleteCard({
  result,
  onExit,
  accent = '#4f8cff',
}: {
  result: CompleteResult
  onExit?: () => void
  accent?: string
}) {
  const reduce = useReducedMotion()
  const { level, into, needed } = xpToNextLevel(result.totalXP)
  const pct = Math.min(100, Math.round((into / needed) * 100))
  const badgeKey = result.newBadges[0]
  const hasBadge = Boolean(badgeKey)
  const litFlames = Math.min(FLAME_SLOTS, Math.max(0, result.currentStreak))

  useEffect(() => {
    if (reduce) return
    let cancelled = false
    void import('canvas-confetti').then(({ default: confetti }) => {
      if (cancelled) return
      confetti({
        particleCount: 150,
        spread: 78,
        origin: { y: 0.32 },
        colors: [accent, GOLD, GREEN, '#00D2D3', '#ffffff'],
      })
    })
    return () => {
      cancelled = true
    }
  }, [reduce, accent])

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.94, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 180, damping: 20 }}
      className="relative w-full max-w-3xl rounded-[2rem] border border-white/12 bg-black/45 px-6 pb-6 pt-10 backdrop-blur-2xl sm:px-9 sm:pb-8"
      style={{
        boxShadow: `0 40px 120px -40px ${accent}, inset 0 1px 0 rgba(255,255,255,0.08)`,
      }}
    >
      {/* floating emblem straddling the top edge */}
      <div
        className="absolute -top-7 left-1/2 grid h-14 w-14 -translate-x-1/2 place-items-center rounded-2xl backdrop-blur-xl"
        style={{
          color: accent,
          background: `${accent}26`,
          border: `1px solid ${accent}66`,
          boxShadow: `0 0 26px -4px ${accent}, inset 0 0 18px ${accent}33`,
        }}
      >
        <Icon name="Sparkles" size={26} />
      </div>

      {/* title */}
      <div className="text-center">
        <h2 className="text-2xl font-extrabold uppercase tracking-[0.18em] sm:text-3xl">
          Lesson Complete
        </h2>
        <p className="mt-1 text-sm text-muted">
          Great work! You've unlocked new knowledge.
        </p>
      </div>

      {/* XP / level (left) + badge (right) */}
      <div
        className={cn(
          'mt-7 gap-6',
          hasBadge ? 'grid items-center md:grid-cols-[1.1fr_1fr]' : 'mx-auto max-w-md',
        )}
      >
        <div className={hasBadge ? 'text-left' : 'text-center'}>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
            You earned
          </p>
          <div
            className="mt-0.5 flex items-baseline gap-2"
            style={hasBadge ? undefined : { justifyContent: 'center' }}
          >
            <span
              className="text-6xl font-black leading-none sm:text-7xl"
              style={{
                backgroundImage: `linear-gradient(180deg, #FFE3A3, ${GOLD})`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                filter: `drop-shadow(0 4px 18px ${GOLD}66)`,
              }}
            >
              +{result.xpAwarded}
            </span>
            <span className="text-2xl font-extrabold" style={{ color: GOLD }}>
              XP
            </span>
          </div>

          {/* level bar */}
          <div className="mt-4 flex items-center justify-between text-[11px] font-bold uppercase tracking-wide text-muted">
            <span>Level {level}</span>
            <span>Level {level + 1}</span>
          </div>
          <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full"
              initial={reduce ? false : { width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.25 }}
              style={{
                background: `linear-gradient(90deg, ${accent}, ${GREEN}, ${GOLD})`,
                boxShadow: `0 0 12px ${accent}99`,
              }}
            />
          </div>
          <p className="mt-1.5 text-xs text-muted">
            {into.toLocaleString()} / {needed.toLocaleString()} XP
          </p>

          {result.leveledUp && (
            <motion.div
              initial={reduce ? false : { scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 14 }}
              className={cn(
                'mt-4 inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-bold uppercase tracking-wide',
                hasBadge ? '' : 'mx-auto',
              )}
              style={{
                color: GREEN,
                borderColor: `${GREEN}66`,
                background: `${GREEN}1a`,
                boxShadow: `0 0 22px -6px ${GREEN}`,
              }}
            >
              <Icon name="ChevronsUp" size={16} /> Level up!
            </motion.div>
          )}
        </div>

        {badgeKey && <BadgeReward badgeKey={badgeKey} reduce={Boolean(reduce)} />}
      </div>

      {/* streak row */}
      <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5">
        <div
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full"
          style={{
            color: FLAME,
            background: `${FLAME}1f`,
            boxShadow: `0 0 22px -4px ${FLAME}`,
          }}
        >
          <Icon name="Flame" size={26} />
        </div>
        <div className="shrink-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
            Streak
          </p>
          <p className="text-xl font-extrabold text-ink">
            {result.currentStreak} {result.currentStreak === 1 ? 'day' : 'days'}
          </p>
        </div>
        <p className="min-w-[8rem] flex-1 text-sm text-muted">
          {result.currentStreak > 1
            ? 'Keep it up — your streak is on fire!'
            : "You're on the board. Come back tomorrow!"}
        </p>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1">
            {Array.from({ length: FLAME_SLOTS }).map((_, i) => (
              <Icon
                key={i}
                name="Flame"
                size={17}
                style={{
                  color: i < litFlames ? FLAME : 'rgba(160,172,210,0.25)',
                  filter: i < litFlames ? `drop-shadow(0 0 5px ${FLAME})` : undefined,
                }}
              />
            ))}
          </div>
          <span className="text-[11px] text-muted">
            best {result.longestStreak} {result.longestStreak === 1 ? 'day' : 'days'}
          </span>
        </div>
      </div>

      {/* continue */}
      {onExit && (
        <div className="mt-7 flex justify-center">
          <button
            type="button"
            onClick={onExit}
            className="group relative grid h-12 w-full max-w-xs place-items-center rounded-2xl font-semibold text-white shadow-lg transition-all hover:brightness-110 active:scale-[0.99]"
            style={{
              background: `linear-gradient(105deg, ${accent}, color-mix(in srgb, ${accent} 48%, white))`,
              boxShadow: `0 16px 40px -12px ${accent}`,
            }}
          >
            <span>Continue</span>
            <span className="absolute right-2 grid h-8 w-8 place-items-center rounded-full bg-white/20">
              <Icon name="ArrowRight" size={16} />
            </span>
          </button>
        </div>
      )}
    </motion.div>
  )
}

// The new badge as a glowing coin (real medal PNG for unit badges, else a
// procedural accent coin with the lucide emblem) over a radial burst.
function BadgeReward({ badgeKey, reduce }: { badgeKey: string; reduce: boolean }) {
  const meta = badgeMeta(badgeKey)
  const unitSlug = badgeKey.startsWith('unit-')
    ? badgeKey.slice('unit-'.length)
    : null
  const img = unitSlug ? `/badges/physics/${unitSlug}.png` : null

  return (
    <motion.div
      initial={reduce ? false : { scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.35, type: 'spring', stiffness: 220, damping: 16 }}
      className="grid place-items-center rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5 text-center"
    >
      <p
        className="text-[11px] font-bold uppercase tracking-[0.18em]"
        style={{ color: GREEN }}
      >
        New badge earned
      </p>

      <div className="relative mt-3 grid h-32 w-32 place-items-center">
        {/* radial burst */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full blur-xl"
          style={{ background: meta.color, opacity: 0.35 }}
        />
        {!reduce && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              width: 168,
              height: 168,
              background: `repeating-conic-gradient(from 0deg, transparent 0deg, ${meta.color} 2deg, transparent 7deg, transparent 17deg)`,
              WebkitMaskImage: 'radial-gradient(circle, black 12%, transparent 62%)',
              maskImage: 'radial-gradient(circle, black 12%, transparent 62%)',
              mixBlendMode: 'screen',
              opacity: 0.55,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {img ? (
          <img
            src={img}
            alt=""
            draggable={false}
            className="relative h-28 w-28 select-none"
            style={{
              filter: `drop-shadow(0 0 16px ${meta.color}) drop-shadow(0 8px 16px rgba(0,0,0,0.5))`,
            }}
          />
        ) : (
          <div
            className="relative grid h-24 w-24 place-items-center rounded-full border-2"
            style={{
              color: meta.color,
              borderColor: meta.color,
              background: `${meta.color}1f`,
              boxShadow: `0 0 0 4px ${meta.color}22, 0 0 30px -4px ${meta.color}`,
            }}
          >
            <Icon name={meta.icon} size={40} />
          </div>
        )}
      </div>

      <p className="mt-3 text-lg font-extrabold text-ink">{meta.label}</p>
      <p className="text-xs text-muted">Badge unlocked</p>
    </motion.div>
  )
}

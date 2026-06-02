import { useMemo, useState } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { badgeGroups, badgeImage, badgeMeta } from '#/lib/badges'
import type { BadgeGroup } from '#/lib/badges'
import { Icon } from './Icon'

// The badge "trophy room" (design.md §8 step 5, mockup `2.5`): glowing medal
// coins on the shared cosmos. Earned = lit + glowing; locked = desaturated +
// lock. Grouped into one section per subject (+ a leading Milestones row) and
// vertically scrollable, so it scales as subjects land instead of cramming a
// fixed-height constellation. Tapping a coin reveals how to earn it.

export function BadgeConstellation({
  earned,
}: {
  earned: ReadonlySet<string>
}) {
  const reduce = useReducedMotion()
  const router = useRouter()
  const groups = useMemo(() => badgeGroups(), [])
  const allKeys = useMemo(() => groups.flatMap((g) => g.keys), [groups])
  const total = allKeys.length
  const earnedCount = allKeys.filter((k) => earned.has(k)).length
  const isEmpty = earnedCount === 0
  const pct = total > 0 ? Math.round((earnedCount / total) * 100) : 0
  const [selected, setSelected] = useState<string | null>(null)

  const goBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.history.back()
    } else {
      void router.navigate({ to: '/' })
    }
  }

  return (
    <div className="h-[calc(100vh-64px)] overflow-y-auto overflow-x-hidden">
      <div className="relative mx-auto max-w-[1180px] px-5 pb-28 pt-5 sm:px-8">
        {/* header */}
        <button
          type="button"
          onClick={goBack}
          className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-black/40 px-3 py-1.5 text-sm font-semibold text-ink backdrop-blur-md transition-colors hover:bg-black/60"
        >
          <Icon name="ArrowLeft" size={15} /> Back
        </button>

        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div>
            <h1 className="text-2xl font-extrabold uppercase tracking-[0.16em] sm:text-3xl">
              Badge Collection
            </h1>
            <p className="mt-1 text-sm font-bold tracking-wide">
              <span className="text-accent">{earnedCount}</span>
              <span className="text-muted"> of {total} earned</span>
            </p>
          </div>

          {/* legend */}
          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/35 px-4 py-2 text-xs font-semibold uppercase tracking-wide backdrop-blur-md">
            <span className="flex items-center gap-1.5 text-ink">
              <span
                className="h-2.5 w-2.5 rounded-full bg-accent"
                style={{ boxShadow: '0 0 8px var(--color-accent)' }}
              />
              Earned
            </span>
            <span className="flex items-center gap-1.5 text-muted">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              Locked
            </span>
          </div>
        </div>

        {/* overall progress bar */}
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/8">
          <motion.div
            className="h-full rounded-full bg-accent"
            style={{ boxShadow: '0 0 12px rgba(79,140,255,0.8)' }}
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={reduce ? { duration: 0 } : { duration: 0.7, ease: 'easeOut' }}
          />
        </div>

        {isEmpty && (
          <div className="mt-5 flex flex-col items-start gap-2.5 rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur-md">
            <p className="text-sm text-muted">
              Complete lessons to start lighting up your collection.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:brightness-110"
              style={{
                background:
                  'linear-gradient(105deg, #4F8CFF, color-mix(in srgb, #4F8CFF 48%, white))',
                boxShadow: '0 12px 30px -12px #4F8CFF',
              }}
            >
              Start learning <Icon name="ArrowRight" size={15} />
            </Link>
          </div>
        )}

        {/* subject sections */}
        <div className="mt-9 space-y-11">
          {groups.map((g) => (
            <BadgeSection
              key={g.label}
              group={g}
              earned={earned}
              reduce={Boolean(reduce)}
              selected={selected}
              onSelect={(k) => setSelected((s) => (s === k ? null : k))}
            />
          ))}
        </div>
      </div>

      {/* detail card (fixed bottom-center) — how to earn the selected badge */}
      <div className="pointer-events-none fixed bottom-5 left-1/2 z-40 -translate-x-1/2">
        <AnimatePresence>
          {selected && (
            <BadgeDetail
              key={selected}
              badgeKey={selected}
              earned={earned.has(selected)}
              reduce={Boolean(reduce)}
              onClose={() => setSelected(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function BadgeSection({
  group,
  earned,
  reduce,
  selected,
  onSelect,
}: {
  group: BadgeGroup
  earned: ReadonlySet<string>
  reduce: boolean
  selected: string | null
  onSelect: (k: string) => void
}) {
  const earnedIn = group.keys.filter((k) => earned.has(k)).length
  const complete = earnedIn === group.keys.length

  return (
    <section>
      {/* section header */}
      <div className="mb-5 flex items-center gap-3">
        <span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border"
          style={{
            color: group.color,
            borderColor: `${group.color}55`,
            background: `${group.color}1a`,
            boxShadow: `0 0 16px -6px ${group.color}`,
          }}
        >
          <Icon name={group.icon} size={17} />
        </span>
        <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-ink">
          {group.label}
        </h2>
        <span
          className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums"
          style={{
            color: complete ? group.color : 'var(--color-muted)',
            background: complete ? `${group.color}1f` : 'rgba(255,255,255,0.06)',
            border: `1px solid ${complete ? `${group.color}66` : 'rgba(255,255,255,0.12)'}`,
          }}
        >
          {earnedIn}/{group.keys.length}
        </span>
        <div
          className="h-px flex-1"
          style={{
            background: `linear-gradient(90deg, ${group.color}40, transparent)`,
          }}
        />
      </div>

      {/* responsive medal grid — labels live in-flow under each coin */}
      <div className="grid grid-cols-3 gap-x-3 gap-y-7 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7">
        {group.keys.map((k) => (
          <BadgeCoin
            key={k}
            badgeKey={k}
            accent={group.color}
            earned={earned.has(k)}
            reduce={reduce}
            selected={selected === k}
            onSelect={() => onSelect(k)}
          />
        ))}
      </div>
    </section>
  )
}

function BadgeCoin({
  badgeKey,
  accent,
  earned,
  reduce,
  selected,
  onSelect,
}: {
  badgeKey: string
  accent: string
  earned: boolean
  reduce: boolean
  selected: boolean
  onSelect: () => void
}) {
  const meta = badgeMeta(badgeKey)
  const img = badgeImage(badgeKey)
  const color = meta.color || accent
  const D = 74
  const RING = D + 14

  const coin = img ? (
    <img
      src={img}
      alt=""
      draggable={false}
      loading="lazy"
      decoding="async"
      className="h-full w-full select-none"
      style={{
        filter: earned
          ? `drop-shadow(0 0 13px ${color}) drop-shadow(0 6px 14px rgba(0,0,0,0.5))`
          : 'grayscale(0.85) brightness(0.55)',
      }}
    />
  ) : (
    <div
      className="grid h-full w-full place-items-center rounded-full border-2"
      style={{
        color: earned ? color : 'rgba(150,165,200,0.6)',
        borderColor: earned ? color : 'rgba(120,135,170,0.35)',
        background: earned ? `${color}1f` : 'rgba(20,26,43,0.7)',
        boxShadow: earned
          ? `0 0 0 4px ${color}22, 0 0 26px -6px ${color}`
          : undefined,
        filter: earned ? undefined : 'grayscale(0.4)',
      }}
    >
      <Icon name={meta.icon} size={30} />
    </div>
  )

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="group flex cursor-pointer flex-col items-center gap-2 rounded-2xl px-1 py-1.5 outline-none transition-colors focus-visible:bg-white/5"
      title={`${meta.label} — ${earned ? 'earned' : 'locked'}`}
    >
      <div
        className="relative grid place-items-center"
        style={{ width: RING, height: RING }}
      >
        {/* bloom halo */}
        <div
          aria-hidden
          className="pointer-events-none absolute rounded-full blur-2xl"
          style={{
            width: RING * 1.4,
            height: RING * 1.4,
            background: color,
            opacity: earned ? 0.28 : 0.04,
            mixBlendMode: 'screen',
          }}
        />
        {/* thin outer ring (brightens when selected) */}
        <div
          aria-hidden
          className="pointer-events-none absolute rounded-full transition-all"
          style={{
            width: RING,
            height: RING,
            border: `${selected ? 2 : 1}px solid ${
              selected ? color : earned ? `${color}66` : 'rgba(120,135,170,0.18)'
            }`,
            boxShadow: selected ? `0 0 22px -4px ${color}` : undefined,
          }}
        />

        {/* the coin */}
        <motion.div
          className="relative"
          style={{ width: D, height: D }}
          whileHover={reduce ? undefined : { scale: 1.09, y: -3 }}
          transition={{ type: 'spring', stiffness: 320, damping: 20 }}
        >
          {coin}
          {!earned && (
            <span
              className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full text-muted"
              style={{
                background: 'rgba(15,20,34,0.95)',
                border: '2px solid #070a16',
              }}
            >
              <Icon name="Lock" size={12} />
            </span>
          )}
        </motion.div>
      </div>

      {/* label — in normal flow, so it never overlaps a neighbouring coin */}
      <span
        className="line-clamp-2 max-w-[12ch] text-center text-[11px] font-bold uppercase leading-tight tracking-wider"
        style={{
          color: earned ? 'var(--color-ink)' : 'var(--color-muted)',
          textShadow: '0 2px 8px rgba(0,0,0,0.9)',
        }}
      >
        {meta.label}
      </span>
    </button>
  )
}

function BadgeDetail({
  badgeKey,
  earned,
  reduce,
  onClose,
}: {
  badgeKey: string
  earned: boolean
  reduce: boolean
  onClose: () => void
}) {
  const meta = badgeMeta(badgeKey)
  const img = badgeImage(badgeKey)

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      className="pointer-events-auto flex w-[min(92vw,440px)] items-center gap-3.5 rounded-2xl border bg-black/65 px-4 py-3 backdrop-blur-xl"
      style={{
        borderColor: `${meta.color}55`,
        boxShadow: `0 0 34px -10px ${meta.color}, inset 0 1px 0 rgba(255,255,255,0.06)`,
      }}
    >
      <div className="grid h-14 w-14 shrink-0 place-items-center">
        {img ? (
          <img
            src={img}
            alt=""
            draggable={false}
            decoding="async"
            className="h-full w-full select-none"
            style={{
              filter: earned
                ? `drop-shadow(0 0 12px ${meta.color})`
                : 'grayscale(0.7) brightness(0.7)',
            }}
          />
        ) : (
          <div
            className="grid h-12 w-12 place-items-center rounded-full border-2"
            style={{
              color: earned ? meta.color : 'rgba(150,165,200,0.7)',
              borderColor: earned ? meta.color : 'rgba(120,135,170,0.4)',
              background: earned ? `${meta.color}1f` : 'rgba(20,26,43,0.7)',
            }}
          >
            <Icon name={meta.icon} size={22} />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-bold uppercase tracking-wide text-ink">
            {meta.label}
          </p>
          <span
            className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
            style={
              earned
                ? {
                    color: meta.color,
                    background: `${meta.color}1f`,
                    border: `1px solid ${meta.color}66`,
                  }
                : {
                    color: 'var(--color-muted)',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }
            }
          >
            {earned ? 'Earned' : 'Locked'}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-muted">{meta.hint}</p>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-white/10 hover:text-ink"
      >
        <Icon name="X" size={16} />
      </button>
    </motion.div>
  )
}

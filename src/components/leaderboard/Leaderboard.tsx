import { motion, useReducedMotion } from 'motion/react'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../../convex/_generated/api'
import { Avatar } from '#/components/ui/Avatar'
import { Icon } from '#/components/ui/Icon'

// The competitive home of the gamification loop: every learner ranked by
// lifetime XP. A podium crowns the top three, a list carries the rest, and the
// viewer's own row is highlighted (and pinned at the bottom when they fall
// outside the visible top). All from api.users.getLeaderboard — no new state.

const ACCENT = '#4F8CFF'
// gold · silver · bronze for ranks 1–3.
const MEDALS = ['#FFD45A', '#C8D2E0', '#E0A063']

type Entry = {
  rank: number
  userId: string
  name: string | null
  image: string | null
  level: number
  totalXP: number
  currentStreak: number
  isViewer: boolean
}

function displayName(name: string | null, isViewer: boolean): string {
  if (name && name.trim()) return name
  return isViewer ? 'You' : 'Anonymous learner'
}

export function Leaderboard() {
  const reduce = useReducedMotion()
  const boardQ = useQuery(convexQuery(api.users.getLeaderboard, {}))
  const meQ = useQuery(convexQuery(api.users.currentUser, {}))

  const data = boardQ.data
  const entries = (data?.entries ?? []) as Array<Entry>
  const loading = boardQ.isLoading

  const rise = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4, delay: i * 0.04, ease: 'easeOut' as const },
        }

  const podium = entries.slice(0, 3)
  const rest = entries.length >= 3 ? entries.slice(3) : entries
  const showPodium = entries.length >= 3

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full px-4 pb-20 pt-6 sm:pl-28 sm:pr-10">
      <div className="mx-auto max-w-4xl">
        {/* header */}
        <motion.header {...rise(0)} className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
            Leaderboard
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Top learners
          </h1>
          <p className="mt-1 text-sm text-muted">
            Ranked by lifetime XP across the universe. Finish lessons to climb.
          </p>
        </motion.header>

        {loading ? (
          <BoardSkeleton />
        ) : entries.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {showPodium && (
              <motion.div {...rise(1)}>
                <Podium entries={podium} />
              </motion.div>
            )}

            <motion.ul {...rise(2)} className="mt-4 flex flex-col gap-2">
              {rest.map((e) => (
                <li key={e.userId}>
                  <Row entry={e} />
                </li>
              ))}
            </motion.ul>
          </>
        )}

        {/* viewer pinned below the cut */}
        {data && !data.viewerInTop && meQ.data && (
          <div className="sticky bottom-3 mt-4">
            <YourRow
              rank={data.viewerRank}
              name={meQ.data.name ?? null}
              image={meQ.data.image ?? null}
              level={meQ.data.level}
              totalXP={meQ.data.totalXP}
              currentStreak={meQ.data.currentStreak}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function Podium({ entries }: { entries: Array<Entry> }) {
  // Render order [2nd, 1st, 3rd] so the champion sits centered and tallest.
  const order = [entries[1], entries[0], entries[2]]
  const heights = ['h-24', 'h-32', 'h-20']
  const sizes = [60, 78, 56]
  return (
    <div className="grid grid-cols-3 items-end gap-2 sm:gap-4">
      {order.map((e, i) =>
        e ? (
          <PodiumPillar
            key={e.userId}
            entry={e}
            color={MEDALS[e.rank - 1]}
            barHeight={heights[i]}
            avatarSize={sizes[i]}
          />
        ) : (
          <div key={i} />
        ),
      )}
    </div>
  )
}

function PodiumPillar({
  entry,
  color,
  barHeight,
  avatarSize,
}: {
  entry: Entry
  color: string
  barHeight: string
  avatarSize: number
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-2">
        <Avatar
          name={entry.name}
          image={entry.image}
          size={avatarSize}
          ring={color}
        />
        <span
          className="absolute -bottom-1 left-1/2 grid h-6 w-6 -translate-x-1/2 place-items-center rounded-full text-[11px] font-extrabold text-black"
          style={{ background: color, boxShadow: `0 0 12px -2px ${color}` }}
        >
          {entry.rank}
        </span>
      </div>
      <span
        className={
          'line-clamp-1 max-w-full text-center text-sm font-bold ' +
          (entry.isViewer ? 'text-accent' : 'text-ink')
        }
      >
        {displayName(entry.name, entry.isViewer)}
      </span>
      <span className="text-xs font-semibold" style={{ color }}>
        {entry.totalXP.toLocaleString()} XP
      </span>
      <div
        className={
          'mt-2 flex w-full items-start justify-center rounded-t-xl border border-b-0 pt-2 ' +
          barHeight
        }
        style={{
          borderColor: `${color}55`,
          background: `linear-gradient(180deg, ${color}22, ${color}05)`,
        }}
      >
        <span className="text-[11px] font-bold uppercase tracking-wide text-muted">
          Lv.{entry.level}
        </span>
      </div>
    </div>
  )
}

function Row({ entry }: { entry: Entry }) {
  const viewer = entry.isViewer
  return (
    <div
      className="flex items-center gap-3 rounded-2xl border px-3 py-2.5 backdrop-blur-xl sm:px-4"
      style={{
        borderColor: viewer ? `${ACCENT}66` : 'rgba(255,255,255,0.08)',
        background: viewer ? `${ACCENT}14` : 'rgba(0,0,0,0.38)',
        boxShadow: viewer
          ? `0 0 0 1px ${ACCENT}33, 0 12px 30px -18px ${ACCENT}`
          : '0 12px 30px -22px rgba(0,0,0,0.8)',
      }}
    >
      <span className="w-7 shrink-0 text-center text-sm font-bold text-muted">
        {entry.rank}
      </span>
      <Avatar name={entry.name} image={entry.image} size={40} />
      <div className="min-w-0 flex-1">
        <p
          className={
            'truncate text-sm font-bold ' + (viewer ? 'text-accent' : 'text-ink')
          }
        >
          {displayName(entry.name, viewer)}
          {viewer && (
            <span className="ml-2 rounded-full bg-accent/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent">
              You
            </span>
          )}
        </p>
        <p className="text-xs text-muted">Level {entry.level}</p>
      </div>
      {entry.currentStreak > 0 && (
        <span
          className="hidden shrink-0 items-center gap-1 text-xs font-semibold text-ink sm:flex"
          title={`${entry.currentStreak}-day streak`}
        >
          <span style={{ color: '#FF8A4C' }}>
            <Icon name="Flame" size={14} />
          </span>
          {entry.currentStreak}
        </span>
      )}
      <span className="shrink-0 text-right text-sm font-extrabold text-accent">
        {entry.totalXP.toLocaleString()}
        <span className="ml-1 text-[10px] font-bold text-muted">XP</span>
      </span>
    </div>
  )
}

function YourRow({
  rank,
  name,
  image,
  level,
  totalXP,
  currentStreak,
}: {
  rank: number | null
  name: string | null
  image: string | null
  level: number
  totalXP: number
  currentStreak: number
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl border px-3 py-2.5 backdrop-blur-2xl sm:px-4"
      style={{
        borderColor: `${ACCENT}66`,
        background: 'rgba(8,12,24,0.85)',
        boxShadow: `0 0 0 1px ${ACCENT}33, 0 18px 44px -20px ${ACCENT}`,
      }}
    >
      <span className="w-7 shrink-0 text-center text-sm font-bold text-accent">
        {rank ?? '—'}
      </span>
      <Avatar name={name} image={image} size={40} ring={ACCENT} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-accent">
          {name && name.trim() ? name : 'You'}
          <span className="ml-2 rounded-full bg-accent/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent">
            You
          </span>
        </p>
        <p className="text-xs text-muted">
          {rank ? 'Your rank' : 'Finish a lesson to join the board'} · Level {level}
        </p>
      </div>
      {currentStreak > 0 && (
        <span className="hidden shrink-0 items-center gap-1 text-xs font-semibold text-ink sm:flex">
          <span style={{ color: '#FF8A4C' }}>
            <Icon name="Flame" size={14} />
          </span>
          {currentStreak}
        </span>
      )}
      <span className="shrink-0 text-right text-sm font-extrabold text-accent">
        {totalXP.toLocaleString()}
        <span className="ml-1 text-[10px] font-bold text-muted">XP</span>
      </span>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/40 py-16 text-center backdrop-blur-xl">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-accent/12 text-accent">
        <Icon name="Trophy" size={26} />
      </span>
      <p className="mt-4 text-base font-bold text-ink">No rankings yet</p>
      <p className="mt-1 max-w-xs text-sm text-muted">
        Be the first to earn XP — finish a lesson and claim the top spot.
      </p>
    </div>
  )
}

function BoardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-16 animate-pulse rounded-2xl border border-white/8 bg-white/[0.03]"
        />
      ))}
    </div>
  )
}

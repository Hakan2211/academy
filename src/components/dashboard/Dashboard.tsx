import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../../convex/_generated/api'
import { xpToNextLevel } from '#/lib/xp'
import { useIsPremium } from '#/lib/billing'
import { BADGES, badgeImage, badgeMeta } from '#/lib/badges'
import { Icon } from '#/components/ui/Icon'

// The returning-learner home base (roadmap §Dashboard). A Cosmic Glass page over
// the shared universe that turns the gamification data we already store into a
// glanceable overview: a Continue hero, stat tiles, per-category Physics
// progress, and the latest badges. All from existing queries (getUserStats /
// getResumePoint / getProgressForUser / getSubjectOverview) — no new backend.

const SUBJECT = 'physics'
const ACCENT = '#4F8CFF'
const FLAME = '#FF8A4C'
const GOLD = '#FFB020'
const GREEN = '#2ECC71'

export function Dashboard() {
  const reduce = useReducedMotion()

  const statsQ = useQuery(convexQuery(api.progress.getUserStats, {}))
  const resumeQ = useQuery(
    convexQuery(api.catalog.getResumePoint, { subjectSlug: SUBJECT }),
  )
  // Completed-lesson set from the one-doc progress summary (bandwidth-lean).
  const progressQ = useQuery(
    convexQuery(api.progress.getCompletedLessons, {}),
  )
  const overviewQ = useQuery(
    convexQuery(api.catalog.getSubjectOverview, { subjectSlug: SUBJECT }),
  )

  const stats = statsQ.data ?? null
  const totalXP = stats?.totalXP ?? 0
  const { level, into, needed } = xpToNextLevel(totalXP)
  const streak = stats?.currentStreak ?? 0
  const longest = stats?.longestStreak ?? 0
  const earned = useMemo(
    () => new Set(stats?.badges ?? []),
    [stats?.badges],
  )
  const totalBadges = useMemo(() => Object.keys(BADGES).length, [])

  const completed = useMemo(
    () =>
      new Set(
        progressQ.data ?? [],
      ),
    [progressQ.data],
  )

  const units = overviewQ.data?.units ?? []
  const subjectColor = overviewQ.data?.subject.color ?? ACCENT

  const perUnit = useMemo(
    () =>
      units.map((u) => {
        const done = u.lessonIds.filter((id) => completed.has(String(id))).length
        return {
          slug: u.slug,
          name: u.name,
          accent: u.accentColor ?? subjectColor,
          done,
          total: u.lessonCount,
        }
      }),
    [units, completed, subjectColor],
  )
  const lessonsDone = perUnit.reduce((a, u) => a + u.done, 0)
  const lessonsTotal = perUnit.reduce((a, u) => a + u.total, 0)
  const overallPct =
    lessonsTotal > 0 ? Math.round((lessonsDone / lessonsTotal) * 100) : 0

  const rise = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4, delay: i * 0.05, ease: 'easeOut' as const },
        }

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full px-4 pb-20 pt-6 sm:pl-28 sm:pr-10">
      <div className="mx-auto max-w-6xl">
        {/* header */}
        <motion.header {...rise(0)} className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
            Dashboard
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-muted">
            Your Physics journey at a glance — {overallPct}% complete.
          </p>
        </motion.header>

        {/* continue hero */}
        <motion.div {...rise(1)}>
          <ContinueHero resume={resumeQ.data ?? null} />
        </motion.div>

        {/* stat tiles */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <motion.div {...rise(2)}>
            <StatTile
              icon="Sparkles"
              label="Level"
              value={`Lv.${level}`}
              sub={`${into} / ${needed} XP`}
              color={ACCENT}
              barPct={Math.min(100, (into / needed) * 100)}
            />
          </motion.div>
          <motion.div {...rise(3)}>
            <StatTile
              icon="Flame"
              label="Streak"
              value={`${streak}`}
              sub={`best ${longest} ${longest === 1 ? 'day' : 'days'}`}
              color={FLAME}
            />
          </motion.div>
          <motion.div {...rise(4)}>
            <StatTile
              icon="Medal"
              label="Badges"
              value={`${earned.size}`}
              sub={`of ${totalBadges}`}
              color={GOLD}
            />
          </motion.div>
          <motion.div {...rise(5)}>
            <StatTile
              icon="GraduationCap"
              label="Lessons"
              value={`${lessonsDone}`}
              sub={lessonsTotal > 0 ? `of ${lessonsTotal}` : 'done'}
              color={GREEN}
            />
          </motion.div>
        </div>

        {/* progress + recent badges */}
        <div className="mt-5 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <motion.div {...rise(6)}>
            <PhysicsProgress units={perUnit} overallPct={overallPct} />
          </motion.div>
          <motion.div {...rise(7)}>
            <RecentBadges earned={stats?.badges ?? []} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function Card({
  children,
  className = '',
  accent,
}: {
  children: React.ReactNode
  className?: string
  accent?: string
}) {
  return (
    <div
      className={`rounded-2xl border bg-black/40 p-5 backdrop-blur-xl ${className}`}
      style={{
        borderColor: accent ? `${accent}44` : 'rgba(255,255,255,0.1)',
        boxShadow:
          '0 16px 44px -24px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      {children}
    </div>
  )
}

function ContinueHero({
  resume,
}: {
  resume: {
    state: 'start' | 'continue' | 'done'
    contentSlug: string | null
    title: string | null
    unitName: string | null
    lessonNumber: number | null
    unitLessonCount: number | null
    accentColor: string | null
    requiresPremium?: boolean | null
  } | null
}) {
  const accent = resume?.accentColor ?? ACCENT
  // A free user whose next lesson sits in a premium world gets an honest
  // gold "Unlock" CTA instead of a Resume that dead-ends at the gate.
  const { isPremium } = useIsPremium()
  const premiumNext = resume?.requiresPremium === true && isPremium === false

  if (!resume || resume.state === 'done') {
    const done = resume?.state === 'done'
    return (
      <Card accent={ACCENT} className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-accent">
            {done ? 'Physics complete' : 'Your journey'}
          </p>
          <h2 className="mt-1 text-xl font-bold">
            {done ? "You've finished every Physics lesson 🎉" : 'Start exploring'}
          </h2>
        </div>
        <Link
          to="/subjects/$subjectSlug"
          params={{ subjectSlug: SUBJECT }}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
          style={{ background: ACCENT, boxShadow: `0 12px 30px -12px ${ACCENT}` }}
        >
          <Icon name="Map" size={18} /> {done ? 'Review map' : 'Open map'}
        </Link>
      </Card>
    )
  }

  const isStart = resume.state === 'start'
  const contentSlug = resume.contentSlug
  if (!contentSlug) return null

  return (
    <Card
      accent={accent}
      className="relative flex items-center justify-between gap-4 overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full blur-3xl"
        style={{ background: `${accent}33` }}
      />
      <div className="min-w-0">
        <p
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: accent }}
        >
          {isStart ? 'Start your journey' : 'Continue your path'}
        </p>
        <h2 className="mt-1 truncate text-2xl font-extrabold">{resume.title}</h2>
        <p className="mt-1 text-sm text-muted">
          {resume.unitName} · Lesson {resume.lessonNumber} of {resume.unitLessonCount}
        </p>
      </div>
      {premiumNext ? (
        <Link
          to="/upgrade"
          className="group inline-flex shrink-0 items-center gap-2 rounded-xl px-5 py-3 font-semibold text-[#1a1304] transition-all hover:brightness-110 active:scale-[0.98]"
          style={{
            background:
              'linear-gradient(105deg, var(--color-warn), color-mix(in srgb, var(--color-warn) 60%, white))',
            boxShadow: '0 14px 36px -12px var(--color-warn)',
          }}
        >
          <Icon name="Crown" size={18} /> Unlock
        </Link>
      ) : (
        <Link
          to="/learn/$"
          params={{ _splat: contentSlug }}
          className="group inline-flex shrink-0 items-center gap-2 rounded-xl px-5 py-3 font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
          style={{
            background: `linear-gradient(105deg, ${accent}, color-mix(in srgb, ${accent} 50%, white))`,
            boxShadow: `0 14px 36px -12px ${accent}`,
          }}
        >
          <Icon name="Play" size={18} /> {isStart ? 'Start' : 'Resume'}
        </Link>
      )}
    </Card>
  )
}

function StatTile({
  icon,
  label,
  value,
  sub,
  color,
  barPct,
}: {
  icon: string
  label: string
  value: string
  sub: string
  color: string
  barPct?: number
}) {
  return (
    <Card className="h-full">
      <div className="flex items-center gap-2">
        <span
          className="grid h-8 w-8 place-items-center rounded-lg"
          style={{
            color,
            background: `${color}1f`,
            boxShadow: `0 0 16px -6px ${color}`,
          }}
        >
          <Icon name={icon} size={17} />
        </span>
        <span className="text-[11px] font-bold uppercase tracking-wide text-muted">
          {label}
        </span>
      </div>
      <div className="mt-2 text-2xl font-extrabold text-ink">{value}</div>
      {typeof barPct === 'number' ? (
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full"
            style={{ width: `${barPct}%`, background: color }}
          />
        </div>
      ) : (
        <div className="mt-1 text-xs text-muted">{sub}</div>
      )}
      {typeof barPct === 'number' && (
        <div className="mt-1 text-xs text-muted">{sub}</div>
      )}
    </Card>
  )
}

function PhysicsProgress({
  units,
  overallPct,
}: {
  units: Array<{ slug: string; name: string; accent: string; done: number; total: number }>
  overallPct: number
}) {
  return (
    <Card className="h-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wide text-ink">
          Your Physics journey
        </h3>
        <span className="text-sm font-bold text-accent">{overallPct}%</span>
      </div>

      {units.length === 0 ? (
        <p className="text-sm text-muted">Loading your progress…</p>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2">
          {units.map((u) => {
            const pct = u.total > 0 ? Math.round((u.done / u.total) * 100) : 0
            const complete = u.total > 0 && u.done >= u.total
            return (
              <li key={u.slug}>
                <Link
                  to="/subjects/$subjectSlug/$unitSlug"
                  params={{ subjectSlug: SUBJECT, unitSlug: u.slug }}
                  className="block rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2.5 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{
                        background: u.accent,
                        boxShadow: `0 0 8px ${u.accent}`,
                      }}
                    />
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">
                      {u.name}
                    </span>
                    {complete ? (
                      <span style={{ color: u.accent }}>
                        <Icon name="CheckCircle2" size={15} />
                      </span>
                    ) : (
                      <span className="shrink-0 text-xs font-medium text-muted">
                        {u.done}/{u.total}
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, background: u.accent }}
                    />
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}

function RecentBadges({ earned }: { earned: Array<string> }) {
  // Most-recently awarded first (badges array is append-order).
  const recent = [...earned].reverse().slice(0, 6)

  return (
    <Card className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wide text-ink">
          Latest badges
        </h3>
        <Link
          to="/badges"
          className="text-xs font-semibold text-accent transition-opacity hover:opacity-80"
        >
          View all →
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-white/[0.04] text-muted">
            <Icon name="Medal" size={22} />
          </span>
          <p className="mt-3 text-sm text-muted">
            Finish a lesson to earn your first badge.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {recent.map((k) => (
            <DashBadge key={k} badgeKey={k} />
          ))}
        </div>
      )}
    </Card>
  )
}

function DashBadge({ badgeKey }: { badgeKey: string }) {
  const meta = badgeMeta(badgeKey)
  const img = badgeImage(badgeKey)

  return (
    <Link
      to="/badges"
      className="flex flex-col items-center gap-1.5"
      title={`${meta.label} — earned`}
    >
      <span className="grid h-14 w-14 place-items-center">
        {img ? (
          <img
            src={img}
            alt=""
            draggable={false}
            decoding="async"
            className="h-full w-full select-none"
            style={{ filter: `drop-shadow(0 0 10px ${meta.color})` }}
          />
        ) : (
          <span
            className="grid h-12 w-12 place-items-center rounded-full border-2"
            style={{
              color: meta.color,
              borderColor: meta.color,
              background: `${meta.color}1f`,
              boxShadow: `0 0 20px -6px ${meta.color}`,
            }}
          >
            <Icon name={meta.icon} size={22} />
          </span>
        )}
      </span>
      <span className="line-clamp-1 text-center text-[10px] font-semibold text-muted">
        {meta.label}
      </span>
    </Link>
  )
}

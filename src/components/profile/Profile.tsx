import { useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { xpToNextLevel } from '#/lib/xp'
import { BADGES, badgeImage, badgeMeta } from '#/lib/badges'
import { Avatar } from '#/components/ui/Avatar'
import { Icon } from '#/components/ui/Icon'

// The learner's identity page: who they are (avatar, editable name, member
// since) plus a glanceable record of everything the gamification system tracks.
// Reads currentUser + getProgressForUser; name edits go through updateProfile.

const ACCENT = '#4F8CFF'
const FLAME = '#FF8A4C'
const GOLD = '#FFB020'
const GREEN = '#2ECC71'
const VIOLET = '#A29BFE'

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

export function Profile() {
  const reduce = useReducedMotion()
  const meQ = useQuery(convexQuery(api.users.currentUser, {}))
  const progressQ = useQuery(convexQuery(api.progress.getProgressForUser, {}))

  const me = meQ.data ?? null
  const lessonsDone = useMemo(
    () => (progressQ.data ?? []).filter((p) => p.completed).length,
    [progressQ.data],
  )

  const totalXP = me?.totalXP ?? 0
  const { level, into, needed } = xpToNextLevel(totalXP)
  const pct = Math.min(100, (into / needed) * 100)
  const earned = me?.badges ?? []
  const totalBadges = useMemo(() => Object.keys(BADGES).length, [])

  const memberSince = me?.createdAt
    ? new Date(me.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
      })
    : null

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
      <div className="mx-auto max-w-4xl">
        <motion.header {...rise(0)} className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
            Profile
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Your account
          </h1>
        </motion.header>

        {/* identity hero */}
        <motion.div {...rise(1)}>
          <Card accent={ACCENT}>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
              <div className="relative">
                <Avatar
                  name={me?.name}
                  image={me?.image}
                  email={me?.email}
                  size={88}
                  ring={ACCENT}
                />
                <span
                  className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full border-2 border-[#080c18] bg-accent text-xs font-extrabold text-white"
                  style={{ boxShadow: `0 0 14px -2px ${ACCENT}` }}
                  title={`Level ${level}`}
                >
                  {level}
                </span>
              </div>

              <div className="min-w-0 flex-1 text-center sm:text-left">
                <NameEditor name={me?.name ?? null} ready={!!me} />
                {me?.email && (
                  <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted sm:justify-start">
                    <Icon name="Mail" size={14} />
                    {me.email}
                  </p>
                )}
                {memberSince && (
                  <p className="mt-0.5 flex items-center justify-center gap-1.5 text-xs text-muted sm:justify-start">
                    <Icon name="Calendar" size={13} />
                    Member since {memberSince}
                  </p>
                )}
              </div>

              <Link
                to="/settings"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-3.5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-white/[0.08]"
              >
                <Icon name="Settings" size={16} /> Settings
              </Link>
            </div>

            {/* xp bar */}
            <div className="mt-5">
              <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-muted">
                <span>Level {level}</span>
                <span>
                  {into} / {needed} XP to Lv.{level + 1}
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-accent"
                  style={{ boxShadow: '0 0 10px rgba(79,140,255,0.9)' }}
                  initial={false}
                  animate={{ width: `${pct}%` }}
                  transition={reduce ? { duration: 0 } : { duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* stat tiles */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <motion.div {...rise(2)}>
            <StatTile icon="Sparkles" label="Total XP" value={totalXP.toLocaleString()} color={ACCENT} />
          </motion.div>
          <motion.div {...rise(2)}>
            <StatTile icon="TrendingUp" label="Level" value={`${level}`} color={VIOLET} />
          </motion.div>
          <motion.div {...rise(3)}>
            <StatTile
              icon="Flame"
              label="Streak"
              value={`${me?.currentStreak ?? 0}`}
              color={FLAME}
            />
          </motion.div>
          <motion.div {...rise(3)}>
            <StatTile
              icon="Trophy"
              label="Best streak"
              value={`${me?.longestStreak ?? 0}`}
              color={GOLD}
            />
          </motion.div>
          <motion.div {...rise(4)}>
            <StatTile
              icon="Medal"
              label="Badges"
              value={`${earned.length}`}
              sub={`of ${totalBadges}`}
              color={GOLD}
            />
          </motion.div>
          <motion.div {...rise(4)}>
            <StatTile
              icon="GraduationCap"
              label="Lessons"
              value={`${lessonsDone}`}
              color={GREEN}
            />
          </motion.div>
        </div>

        {/* recent badges */}
        <motion.div {...rise(5)} className="mt-5">
          <Card>
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
            {earned.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-white/[0.04] text-muted">
                  <Icon name="Medal" size={22} />
                </span>
                <p className="mt-3 text-sm text-muted">
                  Finish a lesson to earn your first badge.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
                {[...earned].reverse().slice(0, 8).map((k) => (
                  <ProfileBadge key={k} badgeKey={k} />
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

function NameEditor({ name, ready }: { name: string | null; ready: boolean }) {
  const updateProfile = useMutation(api.users.updateProfile)
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(name ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Keep the field in sync when the row loads / changes (and we're not editing).
  useEffect(() => {
    if (!editing) setValue(name ?? '')
  }, [name, editing])

  async function save() {
    const trimmed = value.trim()
    if (trimmed.length === 0) {
      setError('Name cannot be empty.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await updateProfile({ name: trimmed })
      setEditing(false)
    } catch {
      setError('Could not save. Try a shorter name.')
    } finally {
      setSaving(false)
    }
  }

  if (!editing) {
    return (
      <div className="flex items-center justify-center gap-2 sm:justify-start">
        <h2 className="truncate text-2xl font-extrabold text-ink">
          {name && name.trim() ? name : 'Learner'}
        </h2>
        {ready && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label="Edit name"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-white/10 hover:text-accent"
          >
            <Icon name="Pencil" size={15} />
          </button>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <input
          autoFocus
          value={value}
          maxLength={40}
          disabled={saving}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void save()
            if (e.key === 'Escape') {
              setEditing(false)
              setValue(name ?? '')
              setError(null)
            }
          }}
          className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/[0.05] px-3 py-1.5 text-lg font-bold text-ink outline-none focus:border-accent/60"
          placeholder="Your name"
        />
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving}
          aria-label="Save name"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          <Icon name="Check" size={17} />
        </button>
        <button
          type="button"
          onClick={() => {
            setEditing(false)
            setValue(name ?? '')
            setError(null)
          }}
          disabled={saving}
          aria-label="Cancel"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/12 text-muted transition-colors hover:bg-white/10 hover:text-ink"
        >
          <Icon name="X" size={17} />
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-300">{error}</p>}
    </div>
  )
}

function StatTile({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: string
  label: string
  value: string
  sub?: string
  color: string
}) {
  return (
    <Card className="h-full">
      <span
        className="grid h-8 w-8 place-items-center rounded-lg"
        style={{ color, background: `${color}1f`, boxShadow: `0 0 16px -6px ${color}` }}
      >
        <Icon name={icon} size={17} />
      </span>
      <div className="mt-2 text-2xl font-extrabold text-ink">{value}</div>
      <div className="mt-0.5 text-[11px] font-bold uppercase tracking-wide text-muted">
        {label}
        {sub && <span className="ml-1 normal-case text-muted/70">{sub}</span>}
      </div>
    </Card>
  )
}

function ProfileBadge({ badgeKey }: { badgeKey: string }) {
  const meta = badgeMeta(badgeKey)
  const img = badgeImage(badgeKey)
  return (
    <Link
      to="/badges"
      className="flex flex-col items-center gap-1.5"
      title={`${meta.label} — earned`}
    >
      <span className="grid h-12 w-12 place-items-center">
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
            className="grid h-11 w-11 place-items-center rounded-full border-2"
            style={{
              color: meta.color,
              borderColor: meta.color,
              background: `${meta.color}1f`,
              boxShadow: `0 0 20px -6px ${meta.color}`,
            }}
          >
            <Icon name={meta.icon} size={20} />
          </span>
        )}
      </span>
      <span className="line-clamp-1 text-center text-[10px] font-semibold text-muted">
        {meta.label}
      </span>
    </Link>
  )
}

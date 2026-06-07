import { useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../../convex/_generated/api'
import { Icon } from '#/components/ui/Icon'
import { useIsPremium } from '#/lib/billing'

// The catalog browser (NavMenu "Discover"). A fast, searchable counterpart to
// the cinematic island hub: drill All subjects → a subject's units → the unit's
// table of contents, or type to search every published lesson by title
// (api.catalog.searchLessons). Progress colours come from getProgressForUser.

const ACCENT = '#4F8CFF'

type CatalogUnit = {
  slug: string
  name: string
  icon: string | null
  accentColor: string | null
  description: string | null
  levelRange: string | null
  lessonCount: number
  lessonIds: Array<string>
  requiresPremium?: boolean
}
type CatalogSubject = {
  slug: string
  name: string
  description: string
  color: string
  icon: string
  order: number
  isPublished: boolean
  unitCount: number
  lessonTotal: number
  units: Array<CatalogUnit>
}

export function Discover() {
  const reduce = useReducedMotion()

  const [raw, setRaw] = useState('')
  const [term, setTerm] = useState('')
  const [subject, setSubject] = useState<string | null>(null)

  // Debounce the search box so we don't fire a query per keystroke.
  useEffect(() => {
    const id = setTimeout(() => setTerm(raw.trim()), 180)
    return () => clearTimeout(id)
  }, [raw])

  const catalogQ = useQuery(convexQuery(api.catalog.getCatalog, {}))
  // Completed-lesson set from the one-doc progress summary (bandwidth-lean).
  const progressQ = useQuery(convexQuery(api.progress.getCompletedLessons, {}))
  // Browsing stays free for everyone; premium content is marked, and premium
  // lesson hits route to /upgrade for free users (locks only when === false).
  const { isPremium } = useIsPremium()
  const searchQ = useQuery({
    ...convexQuery(
      api.catalog.searchLessons,
      subject ? { term, subjectSlug: subject } : { term },
    ),
    enabled: term.length > 0,
  })

  const catalog = (catalogQ.data ?? []) as Array<CatalogSubject>
  const completed = useMemo(
    () => new Set(progressQ.data ?? []),
    [progressQ.data],
  )

  const doneInUnit = (u: CatalogUnit) =>
    u.lessonIds.filter((id) => completed.has(String(id))).length
  const doneInSubject = (s: CatalogSubject) =>
    s.units.reduce((sum, u) => sum + doneInUnit(u), 0)

  const totals = useMemo(() => {
    const lessons = catalog.reduce((a, s) => a + s.lessonTotal, 0)
    const worlds = catalog.reduce((a, s) => a + s.unitCount, 0)
    return { subjects: catalog.length, worlds, lessons }
  }, [catalog])

  const activeSubject = subject
    ? catalog.find((s) => s.slug === subject) ?? null
    : null
  const searching = term.length > 0

  const rise = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.35, delay: i * 0.04, ease: 'easeOut' as const },
        }

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full px-4 pb-20 pt-6 sm:pl-28 sm:pr-10">
      <div className="mx-auto max-w-6xl">
        {/* header */}
        <motion.header {...rise(0)} className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
            Discover
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Browse everything
          </h1>
          {catalog.length > 0 && (
            <p className="mt-1 text-sm text-muted">
              {totals.subjects} subjects · {totals.worlds} worlds ·{' '}
              {totals.lessons.toLocaleString()} lessons — search or dive in.
            </p>
          )}
        </motion.header>

        {/* search */}
        <motion.div {...rise(1)} className="mb-4">
          <div
            className="flex items-center gap-2.5 rounded-2xl border bg-black/40 px-4 py-3 backdrop-blur-xl"
            style={{ borderColor: 'rgba(79,140,255,0.28)' }}
          >
            <span className="text-muted">
              <Icon name="Search" size={18} />
            </span>
            <input
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              placeholder="Search lessons across every subject…"
              className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted/70 sm:text-base"
              autoComplete="off"
              spellCheck={false}
            />
            {raw && (
              <button
                type="button"
                onClick={() => setRaw('')}
                aria-label="Clear search"
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-white/10 hover:text-ink"
              >
                <Icon name="X" size={16} />
              </button>
            )}
          </div>
        </motion.div>

        {/* subject chips */}
        <motion.div {...rise(2)} className="mb-6 flex flex-wrap gap-2">
          <Chip
            label="All"
            active={subject === null}
            onClick={() => setSubject(null)}
          />
          {catalog.map((s) => (
            <Chip
              key={s.slug}
              label={s.name}
              color={s.color}
              icon={s.icon}
              active={subject === s.slug}
              onClick={() => setSubject((cur) => (cur === s.slug ? null : s.slug))}
            />
          ))}
        </motion.div>

        {/* body */}
        {searching ? (
          <SearchResults
            results={searchQ.data ?? []}
            loading={searchQ.isLoading}
            term={term}
            completed={completed}
            scopedTo={activeSubject?.name ?? null}
            isPremium={isPremium}
          />
        ) : catalogQ.isLoading ? (
          <GridSkeleton />
        ) : activeSubject ? (
          <SubjectUnits
            subject={activeSubject}
            doneInUnit={doneInUnit}
            onBack={() => setSubject(null)}
            isPremium={isPremium}
          />
        ) : (
          <SubjectGrid
            subjects={catalog}
            doneInSubject={doneInSubject}
            onPick={setSubject}
          />
        )}
      </div>
    </div>
  )
}

function Chip({
  label,
  color = ACCENT,
  icon,
  active,
  onClick,
}: {
  label: string
  color?: string
  icon?: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors"
      style={{
        borderColor: active ? color : 'rgba(255,255,255,0.12)',
        background: active ? `${color}22` : 'rgba(255,255,255,0.03)',
        color: active ? '#fff' : 'var(--color-muted)',
        boxShadow: active ? `0 0 16px -6px ${color}` : undefined,
      }}
    >
      {icon && (
        <span style={{ color: active ? color : undefined }}>
          <Icon name={icon} size={14} />
        </span>
      )}
      {label}
    </button>
  )
}

function SubjectGrid({
  subjects,
  doneInSubject,
  onPick,
}: {
  subjects: Array<CatalogSubject>
  doneInSubject: (s: CatalogSubject) => number
  onPick: (slug: string) => void
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {subjects.map((s) => {
        const done = doneInSubject(s)
        const pct = s.lessonTotal > 0 ? Math.round((done / s.lessonTotal) * 100) : 0
        return (
          <button
            key={s.slug}
            type="button"
            onClick={() => onPick(s.slug)}
            className="group flex flex-col rounded-2xl border bg-black/40 p-5 text-left backdrop-blur-xl transition-all hover:-translate-y-0.5"
            style={{
              borderColor: `${s.color}3a`,
              boxShadow: '0 16px 44px -28px rgba(0,0,0,0.85)',
            }}
          >
            <div className="flex items-center gap-3">
              <span
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
                style={{
                  color: s.color,
                  background: `${s.color}1f`,
                  boxShadow: `0 0 20px -6px ${s.color}`,
                }}
              >
                <Icon name={s.icon} size={22} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-extrabold text-ink">
                  {s.name}
                </h3>
                <p className="text-xs text-muted">
                  {s.unitCount} worlds · {s.lessonTotal} lessons
                </p>
              </div>
              <span className="text-muted transition-transform group-hover:translate-x-0.5">
                <Icon name="ChevronRight" size={18} />
              </span>
            </div>

            <p className="mt-3 line-clamp-2 text-sm text-muted">{s.description}</p>

            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-muted">
                <span>{done > 0 ? `${done}/${s.lessonTotal} done` : 'Not started'}</span>
                <span style={{ color: s.color }}>{pct}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, background: s.color }}
                />
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

function SubjectUnits({
  subject,
  doneInUnit,
  onBack,
  isPremium,
}: {
  subject: CatalogSubject
  doneInUnit: (u: CatalogUnit) => number
  onBack: () => void
  isPremium: boolean | undefined
}) {
  return (
    <div>
      {/* subject hero */}
      <div className="mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/12 bg-white/[0.04] text-muted transition-colors hover:bg-white/[0.08] hover:text-ink"
          aria-label="All subjects"
        >
          <Icon name="ArrowLeft" size={18} />
        </button>
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
          style={{
            color: subject.color,
            background: `${subject.color}1f`,
            boxShadow: `0 0 20px -6px ${subject.color}`,
          }}
        >
          <Icon name={subject.icon} size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-xl font-extrabold text-ink">{subject.name}</h2>
          <p className="truncate text-xs text-muted">{subject.description}</p>
        </div>
        <Link
          to="/subjects/$subjectSlug"
          params={{ subjectSlug: subject.slug }}
          className="hidden shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors hover:brightness-110 sm:flex"
          style={{
            borderColor: `${subject.color}55`,
            background: `${subject.color}1a`,
            color: '#fff',
          }}
        >
          <Icon name="Orbit" size={15} /> Open world
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {subject.units.map((u) => {
          const accent = u.accentColor ?? subject.color
          const done = doneInUnit(u)
          const pct = u.lessonCount > 0 ? Math.round((done / u.lessonCount) * 100) : 0
          const complete = u.lessonCount > 0 && done >= u.lessonCount
          return (
            <Link
              key={u.slug}
              to="/subjects/$subjectSlug/$unitSlug"
              params={{ subjectSlug: subject.slug, unitSlug: u.slug }}
              className="group flex flex-col rounded-2xl border bg-black/40 p-4 backdrop-blur-xl transition-all hover:-translate-y-0.5"
              style={{
                borderColor: `${accent}33`,
                boxShadow: '0 14px 40px -28px rgba(0,0,0,0.85)',
              }}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg"
                  style={{ color: accent, background: `${accent}1f` }}
                >
                  <Icon name={u.icon ?? 'BookOpen'} size={18} />
                </span>
                <h3 className="min-w-0 flex-1 truncate text-sm font-bold text-ink">
                  {u.name}
                </h3>
                {/* tier chip: users see what's premium before they click; the
                    unit route itself shows the upgrade gate */}
                {u.requiresPremium && isPremium === false && !complete && (
                  <span className="flex shrink-0 items-center gap-1 rounded-full border border-warn/40 bg-warn/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-warn">
                    <Icon name="Crown" size={11} />
                    Premium
                  </span>
                )}
                {complete && (
                  <span style={{ color: accent }}>
                    <Icon name="CheckCircle2" size={16} />
                  </span>
                )}
              </div>

              {u.description && (
                <p className="mt-2 line-clamp-2 text-xs text-muted">{u.description}</p>
              )}

              <div className="mt-auto pt-3">
                <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-muted">
                  <span>
                    {u.levelRange ?? `${u.lessonCount} lessons`}
                  </span>
                  <span style={{ color: accent }}>
                    {done}/{u.lessonCount}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: accent }}
                  />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

type LessonHit = {
  lessonId: string
  contentSlug: string
  title: string
  summary: string
  estimatedMinutes: number
  level: string
  subjectSlug: string
  subjectName: string
  unitSlug: string
  unitName: string
  accentColor: string
  requiresPremium?: boolean
}

function SearchResults({
  results,
  loading,
  term,
  completed,
  scopedTo,
  isPremium,
}: {
  results: Array<LessonHit>
  loading: boolean
  term: string
  completed: Set<string>
  scopedTo: string | null
  isPremium: boolean | undefined
}) {
  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-[72px] animate-pulse rounded-2xl border border-white/8 bg-white/[0.03]"
          />
        ))}
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/40 py-16 text-center backdrop-blur-xl">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-white/[0.04] text-muted">
          <Icon name="SearchX" size={26} />
        </span>
        <p className="mt-4 text-base font-bold text-ink">No lessons found</p>
        <p className="mt-1 max-w-xs text-sm text-muted">
          Nothing matches “{term}”{scopedTo ? ` in ${scopedTo}` : ''}. Try a
          different word{scopedTo ? ' or search all subjects' : ''}.
        </p>
      </div>
    )
  }

  return (
    <>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
        {results.length} result{results.length === 1 ? '' : 's'}
        {scopedTo ? ` in ${scopedTo}` : ''}
      </p>
      <ul className="flex flex-col gap-2">
        {results.map((r) => {
          const done = completed.has(r.lessonId)
          // Premium hits stay visible (the catalog sells itself) but lead to
          // /upgrade for free users; completed ones keep their normal link.
          const lockedHit =
            r.requiresPremium === true && isPremium === false && !done
          const row = (
            <>
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg"
                style={{
                  color: done
                    ? r.accentColor
                    : lockedHit
                      ? 'var(--color-warn)'
                      : 'var(--color-muted)',
                  background: done
                    ? `${r.accentColor}1f`
                    : lockedHit
                      ? 'rgba(255,176,32,0.1)'
                      : 'rgba(255,255,255,0.04)',
                }}
              >
                <Icon
                  name={done ? 'CheckCircle2' : lockedHit ? 'Lock' : 'Play'}
                  size={17}
                />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-ink">{r.title}</p>
                <p className="flex items-center gap-1.5 truncate text-xs text-muted">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: r.accentColor }}
                  />
                  {r.subjectName} · {r.unitName}
                </p>
              </div>
              {lockedHit && (
                <span className="flex shrink-0 items-center gap-1 rounded-full border border-warn/40 bg-warn/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-warn">
                  <Icon name="Crown" size={11} />
                  Premium
                </span>
              )}
              <span className="hidden shrink-0 text-xs font-medium text-muted sm:inline">
                {r.estimatedMinutes} min
              </span>
              <span className="text-muted transition-transform group-hover:translate-x-0.5">
                <Icon name="ChevronRight" size={18} />
              </span>
            </>
          )
          const cardClass =
            'group flex items-center gap-3 rounded-2xl border bg-black/40 px-4 py-3 backdrop-blur-xl transition-colors hover:bg-black/55'
          return (
            <li key={r.lessonId}>
              {lockedHit ? (
                <Link
                  to="/upgrade"
                  className={cardClass}
                  style={{ borderColor: 'rgba(255,176,32,0.3)' }}
                >
                  {row}
                </Link>
              ) : (
                <Link
                  to="/learn/$"
                  params={{ _splat: r.contentSlug }}
                  className={cardClass}
                  style={{ borderColor: `${r.accentColor}33` }}
                >
                  {row}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </>
  )
}

function GridSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="h-44 animate-pulse rounded-2xl border border-white/8 bg-white/[0.03]"
        />
      ))}
    </div>
  )
}

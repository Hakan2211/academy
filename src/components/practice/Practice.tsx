import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { PRACTICE_BANK } from '#/content/practice/bank.generated'
import { shuffleOptions } from '#/lib/practice'
import type { PracticeItem } from '#/lib/practice'
import { QuizOption } from '#/components/ui/QuizOption'
import type { QuizOptionState } from '#/components/ui/QuizOption'
import { Icon } from '#/components/ui/Icon'
import { PremiumGate } from '#/components/billing/PremiumGate'
import { useIsPremium } from '#/lib/billing'

// Practice = spaced retrieval review. Only items from COMPLETED lessons are
// unlocked; the spaced schedule (reviewState) decides what's due today. Item
// content is the static generated bank. Layout mirrors the Dashboard's Cosmic
// Glass over the shared universe.

const SUBJECT = 'physics'
const ACCENT = '#4F8CFF'
const SESSION_CAP = 20

function todayLocalDate(): string {
  const d = new Date()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
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
      className={`rounded-2xl border bg-black/40 p-6 backdrop-blur-xl ${className}`}
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

export function Practice() {
  const today = todayLocalDate()

  const pathQ = useQuery(
    convexQuery(api.catalog.getSubjectPath, { subjectSlug: SUBJECT }),
  )
  // Completed-lesson set from the one-doc progress summary (bandwidth-lean).
  const progressQ = useQuery(
    convexQuery(api.progress.getCompletedLessons, {}),
  )
  const reviewQ = useQuery(convexQuery(api.practice.getReviewStates, {}))
  const grade = useMutation(api.practice.gradeItem)
  const { isPremium } = useIsPremium()

  const lessons = pathQ.data?.lessons ?? []
  const slugToLessonId = useMemo(() => {
    const m = new Map<string, string>()
    for (const l of lessons) m.set(l.contentSlug, String(l._id))
    return m
  }, [lessons])

  const completed = useMemo(
    () => new Set(progressQ.data ?? []),
    [progressQ.data],
  )
  const reviewMap = useMemo(
    () => new Map((reviewQ.data ?? []).map((r) => [r.itemId, r])),
    [reviewQ.data],
  )

  const subjectBank = useMemo(
    () => PRACTICE_BANK.filter((it) => it.subject === SUBJECT),
    [],
  )
  const unlocked = useMemo(
    () =>
      subjectBank.filter((it) => {
        const lid = slugToLessonId.get(it.contentSlug)
        return lid != null && completed.has(lid)
      }),
    [subjectBank, slugToLessonId, completed],
  )
  const due = useMemo(
    () =>
      unlocked.filter((it) => {
        const r = reviewMap.get(it.id)
        return !r || r.dueDate <= today
      }),
    [unlocked, reviewMap, today],
  )
  const freshCount = unlocked.filter((it) => !reviewMap.get(it.id)).length
  const reviewCount = due.length - freshCount

  // earliest upcoming due date when nothing is due now
  const nextDue = useMemo(() => {
    const futures = unlocked
      .map((it) => reviewMap.get(it.id)?.dueDate)
      .filter((d): d is string => Boolean(d) && (d as string) > today)
      .sort()
    return futures[0] ?? null
  }, [unlocked, reviewMap, today])

  const [session, setSession] = useState<Array<PracticeItem> | null>(null)
  const [summary, setSummary] = useState<{ correct: number; total: number } | null>(
    null,
  )

  const start = (items: Array<PracticeItem>) => {
    const order = items.slice()
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[order[i], order[j]] = [order[j], order[i]]
    }
    setSummary(null)
    setSession(order.slice(0, SESSION_CAP))
  }

  const onGrade = (itemId: string, correct: boolean) => {
    void grade({ itemId, correct, localDate: today })
  }

  const loading =
    pathQ.isLoading || progressQ.isLoading || reviewQ.isLoading

  // Practice is a premium feature. Gate only on === false (loading shows the
  // normal skeleton); the server already returns empty schedules for free users.
  if (isPremium === false) {
    return (
      <PremiumGate
        title="Practice is Premium"
        description="Spaced-retrieval review resurfaces every idea you've learned right before you'd forget it — included with lifetime access."
      />
    )
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full px-4 pb-20 pt-6 sm:pl-28 sm:pr-10">
      <div className="mx-auto max-w-3xl">
        {session ? (
          <ReviewSession
            queue={session}
            onGrade={onGrade}
            onFinish={(correct, total) => {
              setSession(null)
              setSummary({ correct, total })
            }}
            onQuit={() => setSession(null)}
          />
        ) : (
          <>
            <header className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
                Practice
              </p>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Review &amp; remember
              </h1>
              <p className="mt-1 text-sm text-muted">
                Spaced retrieval brings back what you&rsquo;ve learned, right before
                you&rsquo;d forget it.
              </p>
            </header>

            {summary && (
              <SummaryCard
                summary={summary}
                dueLeft={due.length}
                onContinue={() => start(due)}
              />
            )}

            {loading ? (
              <Card>
                <p className="text-sm text-muted">Loading your review queue…</p>
              </Card>
            ) : unlocked.length === 0 ? (
              <EmptyState />
            ) : (
              <ReviewHero
                dueCount={due.length}
                freshCount={freshCount}
                reviewCount={reviewCount}
                unlockedCount={unlocked.length}
                totalCount={subjectBank.length}
                nextDue={nextDue}
                onStart={() => start(due.length ? due : unlocked)}
                hasDue={due.length > 0}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

function ReviewHero({
  dueCount,
  freshCount,
  reviewCount,
  unlockedCount,
  totalCount,
  nextDue,
  onStart,
  hasDue,
}: {
  dueCount: number
  freshCount: number
  reviewCount: number
  unlockedCount: number
  totalCount: number
  nextDue: string | null
  onStart: () => void
  hasDue: boolean
}) {
  return (
    <div className="space-y-4">
      <Card accent={ACCENT} className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full blur-3xl"
          style={{ background: `${ACCENT}33` }}
        />
        {hasDue ? (
          <>
            <p className="text-xs font-bold uppercase tracking-wider text-accent">
              Ready to review
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-5xl font-black leading-none text-ink">
                {dueCount}
              </span>
              <span className="text-lg font-bold text-muted">
                {dueCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted">
              {freshCount > 0 && `${freshCount} new`}
              {freshCount > 0 && reviewCount > 0 && ' · '}
              {reviewCount > 0 && `${reviewCount} to revisit`}
            </p>
          </>
        ) : (
          <>
            <p className="text-xs font-bold uppercase tracking-wider text-accent">
              All caught up
            </p>
            <h2 className="mt-1 text-2xl font-extrabold text-ink">
              Nothing due right now 🎉
            </h2>
            <p className="mt-2 text-sm text-muted">
              {nextDue
                ? `Next review unlocks ${nextDue}.`
                : 'Finish more lessons to grow your review deck.'}
            </p>
          </>
        )}

        <button
          type="button"
          onClick={onStart}
          className="group mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
          style={{
            background: `linear-gradient(105deg, ${ACCENT}, color-mix(in srgb, ${ACCENT} 50%, white))`,
            boxShadow: `0 14px 36px -12px ${ACCENT}`,
          }}
        >
          <Icon name="Brain" size={18} />
          {hasDue ? 'Start review' : 'Practice anyway'}
        </button>
      </Card>

      <Card className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">Your review deck</p>
          <p className="mt-0.5 text-xs text-muted">
            Questions unlock as you complete lessons.
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold text-ink">
            {unlockedCount}
            <span className="text-base font-bold text-muted"> / {totalCount}</span>
          </p>
          <p className="text-xs text-muted">concepts unlocked</p>
        </div>
      </Card>
    </div>
  )
}

function EmptyState() {
  return (
    <Card className="flex flex-col items-center py-12 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full bg-accent/10 text-accent">
        <Icon name="Brain" size={30} />
      </span>
      <h2 className="mt-4 text-xl font-bold">No reviews yet</h2>
      <p className="mt-1 max-w-sm text-sm text-muted">
        Finish your first lesson and its question joins your review deck — then come
        back here to lock it into memory.
      </p>
      <Link
        to="/subjects/$subjectSlug"
        params={{ subjectSlug: SUBJECT }}
        className="mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold text-white transition-all hover:brightness-110"
        style={{ background: ACCENT, boxShadow: `0 12px 30px -12px ${ACCENT}` }}
      >
        <Icon name="Map" size={18} /> Go to lessons
      </Link>
    </Card>
  )
}

function SummaryCard({
  summary,
  dueLeft,
  onContinue,
}: {
  summary: { correct: number; total: number }
  dueLeft: number
  onContinue: () => void
}) {
  const pct = summary.total > 0 ? Math.round((summary.correct / summary.total) * 100) : 0
  return (
    <Card accent={ACCENT} className="mb-4 text-center">
      <p className="text-xs font-bold uppercase tracking-wider text-accent">
        Session complete
      </p>
      <div className="mt-2 text-4xl font-black text-ink">
        {summary.correct}
        <span className="text-2xl font-bold text-muted"> / {summary.total}</span>
      </div>
      <p className="mt-1 text-sm text-muted">{pct}% recalled correctly</p>
      {dueLeft > 0 && (
        <button
          type="button"
          onClick={onContinue}
          className="mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold text-white transition-all hover:brightness-110"
          style={{ background: ACCENT, boxShadow: `0 12px 30px -12px ${ACCENT}` }}
        >
          <Icon name="ArrowRight" size={18} /> {dueLeft} more due — keep going
        </button>
      )}
    </Card>
  )
}

function ReviewSession({
  queue,
  onGrade,
  onFinish,
  onQuit,
}: {
  queue: Array<PracticeItem>
  onGrade: (itemId: string, correct: boolean) => void
  onFinish: (correct: number, total: number) => void
  onQuit: () => void
}) {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)

  const item = queue[i]
  // Shuffle options per question so the answer isn't memorised by position.
  const shuffled = useMemo(
    () => shuffleOptions(item.options, item.correctIndex),
    [item],
  )
  const answered = selected !== null
  const gotIt = answered && selected === shuffled.correctIndex

  const choose = (idx: number) => {
    if (answered) return
    setSelected(idx)
    const correct = idx === shuffled.correctIndex
    if (correct) setCorrectCount((c) => c + 1)
    onGrade(item.id, correct)
  }

  const next = () => {
    if (i + 1 < queue.length) {
      setI(i + 1)
      setSelected(null)
    } else {
      onFinish(correctCount + 0, queue.length)
    }
  }

  const stateFor = (idx: number): QuizOptionState => {
    if (!answered) return 'idle'
    if (idx === shuffled.correctIndex) return 'correct'
    if (idx === selected) return 'wrong'
    return 'idle'
  }

  return (
    <div>
      {/* progress + quit */}
      <div className="mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={onQuit}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/12 bg-black/40 text-muted backdrop-blur-md transition-colors hover:text-ink"
          aria-label="Quit review"
        >
          <Icon name="X" size={16} />
        </button>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${(i / queue.length) * 100}%` }}
          />
        </div>
        <span className="shrink-0 text-xs font-semibold text-muted">
          {i + 1} / {queue.length}
        </span>
      </div>

      <motion.div
        key={item.id}
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <Card>
          <p className="text-lg font-semibold leading-snug">{item.prompt}</p>
          <div className="mt-4 space-y-2">
            {shuffled.options.map((opt, idx) => (
              <QuizOption
                key={idx}
                label={opt}
                state={stateFor(idx)}
                onClick={() => choose(idx)}
                disabled={answered}
              />
            ))}
          </div>

          {answered && (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 rounded-xl border p-3 text-sm ${
                gotIt
                  ? 'border-success/40 bg-success/10'
                  : 'border-warn/40 bg-warn/10'
              }`}
            >
              <div className="mb-1 flex items-center gap-2 font-semibold">
                <Icon name={gotIt ? 'CircleCheck' : 'Info'} size={16} />
                {gotIt ? 'Correct!' : 'Not quite'}
              </div>
              {item.explanation && <p className="text-muted">{item.explanation}</p>}
            </motion.div>
          )}

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={next}
              disabled={!answered}
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              style={{ background: ACCENT, boxShadow: `0 12px 30px -12px ${ACCENT}` }}
            >
              {i + 1 < queue.length ? 'Next' : 'Finish'}
              <Icon name="ArrowRight" size={16} />
            </button>
          </div>
        </Card>
      </motion.div>

      <p className="mt-3 text-center text-xs text-muted">
        Lesson: {item.lessonTitle}
      </p>
    </div>
  )
}

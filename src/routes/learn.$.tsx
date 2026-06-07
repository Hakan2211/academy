import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { lazy, Suspense, useMemo } from 'react'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { getLessonModule } from '#/lib/lessonModules'
import { LessonRuntimeProvider } from '#/components/lesson/context'
import type { LessonRuntime } from '#/components/lesson/context'
import { LessonBackdrop } from '#/components/lesson/LessonBackdrop'
import { PremiumGate } from '#/components/billing/PremiumGate'

// Client-only: the lesson player renders WebGL canvases and reads device-local
// progress, neither of which should run during SSR.
export const Route = createFileRoute('/learn/$')({
  ssr: false,
  component: LessonPlayer,
})

function todayLocalDate(): string {
  const d = new Date()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

function CenteredLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-muted">
      Loading lesson…
    </div>
  )
}

function LessonPlayer() {
  const { _splat } = Route.useParams()
  const contentSlug = _splat ?? ''
  const subjectSlug = contentSlug.split('/')[0] ?? ''
  const navigate = useNavigate()

  const lessonMetaQ = useQuery(
    convexQuery(api.catalog.getLessonMeta, { contentSlug }),
  )
  // Point read for THIS lesson only — per-step writes re-run just this tiny
  // query, not a scan of the user's whole progress history (bandwidth).
  const progressQ = useQuery(
    convexQuery(api.progress.getLessonProgress, { contentSlug }),
  )

  const recordStep = useMutation(api.progress.recordStepCompletion)
  const complete = useMutation(api.progress.completeLesson)

  const LazyLesson = useMemo(() => {
    const loader = getLessonModule(contentSlug)
    if (!loader) return null
    return lazy(() => loader().then((m) => ({ default: m.default })))
  }, [contentSlug])

  // Resolve saved progress before mounting the engine so it can resume at the
  // right step. (The route is gated, so the user is already authenticated.)
  const waiting = lessonMetaQ.isLoading || progressQ.isLoading
  if (waiting) return <CenteredLoader />

  const lesson = lessonMetaQ.data
  if (!lesson || !LazyLesson) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-muted">
        Lesson not found.
      </div>
    )
  }

  const lessonId = lesson._id
  const mine = progressQ.data ?? null
  const initialStep = mine && !mine.completed ? mine.currentStep : 0

  // The lesson glows in its category accent (unit accent → subject colour →
  // azure default). The cast keeps this typechecking before a Convex codegen
  // push adds the new fields to getLessonMeta's inferred return type; at runtime
  // it gracefully falls back until the updated query is deployed.
  const themed = lesson as typeof lesson & {
    unitAccentColor?: string | null
    subjectColor?: string | null
    unitSlug?: string | null
    premiumLocked?: boolean
  }
  const accent = themed.unitAccentColor ?? themed.subjectColor ?? '#4F8CFF'
  const unitSlug = themed.unitSlug ?? null

  // Premium wall for deep links (Discover hits, resume cards, pasted URLs).
  // Viewer-specific verdict computed server-side; the server also refuses
  // progress/XP writes, so this gate is UX, not the security boundary.
  if (themed.premiumLocked === true) {
    return (
      <div className="relative min-h-screen w-full">
        <LessonBackdrop accent={accent} />
        <PremiumGate
          title={lesson.title}
          description="This lesson is part of the lifetime unlock — every world in all nine subjects, yours forever."
          accent={accent}
          backTo={`/subjects/${subjectSlug}`}
          backLabel="Back to the island"
        />
      </div>
    )
  }

  // Finishing or leaving a lesson returns to its own category trail (one level
  // back), not the subject overworld (two levels back). Falls back to the
  // overworld if the unit slug isn't available yet (e.g. before the updated
  // getLessonMeta is pushed to Convex).
  const exit = () =>
    unitSlug
      ? navigate({
          to: '/subjects/$subjectSlug/$unitSlug',
          params: { subjectSlug, unitSlug },
        })
      : navigate({ to: '/subjects/$subjectSlug', params: { subjectSlug } })

  const runtime: LessonRuntime = {
    initialStep,
    accent,
    onStepAdvance: (nextStepIndex, totalSteps) => {
      void recordStep({
        lessonId,
        stepIndex: nextStepIndex - 1,
        totalSteps,
      })
    },
    onComplete: async () =>
      await complete({ lessonId, localDate: todayLocalDate() }),
    onExit: exit,
  }

  return (
    <div className="relative min-h-screen w-full">
      <LessonBackdrop accent={accent} />
      <LessonRuntimeProvider value={runtime}>
        <Suspense fallback={<CenteredLoader />}>
          <LazyLesson key={contentSlug} />
        </Suspense>
      </LessonRuntimeProvider>
    </div>
  )
}

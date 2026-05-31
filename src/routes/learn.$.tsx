import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { lazy, Suspense, useMemo } from 'react'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { getLessonModule } from '#/lib/lessonModules'
import { useDeviceId } from '#/lib/deviceId.context'
import { LessonRuntimeProvider } from '#/components/lesson/context'
import type { LessonRuntime } from '#/components/lesson/context'
import { GradientBackground } from '#/components/three/GradientBackground'
import { Icon } from '#/components/ui/Icon'

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
  const deviceId = useDeviceId()
  const navigate = useNavigate()

  const lessonMetaQ = useQuery(
    convexQuery(api.catalog.getLessonMeta, { contentSlug }),
  )
  const progressQ = useQuery({
    ...convexQuery(api.progress.getProgressForUser, {
      deviceId: deviceId ?? '',
    }),
    enabled: Boolean(deviceId),
  })

  const recordStep = useMutation(api.progress.recordStepCompletion)
  const complete = useMutation(api.progress.completeLesson)

  const LazyLesson = useMemo(() => {
    const loader = getLessonModule(contentSlug)
    if (!loader) return null
    return lazy(() => loader().then((m) => ({ default: m.default })))
  }, [contentSlug])

  // Resolve identity + saved progress before mounting the engine so it can
  // resume at the right step.
  const waiting =
    deviceId === undefined ||
    lessonMetaQ.isLoading ||
    (Boolean(deviceId) && progressQ.isLoading)
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
  const mine = (progressQ.data ?? []).find((p) => p.lessonId === lessonId)
  const initialStep = mine && !mine.completed ? mine.currentStep : 0

  const exit = () =>
    navigate({ to: '/subjects/$subjectSlug', params: { subjectSlug } })

  const runtime: LessonRuntime = {
    initialStep,
    onStepAdvance: (nextStepIndex, totalSteps) => {
      if (!deviceId) return
      void recordStep({
        deviceId,
        lessonId,
        stepIndex: nextStepIndex - 1,
        totalSteps,
      })
    },
    onComplete: async () => {
      if (!deviceId) {
        return {
          xpAwarded: lesson.xpReward,
          totalXP: lesson.xpReward,
          level: 1,
          leveledUp: false,
          currentStreak: 1,
          longestStreak: 1,
          newBadges: ['first-lesson'],
        }
      }
      return await complete({ deviceId, lessonId, localDate: todayLocalDate() })
    },
    onExit: exit,
  }

  return (
    <div className="relative min-h-screen px-4 py-10">
      <GradientBackground />
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={exit}
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
        >
          <Icon name="X" size={16} /> Exit lesson
        </button>
        <LessonRuntimeProvider value={runtime}>
          <Suspense fallback={<CenteredLoader />}>
            <LazyLesson key={contentSlug} />
          </Suspense>
        </LessonRuntimeProvider>
      </div>
    </div>
  )
}

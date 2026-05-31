import { createFileRoute } from '@tanstack/react-router'
import { convexQuery } from '@convex-dev/react-query'
import { useSuspenseQuery, useQuery } from '@tanstack/react-query'
import { api } from '../../convex/_generated/api'
import { useDeviceId } from '#/lib/deviceId.context'
import { LessonTrail } from '#/components/ui/LessonTrail'
import type {
  LessonLevel,
  LessonNodeData,
  LessonNodeState,
} from '#/components/ui/LessonNode'

export const Route = createFileRoute('/subjects/$subjectSlug/$unitSlug')({
  component: CategoryPage,
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      convexQuery(api.catalog.getCategoryPath, {
        subjectSlug: params.subjectSlug,
        unitSlug: params.unitSlug,
      }),
    )
  },
})

function CategoryPage() {
  const { subjectSlug, unitSlug } = Route.useParams()
  const deviceId = useDeviceId()

  const { data } = useSuspenseQuery(
    convexQuery(api.catalog.getCategoryPath, { subjectSlug, unitSlug }),
  )

  const progressQuery = useQuery({
    ...convexQuery(api.progress.getProgressForUser, {
      deviceId: deviceId ?? '',
    }),
    enabled: Boolean(deviceId),
  })

  if (!data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-muted">
        Category not found.
      </div>
    )
  }

  const { subject, unit, lessons } = data
  const accent = unit.accentColor ?? subject.color

  const progressById = new Map<string, { completed: boolean }>()
  for (const p of progressQuery.data ?? []) {
    progressById.set(p.lessonId, { completed: p.completed })
  }

  // Gating is computed over PUBLISHED lessons only: completed -> complete, the
  // first open one -> current, the rest stay locked until the one before is
  // done. Unpublished lessons render as "soon" in their natural order.
  const stateBySlug = new Map<string, LessonNodeState>()
  let unlocked = true
  let assignedCurrent = false
  for (const l of lessons.filter((x) => x.isPublished)) {
    const p = progressById.get(l._id)
    let state: LessonNodeState
    if (p?.completed) {
      state = 'complete'
    } else if (unlocked) {
      state = assignedCurrent ? 'available' : 'current'
      assignedCurrent = true
    } else {
      state = 'locked'
    }
    unlocked = p?.completed ?? false
    stateBySlug.set(l.contentSlug, state)
  }

  const nodes: Array<LessonNodeData> = lessons.map((l) => ({
    contentSlug: l.contentSlug,
    title: l.title,
    summary: l.summary,
    minutes: l.estimatedMinutes,
    xp: l.xpReward,
    state: l.isPublished
      ? (stateBySlug.get(l.contentSlug) ?? 'available')
      : 'soon',
    level: l.level as LessonLevel | undefined,
    format: l.format as 'core' | 'deepdive' | undefined,
  }))

  // Category completion: every published lesson done -> celebration card.
  const published = lessons.filter((l) => l.isPublished)
  const doneCount = published.filter(
    (l) => progressById.get(l._id)?.completed,
  ).length
  const allComplete = published.length > 0 && doneCount === published.length

  if (nodes.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-muted">
        Lessons are coming soon.
      </div>
    )
  }

  return (
    <LessonTrail
      subjectSlug={subjectSlug}
      subjectName={subject.name}
      unitSlug={unitSlug}
      unitName={unit.name}
      unitDescription={unit.description ?? undefined}
      unitIcon={unit.icon ?? undefined}
      unitLevelRange={unit.levelRange ?? undefined}
      accent={accent}
      lessons={nodes}
      done={doneCount}
      total={published.length}
      complete={allComplete}
      nextUnitSlug={data.nextUnitSlug}
      nextUnitName={data.nextUnitName}
    />
  )
}

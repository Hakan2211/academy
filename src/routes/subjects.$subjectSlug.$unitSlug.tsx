import { createFileRoute, Link } from '@tanstack/react-router'
import { convexQuery } from '@convex-dev/react-query'
import { useSuspenseQuery, useQuery } from '@tanstack/react-query'
import { api } from '../../convex/_generated/api'
import { useDeviceId } from '#/lib/deviceId.context'
import { TrailMap } from '#/components/ui/TrailMap'
import { CategoryCompleteCard } from '#/components/ui/CategoryCompleteCard'
import type {
  LessonLevel,
  LessonNodeData,
  LessonNodeState,
} from '#/components/ui/LessonNode'
import { Icon } from '#/components/ui/Icon'

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

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        to="/subjects/$subjectSlug"
        params={{ subjectSlug }}
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
      >
        <Icon name="ArrowLeft" size={16} /> {subject.name}
      </Link>

      <header className="mb-8 flex items-start gap-4">
        <div
          className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl"
          style={{ background: `${accent}22`, color: accent }}
        >
          <Icon name={unit.icon ?? 'Folder'} size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold" style={{ color: accent }}>
            {unit.name}
          </h1>
          {unit.description && (
            <p className="mt-1 text-muted">{unit.description}</p>
          )}
          {unit.levelRange && (
            <span className="mt-2 inline-block rounded-full border border-border px-2 py-0.5 text-xs font-medium text-muted">
              {unit.levelRange}
            </span>
          )}
        </div>
      </header>

      {allComplete && (
        <CategoryCompleteCard
          subjectSlug={subjectSlug}
          unitSlug={unitSlug}
          unitName={unit.name}
          done={doneCount}
          total={published.length}
          accent={accent}
          nextUnitSlug={data.nextUnitSlug}
          nextUnitName={data.nextUnitName}
        />
      )}

      {nodes.length > 0 ? (
        <TrailMap lessons={nodes} accent={accent} />
      ) : (
        <p className="text-muted">Lessons are coming soon.</p>
      )}
    </div>
  )
}

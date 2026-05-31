import { createFileRoute, Link } from '@tanstack/react-router'
import { convexQuery } from '@convex-dev/react-query'
import { useSuspenseQuery, useQuery } from '@tanstack/react-query'
import { api } from '../../convex/_generated/api'
import { useDeviceId } from '#/lib/deviceId.context'
import { Overworld } from '#/components/ui/Overworld'
import type { OverworldUnit } from '#/components/ui/Overworld'
import { Icon } from '#/components/ui/Icon'

export const Route = createFileRoute('/subjects/$subjectSlug/')({
  component: SubjectPage,
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      convexQuery(api.catalog.getSubjectOverview, {
        subjectSlug: params.subjectSlug,
      }),
    )
  },
})

function SubjectPage() {
  const { subjectSlug } = Route.useParams()
  const deviceId = useDeviceId()

  const { data } = useSuspenseQuery(
    convexQuery(api.catalog.getSubjectOverview, { subjectSlug }),
  )

  // Progress is per-device and client-only; used to count completed lessons.
  const progressQuery = useQuery({
    ...convexQuery(api.progress.getProgressForUser, {
      deviceId: deviceId ?? '',
    }),
    enabled: Boolean(deviceId),
  })

  if (!data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-muted">
        Subject not found.
      </div>
    )
  }

  const completedIds = new Set(
    (progressQuery.data ?? [])
      .filter((p) => p.completed)
      .map((p) => p.lessonId),
  )

  const units: Array<OverworldUnit> = data.units.map((unit) => ({
    slug: unit.slug,
    name: unit.name,
    icon: unit.icon,
    accentColor: unit.accentColor,
    done: unit.lessonIds.filter((id) => completedIds.has(id)).length,
    total: unit.lessonCount,
  }))

  const totalDone = units.reduce((a, u) => a + u.done, 0)
  const totalLessons = units.reduce((a, u) => a + u.total, 0)
  const pct = totalLessons > 0 ? Math.round((totalDone / totalLessons) * 100) : 0

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
      >
        <Icon name="ArrowLeft" size={16} /> All subjects
      </Link>

      <header className="mb-4">
        <h1 className="text-3xl font-bold" style={{ color: data.subject.color }}>
          {data.subject.name}
        </h1>
        <p className="mt-1 text-muted">{data.subject.description}</p>

        {totalLessons > 0 && (
          <div className="mt-4 max-w-md">
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: data.subject.color }}
              />
            </div>
            <p className="mt-1.5 text-sm text-muted">
              {totalDone}/{totalLessons} lessons across {units.length} categories
            </p>
          </div>
        )}
      </header>

      {units.length > 0 ? (
        <Overworld
          subjectSlug={subjectSlug}
          subjectColor={data.subject.color}
          units={units}
        />
      ) : (
        <p className="text-muted">Categories are coming soon.</p>
      )}
    </div>
  )
}

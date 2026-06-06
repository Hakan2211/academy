import { createFileRoute } from '@tanstack/react-router'
import { convexQuery } from '@convex-dev/react-query'
import { useSuspenseQuery, useQuery } from '@tanstack/react-query'
import { api } from '../../convex/_generated/api'
import { CategoryOverworld } from '#/components/ui/CategoryOverworld'
import type { OverworldUnit } from '#/components/ui/CategoryOverworld'

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

  const { data } = useSuspenseQuery(
    convexQuery(api.catalog.getSubjectOverview, { subjectSlug }),
  )

  // Per-user progress; used to count completed lessons.
  const progressQuery = useQuery(
    convexQuery(api.progress.getProgressForUser, {}),
  )

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

  if (units.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-muted">
        Categories are coming soon.
      </div>
    )
  }

  return (
    <CategoryOverworld
      subjectSlug={subjectSlug}
      subjectName={data.subject.name}
      subjectColor={data.subject.color}
      units={units}
    />
  )
}
